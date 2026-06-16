from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from sse_starlette.sse import EventSourceResponse
from typing import List, Optional
from pydantic import BaseModel
import asyncio
import json

from apps.api.database import get_db, engine
from apps.api.models import Base, Candidate, JobRequisition, PipelineEvent, StageEnum, ActorEnum
from apps.api.schemas import CandidateResponse, JobRequisitionResponse, PipelineEventResponse
from services.orchestrator.graph import agent_graph

# Ensure tables are created for the hackathon MVP
Base.metadata.create_all(bind=engine)

router = APIRouter()

class SSEManager:
    def __init__(self):
        self.listeners = []
    
    def add_listener(self, q: asyncio.Queue):
        self.listeners.append(q)
        
    def remove_listener(self, q: asyncio.Queue):
        self.listeners.remove(q)
        
    async def publish(self, message: dict):
        for q in self.listeners:
            await q.put(message)

sse_manager = SSEManager()

def write_event(db: Session, candidate_id: int, stage: StageEnum, action: str, actor: ActorEnum = ActorEnum.AGENT):
    event = PipelineEvent(candidate_id=candidate_id, stage=stage, action=action, actor=actor)
    db.add(event)
    db.commit()
    db.refresh(event)
    
    # Broadcast event
    loop = asyncio.get_event_loop()
    if loop.is_running():
        asyncio.run_coroutine_threadsafe(
            sse_manager.publish({
                "candidate_id": candidate_id,
                "stage": stage.value,
                "action": action,
                "actor": actor.value
            }),
            loop
        )

def run_graph_task(candidate_id: int, patch_content: Optional[str] = None, decision: Optional[str] = None):
    from apps.api.database import SessionLocal
    db = SessionLocal()
    try:
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        job = db.query(JobRequisition).filter(JobRequisition.id == candidate.job_id).first()
        
        config = {"configurable": {"thread_id": str(candidate_id)}}
        current_state = agent_graph.get_state(config)
        
        if patch_content is not None:
            write_event(db, candidate_id, StageEnum.SANDBOXED, "Recruiter submitted patch", ActorEnum.HUMAN)
            agent_graph.update_state(config, {"patch_content": patch_content})
            
        if decision is not None:
            write_event(db, candidate_id, StageEnum.DECISION, f"Recruiter decision: {decision}", ActorEnum.HUMAN)
            # Will trigger Celery task directly in Milestone 5
            
        state_input = None
        if not current_state.values and not patch_content and not decision:
            state_input = {
                "candidate_id": candidate.id,
                "job_id": job.id,
                "resume_text": candidate.resume_text,
                "repo_metadata": candidate.repo_metadata,
                "job_rubric": job.rubric,
                "current_stage": StageEnum.SOURCED
            }
            write_event(db, candidate_id, StageEnum.SOURCED, "Started evaluation pipeline")
            
        if decision is None: # Only run graph if not just recording final decision
            for event in agent_graph.stream(state_input, config=config):
                for node, state_update in event.items():
                    stage = state_update.get("current_stage", StageEnum.SOURCED)
                    write_event(db, candidate_id, stage, f"Completed agent step: {node}")
                    candidate.current_stage = stage
                    db.commit()
                    
    finally:
        db.close()

class PatchSubmit(BaseModel):
    patch_content: str

class DecisionSubmit(BaseModel):
    decision: str

@router.get("/jobs", response_model=List[JobRequisitionResponse])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(JobRequisition).all()

@router.get("/candidates", response_model=List[CandidateResponse])
def get_candidates(db: Session = Depends(get_db)):
    return db.query(Candidate).all()

@router.post("/pipeline/start/{candidate_id}")
def start_pipeline(candidate_id: int, background_tasks: BackgroundTasks):
    background_tasks.add_task(run_graph_task, candidate_id)
    return {"status": "pipeline_started"}

@router.post("/pipeline/sandbox/{candidate_id}")
def submit_sandbox(candidate_id: int, payload: PatchSubmit, background_tasks: BackgroundTasks):
    background_tasks.add_task(run_graph_task, candidate_id, patch_content=payload.patch_content)
    return {"status": "sandbox_resumed"}

@router.post("/pipeline/decision/{candidate_id}")
def submit_decision(candidate_id: int, payload: DecisionSubmit, background_tasks: BackgroundTasks):
    from apps.api.database import SessionLocal
    from services.logistics_worker.tasks import trigger_hire_logistics
    
    db = SessionLocal()
    write_event(db, candidate_id, StageEnum.DECISION, f"Recruiter decision: {payload.decision}", ActorEnum.HUMAN)
    
    if payload.decision in ["HIRE", "STRONG_HIRE"]:
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        job = db.query(JobRequisition).filter(JobRequisition.id == candidate.job_id).first()
        
        candidate.current_stage = StageEnum.OFFER
        db.commit()
        write_event(db, candidate_id, StageEnum.OFFER, "Triggered background logistics", ActorEnum.AGENT)
        
        trigger_hire_logistics.delay(candidate.id, candidate.name, job.title)
    
    db.close()
    return {"status": "decision_recorded"}

@router.get("/stream")
async def sse_stream():
    q = asyncio.Queue()
    sse_manager.add_listener(q)
    
    async def event_generator():
        try:
            while True:
                data = await q.get()
                yield {"data": json.dumps(data)}
        except asyncio.CancelledError:
            sse_manager.remove_listener(q)
            
    return EventSourceResponse(event_generator())
