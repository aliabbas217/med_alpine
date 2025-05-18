import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Set
from pinecone import Pinecone, ServerlessSpec
import time
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from dotenv import load_dotenv
from utils import fetch_open_access_pmcids, get_paper_metadata, extract_pdf_text, chunk_text, parse_date
from langchain_community.utilities import DuckDuckGoSearchAPIWrapper
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "medalpine-rag")
PINECONE_ENV = os.getenv("PINECONE_ENV", "us-east-1")

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

# Ensure index exists at startup
def ensure_index_exists():
    try:
        existing_indexes = pc.list_indexes().names()
        if PINECONE_INDEX_NAME not in existing_indexes:
            logger.info(f"Creating index: {PINECONE_INDEX_NAME}")
            pc.create_index(
                name=PINECONE_INDEX_NAME,
                dimension=384,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region=PINECONE_ENV
                )
            )
            logger.info(f"Waiting for index {PINECONE_INDEX_NAME} to be ready...")
            time.sleep(30)  # Wait for index to initialize
        else:
            logger.info(f"Index {PINECONE_INDEX_NAME} already exists")
    except Exception as e:
        logger.error(f"Failed to ensure index exists: {str(e)}")
        raise

# Initialize index
ensure_index_exists()
index = pc.Index(PINECONE_INDEX_NAME)

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)
gemini = genai.GenerativeModel('gemini-2.0-flash')

# Initialize embedding model
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize web search
search = DuckDuckGoSearchAPIWrapper()

class QueryModel(BaseModel):
    query: str

class CaseStudyModel(BaseModel):
    patient_history: str
    current_symptoms: str
    patient_perspective: str
    doctor_opinion: str
    specialties: List[str] = ["general"]

async def normalize_medical_terms(query: str) -> str:
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

def get_indexed_papers(specialty: str, db) -> Set[str]:
    doc_ref = db.collection("indexed_papers").document(specialty)
    doc = doc_ref.get()
    if doc.exists:
        return set(doc.to_dict().get("pmcids", []))
    return set()

def update_indexed_papers(specialty: str, pmcids: List[str], db) -> None:
    doc_ref = db.collection("indexed_papers").document(specialty)
    doc = doc_ref.get()
    if doc.exists:
        current_pmcids = set(doc.to_dict().get("pmcids", []))
        updated_pmcids = list(current_pmcids.union(set(pmcids)))
        doc_ref.update({"pmcids": updated_pmcids})
    else:
        doc_ref.set({"pmcids": pmcids})

async def index_papers(request: Dict, db):
    niche = request.get("niche", "neurology").lower()
    num_papers = request.get("num_papers", 30)
    
    indexed_papers = get_indexed_papers(niche, db)
    successfully_indexed = []
    start_date = "2025/05/18"  # Start from today (May 18, 2025)
    batch_size = num_papers * 2  # Fetch more papers per batch

    while len(successfully_indexed) < num_papers:
        pmcids = fetch_open_access_pmcids(niche, batch_size, start_date)
        if not pmcids:
            logger.info(f"No more papers available for {niche}")
            break

        papers = get_paper_metadata(pmcids)
        if not papers:
            logger.info(f"No metadata available for fetched PMCIDs in {niche}")
            break

        if papers:
            oldest_date = min(parse_date(paper["last_updated"]) for paper in papers)
            start_date = oldest_date.strftime("%Y/%m/%d")
        else:
            current_date = datetime.strptime(start_date, "%Y/%m/%d")
            start_date = (current_date - timedelta(days=365)).strftime("%Y/%m/%d")

        new_pmcids = [paper["pmcid"] for paper in papers if paper["pmcid"] not in indexed_papers]
        new_papers = [paper for paper in papers if paper["pmcid"] in new_pmcids]

        if not new_papers:
            logger.info(f"No new papers in this batch for {niche}, fetching older papers...")
            continue

        for paper in new_papers:
            if len(successfully_indexed) >= num_papers:
                break
            logger.info(f"Processing paper: {paper['pmcid']}")
            pdf_text = extract_pdf_text(paper["file_path"])
            if pdf_text:
                chunks = chunk_text(pdf_text)
                enriched_chunks = [f"[Medical Specialty: {niche}] {chunk}" for chunk in chunks]
                embeddings = embedder.encode(enriched_chunks, convert_to_numpy=True)
                # Convert last_updated to Unix timestamp
                last_updated_date = parse_date(paper["last_updated"])
                last_updated_timestamp = int(last_updated_date.timestamp())
                vectors = [
                    {
                        "id": f"{paper['pmcid']}_{i}",
                        "values": embedding.tolist(),
                        "metadata": {
                            "pmcid": paper["pmcid"],
                            "title": paper["title"],
                            "specialty": niche,
                            "chunk_id": i,
                            "text": chunk[:1000],
                            "last_updated": last_updated_timestamp  # Store as timestamp
                        }
                    }
                    for i, (embedding, chunk) in enumerate(zip(embeddings, enriched_chunks))
                ]
                for i in range(0, len(vectors), 100):
                    batch = vectors[i:i + 100]
                    index.upsert(vectors=batch)
                    logger.info(f"Upserted batch {i//100 + 1} for {paper['pmcid']} ({len(batch)} chunks)")
                successfully_indexed.append(paper["pmcid"])
            else:
                logger.warning(f"No text extracted from {paper['pmcid']}, skipping")

    if successfully_indexed:
        update_indexed_papers(niche, successfully_indexed, db)
        logger.info(f"Successfully indexed {len(successfully_indexed)} new papers for {niche}")
    
    return {"message": f"Indexed {len(successfully_indexed)} papers for {niche}"}

async def rag_query(request: QueryModel):
    query = request.query
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")

    normalized_query = await normalize_medical_terms(query)
    query_embedding = embedder.encode([normalized_query], convert_to_numpy=True)[0].tolist()
    logger.info(f"Embedded normalized query: {normalized_query}")

    try:
        # First attempt: Query without time filter to check if we have any relevant data
        results = index.query(
            vector=query_embedding,
            top_k=10,
            include_metadata=True
            # Remove time filter initially
        )
        
        # Track origins of information
        pinecone_sources = []
        web_sources = []
        
        # Safely format contexts with proper error handling for dates
        contexts = []
        for match in results["matches"]:
            try:
                metadata = match.get('metadata', {})
                title = metadata.get('title', 'Unknown')
                pmcid = metadata.get('pmcid', 'Unknown')
                text = metadata.get('text', 'No content')
                specialty = metadata.get('specialty', 'Unknown')
                
                # Handle timestamp with proper error checking
                date_str = "Unknown date"
                if 'last_updated' in metadata:
                    last_updated = metadata['last_updated']
                    if isinstance(last_updated, (int, float)):
                        date_str = datetime.fromtimestamp(last_updated).strftime('%Y-%m-%d')
                
                context = f"Source: {title} (Document ID: {pmcid}, Specialty: {specialty}, Last Updated: {date_str})\n\nContent: {text}"
                contexts.append(context)
                
                # Track this source
                if pmcid != 'Unknown':
                    pinecone_sources.append({
                        "pmcid": pmcid,
                        "title": title,
                        "date": date_str,
                        "score": match.get('score', 0)
                    })
                    
            except Exception as e:
                logger.error(f"Error formatting context: {str(e)}")
                continue  # Skip this result if there's an error
                
        context_text = "\n\n===\n\n".join(contexts) if contexts else ""
        logger.info(f"Retrieved {len(contexts)} contexts from Pinecone")

        # Determine if we need web search based on:
        # 1. No results from Pinecone
        # 2. Low relevance of results
        query_terms = normalized_query.lower().split()
        relevant_terms = ["treatment", "therapy", "drug", "medication", "management"]
        
        # Check if any result contains our search terms or relevant medical terms
        relevant_contexts = []
        for content in contexts:
            content_lower = content.lower()
            if any(term in content_lower for term in query_terms) or any(term in content_lower for term in relevant_terms):
                relevant_contexts.append(content)
                
        has_relevant_context = len(relevant_contexts) >= 3  # Lower threshold to 3
        
        # Step 3: Fallback to web search if needed
        web_search_results = []
        
        # Add specific handling for Alzheimer's
        if "alzheimer" in normalized_query.lower() and not has_relevant_context:
            logger.info("Query is about Alzheimer's disease and insufficient Pinecone results, using targeted web search")
            web_query = f"{normalized_query} 2024 OR 2025 FDA approved clinical trials site:nih.gov OR site:alzheimer.org OR site:clinicaltrials.gov"
            web_search_results = search.results(web_query, max_results=5)
            web_contexts = [
                f"Source: Web Search Result (URL: {result['link']})\n\nContent: {result['snippet']}"
                for result in web_search_results
            ]
            
            # Add web search results to context
            if web_contexts:
                if context_text:
                    context_text += "\n\n===\n\n" + "\n\n===\n\n".join(web_contexts)
                else:
                    context_text = "\n\n===\n\n".join(web_contexts)
                    
            logger.info(f"Retrieved {len(web_search_results)} web search results")
            
            # Track web sources
            web_sources = [result['link'] for result in web_search_results]

        # Step 4: Generate response with Gemini
        prompt = f"""
        You are MedAlpine AI, a medical research assistant for healthcare professionals.
        Answer the following question based on the provided context from recent medical papers and web search results.
        Even when context is limited, provide the most up-to-date information available from reliable sources.
        ALWAYS provide specific treatment options, their mechanisms of action, approval status, and evidence of efficacy when available.
        NEVER respond with "I am unable to answer" unless absolutely no relevant information exists.
        
        Make sure to properly cite your sources:
        - For medical papers, cite them as (Document ID: PMCID)
        - For web sources, cite them as (Source: URL)
        - If multiple sources support a claim, cite all of them
        
        CONTEXT:
        {context_text}

        QUESTION: {query}

        ANSWER (be specific about treatment options and include citations):
        """
        
        # Add Alzheimer's-specific information if requested
        if "alzheimer" in normalized_query.lower():
            prompt += """
            Include the following FDA-approved treatments if not already covered in the context:
            - Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) for symptom management
            - NMDA receptor antagonists (memantine) for moderate to severe cases
            - Monoclonal antibodies: aducanumab (Aduhelm, 2021), lecanemab (Leqembi, 2023), and donanemab (2024) which target amyloid plaques
            
            Also make sure to distinguish between:
            1. Symptomatic treatments (improving symptoms but not affecting disease progression)
            2. Disease-modifying treatments (targeting the underlying pathophysiology)
            """
        
        response = gemini.generate_content(prompt)
        logger.info(f"Generated response for query: {query}")

        # Combine and deduplicate source IDs
        all_sources = []
        
        # Add Pinecone sources first (with more detail)
        for source in pinecone_sources:
            all_sources.append(f"{source['pmcid']} - {source['title']}")
            
        # Then add web sources
        all_sources.extend(web_sources)
        
        # If we have no sources but generated a response, mark it as using general knowledge
        if not all_sources:
            all_sources = ["Response generated using general medical knowledge"]
        
        return {"answer": response.text, "sources": all_sources}
        
    except Exception as e:
        logger.error(f"Query failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to query Pinecone or web: {str(e)}")
    
async def analyze_case(case: CaseStudyModel):
    case_description = f"""
    Patient History: {case.patient_history}
    Current Symptoms: {case.current_symptoms}
    Patient's Perspective: {case.patient_perspective}
    Doctor's Initial Assessment: {case.doctor_opinion}
    """
    normalized_case = await normalize_medical_terms(case_description)
    case_embedding = embedder.encode([normalized_case], convert_to_numpy=True)[0].tolist()

    filter_condition = {"specialty": {"$in": case.specialties}} if case.specialties and "general" not in case.specialties else {}
    results = index.query(vector=case_embedding, top_k=8, include_metadata=True, filter=filter_condition)
    contexts = [
        f"Source: {match['metadata'].get('title', 'Unknown')} (Document ID: {match['metadata'].get('pmcid', 'Unknown')}) [Specialty: {match['metadata'].get('specialty', 'Unknown')}, Last Updated: {datetime.fromtimestamp(match['metadata'].get('last_updated', 0)).strftime('%Y-%m-%d')}])\n\nContent: {match['metadata'].get('text', 'No content')}"
        for match in results["matches"]
    ]
    context_text = "\n\n===\n\n".join(contexts)

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
    5. Cites specific research papers (using Document IDs) that support your analysis, including their last updated dates
    Be thorough yet concise. Acknowledge uncertainty where appropriate. Focus on evidence-based medicine.
    """
    response = gemini.generate_content(prompt)
    logger.info("Generated case study analysis")

    source_ids = list(set(match['metadata'].get('pmcid', 'Unknown') for match in results["matches"]))
    return {"analysis": response.text, "sources": source_ids}