from typing import Dict, Any
from services.orchestrator.state import AgentState
from services.orchestrator.mock_llm import mock_llm
from apps.api.models import StageEnum, RecommendationEnum
from services.sandbox_runner.runner import run_sandbox_evaluation

def ingest_and_vectorize(state: AgentState) -> Dict[str, Any]:
    print(f"Node: ingest_and_vectorize for Candidate {state.get('candidate_id')}")
    # Real implementation to follow: chunking, embedding, ChromaDB
    return {
        "embedding_id": f"emb_mock_{state.get('candidate_id')}",
        "current_stage": StageEnum.SIGNAL_ANALYZED
    }

def agentic_probe(state: AgentState) -> Dict[str, Any]:
    print(f"Node: agentic_probe for Candidate {state.get('candidate_id')}")
    result = mock_llm.probe_candidate(state.get("resume_text", ""), state.get("job_rubric", {}))
    return {
        "probe_reasoning": result["reasoning"],
        "probe_decision": result["decision"]
    }

def sandbox_evaluate(state: AgentState) -> Dict[str, Any]:
    print(f"Node: sandbox_evaluate for Candidate {state.get('candidate_id')}")
    patch_content = state.get("patch_content")
    if not patch_content:
        # Provide a default valid patch for demo purposes if none is provided
        patch_content = \"\"\"--- a/app.py
+++ b/app.py
@@ -5,3 +5,3 @@
 def health_check():
-    return jsonify({"status": "down"}), 500
+    return jsonify({"status": "ok"}), 200
\"\"\"
    
    results = run_sandbox_evaluation(patch_content)
    
    return {
        "sandbox_results": results,
        "sandbox_time_seconds": results.get("time_to_fix_seconds", 0),
        "sandbox_raw_score": results.get("raw_score", 0.0),
        "current_stage": StageEnum.SANDBOXED
    }

def synthesize_narrative(state: AgentState) -> Dict[str, Any]:
    print(f"Node: synthesize_narrative for Candidate {state.get('candidate_id')}")
    result = mock_llm.synthesize(
        state.get("probe_reasoning", ""), 
        state.get("sandbox_results", {}), 
        state.get("job_rubric", {})
    )
    return {
        "narrative_summary": result["summary"],
        "evidence_snippets": result["evidence_snippets"],
        "score_breakdown": result["score_breakdown"],
        "recommendation": RecommendationEnum(result["recommendation"]),
        "current_stage": StageEnum.REVIEW
    }

def htl_gate(state: AgentState) -> Dict[str, Any]:
    print(f"Node: htl_gate (Human in the loop) for Candidate {state.get('candidate_id')}")
    return {"current_stage": StageEnum.DECISION}
