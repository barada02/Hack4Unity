"""
Agent definitions for Artifact_agent.
"""

from google.adk.agents import Agent
from .config import MODEL, WOLFRAM_INSTRUCTION
import sys
import os

# Add tools directory to path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'tools'))
from wolfram_generator import generate_wolfram_artifact


# Create the root agent (ArtifactAgent)
agent_artifact = Agent(
    name="ArtifactAgent",
    description="An intelligent agent that generates visual artifacts (images, plots, animations, mathematical visualizations) using Wolfram Language through a cloud service. Takes user prompts and creates custom artifacts by converting natural language into Wolfram expressions and generating visual outputs.",
    model=MODEL,
    instructions=WOLFRAM_INSTRUCTION,
    tools=[generate_wolfram_artifact]
)

root_agent = agent_artifact