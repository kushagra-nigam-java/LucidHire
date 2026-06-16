# LucidHire Assumptions & Scope Locks

1. **ChromaDB over Qdrant**: The MVP specifies a vector database. ChromaDB (local embedded mode) was chosen to run seamlessly without requiring an extra Docker container to be stood up for Qdrant, improving the hackathon `docker compose up` out-of-the-box experience.
2. **Subprocess Fallback**: If the Docker socket is unavailable, the `sandbox-runner` service falls back to standard Python `subprocess` execution. This does not provide secure isolation and the UI explicitly labels it as such: `[SUBPROCESS FALLBACK — NOT ISOLATED, NOT FOR UNTRUSTED CODE BEYOND A DEMO]`.
3. **No Authentication**: As instructed, the MVP assumes the user is the hiring manager/recruiter. There is no auth barrier.
4. **Mocked DEMO_MODE Services**: Without valid API keys for Groq, Google Calendar, and SMTP, the application natively falls back to deterministic mocks (Mock LLM, local JSON outbox, and generated fake calendar slots). This is forced via `DEMO_MODE=true` in the `.env.example`.
5. **No Candidate UI**: The evaluation patch submission is mocked through the recruiter's "Sandbox Workbench" per the specification logic. The candidate does not log in directly.
6. **Docker execution privileges**: The `api` service mounts `/var/run/docker.sock` so it can orchestrate the ephemeral `sandboxuser` containers.
