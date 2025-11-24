# Unity Visual Sandbox - Wolfram Cloud API

## 🚀 **Deployment Information**

### **API Endpoint:**
```
https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox
```

### **UUID:**
```
48b879cf-46b3-4261-8d3f-d96081aeb6b8
```

### **Deployment Details:**
- **Owner:** chandanbarada2@gmail.com
- **Created:** 24/11/2025 1:04 pm GMT-6
- **Permissions:** Public Execute (All users can execute)
- **Status:** Active
- **Auto-Remove:** False (permanent)
- **Archiving Date:** 23/01/2026 1:04 pm GMT-6

---

## 📋 **API Parameters**

### **Input Parameters:**
```json
{
  "code": "String" (required) - Wolfram Language code to execute,
  "format": "String" (optional, default: "auto") - Output format preference,
  "timeout": "Integer" (optional, default: 15) - Execution timeout in seconds
}
```

### **Response Format:**
```json
{
  "status": "success" | "error",
  "result": "base64_encoded_content" | "error_message",
  "resultType": "image" | "graphics" | "chart" | "animation" | "data" | "text" | "expression",
  "executionTime": "timestamp",
  "timestamp": "datetime_string",
  "codeLength": "integer"
}
```

---

## 🧪 **Test Examples**

### **Simple Image Generation:**
```bash
curl -X POST https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox \
  -H "Content-Type: application/json" \
  -d '{"code": "Image[Graphics[{Red, Disk[]}], ImageSize -> 200]"}'
```

### **2D Plot:**
```bash
curl -X POST https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox \
  -H "Content-Type: application/json" \
  -d '{"code": "Plot[Sin[x] + Cos[2*x], {x, 0, 4*Pi}, PlotStyle -> {Thick, Blue}]"}'
```

### **Word Cloud (Unity Theme):**
```bash
curl -X POST https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox \
  -H "Content-Type: application/json" \
  -d '{"code": "WordCloud[\"unity peace collaboration diversity friendship connection understanding\", ColorFunction -> \"Rainbow\"]"}'
```

---

## 🎨 **Sample Artifact Code Library**

### **Cultural Connections:**
```wolfram
Graph[{1 <-> 2, 2 <-> 3, 3 <-> 4, 1 <-> 4}, 
  VertexLabels -> {1 -> "USA", 2 -> "Japan", 3 -> "India", 4 -> "Brazil"}, 
  EdgeStyle -> Thick, VertexSize -> Large]
```

### **Unity Spectrum:**
```wolfram
Graphics[Table[{Hue[i/10], Rectangle[{i, 0}, {i + 1, 1}]}, {i, 0, 9}], 
  ImageSize -> 400, PlotLabel -> "Unity Color Spectrum"]
```

### **World Connections:**
```wolfram
GeoGraphics[{GeoStyling["ReliefMap"], 
  Point[RandomGeoPosition["World", 20]]}, 
  GeoProjection -> "Mollweide", ImageSize -> 500]
```

### **Harmony Waves:**
```wolfram
Plot[{Sin[x], Cos[x], Sin[2*x]/2}, {x, 0, 4*Pi}, 
  PlotStyle -> {Red, Blue, Green}, 
  Filling -> {1 -> {2}}, 
  PlotLabel -> "Harmony Waves"]
```

### **Cultural Diversity:**
```wolfram
PieChart[{30, 25, 20, 15, 10}, 
  ChartLabels -> {"Asia", "Europe", "Americas", "Africa", "Oceania"}, 
  ChartStyle -> "Pastel", 
  PlotLabel -> "Cultural Diversity"]
```

### **3D Unity Visualization:**
```wolfram
Plot3D[Sin[x*y], {x, -2, 2}, {y, -2, 2}, 
  ColorFunction -> "Rainbow", 
  PlotLabel -> "Unity Surface", 
  ImageSize -> 400]
```

---

## 🔗 **Integration Notes**

### **For Express Backend:**
```javascript
const WOLFRAM_API_URL = 'https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox';

async function executeWolframCode(code, format = 'auto') {
  const response = await fetch(WOLFRAM_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, format })
  });
  return await response.json();
}
```

### **For ADK Service:**
```python
import requests

WOLFRAM_API_URL = 'https://www.wolframcloud.com/obj/chandanbarada2/unity-visual-sandbox'

def execute_wolfram_code(code, format_type='auto'):
    response = requests.post(WOLFRAM_API_URL, json={
        'code': code,
        'format': format_type
    })
    return response.json()
```

---

## 🛡️ **Security & Limits**

- **Public Access:** Anyone can execute code
- **Timeout:** 15 seconds maximum execution
- **File Size:** Limited by Wolfram Cloud quotas
- **Rate Limiting:** Subject to Wolfram Cloud API limits
- **Archive Date:** Will be archived on 23/01/2026 (2 months)

---

## 🔄 **Next Steps**

1. ✅ **API Deployed** - Unity Visual Sandbox is live
2. 🧪 **Test Basic Functions** - Verify image/graphics generation
3. 🔗 **Backend Integration** - Connect to Express API
4. 🤖 **ADK Integration** - Connect AI agent for code generation
5. 🎨 **Artifact System** - Build full creation pipeline