from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from apps.api.models import StageEnum, RecommendationEnum, ActorEnum

class JobRequisitionBase(BaseModel):
    title: str
    rubric: Dict[str, Any]
    generated_jd_text: str
    sandbox_type: str

class JobRequisitionCreate(JobRequisitionBase):
    pass

class JobRequisitionResponse(JobRequisitionBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CandidateBase(BaseModel):
    job_id: int
    name: str
    source: str
    resume_text: str
    repo_metadata: Dict[str, Any]
    embedding_id: Optional[str] = None
    current_stage: StageEnum = StageEnum.SOURCED

class CandidateCreate(CandidateBase):
    pass

class CandidateResponse(CandidateBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class AssessmentRunBase(BaseModel):
    candidate_id: int
    job_id: int
    container_id: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    test_results: Optional[Dict[str, Any]] = None
    diff_text: Optional[str] = None
    time_to_fix_seconds: Optional[int] = None
    raw_score: Optional[float] = None

class AssessmentRunCreate(AssessmentRunBase):
    pass

class AssessmentRunResponse(AssessmentRunBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class IntelligenceNarrativeBase(BaseModel):
    candidate_id: int
    job_id: int
    summary_text: str
    evidence_snippets: List[Dict[str, Any]]
    score_breakdown: Dict[str, Any]
    recommendation: RecommendationEnum

class IntelligenceNarrativeCreate(IntelligenceNarrativeBase):
    pass

class IntelligenceNarrativeResponse(IntelligenceNarrativeBase):
    id: int
    generated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PipelineEventBase(BaseModel):
    candidate_id: int
    stage: StageEnum
    actor: ActorEnum
    action: str
    metadata_: Optional[Dict[str, Any]] = Field(default=None, alias="metadata")

class PipelineEventCreate(PipelineEventBase):
    pass

class PipelineEventResponse(PipelineEventBase):
    id: int
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
