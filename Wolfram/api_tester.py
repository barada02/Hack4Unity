#!/usr/bin/env python3
"""
Unity Visual Sandbox API Tester
Direct API testing with raw output analysis
"""

import requests
import json
import base64
import os
from datetime import datetime
from config import *

def save_response(test_name, response_data, raw_response):
    """Save test response to file for analysis"""
    if not SAVE_RESPONSES:
        return
        
    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{OUTPUT_DIR}/{test_name}_{timestamp}.json"
    
    # Save structured data
    with open(filename, 'w') as f:
        json.dump({
            "test_name": test_name,
            "timestamp": timestamp,
            "status_code": raw_response.status_code,
            "headers": dict(raw_response.headers),
            "response_data": response_data,
            "raw_text": raw_response.text[:1000] if len(raw_response.text) > 1000 else raw_response.text
        }, f, indent=2)
    
    print(f"✅ Response saved to: {filename}")

def analyze_result(response_data):
    """Analyze the response and provide insights"""
    print("\n" + "="*50)
    print("📊 RESPONSE ANALYSIS")
    print("="*50)
    
    # Handle raw Wolfram responses (not JSON wrapped)
    if response_data.get('raw_response'):
        print("🔍 Raw Wolfram Output Detected")
        result = response_data.get('result', '')
        content_type = response_data.get('content_type', '')
        
        print(f"Content-Type: {content_type}")
        print(f"Response Length: {len(result)} characters")
        
        # Analyze content type
        if 'image' in content_type or result.startswith('data:image'):
            print("✅ Image content detected")
        elif 'svg' in content_type or result.startswith('<svg'):
            print("✅ SVG graphics detected")
        elif result.startswith('<?xml'):
            print("✅ XML content detected")
        elif result.startswith('{') or result.startswith('['):
            print("✅ Possible JSON/data structure")
        else:
            print(f"📄 Text content preview: {result[:200]}...")
        
        return
    
    if 'status' in response_data:
        status = response_data['status']
        print(f"Status: {status}")
        
        if status == SUCCESS_STATUS:
            result_type = response_data.get('resultType', 'unknown')
            print(f"Result Type: {result_type}")
            print(f"Description: {RESULT_TYPES.get(result_type, 'Unknown type')}")
            
            # Analyze result content
            result = response_data.get('result', '')
            if result_type in ['image', 'graphics', 'chart', 'animation']:
                print(f"Content Length: {len(result)} characters")
                if result.startswith('data:image'):
                    print("✅ Proper base64 image format detected")
                elif result.startswith('<svg'):
                    print("✅ SVG graphics format detected")
                else:
                    print("⚠️  Unknown image format")
            
            elif result_type == 'data':
                try:
                    data = json.loads(result) if isinstance(result, str) else result
                    print(f"Data items: {len(data) if isinstance(data, list) else 'N/A'}")
                    print("✅ Valid JSON data format")
                except:
                    print("⚠️  Invalid JSON data format")
            
            # Performance metrics
            if 'executionTime' in response_data:
                exec_time = response_data['executionTime']
                print(f"Execution Time: {exec_time}")
                
            if 'codeLength' in response_data:
                code_len = response_data['codeLength']
                print(f"Code Length: {code_len} characters")
                
        else:
            print(f"❌ Error: {response_data.get('result', 'Unknown error')}")
    
    print("="*50)

def test_expression(expression_code, description=""):
    """Test a single Wolfram expression"""
    print(f"\n🧪 Testing: {description}")
    print(f"Code: {expression_code}")
    print("-" * 30)
    
    try:
        # Prepare request
        payload = {
            "code": expression_code,
            "format": DEFAULT_FORMAT,
            "timeout": DEFAULT_TIMEOUT
        }
        
        print("📤 Sending request...")
        if ENABLE_DEBUG:
            print(f"URL: {API_URL}")
            print(f"Payload (form data): {payload}")
            print("Note: Sending as form data, not JSON")
        
        # Send request (Wolfram Cloud expects form data, not JSON)
        response = requests.post(
            API_URL,
            data=payload,  # Use form data instead of JSON
            timeout=30  # HTTP timeout (separate from Wolfram timeout)
        )
        
        print(f"📥 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            print(f"📥 Raw Response Content: {response.text[:500]}...")  # Show first 500 chars
            print(f"📥 Response Headers: {dict(response.headers)}")
            
            try:
                response_data = response.json()
                
                # Save response for analysis
                test_name = description.replace(" ", "_").lower() if description else "unnamed_test"
                save_response(test_name, response_data, response)
                
                # Analyze response
                analyze_result(response_data)
                
                return response_data
            except json.JSONDecodeError as e:
                print(f"❌ JSON Decode Error: {str(e)}")
                print(f"📄 Full Response Text: {response.text}")
                
                # Check if it's direct Wolfram output (not wrapped in JSON)
                if response.text.strip():
                    print("🔍 Appears to be direct Wolfram output, not JSON wrapped")
                    
                    # Try to determine the content type
                    content_type = response.headers.get('content-type', '')
                    print(f"📋 Content-Type: {content_type}")
                    
                    # Create a mock response for analysis
                    mock_response = {
                        "status": "success",
                        "result": response.text,
                        "resultType": "unknown",
                        "raw_response": True,
                        "content_type": content_type
                    }
                    
                    analyze_result(mock_response)
                    return mock_response
                
                return None
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except requests.exceptions.Timeout:
        print("❌ Request timeout - API took too long to respond")
        return None
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - Check internet connection and API URL")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return None

def interactive_menu():
    """Interactive menu for testing expressions"""
    print("\n" + "="*60)
    print("🚀 UNITY VISUAL SANDBOX API TESTER")
    print("="*60)
    
    while True:
        print("\n📋 Choose a test option:")
        print("1. Load from expressions file")
        print("2. Enter custom expression")
        print("3. Quick test (sine plot)")
        print("4. View API configuration")
        print("5. Exit")
        
        choice = input("\n👉 Enter your choice (1-5): ").strip()
        
        if choice == '1':
            # This will load from expressions.py
            try:
                from expressions import get_expression_by_number, list_expressions
                list_expressions()
                expr_num = input("\n👉 Enter expression number: ").strip()
                try:
                    expr_data = get_expression_by_number(int(expr_num))
                    if expr_data:
                        test_expression(expr_data['code'], expr_data['description'])
                    else:
                        print("❌ Invalid expression number")
                except ValueError:
                    print("❌ Please enter a valid number")
            except ImportError:
                print("❌ expressions.py file not found")
                
        elif choice == '2':
            print("\n📝 Enter custom Wolfram expression:")
            custom_code = input("Code: ").strip()
            if custom_code:
                description = input("Description (optional): ").strip()
                test_expression(custom_code, description or "Custom Expression")
            else:
                print("❌ Empty expression")
                
        elif choice == '3':
            test_expression("Plot[Sin[x], {x, 0, 2*Pi}]", "Quick Test - Sine Plot")
            
        elif choice == '4':
            print(f"\n📡 API Configuration:")
            print(f"URL: {API_URL}")
            print(f"UUID: {API_UUID}")
            print(f"Default Timeout: {DEFAULT_TIMEOUT}s")
            print(f"Default Format: {DEFAULT_FORMAT}")
            print(f"Debug Mode: {ENABLE_DEBUG}")
            print(f"Save Responses: {SAVE_RESPONSES}")
            
        elif choice == '5':
            print("\n👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid choice. Please try again.")

if __name__ == "__main__":
    interactive_menu()