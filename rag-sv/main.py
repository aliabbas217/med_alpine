import os
import logging
import json
from fastapi import FastAPI, Depends
from dotenv import load_dotenv
from firebase_admin import credentials, initialize_app, firestore
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
## import csv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Firebase Admin SDK
firebase_credentials_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY", os.path.join(os.path.dirname(__file__), "firebase-credentials.json"))
if firebase_credentials_path.startswith("{") and firebase_credentials_path.endswith("}"):
    cred_dict = json.loads(firebase_credentials_path)
else:
    cred_dict = json.load(open(firebase_credentials_path))
cred = credentials.Certificate(cred_dict)
initialize_app(cred, {"projectId": os.getenv("NEXT_PUBLIC_FIREBASE_PROJECT_ID")})
db = firestore.client()

# Create FastAPI app
app = FastAPI(title="MedAlpine API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to provide Firestore client
def get_db():
    return db

# Import modules after Firebase initialization
from newsfeed import get_newsfeed, NewsfeedRequest
from rag import rag_query, index_papers, QueryModel, analyze_case, CaseStudyModel

# Include endpoints with dependencies
@app.post("/newsfeed")
async def newsfeed_endpoint(request: NewsfeedRequest, db=Depends(get_db)):
    return await get_newsfeed(request, db)

app.post("/rag-query")(rag_query)
app.post("/analyze-case")(analyze_case)

@app.post("/index-papers")
async def index_papers_endpoint(request: Dict, db=Depends(get_db)):
    return await index_papers(request, db)

if __name__ == "__main__":
    logger.info("Starting MedAlpine API server on port 8000")
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)