"""
Agent definitions for Artifact_agent.
"""

from google.adk.agents import Agent
from .config import MODEL, WOLFRAM_INSTRUCTION, AGENT_DESCRIPTION
from .tools.wolfram_generator import generate_wolfram_artifact


# Create the root agent (ArtifactAgent)
agent_artifact = Agent(
    name="ArtifactAgent",
    description=AGENT_DESCRIPTION,
    model=MODEL,
    instructions=WOLFRAM_INSTRUCTION,
    tools=[generate_wolfram_artifact]
)

root_agent = agent_artifact

