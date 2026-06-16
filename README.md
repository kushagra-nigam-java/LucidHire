# LucidHire

**LucidHire — "See past the resume."**

An agentic AI recruitment co-pilot that replaces keyword-matching ATS screening with adaptive, role-specific sandbox assessments. It handles all hiring logistics autonomously, and hands recruiters a clear, evidence-backed intelligence narrative instead of a stack of resumes.

## Architecture
- **Web**: Next.js 14 App Router, Tailwind CSS, Monaco Editor, Recharts.
- **API**: FastAPI, SQLAlchemy, Server-Sent Events (SSE) for live streaming.
- **Orchestration**: LangGraph, LangChain.
- **Sandbox**: Docker SDK for Python (Ephemeral isolated containers, `network=none`, dropped capabilities).
- **Logistics**: Celery workers backed by Redis.

## Getting Started
Ensure you have Docker and Docker Compose installed.

1. Clone the repository.
2. `cp .env.example .env`
3. Bring up the stack:
   ```bash
   docker compose up --build
   ```
4. Access the UI at `http://localhost:3000`.

## Features
- **Conversational Job Calibration**: Define requirements via chat to auto-generate JDs and scoring rubrics.
- **Agentic Pipeline**: LangGraph nodes automatically ingest resumes, analyze signals, evaluate sandbox performance, and synthesize reports.
- **Secure Sandbox**: Untrusted candidate code runs in a highly restricted, network-disabled ephemeral Docker container.
- **Background Logistics**: Once a Hire decision is made, Celery automates interview scheduling, offer emails, and hardware provisioning stubs.

## Roadmap / Not in MVP
As a hackathon-grade MVP, the following features are explicitly deferred:
- Cybersecurity-threat-response sandboxes
- Multi-language sandbox support
- GitHub/LinkedIn live scraping
- Production AI-vs-human authorship detection
- Authentication/SSO integration (current MVP assumes single-tenant recruiter logic).
