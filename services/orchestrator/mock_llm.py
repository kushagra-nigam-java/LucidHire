import os
from typing import Dict, Any

class MockLLM:
    """Deterministic mock LLM for DEMO_MODE to avoid requiring external API keys."""
    
    def __init__(self):
        self.is_demo_mode = os.getenv("DEMO_MODE", "true").lower() == "true" or not os.getenv("GROQ_API_KEY")

    def probe_candidate(self, resume: str, rubric: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "reasoning": "[DEMO MODE - MOCK LLM] Candidate shows strong alignment with Python and React requirements based on resume keywords.",
            "decision": "ADVANCE"
        }

    def synthesize(self, probe_reasoning: str, sandbox_results: Dict[str, Any], rubric: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "summary": "[DEMO MODE - MOCK LLM] The candidate successfully diagnosed and fixed the containerized microservice issue under the required time limit. Probe signals were strong.",
            "evidence_snippets": [
                {"source": "Resume", "text": "5 years of Python experience"},
                {"source": "Sandbox", "text": "Fixed failing API test in 42 seconds"}
            ],
            "score_breakdown": {
                "technical": 85,
                "problem_solving": 92,
                "communication": 80
            },
            "recommendation": "HIRE"
        }

mock_llm = MockLLM()
