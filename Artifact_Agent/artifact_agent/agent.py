"""
Agent definitions for Artifact_agent.
"""

from google.adk.agents import Agent

# Handle both relative and direct imports
try:
    # Try relative import first (when used as module)
    from .config import MODEL, WOLFRAM_INSTRUCTION, AGENT_DESCRIPTION
    from .tools.wolfram_generator import generate_wolfram_artifact
except ImportError:
    # Fallback to direct import (when run directly)
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from config import MODEL, WOLFRAM_INSTRUCTION, AGENT_DESCRIPTION
    from tools.wolfram_generator import generate_wolfram_artifact


# Create the root agent (ArtifactAgent)
agent_artifact = Agent(
    name="ArtifactAgent",
    description=AGENT_DESCRIPTION,
    model=MODEL,
    instruction=WOLFRAM_INSTRUCTION,
    tools=[generate_wolfram_artifact]
)

root_agent = agent_artifact

# Test imports when run directly
if __name__ == "__main__":
    print("Testing agent.py imports...")
    
    try:
        print("✅ Successfully imported Agent from google.adk.agents")
    except Exception as e:
        print(f"❌ Failed to import Agent: {e}")
    
    try:
        print(f"✅ Successfully imported config values:")
        print(f"   MODEL: {MODEL}")
        print(f"   AGENT_DESCRIPTION: {AGENT_DESCRIPTION[:50]}...")
        print(f"   WOLFRAM_INSTRUCTION: {WOLFRAM_INSTRUCTION[:50]}...")
    except Exception as e:
        print(f"❌ Failed to import config: {e}")
    
    try:
        print(f"✅ Successfully imported wolfram tool: {generate_wolfram_artifact}")
    except Exception as e:
        print(f"❌ Failed to import wolfram_generator: {e}")
    
    try:
        print(f"✅ Successfully created agent: {agent_artifact.name}")
        print(f"   Agent model: {agent_artifact.model}")
        print(f"   Agent tools: {len(agent_artifact.tools)} tool(s)")
    except Exception as e:
        print(f"❌ Failed to create agent: {e}")
    
    print("\nAgent test completed!")

