# Unity Visual Sandbox API Configuration

# API Endpoint Configuration
API_URL = "https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox"
API_UUID = "48b879cf-46b3-4261-8d3f-d96081aeb6b8"

# API Parameters
DEFAULT_TIMEOUT = 15
DEFAULT_FORMAT = "auto"

# Test Configuration
ENABLE_DEBUG = True
SAVE_RESPONSES = True
OUTPUT_DIR = "./test_outputs"

# Response Type Mapping
RESULT_TYPES = {
    "image": "Base64 encoded image",
    "graphics": "SVG graphics", 
    "chart": "PNG chart (base64)",
    "animation": "GIF animation (base64)",
    "data": "JSON data",
    "text": "Plain text",
    "expression": "Wolfram expression string",
    "error": "Error message"
}

# Status Codes
SUCCESS_STATUS = "success"
ERROR_STATUS = "error"