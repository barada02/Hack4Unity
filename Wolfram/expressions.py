#!/usr/bin/env python3
"""
Wolfram Expressions Library for Unity Hub
Curated expressions for testing visual artifacts
"""

# Expression database
EXPRESSIONS = {
    1: {
        "category": "Basic 2D",
        "description": "Simple Sine Wave",
        "code": "Plot[Sin[x], {x, 0, 2*Pi}]",
        "expected_type": "graphics",
        "complexity": "low"
    },
    
    2: {
        "category": "Basic 2D", 
        "description": "Harmony Waves (Multiple Functions)",
        "code": "Plot[{Sin[x], Cos[x], Sin[2*x]/2}, {x, 0, 4*Pi}, PlotStyle -> {Red, Blue, Green}, Filling -> {1 -> {2}}, PlotLabel -> \"Harmony Waves\"]",
        "expected_type": "graphics",
        "complexity": "medium"
    },
    
    3: {
        "category": "Word Cloud",
        "description": "Unity Theme Word Cloud",
        "code": "WordCloud[\"unity peace collaboration diversity friendship connection understanding harmony bridge culture global world together\", ColorFunction -> \"Rainbow\"]",
        "expected_type": "image",
        "complexity": "low"
    },
    
    4: {
        "category": "3D Graphics",
        "description": "Unity Surface Visualization",
        "code": "Plot3D[Sin[x*y], {x, -2, 2}, {y, -2, 2}, ColorFunction -> \"Rainbow\", PlotLabel -> \"Unity Surface\", ImageSize -> 400]",
        "expected_type": "graphics",
        "complexity": "high"
    },
    
    5: {
        "category": "Network Graph",
        "description": "Cultural Connections Network",
        "code": "Graph[{1 <-> 2, 2 <-> 3, 3 <-> 4, 1 <-> 4, 4 <-> 5, 2 <-> 5}, VertexLabels -> {1 -> \"USA\", 2 -> \"Japan\", 3 -> \"India\", 4 -> \"Brazil\", 5 -> \"Nigeria\"}, EdgeStyle -> Thick, VertexSize -> Large, GraphLayout -> \"SpringElectricalEmbedding\"]",
        "expected_type": "graphics", 
        "complexity": "medium"
    },
    
    6: {
        "category": "Chart",
        "description": "Cultural Diversity Pie Chart",
        "code": "PieChart[{30, 25, 20, 15, 10}, ChartLabels -> {\"Asia\", \"Europe\", \"Americas\", \"Africa\", \"Oceania\"}, ChartStyle -> \"Pastel\", PlotLabel -> \"Global Cultural Diversity\"]",
        "expected_type": "chart",
        "complexity": "low"
    },
    
    7: {
        "category": "Geography",
        "description": "World Connection Points",
        "code": "GeoGraphics[{GeoStyling[\"ReliefMap\"], Point[RandomGeoPosition[\"World\", 15]]}, GeoProjection -> \"Mollweide\", ImageSize -> 500]",
        "expected_type": "graphics",
        "complexity": "medium"
    },
    
    8: {
        "category": "Abstract Art",
        "description": "Unity Color Spectrum",
        "code": "Graphics[Table[{Hue[i/20], Rectangle[{i, 0}, {i + 1, 2}]}, {i, 0, 19}], ImageSize -> 600, PlotLabel -> \"Unity Spectrum\"]",
        "expected_type": "graphics",
        "complexity": "low"
    },
    
    9: {
        "category": "Mathematical Art",
        "description": "Unity Mandala Pattern", 
        "code": "PolarPlot[1 + Sin[8*t]/3, {t, 0, 2*Pi}, PlotStyle -> {Thick, Purple}, PolarAxes -> False, Background -> Black]",
        "expected_type": "graphics",
        "complexity": "medium"
    },
    
    10: {
        "category": "Data Visualization",
        "description": "Random Unity Data Points",
        "code": "ListPlot[Table[{RandomReal[10], RandomReal[10]}, {20}], PlotStyle -> {Red, PointSize[0.02]}, PlotLabel -> \"Unity Points\"]",
        "expected_type": "graphics",
        "complexity": "low"
    },
    
    11: {
        "category": "Animation",
        "description": "Rotating Unity Symbol",
        "code": "Table[Graphics[{Rotate[{Red, Disk[{0, 0}, 1], Blue, Disk[{0, 0}, 0.5]}, angle], Text[\"UNITY\", {0, 0}]}, PlotRange -> 2], {angle, 0, 2*Pi, Pi/4}]",
        "expected_type": "animation",
        "complexity": "high"
    },
    
    12: {
        "category": "Simple Image",
        "description": "Unity Symbol Image",
        "code": "Image[Graphics[{Red, Disk[], Blue, Disk[{0, 0}, 0.7], White, Text[Style[\"UNITY\", FontSize -> 20], {0, 0}]}, ImageSize -> 300], ImageSize -> 300]",
        "expected_type": "image", 
        "complexity": "low"
    },
    
    13: {
        "category": "Error Test",
        "description": "Intentional Syntax Error",
        "code": "InvalidFunction[x, y, z, missing bracket",
        "expected_type": "error",
        "complexity": "low"
    },
    
    14: {
        "category": "Data Output",
        "description": "Cultural Statistics Data",
        "code": "Association[\"Countries\" -> {\"USA\", \"Japan\", \"India\", \"Brazil\"}, \"Populations\" -> {331, 125, 1380, 213}, \"Languages\" -> {\"English\", \"Japanese\", \"Hindi\", \"Portuguese\"}]",
        "expected_type": "data",
        "complexity": "low"
    },
    
    15: {
        "category": "Complex 3D",
        "description": "Unity Sphere Network",
        "code": "Graphics3D[{Opacity[0.7], Red, Sphere[{0, 0, 0}, 1], Blue, Sphere[{2, 0, 0}, 0.8], Green, Sphere[{1, 2, 0}, 0.8], Yellow, Sphere[{-1, 1, 2}, 0.8]}, PlotLabel -> \"Unity Spheres\"]",
        "expected_type": "graphics",
        "complexity": "high"
    }
}

def list_expressions():
    """Display all available expressions"""
    print("\n📚 AVAILABLE EXPRESSIONS:")
    print("=" * 80)
    
    categories = {}
    for num, expr in EXPRESSIONS.items():
        category = expr['category']
        if category not in categories:
            categories[category] = []
        categories[category].append((num, expr))
    
    for category, expressions in categories.items():
        print(f"\n🎨 {category.upper()}:")
        for num, expr in expressions:
            complexity_icon = {"low": "🟢", "medium": "🟡", "high": "🔴"}.get(expr['complexity'], "⚪")
            print(f"  {num:2d}. {expr['description']} {complexity_icon}")
            print(f"      Expected: {expr['expected_type']} | Complexity: {expr['complexity']}")
    
    print(f"\n📊 Total expressions: {len(EXPRESSIONS)}")
    print("🟢 Low complexity  🟡 Medium complexity  🔴 High complexity")

def get_expression_by_number(num):
    """Get expression by number"""
    return EXPRESSIONS.get(num)

def get_expressions_by_category(category):
    """Get all expressions in a category"""
    return [(num, expr) for num, expr in EXPRESSIONS.items() 
            if expr['category'].lower() == category.lower()]

def get_expressions_by_complexity(complexity):
    """Get expressions by complexity level"""
    return [(num, expr) for num, expr in EXPRESSIONS.items()
            if expr['complexity'] == complexity]

def search_expressions(keyword):
    """Search expressions by keyword in description or code"""
    keyword = keyword.lower()
    results = []
    for num, expr in EXPRESSIONS.items():
        if (keyword in expr['description'].lower() or 
            keyword in expr['code'].lower() or
            keyword in expr['category'].lower()):
            results.append((num, expr))
    return results

# Interactive functions for Wolfram Cloud testing
def display_code_for_wolfram(num):
    """Display code formatted for copy-paste into Wolfram Cloud"""
    expr = get_expression_by_number(num)
    if expr:
        print(f"\n🔬 EXPRESSION {num}: {expr['description']}")
        print("=" * 50)
        print("📋 Copy this code to Wolfram Cloud:")
        print("-" * 30)
        print(expr['code'])
        print("-" * 30)
        print(f"Expected result type: {expr['expected_type']}")
        print(f"Complexity: {expr['complexity']}")
        return expr['code']
    else:
        print(f"❌ Expression {num} not found")
        return None

if __name__ == "__main__":
    print("🎨 Unity Hub Wolfram Expressions Library")
    list_expressions()
    
    while True:
        print(f"\n{'='*50}")
        print("📋 Options:")
        print("1. List all expressions")
        print("2. Show expression code for Wolfram Cloud")
        print("3. Search expressions")
        print("4. Filter by category")
        print("5. Filter by complexity")
        print("6. Exit")
        
        choice = input("\n👉 Enter choice: ").strip()
        
        if choice == '1':
            list_expressions()
        elif choice == '2':
            num = input("Enter expression number: ").strip()
            try:
                display_code_for_wolfram(int(num))
            except ValueError:
                print("❌ Invalid number")
        elif choice == '3':
            keyword = input("Enter search keyword: ").strip()
            results = search_expressions(keyword)
            print(f"\n🔍 Search results for '{keyword}':")
            for num, expr in results:
                print(f"{num}. {expr['description']} ({expr['category']})")
        elif choice == '4':
            print("\nCategories: Basic 2D, Word Cloud, 3D Graphics, Network Graph, Chart, Geography, Abstract Art, Mathematical Art, Data Visualization, Animation, Simple Image, Error Test, Data Output, Complex 3D")
            category = input("Enter category: ").strip()
            results = get_expressions_by_category(category)
            print(f"\n📂 Expressions in '{category}':")
            for num, expr in results:
                print(f"{num}. {expr['description']}")
        elif choice == '5':
            complexity = input("Enter complexity (low/medium/high): ").strip()
            results = get_expressions_by_complexity(complexity)
            print(f"\n⚡ {complexity.title()} complexity expressions:")
            for num, expr in results:
                print(f"{num}. {expr['description']} ({expr['category']})")
        elif choice == '6':
            break
        else:
            print("❌ Invalid choice")