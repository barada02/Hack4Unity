import requests
import os
from typing import Dict, Optional
import logging
from dotenv import load_dotenv

# Load .env file from parent directory (two levels up from tools/)
parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(parent_dir, '.env'))

logger = logging.getLogger(__name__)

def generate_wolfram_artifact(
    expression: str, 
    format: str = "png", 
    artifact_id: str = None
) -> Dict:
    """
    Generate a Wolfram artifact using the Cloud Run service and return the result.
    
    Args:
        expression (str): Wolfram Language expression to evaluate
        format (str): Output format - "png" or "gif" (default: "png")
        artifact_id (str): Unique identifier for the artifact (optional, will generate if None)
        
    Returns:
        Dict: Response containing success status, image URL, and metadata
        
    Example:
        result = generate_wolfram_artifact(
            expression="Plot[Sin[x], {x, 0, 2*Pi}]",
            format="png",
            artifact_id="test-123"
        )
        
        if result["success"]:
            image_url = result["image_url"]
            print(f"Artifact generated: {image_url}")
        else:
            print(f"Error: {result['error']}")
    """
    
    try:
        # Get Cloud Run service URL from environment
        cloud_run_url = os.getenv("CLOUD_RUN_SERVICE_URL")
        if not cloud_run_url:
            return {
                "success": False,
                "error": "CLOUD_RUN_SERVICE_URL not found in environment variables"
            }
        
        # Generate artifact_id if not provided
        if artifact_id is None:
            import uuid
            artifact_id = f"artifact_{uuid.uuid4().hex[:8]}"
        
        # Validate format
        if format not in ["png", "gif"]:
            return {
                "success": False,
                "error": "Format must be 'png' or 'gif'"
            }
        
        # Prepare request payload
        payload = {
            "expression": expression,
            "format": format,
            "artifact_id": artifact_id
        }
        
        # Make request to Cloud Run service
        logger.info(f"Calling Cloud Run service: {cloud_run_url}/generate")
        
        response = requests.post(
            f"{cloud_run_url}/generate",
            json=payload,
            timeout=60  # 60 second timeout for Wolfram processing
        )
        
        response.raise_for_status()
        result = response.json()
        
        logger.info(f"Cloud Run response: {result.get('success', False)}")
        
        return result
        
    except requests.exceptions.Timeout:
        logger.error("Cloud Run service timeout")
        return {
            "success": False,
            "error": "Request timeout - Wolfram processing took too long"
        }
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        return {
            "success": False,
            "error": f"Network error: {str(e)}"
        }
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return {
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }


def health_check_wolfram_service() -> Dict:
    """
    Check if the Wolfram Cloud Run service is healthy.
    
    Returns:
        Dict: Health status response
    """
    
    try:
        cloud_run_url = os.getenv("CLOUD_RUN_SERVICE_URL")
        if not cloud_run_url:
            return {
                "healthy": False,
                "error": "CLOUD_RUN_SERVICE_URL not found in environment variables"
            }
        
        response = requests.get(f"{cloud_run_url}/health", timeout=10)
        response.raise_for_status()
        
        result = response.json()
        return {
            "healthy": True,
            "service_response": result
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "healthy": False,
            "error": str(e)
        }


# Example usage and test function
if __name__ == "__main__":
    # Test the function (requires CLOUD_RUN_SERVICE_URL in environment)
    
    # Test health check
    health = health_check_wolfram_service()
    print("Health check:", health)
    
    # Test artifact generation
    if health.get("healthy"):
        test_result = generate_wolfram_artifact(
            expression="Plot[Sin[x], {x, 0, 2*Pi}]",
            format="png",
            artifact_id="test_artifact"
        )
        print("Test result:", test_result)
    else:
        print("Service not healthy, skipping artifact test")