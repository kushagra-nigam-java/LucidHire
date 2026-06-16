# LucidHire Demo Script

Follow these precise steps to walk through the complete LucidHire pipeline in under 5 minutes. No external API accounts or credentials are required if `DEMO_MODE=true` (the default).

### 1. Start the Stack
1. Ensure Docker is running.
2. In the project root, run:
   ```bash
   docker compose up --build
   ```
3. Open `http://localhost:3000` in your browser.

### 2. Calibration Phase
1. You will land on the `/setup` Calibration Chat screen.
2. Type any role requirements (e.g., "I need a Senior Python Developer who knows React").
3. Press **Send**.
4. The Agent will respond and immediately generate a Job Requisition and Rubric card on the right.
5. Click **Confirm & Create Requisition**.

### 3. Pipeline Board
1. You are now on the Kanban Pipeline board. Three demo candidates will load in the `SOURCED` and `REVIEW` columns.
2. Under "Alice Developer", click **Run Agent**.
3. Watch the **Live Activity Feed** in the bottom right corner stream SSE updates as the LangGraph agent ingests the resume, analyzes signals, and decides to advance the candidate.
4. Alice moves to `SIGNAL_ANALYZED`. Click **Enter Sandbox**.

### 4. Sandbox Workbench
1. You are now acting on behalf of the candidate. A Monaco code editor will load with a broken Flask microservice test.
2. The UI provides a pre-written patch fixing the 500 error to a 200 OK.
3. Click **Run Tests**.
4. Observe the Terminal Output window stream the results of the `pytest` run inside the hardened Docker (or isolated subprocess fallback). It will pass.
5. Click **Return to Pipeline**.

### 5. Hiring Decision
1. Back on the board, Charlie Engineer is in the `REVIEW` stage. Click **View Report**.
2. Review the Score Breakdown (Recharts pie chart) and Evidence Snippets.
3. Click the **Hire** button.
4. The system logs the decision and triggers the async Celery logistics chain.
5. Look at your `docker compose` logs; you will see the `worker` service automatically schedule the calendar, generate the email to `outbox.json`, and log the hardware provisioning request!
