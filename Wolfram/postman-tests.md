# Unity Visual Sandbox - Postman Test Collection

## 🚀 **Postman Collection Setup**

### **Base Configuration:**
- **Method:** POST
- **URL:** `https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox`
- **Body Type:** `x-www-form-urlencoded` (NOT JSON)
- **Headers:** 
  ```
  Content-Type: application/x-www-form-urlencoded
  ```

---

## 📋 **Test Examples for Postman**

### **Test 1: Simple 2D Plot**
**Body (x-www-form-urlencoded):**
```
code: Plot[Sin[x], {x, 0, 2*Pi}]
format: auto
timeout: 10
```

**Expected Response:**
```json
{
  "status": "success",
  "result": "<svg>...</svg>",
  "resultType": "graphics",
  "executionTime": 1732537815.123,
  "timestamp": "Mon 25 Nov 2024 12:30:15",
  "codeLength": 27
}
```

---

### **Test 2: Unity Word Cloud**
**Body (x-www-form-urlencoded):**
```
code: WordCloud["unity peace collaboration diversity friendship connection understanding harmony", ColorFunction -> "Rainbow"]
format: auto
```

---

### **Test 3: Simple Image**
```json
{
  "code": "Image[Graphics[{Red, Disk[]}], ImageSize -> 200]"
}
```

---

### **Test 4: Cultural Network Graph**
```json
{
  "code": "Graph[{1 <-> 2, 2 <-> 3, 3 <-> 4, 1 <-> 4}, VertexLabels -> {1 -> \"USA\", 2 -> \"Japan\", 3 -> \"India\", 4 -> \"Brazil\"}, EdgeStyle -> Thick, VertexSize -> Large]"
}
```

---

### **Test 5: 3D Unity Surface**
```json
{
  "code": "Plot3D[Sin[x*y], {x, -2, 2}, {y, -2, 2}, ColorFunction -> \"Rainbow\", PlotLabel -> \"Unity Surface\"]"
}
```

---

### **Test 6: Unity Color Spectrum**
```json
{
  "code": "Graphics[Table[{Hue[i/10], Rectangle[{i, 0}, {i + 1, 1}]}, {i, 0, 9}], ImageSize -> 400, PlotLabel -> \"Unity Spectrum\"]"
}
```

---

### **Test 7: Cultural Diversity Chart**
```json
{
  "code": "PieChart[{30, 25, 20, 15, 10}, ChartLabels -> {\"Asia\", \"Europe\", \"Americas\", \"Africa\", \"Oceania\"}, ChartStyle -> \"Pastel\", PlotLabel -> \"Cultural Diversity\"]"
}
```

---

### **Test 8: Harmony Waves**
```json
{
  "code": "Plot[{Sin[x], Cos[x], Sin[2*x]/2}, {x, 0, 4*Pi}, PlotStyle -> {Red, Blue, Green}, Filling -> {1 -> {2}}, PlotLabel -> \"Harmony Waves\"]"
}
```

---

### **Test 9: World Map with Points**
```json
{
  "code": "GeoGraphics[{GeoStyling[\"ReliefMap\"], Point[RandomGeoPosition[\"World\", 15]]}, GeoProjection -> \"Mollweide\", ImageSize -> 500]"
}
```

---

### **Test 10: Error Handling Test**
```json
{
  "code": "InvalidFunction[x, y, z]"
}
```

**Expected Error Response:**
```json
{
  "status": "error",
  "result": "Syntax or execution error",
  "resultType": "error",
  "executionTime": 1732537815.123,
  "timestamp": "Mon 25 Nov 2024 12:30:15",
  "codeLength": 21
}
```

---

### **Test 11: Timeout Test (Long Running)**
```json
{
  "code": "Table[Prime[i], {i, 1, 100000}]",
  "timeout": 5
}
```

**Expected Timeout Response:**
```json
{
  "status": "error",
  "result": "Execution timeout",
  "resultType": "error"
}
```

---

### **Test 12: Data Output Test**
```json
{
  "code": "Table[{RandomReal[], RandomReal[]}, {10}]",
  "format": "auto"
}
```

**Expected Response:**
```json
{
  "status": "success",
  "result": "[[0.123, 0.456], [0.789, 0.012], ...]",
  "resultType": "data"
}
```

---

## 🔧 **Postman Collection JSON**

Copy this JSON to import into Postman:

```json
{
  "info": {
    "name": "Unity Visual Sandbox API",
    "description": "Test collection for Unity Hub Wolfram API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Simple 2D Plot",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"code\": \"Plot[Sin[x], {x, 0, 2*Pi}]\",\n  \"format\": \"auto\"\n}"
        },
        "url": {
          "raw": "https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox",
          "protocol": "https",
          "host": ["www", "wolframcloud", "com"],
          "path": ["obj", "chandanbarada2", "unity-visual-sandbox"]
        }
      }
    },
    {
      "name": "Unity Word Cloud",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"code\": \"WordCloud[\\\"unity peace collaboration diversity friendship connection understanding harmony\\\", ColorFunction -> \\\"Rainbow\\\"]\"\n}"
        },
        "url": {
          "raw": "https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox",
          "protocol": "https",
          "host": ["www", "wolframcloud", "com"],
          "path": ["obj", "chandanbarada2", "unity-visual-sandbox"]
        }
      }
    },
    {
      "name": "Cultural Network Graph",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"code\": \"Graph[{1 <-> 2, 2 <-> 3, 3 <-> 4, 1 <-> 4}, VertexLabels -> {1 -> \\\"USA\\\", 2 -> \\\"Japan\\\", 3 -> \\\"India\\\", 4 -> \\\"Brazil\\\"}, EdgeStyle -> Thick, VertexSize -> Large]\"\n}"
        },
        "url": {
          "raw": "https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox",
          "protocol": "https",
          "host": ["www", "wolframcloud", "com"],
          "path": ["obj", "chandanbarada2", "unity-visual-sandbox"]
        }
      }
    },
    {
      "name": "3D Unity Surface",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"code\": \"Plot3D[Sin[x*y], {x, -2, 2}, {y, -2, 2}, ColorFunction -> \\\"Rainbow\\\", PlotLabel -> \\\"Unity Surface\\\"]\"\n}"
        },
        "url": {
          "raw": "https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox",
          "protocol": "https",
          "host": ["www", "wolframcloud", "com"],
          "path": ["obj", "chandanbarada2", "unity-visual-sandbox"]
        }
      }
    },
    {
      "name": "Error Handling Test",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"code\": \"InvalidFunction[x, y, z]\"\n}"
        },
        "url": {
          "raw": "https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox",
          "protocol": "https",
          "host": ["www", "wolframcloud", "com"],
          "path": ["obj", "chandanbarada2", "unity-visual-sandbox"]
        }
      }
    }
  ]
}
```

---

## 📊 **Testing Checklist**

### **Visual Artifacts:**
- [ ] 2D Plots (Test 1, 8)
- [ ] 3D Graphics (Test 5) 
- [ ] Images (Test 3)
- [ ] Charts (Test 7)
- [ ] Word Clouds (Test 2)
- [ ] Network Graphs (Test 4)
- [ ] Geographic Maps (Test 9)

### **Response Types:**
- [ ] SVG Graphics 
- [ ] Base64 Images
- [ ] JSON Data
- [ ] Text Output

### **Error Handling:**
- [ ] Syntax Errors (Test 10)
- [ ] Timeout Errors (Test 11)
- [ ] Invalid Parameters

### **Performance:**
- [ ] Response Time < 15 seconds
- [ ] Proper Base64 encoding
- [ ] Correct resultType classification

---

## 🎯 **Quick Start Instructions**

1. **Open Postman**
2. **Import Collection** - Copy the JSON above
3. **Run Tests** - Start with "Simple 2D Plot"
4. **Verify Response** - Check for base64 SVG content
5. **Test Visual Types** - Try word clouds, 3D plots
6. **Test Error Cases** - Verify error handling works

Your Unity Visual Sandbox is ready for comprehensive testing! 🚀