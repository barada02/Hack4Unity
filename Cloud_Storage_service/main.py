from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google.cloud import storage
import requests
import uuid
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Wolfram Cloud Storage Service", version="1.0.0")

# Wolfram API URLs from environment
WOLFRAM_APIS = {
    "png": os.getenv("WOLFRAM_PNG_API"),
    "gif": os.getenv("WOLFRAM_GIF_API")
}

# Google Cloud Storage
BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "hack4unity-artifacts")
storage_client = storage.Client()

class WolframRequest(BaseModel):
    expression: str
    format: str = "png"  # png or gif
    artifact_id: str

class WolframResponse(BaseModel):
    success: bool
    artifact_id: str
    expression: str
    format: str
    image_url: str = None
    gcs_path: str = None
    timestamp: str
    error: str = None

@app.get("/health")
async def health_check():
    """Health check endpoint for Cloud Run"""
    return {"status": "healthy", "service": "wolfram-cloud-storage"}

@app.post("/generate", response_model=WolframResponse)
async def generate_artifact(request: WolframRequest):
    """
    Generate artifact using Wolfram API and store in Google Cloud Storage
    """
    try:
        logger.info(f"Processing request for artifact {request.artifact_id}")
        
        # Validate format
        if request.format not in ["png", "gif"]:
            raise HTTPException(status_code=400, detail="Format must be 'png' or 'gif'")
        
        # Get Wolfram API URL
        api_url = WOLFRAM_APIS.get(request.format)
        if not api_url:
            raise HTTPException(status_code=400, detail=f"API not found for format: {request.format}")
        
        # Call Wolfram API
        logger.info(f"Calling Wolfram API: {api_url}")
        wolfram_params = {"expr": request.expression}
        
        response = requests.get(api_url, params=wolfram_params, timeout=30)
        response.raise_for_status()
        
        # Generate unique filename
        timestamp = datetime.utcnow().isoformat()
        filename = f"artifacts/{request.artifact_id}_{uuid.uuid4().hex[:8]}.{request.format}"
        
        # Upload to Google Cloud Storage
        logger.info(f"Uploading to GCS: {filename}")
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(filename)
        
        # Set content type based on format
        content_type = "image/png" if request.format == "png" else "image/gif"
        blob.upload_from_string(response.content, content_type=content_type)
        
        # Make blob publicly readable
        blob.make_public()
        
        # Generate public URL
        public_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{filename}"
        
        logger.info(f"Successfully generated artifact: {public_url}")
        
        return WolframResponse(
            success=True,
            artifact_id=request.artifact_id,
            expression=request.expression,
            format=request.format,
            image_url=public_url,
            gcs_path=filename,
            timestamp=timestamp
        )
        
    except requests.RequestException as e:
        logger.error(f"Wolfram API error: {str(e)}")
        return WolframResponse(
            success=False,
            artifact_id=request.artifact_id,
            expression=request.expression,
            format=request.format,
            timestamp=datetime.utcnow().isoformat(),
            error=f"Wolfram API error: {str(e)}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return WolframResponse(
            success=False,
            artifact_id=request.artifact_id,
            expression=request.expression,
            format=request.format,
            timestamp=datetime.utcnow().isoformat(),
            error=f"Service error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)