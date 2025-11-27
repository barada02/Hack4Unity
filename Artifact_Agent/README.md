# Artifact Agent

An intelligent Wolfram Language artifact generation agent built with Google Agent Development Kit (ADK). This agent converts natural language requests into Wolfram Language expressions and generates visual artifacts through a cloud service.

## Overview

The Artifact Agent specializes in:
- Converting user requests to Wolfram Language expressions
- Generating visual artifacts (plots, graphs, animations, mathematical visualizations)
- Storing artifacts in Google Cloud Storage
- Returning structured JSON responses with artifact URLs

## Architecture

```
Artifact_Agent/
├── .env                           # Environment variables
├── Dockerfile                     # Container configuration
├── requirements.txt               # Python dependencies
├── fastapi_app.py                # FastAPI server wrapper
├── agent_runner.py               # Agent execution script
└── artifact_agent/               # Main agent package
    ├── __init__.py
    ├── agent.py                   # Agent definition and configuration
    ├── config.py                  # Configuration and instructions
    └── tools/
        └── wolfram_generator.py   # Wolfram Cloud Run integration tool
```

## Features

- **Natural Language Processing**: Understands user requests for visual content
- **Wolfram Language Generation**: Creates concise, efficient Wolfram expressions
- **Cloud Integration**: Uses Cloud Run service for Wolfram execution
- **Artifact Storage**: Stores generated images/animations in Google Cloud Storage
- **JSON API**: Returns structured responses with artifact metadata

## Environment Variables

Create a `.env` file in the root directory:

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-project-id
CLOUD_PROJECT_ID=your-project-id
CLOUD_PROJECT_REGION=us-central1

# Model Configuration
MODEL=gemini-2.0-flash-lite

# Wolfram Cloud Run Service
CLOUD_RUN_SERVICE_URL=https://your-wolfram-service-url
```

## Usage

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the agent directly
python agent_runner.py

# Or run as FastAPI service
python fastapi_app.py
```

### Docker Deployment

```bash
# Build image
docker build -t artifact-agent .

# Run container
docker run -p 8080:8080 --env-file .env artifact-agent
```

### API Usage

Send POST requests to generate artifacts:

```json
{
  "prompt": "Create a sine wave plot",
  "artifact_id": "sine-wave-001"
}
```

Response:

```json
{
  "success": true,
  "artifact_id": "sine-wave-001",
  "expression": "Plot[Sin[x], {x, 0, 2*Pi}]",
  "format": "png",
  "image_url": "https://storage.googleapis.com/bucket/artifacts/sine-wave-001.png",
  "gcs_path": "artifacts/sine-wave-001.png",
  "timestamp": "2025-11-28T10:30:00"
}
```

## Agent Capabilities

### Supported Artifact Types

- **Static Visualizations**: Plots, graphs, charts, mathematical functions
- **Animations**: Dynamic visualizations, animated plots, moving graphics
- **3D Graphics**: Three-dimensional plots, surfaces, geometric shapes
- **Mathematical Content**: Fractals, equations, data visualizations
- **Custom Graphics**: Patterns, artistic content, geometric designs

### Example Requests

- "Create a 3D spiral animation"
- "Plot a sine and cosine function together"  
- "Generate a fractal pattern"
- "Make a bar chart of sample data"
- "Create an animated bouncing ball"

## Dependencies

- **Google ADK**: Agent framework and AI capabilities
- **FastAPI**: HTTP API server
- **python-dotenv**: Environment variable management
- **requests**: HTTP client for Cloud Run integration

## Development

The agent uses a modular architecture:

1. **Agent Core** (`agent.py`): Main agent definition with ADK integration
2. **Configuration** (`config.py`): Centralized settings and instructions
3. **Tools** (`tools/wolfram_generator.py`): Cloud Run service integration
4. **API Layer** (`fastapi_app.py`): HTTP interface for external access

## Deployment

The agent can be deployed as:
- **Standalone service**: Direct agent execution
- **FastAPI service**: HTTP API for integration with web applications
- **Docker container**: Containerized deployment for cloud platforms
- **Cloud Run**: Serverless deployment on Google Cloud

## License

This project is part of the Hack4Unity hackathon submission.