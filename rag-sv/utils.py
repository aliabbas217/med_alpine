import os
import requests
import tarfile
import io
import xml.etree.ElementTree as ET
import fitz  # PyMuPDF
from datetime import datetime, timedelta
import logging
from typing import List
import csv  
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

NCBI_API_KEY = os.getenv("NCBI_API_KEY")

# Configure a session with retry logic for requests
session = requests.Session()
retries = Retry(total=3, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504])
session.mount("https://", HTTPAdapter(max_retries=retries))

def parse_date(date_str: str) -> datetime:
    try:
        return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        try:
            return datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return datetime.min

def fetch_open_access_pmcids(niche: str, num_papers: int = 30, start_date: str = None) -> list:
    if not start_date:
        start_date = datetime.now().strftime("%Y/%m/%d")
    end_date = (datetime.strptime(start_date, "%Y/%m/%d") - timedelta(days=365)).strftime("%Y/%m/%d")
    all_pmcids = []
    retstart = 0
    retmax = min(num_papers, 100)  # NCBI API limit per request

    while len(all_pmcids) < num_papers:
        url = (
            f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc"
            f"&term={niche}%5Bmesh%5D+AND+open+access%5Bfilter%5D"
            f"&retstart={retstart}&retmax={retmax}&retmode=json"
            f"&mindate={end_date}&maxdate={start_date}&datetype=pdat"
            f"&api_key={NCBI_API_KEY}"  # Add API key to the request
        )
        try:
            response = session.get(url, timeout=10)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to fetch PMCIDs from NCBI: {str(e)}")
            raise ValueError(f"Failed to fetch PMCIDs from NCBI: {str(e)}")
        
        data = response.json()
        pmcids = [f"PMC{id}" for id in data["esearchresult"]["idlist"]]
        all_pmcids.extend(pmcids)

        # If fewer results than expected, adjust date range and continue
        if len(pmcids) < retmax:
            start_date = end_date
            end_date = (datetime.strptime(start_date, "%Y/%m/%d") - timedelta(days=365)).strftime("%Y/%m/%d")
            retstart = 0
            if start_date <= "2000/01/01":  # Stop if we go too far back
                break
        else:
            retstart += retmax

    return all_pmcids[:num_papers]

def get_paper_metadata(pmcids: list) -> list:
    csv_path = os.path.join(os.path.dirname(__file__), "oa_file_list.csv")
    if not os.path.exists(csv_path):
        logger.info("CSV file not found. Downloading...")
        url = "https://ftp.ncbi.nlm.nih.gov/pub/pmc/oa_file_list.csv"
        try:
            response = session.get(url, stream=True, timeout=10)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to download CSV file from NCBI: {str(e)}")
            raise ValueError(f"Failed to download CSV file from NCBI: {str(e)}")
        
        with open(csv_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        logger.info("CSV file downloaded successfully")

    papers = []
    with open(csv_path, newline='', encoding='utf-8') as f:
        csv_reader = csv.DictReader(f)
        for row in csv_reader:
            if row["Accession ID"] in pmcids:
                papers.append({
                    "pmcid": row["Accession ID"],
                    "file_path": row["File"],
                    "title": row["Article Citation"].split(".")[0],
                    "last_updated": row["Last Updated (YYYY-MM-DD HH:MM:SS)"] or "1970-01-01 00:00:00"
                })
    return sorted(papers, key=lambda x: parse_date(x["last_updated"]), reverse=True)

def extract_paper_content(file_path: str) -> str:
    url = f"https://ftp.ncbi.nlm.nih.gov/pub/pmc/{file_path}"
    try:
        response = session.get(url, stream=True, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to download tar file for {file_path}: {str(e)}")
        return "No content available"

    tar = tarfile.open(fileobj=io.BytesIO(response.content), mode="r:gz")
    nxml_content = None
    pdf_content = None
    for member in tar.getmembers():
        member_name = member.name.lower()
        if member_name.endswith((".nxml", ".xml")):
            nxml_content = tar.extractfile(member).read()
        elif member_name.endswith((".pdf", ".PDF")):
            pdf_content = tar.extractfile(member).read()

    if nxml_content:
        try:
            root = ET.fromstring(nxml_content)
            namespaces = dict([node for _, node in ET.iterparse(io.BytesIO(nxml_content), events=['start-ns'])])
            if 'nlm' not in namespaces:
                namespaces['nlm'] = 'http://dtd.nlm.nih.gov/publishing/3.0'
            
            for tag in ['abstract', 'Abstract']:
                abstract = (root.find(f".//{tag}") or root.find(f".//nlm:{tag}", namespaces) or
                           root.find(f".//{{http://dtd.nlm.nih.gov/publishing/3.0}}{tag}"))
                if abstract:
                    text = abstract.text.strip() if abstract.text else "".join(abstract.itertext()).strip()
                    if text:
                        logger.info(f"Extracted abstract from {tag} in {file_path}")
                        return text[:1000]
                    for p in abstract.findall(".//p") + abstract.findall(".//nlm:p", namespaces):
                        p_text = "".join(p.itertext()).strip()
                        if p_text:
                            logger.info(f"Extracted abstract from nested p tag in {file_path}")
                            return p_text[:1000]
            
            for sec in root.findall(".//sec") + root.findall(".//nlm:sec", namespaces):
                if sec.get("sec-type", "").lower() == "abstract" or "abstract" in sec.text.lower():
                    text = "".join(sec.itertext()).strip()
                    if text:
                        logger.info(f"Extracted abstract from sec tag in {file_path}")
                        return text[:1000]
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

def extract_pdf_text(file_path: str) -> str:
    url = f"https://ftp.ncbi.nlm.nih.gov/pub/pmc/{file_path}"
    try:
        response = session.get(url, stream=True, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to download tar file for {file_path}: {str(e)}")
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

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> List[str]:
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunk = text[i:i + chunk_size]
        if chunk:
            chunks.append(chunk)
    logger.info(f"Chunked text into {len(chunks)} pieces")
    return chunks