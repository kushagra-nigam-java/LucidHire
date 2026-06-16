from langgraph.graph import StateGraph, END
from services.orchestrator.state import AgentState
from services.orchestrator.nodes import (
    ingest_and_vectorize,
    agentic_probe,
    sandbox_evaluate,
    synthesize_narrative,
    htl_gate
)
from langgraph.checkpoint.memory import MemorySaver

workflow = StateGraph(AgentState)

workflow.add_node("ingest", ingest_and_vectorize)
workflow.add_node("probe", agentic_probe)
workflow.add_node("sandbox", sandbox_evaluate)
workflow.add_node("synthesize", synthesize_narrative)
workflow.add_node("htl", htl_gate)

workflow.set_entry_point("ingest")
workflow.add_edge("ingest", "probe")

def probe_router(state: AgentState):
    if state.get("probe_decision") == "ADVANCE":
        return "sandbox"
    return "synthesize"

workflow.add_conditional_edges(
    "probe",
    probe_router,
    {"sandbox": "sandbox", "synthesize": "synthesize"}
)

workflow.add_edge("sandbox", "synthesize")
workflow.add_edge("synthesize", "htl")
workflow.add_edge("htl", END)

memory = MemorySaver()

# Compile the graph
agent_graph = workflow.compile(
    checkpointer=memory,
    interrupt_before=["sandbox", "htl"]
)
