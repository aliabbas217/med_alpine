import os
import requests
import tarfile
import io
import csv
from datetime import datetime
import fitz  # PyMuPDF
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import logging
from typing import List, Dict, Set
import numpy as np
from firebase_admin import credentials, firestore
import json
from pinecone import Pinecone
#cors
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app
app = FastAPI()
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "medalpine-rag")
PINECONE_ENV = os.getenv("PINECONE_ENV", "us-east-1")

# Initialize Pinecone with the new API
pc = Pinecone(api_key=PINECONE_API_KEY)  # Initialize Pinecone client

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)
gemini = genai.GenerativeModel('gemini-2.0-flash')

# Initialize embedding model
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize Firebase (for tracking indexed papers)
firebase_cred_path = os.getenv("FIREBASE_CREDENTIALS", "firebase-credentials.json")

# Check if credentials file exists
if os.path.exists(firebase_cred_path):
    try:
        # Get Firebase credentials
        cred = credentials.Certificate(firebase_cred_path)
        import firebase_admin
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        logger.info("Firebase initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing Firebase: {str(e)}")
        logger.warning("Falling back to in-memory database")
        # Create an in-memory alternative if Firebase fails
else:
    logger.warning(f"Firebase credentials file '{firebase_cred_path}' not found")
    logger.warning("Using in-memory database instead. Paper indexing will not persist between runs.")
    # Create an in-memory alternative if Firebase credentials are missing
    class InMemoryDB:
        def __init__(self):
            self.data = {}
        
        def collection(self, name):
            return InMemoryCollection(self.data, name)
    
    class InMemoryCollection:
        def __init__(self, data, name):
            self.data = data
            self.name = name
            if name not in data:
                data[name] = {}
        
        def document(self, doc_id):
            return InMemoryDocument(self.data, self.name, doc_id)
    
    class InMemoryDocument:
        def __init__(self, data, collection_name, doc_id):
            self.data = data
            self.collection_name = collection_name
            self.doc_id = doc_id
            if doc_id not in data[collection_name]:
                data[collection_name][doc_id] = {}
        
        def get(self):
            class DocSnapshot:
                def __init__(self, exists, data):
                    self.exists = exists
                    self._data = data
                
                def to_dict(self):
                    return self._data
            
            doc_data = self.data[self.collection_name][self.doc_id]
            return DocSnapshot(True, doc_data) if doc_data else DocSnapshot(False, {})
        
        def set(self, data):
            self.data[self.collection_name][self.doc_id] = data
        
        def update(self, data):
            current = self.data[self.collection_name][self.doc_id]
            current.update(data)
    
    db = InMemoryDB()
    logger.warning("Using in-memory database as Firebase initialization failed")

# Define a request model for the API
class QueryModel(BaseModel):
    query: str

class CaseStudyModel(BaseModel):
    patient_history: str
    current_symptoms: str
    patient_perspective: str
    doctor_opinion: str
    specialties: List[str] = ["general"]

# Parse date helper function
def parse_date(date_str):
    if not date_str:
        return datetime.min
    try:
        return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        try:
            return datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return datetime.min

# Chunking function
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunk = text[i:i + chunk_size]
        if chunk:  # Ensure non-empty
            chunks.append(chunk)
    logger.info(f"Chunked text into {len(chunks)} pieces")
    return chunks

# Extract text from PDF in tar file
def extract_pdf_text(file_path: str) -> str:
    url = f"https://ftp.ncbi.nlm.nih.gov/pub/pmc/{file_path}"
    response = requests.get(url, stream=True)
    if response.status_code != 200:
        logger.error(f"Failed to download tar file for {file_path}: HTTP {response.status_code}")
        return ""
    
    tar = tarfile.open(fileobj=io.BytesIO(response.content), mode="r:gz")
    pdf_content = None
    for member in tar.getmembers():
        if member.name.lower().endswith((".pdf", ".PDF")):
            pdf_content = tar.extractfile(member).read()
            break
    
    if pdf_content:
        try:
            doc = fitz.open(stream=pdf_content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text("text")
            doc.close()
            logger.info(f"Extracted text from PDF for {file_path}")
            return text
        except Exception as e:
            logger.error(f"PDF extraction failed for {file_path}: {str(e)}")
            return ""
    logger.warning(f"No PDF found in tar file for {file_path}")
    return ""

# Fetch open access PMCIDs
def fetch_open_access_pmcids(niche: str, num_papers: int = 30) -> List[str]:
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term={niche}%5Bmesh%5D+AND+open+access%5Bfilter%5D&retmax={num_papers}&retmode=json"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch PMCIDs from NCBI")
    data = response.json()
    return [f"PMC{id}" for id in data["esearchresult"]["idlist"]]

# Get paper metadata
def get_paper_metadata(pmcids: List[str]) -> List[Dict]:
    if not os.path.exists("oa_file_list.csv"):
        logger.info("CSV file not found. Downloading...")
        url = "https://ftp.ncbi.nlm.nih.gov/pub/pmc/oa_file_list.csv"
        response = requests.get(url, stream=True)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to download CSV file from NCBI")
        with open("oa_file_list.csv", "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        logger.info("CSV file downloaded successfully")

    papers = []
    with open("oa_file_list.csv", newline='', encoding='utf-8') as f:
        csv_reader = csv.DictReader(f)
        for row in csv_reader:
            if row["Accession ID"] in pmcids:
                papers.append({
                    "pmcid": row["Accession ID"],
                    "file_path": row["File"],
                    "title": row["Article Citation"].split(".")[0],
                    "last_updated": row["Last Updated (YYYY-MM-DD HH:MM:SS)"]
                })
    return sorted(papers, key=lambda x: parse_date(x["last_updated"]), reverse=True)[:len(pmcids)]

def ensure_index_exists():
    """Check if Pinecone index exists, create if needed"""
    try:
        # Check if our index exists
        existing_indexes = pc.list_indexes().names()
        
        if PINECONE_INDEX_NAME not in existing_indexes:
            logger.info(f"Creating index: {PINECONE_INDEX_NAME}")
            
            # Create standard vector index
            pc.create_index(
                name=PINECONE_INDEX_NAME,
                dimension=384,  # MiniLM-L6-v2 embedding size
                metric="cosine"
            )
            
            logger.info(f"Waiting for index {PINECONE_INDEX_NAME} to be ready...")
            import time
            time.sleep(30)  # Give it some time to initialize
        else:
            logger.info(f"Index {PINECONE_INDEX_NAME} already exists")
    except Exception as e:
        logger.error(f"Error checking/creating index: {str(e)}")
        raise


def process_papers_for_rag(niche: str, num_papers: int = 30) -> None:
    """Process papers for a specific medical specialty and store them in Pinecone"""
    # Check which papers we've already indexed
    indexed_papers = get_indexed_papers(niche)
    logger.info(f"Found {len(indexed_papers)} already indexed papers for {niche}")
    
    # Get new papers to index
    pmcids = fetch_open_access_pmcids(niche, num_papers * 2)  # Fetch extra to account for already indexed
    new_pmcids = [pmcid for pmcid in pmcids if pmcid not in indexed_papers][:num_papers]
    
    if not new_pmcids:
        logger.info(f"No new papers to index for {niche}")
        return
        
    logger.info(f"Processing {len(new_pmcids)} new papers for {niche}")
    papers = get_paper_metadata(new_pmcids)
    
    # Make sure index exists
    ensure_index_exists()
    
    # Get index connection
    index = pc.Index(PINECONE_INDEX_NAME)
    
    # Process each paper
    successfully_indexed = []
    for paper in papers:
        try:
            logger.info(f"Processing paper: {paper['pmcid']}")
            pdf_text = extract_pdf_text(paper["file_path"])
            if pdf_text:
                chunks = chunk_text(pdf_text, chunk_size=1000, overlap=100)  # Larger chunks for better context
                
                # Add specialty as metadata to improve retrieval
                enriched_chunks = []
                for i, chunk in enumerate(chunks):
                    # Add specialty context to the beginning of each chunk
                    enriched_chunk = f"[Medical Specialty: {niche}] {chunk}"
                    enriched_chunks.append(enriched_chunk)
                
                embeddings = embedder.encode(enriched_chunks, convert_to_numpy=True)
                
                # Prepare batch for upserting
                vectors = []
                for i, (chunk, embedding) in enumerate(zip(enriched_chunks, embeddings)):
                    vector_id = f"{paper['pmcid']}_{i}"
                    vectors.append({
                        "id": vector_id,
                        "values": embedding.tolist(),
                        "metadata": {
                            "pmcid": paper["pmcid"], 
                            "title": paper["title"],
                            "specialty": niche,
                            "chunk_id": i,
                            "text": chunk[:1000]  # Store the first 1000 chars
                        }
                    })
                    
                # Upsert in batches
                batch_size = 100
                for i in range(0, len(vectors), batch_size):
                    batch = vectors[i:i + batch_size]
                    index.upsert(vectors=batch)
                    logger.info(f"Upserted batch {i//batch_size + 1} for {paper['pmcid']} ({len(batch)} chunks)")
                
                successfully_indexed.append(paper["pmcid"])
            else:
                logger.warning(f"No text extracted from {paper['pmcid']}, skipping")
        except Exception as e:
            logger.error(f"Error processing paper {paper['pmcid']}: {str(e)}")
    
    # Update the tracking list
    if successfully_indexed:
        update_indexed_papers(niche, successfully_indexed)
        logger.info(f"Successfully indexed {len(successfully_indexed)} new papers for {niche}")

@app.post("/rag-query")
async def rag_query(request: QueryModel):
    """Query the RAG system with medical term normalization"""
    # Initialize index connection
    index = pc.Index(PINECONE_INDEX_NAME)
    
    query = request.query
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")

    # Normalize medical terms
    normalized_query = await normalize_medical_terms(query)
    
    # Embed the normalized query
    query_embedding = embedder.encode([normalized_query], convert_to_numpy=True)[0].tolist()
    logger.info(f"Embedded normalized query: {normalized_query}")

    # Retrieve similar chunks from Pinecone
    results = index.query(
        vector=query_embedding, 
        top_k=5, 
        include_metadata=True
    )
    
    # Extract context from matches
    contexts = []
    for match in results["matches"]:
        contexts.append(f"Source: {match['metadata']['title']} (Document ID: {match['metadata']['pmcid']})\n\nContent: {match['metadata']['text']}")
    
    context_text = "\n\n===\n\n".join(contexts)
    
    # Generate response with Gemini
    prompt = f"""
    You are MedAlpine AI, a medical research assistant for healthcare professionals.
    Answer the following question based ONLY on the provided context from medical papers.
    If the context doesn't contain enough information to answer the question, say so honestly.
    Don't make up information or use your general knowledge.
    Always cite the source papers by mentioning their Document IDs.
    
    CONTEXT:
    {context_text}
    
    QUESTION: {query}
    
    ANSWER:
    """
    
    response = gemini.generate_content(prompt)
    logger.info(f"Generated response for query: {query}")
    
    source_ids = [match['metadata']['pmcid'] for match in results["matches"]]
    
    return {
        "answer": response.text, 
        "sources": source_ids
    }


@app.post("/analyze-case")
async def analyze_case(case: CaseStudyModel):
    """Analyze a medical case study with RAG-enhanced responses"""
    # Initialize index connection
    index = pc.Index(PINECONE_INDEX_NAME)
    
    # Construct a comprehensive case description
    case_description = f"""
    Patient History: {case.patient_history}
    Current Symptoms: {case.current_symptoms}
    Patient's Perspective: {case.patient_perspective}
    Doctor's Initial Assessment: {case.doctor_opinion}
    """
    
    # Normalize medical terms in the case description
    normalized_case = await normalize_medical_terms(case_description)
    
    # Create embedding for the case
    case_embedding = embedder.encode([normalized_case], convert_to_numpy=True)[0].tolist()
    
    # Retrieve relevant paper chunks from Pinecone
    # Filter by specialties if provided
    filter_condition = {}
    if case.specialties and "general" not in case.specialties:
        filter_condition = {
            "specialty": {"$in": case.specialties}
        }
    
    results = index.query(
        vector=case_embedding,
        top_k=8,  # Retrieve more chunks for better context
        include_metadata=True,
        filter=filter_condition
    )
    
    # Extract context from matches
    contexts = []
    for match in results["matches"]:
        source_info = f"Source: {match['metadata']['title']} (Document ID: {match['metadata']['pmcid']})"
        specialty = match['metadata'].get('specialty', 'Unknown')
        contexts.append(f"{source_info} [Specialty: {specialty}]\n\nContent: {match['metadata']['text']}")
    
    context_text = "\n\n===\n\n".join(contexts)
    
    # Generate comprehensive analysis with Gemini
    prompt = f"""
    You are MedAlpine AI, a sophisticated medical research assistant for healthcare professionals.
    
    Analyze the following case study carefully and provide a comprehensive assessment based on the given information and relevant research.
    
    CASE STUDY:
    -------------
    Patient History: {case.patient_history}
    
    Current Symptoms: {case.current_symptoms}
    
    Patient's Perspective: {case.patient_perspective}
    
    Doctor's Initial Assessment: {case.doctor_opinion}
    -------------
    
    RELEVANT RESEARCH CONTEXT:
    -------------
    {context_text}
    -------------
    
    Provide a structured response that:
    1. Summarizes the key aspects of the case
    2. Analyzes possible diagnoses based on symptoms and history
    3. Evaluates the doctor's initial assessment in light of the research evidence
    4. Recommends potential next steps for diagnosis or treatment based on recent research
    5. Cites specific research papers (using Document IDs) that support your analysis
    
    Be thorough yet concise. Acknowledge uncertainty where appropriate. Focus on evidence-based medicine.
    """
    
    response = gemini.generate_content(prompt)
    logger.info("Generated case study analysis")
    
    source_ids = [match['metadata']['pmcid'] for match in results["matches"]]
    
    return {
        "analysis": response.text,
        "sources": source_ids
    }


def ensure_index_exists():
    """Check if Pinecone index exists, create if needed"""
    try:
        # Check if our index exists
        existing_indexes = pc.list_indexes().names()
        
        if PINECONE_INDEX_NAME not in existing_indexes:
            logger.info(f"Creating index: {PINECONE_INDEX_NAME}")
            
            # Create standard vector index
            pc.create_index(
                name=PINECONE_INDEX_NAME,
                dimension=384,  # MiniLM-L6-v2 embedding size
                metric="cosine"
            )
            
            logger.info(f"Waiting for index {PINECONE_INDEX_NAME} to be ready...")
            import time
            time.sleep(30)  # Give it some time to initialize
        else:
            logger.info(f"Index {PINECONE_INDEX_NAME} already exists")
    except Exception as e:
        logger.error(f"Error checking/creating index: {str(e)}")
        raise


# Track which papers have been indexed
def get_indexed_papers(specialty: str) -> Set[str]:
    """Get the list of papers that have already been indexed for a specialty"""
    doc_ref = db.collection("indexed_papers").document(specialty)
    doc = doc_ref.get()
    if doc.exists:
        return set(doc.to_dict().get("pmcids", []))
    return set()

def update_indexed_papers(specialty: str, pmcids: List[str]) -> None:
    """Add newly indexed papers to the tracking list in Firestore"""
    doc_ref = db.collection("indexed_papers").document(specialty)
    doc = doc_ref.get()
    
    if doc.exists:
        current_pmcids = set(doc.to_dict().get("pmcids", []))
        updated_pmcids = list(current_pmcids.union(set(pmcids)))
        doc_ref.update({"pmcids": updated_pmcids})
    else:
        doc_ref.set({"pmcids": pmcids})


async def normalize_medical_terms(query: str) -> str:
    """Convert layman's terms to medical terminology to improve search"""
    prompt = f"""
    Convert the following medical query from layman's terms to proper medical terminology.
    Only return the converted text without explanations or formatting.
    For example:
    Input: "heart attack with chest pain and shortness of breath"
    Output: "myocardial infarction with angina pectoris and dyspnea"
    
    Input: "{query}"
    Output:
    """
    
    response = gemini.generate_content(prompt)
    normalized = response.text.strip()
    logger.info(f"Normalized query: '{query}' -> '{normalized}'")
    return normalized


# Initialize RAG data
if __name__ == "__main__":
    logger.info("Starting RAG application")
    
    # Make sure our index exists
    ensure_index_exists()
    
    # Process papers for multiple specialties
    # Let's focus on neurology with more papers
    process_papers_for_rag("neurology", 25)  # Process more papers for neurology
    
    # Initialize other specialties with fewer papers to start
    specialties = ["cardiology", "pulmonology", "general"]
    for specialty in specialties:
        process_papers_for_rag(specialty, 5)
    
    import uvicorn
    logger.info("Starting FastAPI server")
    uvicorn.run(app, host="0.0.0.0", port=8001)