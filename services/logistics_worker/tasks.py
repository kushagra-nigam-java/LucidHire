from services.logistics_worker.celery_app import celery_app
import os
import json
import datetime
from typing import Dict, Any

def _is_demo_mode():
    return os.getenv("DEMO_MODE", "true").lower() == "true"

@celery_app.task(name="schedule_interview")
def schedule_interview(candidate_id: int, candidate_name: str) -> Dict[str, Any]:
    print(f"Executing schedule_interview for candidate {candidate_id}")
    if _is_demo_mode() or not os.getenv("GOOGLE_CALENDAR_CREDENTIALS"):
        # Mocked free/busy generator
        proposal = {
            "candidate_id": candidate_id,
            "status": "proposed",
            "slots": [
                (datetime.datetime.now() + datetime.timedelta(days=1)).isoformat(),
                (datetime.datetime.now() + datetime.timedelta(days=2)).isoformat(),
            ],
            "method": "mock_calendar",
            "message": "[DEMO MODE - MOCK CALENDAR] Fake free/busy slots generated."
        }
        return proposal
    else:
        # Real Google Calendar integration would go here
        return {"status": "error", "message": "Real calendar integration not implemented"}

@celery_app.task(name="send_outreach_email")
def send_outreach_email(candidate_id: int, email_content: str) -> Dict[str, Any]:
    print(f"Executing send_outreach_email for candidate {candidate_id}")
    if _is_demo_mode() or not os.getenv("GMAIL_SMTP_USER"):
        # Write to outbox.json
        outbox_file = "outbox.json"
        outbox = []
        if os.path.exists(outbox_file):
            try:
                with open(outbox_file, "r") as f:
                    outbox = json.load(f)
            except json.JSONDecodeError:
                outbox = []
                
        outbox.append({
            "candidate_id": candidate_id,
            "timestamp": datetime.datetime.now().isoformat(),
            "content": email_content,
            "method": "mock_email",
            "message": "[DEMO MODE - MOCK EMAIL] Written to outbox.json"
        })
        
        with open(outbox_file, "w") as f:
            json.dump(outbox, f, indent=2)
            
        return {"status": "sent_to_outbox", "candidate_id": candidate_id}
    else:
        return {"status": "error", "message": "Real email integration not implemented"}

@celery_app.task(name="provision_hardware")
def provision_hardware(candidate_id: int, role: str) -> Dict[str, Any]:
    print(f"Executing provision_hardware for candidate {candidate_id}")
    # Stubbed provisioning service that logs a structured provisioning request object.
    request_obj = {
        "candidate_id": candidate_id,
        "role": role,
        "equipment": ["MacBook Pro 16", "Monitor"],
        "sso_groups": ["engineering", "all-hands"],
        "status": "logged_for_fulfillment",
        "message": "Hardware/portal provisioning requested."
    }
    print(f"PROVISIONING REQUEST LOGGED: {json.dumps(request_obj)}")
    return request_obj

@celery_app.task(name="trigger_hire_logistics")
def trigger_hire_logistics(candidate_id: int, candidate_name: str, role: str):
    print(f"Triggering full hire logistics chain for candidate {candidate_id}")
    schedule_interview.delay(candidate_id, candidate_name)
    send_outreach_email.delay(
        candidate_id, 
        f"Congratulations {candidate_name}! We would like to extend an offer for the {role} position."
    )
    provision_hardware.delay(candidate_id, role)
    return {"status": "hire_logistics_triggered"}
