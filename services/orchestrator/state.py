from typing import TypedDict, Dict, Any, List, Optional
from apps.api.models import StageEnum, RecommendationEnum

class AgentState(TypedDict):
    candidate_id: int
    job_id: int
    resume_text: str
    repo_metadata: Dict[str, Any]
    job_rubric: Dict[str, Any]
    
    # Updated by ingest_and_vectorize
    embedding_id: Optional[str]
    
    # Updated by agentic_probe
    probe_reasoning: Optional[str]
    probe_decision: Optional[str] # "ADVANCE" or "REJECT"
    
    # Input for sandbox_evaluate
    patch_content: Optional[str]
    
    # Updated by sandbox_evaluate
    sandbox_results: Optional[Dict[str, Any]]
    sandbox_time_seconds: Optional[int]
    sandbox_raw_score: Optional[float]
    
    # Updated by synthesize_narrative
    narrative_summary: Optional[str]
    evidence_snippets: Optional[List[Dict[str, Any]]]
    score_breakdown: Optional[Dict[str, Any]]
    recommendation: Optional[RecommendationEnum]
    
    # Current stage
    current_stage: StageEnum
