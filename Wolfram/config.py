# Artifact Generator API Configuration

# API Endpoint Configuration
API_URL = "https://www.wolframcloud.com/obj/chandanbarada2/api/artifact-generator"
API_UUID = "artifact-generator-v1"

# API Parameters
DEFAULT_TIMEOUT = 15
DEFAULT_FORMAT = "auto"

# Test Configuration
ENABLE_DEBUG = True
SAVE_RESPONSES = True
OUTPUT_DIR = "./test_outputs"

# Response Fields (New API Format)
RESPONSE_FIELDS = {
    "input": "Original Wolfram code",
    "outputExpr": "Expression form result",
    "imageBase64": "Base64 encoded PNG",
    "imagePNG": "Raw PNG bytes", 
    "success": "Boolean success status",
    "timestamp": "ISO datetime string"
}

# Status Codes
SUCCESS_STATUS = True
ERROR_STATUS = False