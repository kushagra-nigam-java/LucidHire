export enum StageEnum {
    SOURCED = "SOURCED",
    SIGNAL_ANALYZED = "SIGNAL_ANALYZED",
    SANDBOXED = "SANDBOXED",
    REVIEW = "REVIEW",
    DECISION = "DECISION",
    OFFER = "OFFER"
}

export enum RecommendationEnum {
    STRONG_HIRE = "STRONG_HIRE",
    HIRE = "HIRE",
    BORDERLINE = "BORDERLINE",
    NO_HIRE = "NO_HIRE"
}

export enum ActorEnum {
    AGENT = "AGENT",
    HUMAN = "HUMAN"
}

export interface JobRequisition {
    id: number;
    title: string;
    rubric: Record<string, any>;
    generated_jd_text: string;
    sandbox_type: string;
    created_at: string;
}

export interface Candidate {
    id: number;
    job_id: number;
    name: string;
    source: string;
    resume_text: string;
    repo_metadata: Record<string, any>;
    embedding_id: string | null;
    current_stage: StageEnum;
}

export interface AssessmentRun {
    id: number;
    candidate_id: number;
    job_id: number;
    container_id: string | null;
    started_at: string | null;
    completed_at: string | null;
    test_results: Record<string, any> | null;
    diff_text: string | null;
    time_to_fix_seconds: number | null;
    raw_score: number | null;
}

export interface IntelligenceNarrative {
    id: number;
    candidate_id: number;
    job_id: number;
    summary_text: string;
    evidence_snippets: Record<string, any>[];
    score_breakdown: Record<string, any>;
    recommendation: RecommendationEnum;
    generated_at: string;
}

export interface PipelineEvent {
    id: number;
    candidate_id: number;
    stage: StageEnum;
    actor: ActorEnum;
    action: string;
    timestamp: string;
    metadata: Record<string, any> | null;
}
