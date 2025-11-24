"""
Agent definitions for Artifact_agent.
"""

from google.adk.agents import Agent
from .config import MODEL


# Create the root agent (LeadManagerAgent)
agent_artifact = Agent(
    name="ArtifactAgent",
    description="An agent that generates artifacts based on user's ask using tools",
    model=MODEL,
    
)

root_agent = agent_artifact