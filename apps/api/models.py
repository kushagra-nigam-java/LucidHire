from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey, Enum, Float
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import enum

Base = declarative_base()

class StageEnum(str, enum.Enum):
    SOURCED = "SOURCED"
    SIGNAL_ANALYZED = "SIGNAL_ANALYZED"
    SANDBOXED = "SANDBOXED"
    REVIEW = "REVIEW"
    DECISION = "DECISION"
    OFFER = "OFFER"

class RecommendationEnum(str, enum.Enum):
    STRONG_HIRE = "STRONG_HIRE"
    HIRE = "HIRE"
    BORDERLINE = "BORDERLINE"
    NO_HIRE = "NO_HIRE"

class ActorEnum(str, enum.Enum):
    AGENT = "AGENT"
    HUMAN = "HUMAN"

class JobRequisition(Base):
    __tablename__ = 'job_requisitions'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    rubric = Column(JSON, nullable=False) # weighted skill criteria
    generated_jd_text = Column(Text, nullable=False)
    sandbox_type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    candidates = relationship("Candidate", back_populates="job")
    assessment_runs = relationship("AssessmentRun", back_populates="job")
    intelligence_narratives = relationship("IntelligenceNarrative", back_populates="job")

class Candidate(Base):
    __tablename__ = 'candidates'
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey('job_requisitions.id'), nullable=False)
    name = Column(String, index=True, nullable=False)
    source = Column(String, nullable=False)
    resume_text = Column(Text, nullable=False)
    repo_metadata = Column(JSON, nullable=False)
    embedding_id = Column(String, index=True)
    current_stage = Column(Enum(StageEnum), default=StageEnum.SOURCED, nullable=False)

    job = relationship("JobRequisition", back_populates="candidates")
    assessment_runs = relationship("AssessmentRun", back_populates="candidate")
    intelligence_narratives = relationship("IntelligenceNarrative", back_populates="candidate")

class AssessmentRun(Base):
    __tablename__ = 'assessment_runs'
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey('candidates.id'), nullable=False)
    job_id = Column(Integer, ForeignKey('job_requisitions.id'), nullable=False)
    container_id = Column(String)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    test_results = Column(JSON, nullable=True)
    diff_text = Column(Text, nullable=True)
    time_to_fix_seconds = Column(Integer, nullable=True)
    raw_score = Column(Float, nullable=True)

    candidate = relationship("Candidate", back_populates="assessment_runs")
    job = relationship("JobRequisition", back_populates="assessment_runs")

class IntelligenceNarrative(Base):
    __tablename__ = 'intelligence_narratives'
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey('candidates.id'), nullable=False)
    job_id = Column(Integer, ForeignKey('job_requisitions.id'), nullable=False)
    summary_text = Column(Text, nullable=False)
    evidence_snippets = Column(JSON, nullable=False) # JSON list
    score_breakdown = Column(JSON, nullable=False)
    recommendation = Column(Enum(RecommendationEnum), nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("Candidate", back_populates="intelligence_narratives")
    job = relationship("JobRequisition", back_populates="intelligence_narratives")

class PipelineEvent(Base):
    __tablename__ = 'pipeline_events'
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey('candidates.id'), nullable=False)
    stage = Column(Enum(StageEnum), nullable=False)
    actor = Column(Enum(ActorEnum), nullable=False)
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    metadata_ = Column("metadata", JSON, nullable=True) # using metadata_ as property name
