from fastapi import HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Dict
import logging
from utils import fetch_open_access_pmcids, get_paper_metadata, extract_paper_content, parse_date

logger = logging.getLogger(__name__)
class NewsfeedRequest(BaseModel):
    niche: str
    months: int = 6  # Default to last 6 months

async def get_newsfeed(request: NewsfeedRequest, db):
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
            "publication_date": paper["last_updated"].split()[0],
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