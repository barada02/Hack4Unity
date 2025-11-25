#!/usr/bin/env python3
"""
Artifact Generator API Tester
Tests the new Wolfram Cloud artifact-generator API
"""

import requests
import json
import base64
import os
from datetime import datetime
from config import *

def test_artifact_api(code="Plot[Sin[x],{x,0,10}]"):
    """
    Test the artifact generator API with Wolfram code
    
    Args:
        code (str): Wolfram Language expression to test
    
    Returns:
        dict: Parsed API response
    """
    print("🧪 ARTIFACT GENERATOR API TEST")
    print("=" * 50)
    print(f"📝 Code: {code}")
    print(f"🌐 URL: {API_URL}")
    print("-" * 30)
    
    try:
        # Prepare the request
        params = {"code": code}
        
        print("📤 Sending GET request...")
        print(f"📋 Parameters: {params}")
        
        # Make the request
        response = requests.get(API_URL, params=params, timeout=30)
        
        print(f"📥 Response Status: {response.status_code}")
        print(f"📥 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Request successful!")
            
            # Parse JSON response
            try:
                data = response.json()
                print("✅ JSON parsing successful!")
                return analyze_response(data, code)
                
            except json.JSONDecodeError as e:
                print(f"❌ JSON Decode Error: {e}")
                print(f"📄 Raw Response: {response.text[:500]}...")
                return None
                
        else:
            print(f"❌ HTTP Error {response.status_code}")
            print(f"📄 Error Response: {response.text}")
            return None
            
    except requests.RequestException as e:
        print(f"❌ Request Error: {e}")
        return None

def analyze_response(data, original_code):
    """
    Analyze and display the API response
    
    Args:
        data (dict): Parsed JSON response
        original_code (str): Original Wolfram code
    
    Returns:
        dict: The response data
    """
    print("\n🔍 RESPONSE ANALYSIS")
    print("=" * 40)
    
    # Check all expected fields
    for field, description in RESPONSE_FIELDS.items():
        if field in data:
            value = data[field]
            print(f"✅ {field}: {description}")
            
            if field == "success":
                print(f"   Status: {'SUCCESS' if value else 'FAILED'}")
            elif field == "input":
                print(f"   Input: {value}")
            elif field == "outputExpr":
                print(f"   Expression: {value[:100]}{'...' if len(str(value)) > 100 else ''}")
            elif field == "imageBase64":
                if value and len(value) > 0:
                    print(f"   Base64 Length: {len(value)} characters")
                    # Save base64 as image file
                    save_base64_image(value, original_code)
                else:
                    print(f"   Base64: Empty or invalid")
            elif field == "imagePNG":
                if value:
                    print(f"   PNG Data: {len(value)} bytes")
                else:
                    print(f"   PNG: No data")
            elif field == "timestamp":
                print(f"   Timestamp: {value}")
        else:
            print(f"❌ Missing field: {field}")
    
    # Check for additional fields
    extra_fields = set(data.keys()) - set(RESPONSE_FIELDS.keys())
    if extra_fields:
        print(f"\n🔍 Additional fields: {list(extra_fields)}")
        for field in extra_fields:
            print(f"   {field}: {data[field]}")
    
    return data

def save_base64_image(base64_data, code, output_dir="./outputs"):
    """
    Save base64 image data to file
    
    Args:
        base64_data (str): Base64 encoded image
        code (str): Original Wolfram code (for filename)
        output_dir (str): Output directory
    """
    try:
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_code = "".join(c for c in code if c.isalnum() or c in "._-")[:30]
        filename = f"artifact_{safe_code}_{timestamp}.png"
        filepath = os.path.join(output_dir, filename)
        
        # Decode and save
        image_data = base64.b64decode(base64_data)
        with open(filepath, 'wb') as f:
            f.write(image_data)
        
        print(f"💾 Image saved: {filepath}")
        print(f"📊 Image size: {len(image_data)} bytes")
        
    except Exception as e:
        print(f"❌ Failed to save image: {e}")

def run_predefined_tests():
    """Run a series of predefined test expressions"""
    
    test_expressions = [
        "Plot[Sin[x],{x,0,10}]",
        "Plot3D[Sin[x*y], {x, -2, 2}, {y, -2, 2}]",
        "ListPlot[Table[{x, x^2}, {x, 0, 10}]]",
        "PieChart[{1, 2, 3, 4}]",
        "Graphics[Circle[]]",
        "BarChart[{1, 3, 2, 5, 4}]"
    ]
    
    print("🧪 RUNNING PREDEFINED TESTS")
    print("=" * 50)
    
    results = []
    for i, expr in enumerate(test_expressions, 1):
        print(f"\n📋 Test {i}/{len(test_expressions)}")
        result = test_artifact_api(expr)
        results.append({"expression": expr, "result": result})
        
        if result and result.get("success"):
            print("✅ Test passed!")
        else:
            print("❌ Test failed!")
    
    return results

def interactive_mode():
    """Interactive testing mode"""
    
    print("🎯 INTERACTIVE MODE")
    print("=" * 30)
    print("Enter Wolfram expressions to test (or 'quit' to exit)")
    
    while True:
        code = input("\n👉 Wolfram code: ").strip()
        
        if code.lower() in ['quit', 'exit', 'q']:
            break
        
        if code:
            test_artifact_api(code)
        else:
            print("⚠️  Please enter a valid expression")

def main():
    """Main function with menu system"""
    
    print("🚀 WOLFRAM ARTIFACT GENERATOR TESTER")
    print("=" * 50)
    
    while True:
        print("\n📋 Choose an option:")
        print("1. Single test (Sin plot)")
        print("2. Interactive mode")
        print("3. Run predefined tests")
        print("4. Custom expression")
        print("5. Exit")
        
        choice = input("\n👉 Enter choice (1-5): ").strip()
        
        if choice == "1":
            test_artifact_api("Plot[Sin[x],{x,0,10}]")
            
        elif choice == "2":
            interactive_mode()
            
        elif choice == "3":
            run_predefined_tests()
            
        elif choice == "4":
            code = input("👉 Enter Wolfram expression: ").strip()
            if code:
                test_artifact_api(code)
            else:
                print("⚠️  Invalid expression")
                
        elif choice == "5":
            print("👋 Goodbye!")
            break
            
        else:
            print("⚠️  Invalid choice. Please select 1-5.")

if __name__ == "__main__":
    main()