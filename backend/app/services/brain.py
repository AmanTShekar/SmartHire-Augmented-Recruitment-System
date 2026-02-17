import json
import logging
from ollama import Client

import os

logger = logging.getLogger(__name__)

class BrainService:
    def __init__(self):
        host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
        self.client = Client(host=host)
        self.analysis_model = "phi3.5"
        self.chat_model = "llama3.2"
        self.embed_model = "nomic-embed-text"

    def embed_text(self, text: str) -> list:
        """
        Generates embeddings using nomic-embed-text via Ollama.
        """
        try:
            response = self.client.embeddings(model=self.embed_model, prompt=text)
            return response['embedding']
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            return [0.0] * 768 # Default for nomic

    def analyze_resume(self, text: str, job_description: str) -> dict:
        """
        Uses Phi-3.5 to analyze the resume against a job description.
        Forces strict JSON output.
        """
        prompt = f"""
        Analyze the following resume against the job description.
        
        Job Description:
        {job_description}
        
        Resume (Markdown):
        {text}
        
        Output a strictly formatted JSON object with these keys:
        - match_score: (float between 0 and 100)
        - candidate_briefing: (a persuasive paragraph for the employer about this candidate)
        - strengths: (list of strings)
        - red_flags: (list of strings)
        
        Return ONLY the JSON.
        """
        
        try:
            response = self.client.generate(
                model=self.analysis_model,
                prompt=prompt,
                format="json",
                options={"temperature": 0.2}
            )
            return json.loads(response['response'])
        except Exception as e:
            logger.error(f"Error in analyze_resume: {e}")
            return {
                "match_score": 0,
                "candidate_briefing": "Analysis failed.",
                "strengths": [],
                "red_flags": ["System error during processing"]
            }

    def chat_with_aria(self, history: list, user_input: str) -> str:
        """
        Uses Llama-3.2 for the 'Aria' recruiter persona.
        """
        system_prompt = "You are Aria, a friendly and encouraging recruiter. Keep responses under 2 sentences. Focus on the candidate's potential."
        
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history:
            messages.append(msg)
        messages.append({"role": "user", "content": user_input})
        
        try:
            response = self.client.chat(
                model=self.chat_model,
                messages=messages,
                options={"temperature": 0.7}
            )
            return response['message']['content']
        except Exception as e:
            logger.error(f"Error in chat_with_aria: {e}")
            return "I'm having a little trouble thinking right now, but I'd love to continue our conversation in a moment!"

brain_service = BrainService()
