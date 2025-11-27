# Wolfram Cloud Storage Service

FastAPI service that generates artifacts using Wolfram Cloud APIs and stores them in Google Cloud Storage.

## Endpoints

- `GET /health` - Health check
- `POST /generate` - Generate and store artifact

## Request Format

```json
{
  "expression": "Plot[Sin[x], {x, 0, 2*Pi}]",
  "format": "png",
  "artifact_id": "unique-id-123"
}
```

## Response Format

```json
{
  "success": true,
  "artifact_id": "unique-id-123", 
  "expression": "Plot[Sin[x], {x, 0, 2*Pi}]",
  "format": "png",
  "image_url": "https://storage.googleapis.com/bucket/path/image.png",
  "gcs_path": "artifacts/unique-id-123_abc123.png",
  "timestamp": "2025-11-27T10:30:00"
}
```

## Environment Variables

- `WOLFRAM_PNG_API` - Wolfram Cloud PNG API URL
- `WOLFRAM_GIF_API` - Wolfram Cloud GIF API URL  
- `GCS_BUCKET_NAME` - Google Cloud Storage bucket name (default: "hack4unity-artifacts")
- `PORT` - Server port (default: 8080)

## Local Development

```bash
pip install -r requirements.txt
python main.py
```

## Cloud Run Deployment

```bash
# Build and deploy
gcloud run deploy wolfram-storage --source . --region us-central1 --allow-unauthenticated
```