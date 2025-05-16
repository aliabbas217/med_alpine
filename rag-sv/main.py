import os
import csv
import requests
import tarfile
import io
import xml.etree.ElementTree as ET
import fitz  # PyMuPDF
import json
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from firebase_admin import credentials, initialize_app, firestore
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Firebase Admin SDK
firebase_credentials_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
if not firebase_credentials_path:
    # Default to a local credentials file if env var not set
    firebase_credentials_path = os.path.join(os.path.dirname(__file__), "firebase-credentials.json")
    cred_dict = json.load(open(firebase_credentials_path))
else:
    # If it's a JSON string, parse it; otherwise, treat it as a file path
    if firebase_credentials_path.strip().startswith("{") and firebase_credentials_path.strip().endswith("}"):
        cred_dict = json.loads(firebase_credentials_path)
    else:
        cred_dict = json.load(open(firebase_credentials_path))

cred = credentials.Certificate(cred_dict)
initialize_app(cred, {
    "projectId": os.getenv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
})

db = firestore.client()
app = FastAPI(title="MedAlpine Newsfeed API")

# Local path for the CSV file in the root directory
CSV_LOCAL_PATH = os.path.join(os.path.dirname(__file__), "oa_file_list.csv")

# Request model
class NewsfeedRequest(BaseModel):
    niche: str
    months: int = 6  # Default to last 6 months

# Parse date from CSV
def parse_date(date_str: str) -> datetime:
    try:
        return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return datetime.min

# Fetch open-access PMCIDs from NCBI E-Utilities API
def fetch_open_access_pmcids(niche: str) -> list:
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term={niche}%5Bmesh%5D+AND+open+access%5Bfilter%5D&retmax=100&retmode=json"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch PMCIDs from NCBI")
    data = response.json()
    return [f"PMC{id}" for id in data["esearchresult"]["idlist"]]

# Read or download local CSV and match PMCIDs
def get_paper_metadata(pmcids: list) -> list:
    if not os.path.exists(CSV_LOCAL_PATH):
        logger.info(f"CSV file not found at {CSV_LOCAL_PATH}. Downloading...")
        url = "https://ftp.ncbi.nlm.nih.gov/pub/pmc/oa_file_list.csv"
        response = requests.get(url, stream=True)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to download CSV file from NCBI")

        with open(CSV_LOCAL_PATH, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        logger.info(f"CSV file downloaded successfully to {CSV_LOCAL_PATH}")

    papers = []
    with open(CSV_LOCAL_PATH, newline='', encoding='utf-8') as f:
        csv_reader = csv.DictReader(f)
        for row in csv_reader:
            if row["Accession ID"] in pmcids:
                papers.append({
                    "pmcid": row["Accession ID"],
                    "file_path": row["File"],
                    "title": row["Article Citation"].split(".")[0],
                    "last_updated": row["Last Updated (YYYY-MM-DD HH:MM:SS)"]
                })
    return sorted(papers, key=lambda x: parse_date(x["last_updated"]), reverse=True)[:10]

# Download and extract paper content
def extract_paper_content(file_path: str) -> str:
    url = f"https://ftp.ncbi.nlm.nih.gov/pub/pmc/{file_path}"
    response = requests.get(url, stream=True)
    if response.status_code != 200:
        logger.error(f"Failed to download tar file for {file_path}: HTTP {response.status_code}")
        raise HTTPException(status_code=500, detail="Failed to download tar file")

    tar = tarfile.open(fileobj=io.BytesIO(response.content), mode="r:gz")
    nxml_content = None
    pdf_content = None
    for member in tar.getmembers():
        member_name = member.name.lower()
        if member_name.endswith((".nxml", ".xml")):
            nxml_content = tar.extractfile(member).read()
        elif member_name.endswith((".pdf", ".PDF")):
            pdf_content = tar.extractfile(member).read()

    # Prefer NXML for abstract
    if nxml_content:
        try:
            root = ET.fromstring(nxml_content)
            # Dynamically discover namespaces
            namespaces = dict([node for _, node in ET.iterparse(io.BytesIO(nxml_content), events=['start-ns'])])
            if 'nlm' not in namespaces:
                namespaces['nlm'] = 'http://dtd.nlm.nih.gov/publishing/3.0'
            
            # Broader search for abstract-like content
            for tag in ['abstract', 'Abstract']:
                # Try without namespace, with nlm namespace, and raw tag
                abstract = (root.find(f".//{tag}") or 
                           root.find(f".//nlm:{tag}", namespaces) or
                           root.find(f".//{{http://dtd.nlm.nih.gov/publishing/3.0}}{tag}"))
                if abstract is not None:
                    # Look for direct text or nested p tags
                    text = abstract.text.strip() if abstract.text else "".join(abstract.itertext()).strip()
                    if text:
                        logger.info(f"Extracted abstract from {tag} in {file_path}")
                        return text[:1000]
                    # Check for nested p tags
                    for p in abstract.findall(".//p") + abstract.findall(".//nlm:p", namespaces):
                        p_text = "".join(p.itertext()).strip()
                        if p_text:
                            logger.info(f"Extracted abstract from nested p tag in {file_path}")
                            return p_text[:1000]
            
            # Check for section with abstract-like content
            for sec in root.findall(".//sec") + root.findall(".//nlm:sec", namespaces):
                sec_type = sec.get("sec-type", "").lower()
                if sec_type == "abstract" or "abstract" in sec_type:
                    text = "".join(sec.itertext()).strip()
                    if text:
                        logger.info(f"Extracted abstract from sec tag in {file_path}")
                        return text[:1000]
                    # Check for nested p tags
                    for p in sec.findall(".//p") + sec.findall(".//nlm:p", namespaces):
                        p_text = "".join(p.itertext()).strip()
                        if p_text:
                            logger.info(f"Extracted abstract from nested p tag in sec for {file_path}")
                            return p_text[:1000]
            
            logger.warning(f"No abstract or abstract-like content found in NXML for {file_path}")
            return "No abstract available"
        except ET.ParseError as e:
            logger.error(f"NXML parsing failed for {file_path}: {str(e)}")
            return "No abstract available (parsing error)"

    # Fallback to PDF
    if pdf_content:
        try:
            doc = fitz.open(stream=pdf_content, filetype="pdf")
            text = ""
            for i in range(min(3, doc.page_count)):
                page_text = doc[i].get_text("text").strip()
                if page_text:
                    text += page_text + "\n"
                if len(text) >= 1000:
                    break
            doc.close()
            if text.strip():
                logger.info(f"Extracted text from PDF for {file_path}")
                return text.strip()[:1000]
            logger.warning(f"No extractable text found in PDF for {file_path}")
            return "No content available"
        except Exception as e:
            logger.error(f"PDF extraction failed for {file_path}: {str(e)}")
            return "No content available"

    logger.warning(f"No NXML or PDF found in tar file for {file_path}")
    return "No content extracted"

# Fetch or update newsfeed from Firestore
@app.post("/newsfeed")
async def get_newsfeed(request: NewsfeedRequest):
    niche = request.niche.lower()
    cutoff_date = datetime.now() - timedelta(days=request.months * 30)

    # Check Firestore for cached data
    newsfeed_ref = db.collection("newsfeed").document(niche)
    doc = newsfeed_ref.get()
    if doc.exists:
        data = doc.to_dict()
        last_fetched = parse_date(data.get("last_fetched", "1970-01-01 00:00:00"))
        if last_fetched > cutoff_date:
            return {"papers": data.get("papers", [])}

    # Fetch new data
    pmcids = fetch_open_access_pmcids(niche)
    papers = get_paper_metadata(pmcids)

    # Extract content for each paper
    result = []
    for paper in papers:
        content = extract_paper_content(paper["file_path"])
        result.append({
            "pmcid": paper["pmcid"],
            "title": paper["title"],
            "publication_date": paper["last_updated"].split()[0],  # YYYY-MM-DD
            "last_updated": paper["last_updated"],
            "content": content,
            "full_text_url": f"https://www.ncbi.nlm.nih.gov/pmc/articles/{paper['pmcid']}/"
        })

    # Save to Firestore
    newsfeed_ref.set({
        "papers": result,
        "last_fetched": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

    return {"papers": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)