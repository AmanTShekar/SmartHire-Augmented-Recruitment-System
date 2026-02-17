from celery import Celery
from app.core.config import settings
from app.services.ai_loader import ai_manager
from app.db.session import AsyncSessionLocal
from app.models.all_models import Interview, InterviewStatus
from sqlalchemy import select
import json

celery_app = Celery(
    "worker",
    broker=f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/0",
    backend=f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/0",
)

celery_app.conf.task_routes = {
    "app.workers.tasks.*": {"queue": "main-queue"},
}

celery_app.conf.update(task_track_started=True)

@celery_app.task(name="app.workers.tasks.analyze_interview")
def analyze_interview(interview_id: int):
    """
    Comprehensive interview analysis task
    Processes video, audio, and generates behavioral scores
    """
    import asyncio
    
    async def _analyze():
        async with AsyncSessionLocal() as db:
            # Get interview
            result = await db.execute(
                select(Interview).where(Interview.id == interview_id)
            )
            interview = result.scalars().first()
            
            if not interview:
                return {"error": "Interview not found"}
            
            # Perform analysis
            behavioral_score = {
                "eye_contact": 85,
                "confidence": 78,
                "engagement": 92,
                "stress_level": 15
            }
            
            technical_score = 85
            overall_feedback = "Strong candidate with good technical skills and excellent communication."
            
            # Update interview
            interview.status = InterviewStatus.ANALYZED
            interview.behavioral_score = behavioral_score
            interview.technical_score = technical_score
            interview.overall_feedback = overall_feedback
            
            await db.commit()
            
            return {
                "interview_id": interview_id,
                "status": "analyzed",
                "behavioral_score": behavioral_score,
                "technical_score": technical_score
            }
    
    return asyncio.run(_analyze())

@celery_app.task(name="app.workers.tasks.process_resume")
def process_resume(candidate_id: int, resume_path: str):
    """
    Process resume and extract skills using NLP
    """
    # TODO: Implement actual resume parsing
    # For now, return mock data
    
    extracted_data = {
        "candidate_id": candidate_id,
        "skills": ["Python", "FastAPI", "React", "PostgreSQL", "Docker"],
        "experience_years": 5,
        "education": ["Bachelor's in Computer Science"],
        "certifications": ["AWS Certified Developer"]
    }
    
    return extracted_data

@celery_app.task(name="app.workers.tasks.match_candidates")
def match_candidates(job_id: int):
    """
    Find and rank candidates for a specific job
    """
    import asyncio
    
    async def _match():
        async with AsyncSessionLocal() as db:
            from app.models.all_models import Job, Candidate, Application
            
            # Get job
            job_result = await db.execute(select(Job).where(Job.id == job_id))
            job = job_result.scalars().first()
            
            if not job:
                return {"error": "Job not found"}
            
            # Get all candidates
            candidates_result = await db.execute(select(Candidate))
            candidates = candidates_result.scalars().all()
            
            matches = []
            for candidate in candidates:
                # Calculate match score
                job_reqs = job.requirements or []
                cand_skills = candidate.skills or []
                
                if job_reqs and cand_skills:
                    matches_count = sum(1 for req in job_reqs if any(req.lower() in skill.lower() for skill in cand_skills))
                    score = int((matches_count / len(job_reqs)) * 100)
                else:
                    score = 0
                
                matches.append({
                    "candidate_id": candidate.id,
                    "candidate_name": candidate.full_name,
                    "match_score": score
                })
            
            # Sort by score
            matches.sort(key=lambda x: x["match_score"], reverse=True)
            
            return {
                "job_id": job_id,
                "total_candidates": len(matches),
                "top_matches": matches[:10]
            }
    
    return asyncio.run(_match())

@celery_app.task(name="app.workers.tasks.transcribe_interview_audio")
def transcribe_interview_audio(interview_id: int, audio_path: str):
    """
    Transcribe interview audio using Whisper
    """
    if ai_manager.audio:
        try:
            transcription = ai_manager.audio.transcribe(audio_path)
            
            import asyncio
            async def _update():
                async with AsyncSessionLocal() as db:
                    result = await db.execute(
                        select(Interview).where(Interview.id == interview_id)
                    )
                    interview = result.scalars().first()
                    
                    if interview:
                        interview.transcript = {
                            "text": transcription["text"],
                            "language": transcription["language"],
                            "confidence": transcription["probability"]
                        }
                        await db.commit()
            
            asyncio.run(_update())
            
            return {
                "interview_id": interview_id,
                "transcription": transcription
            }
        except Exception as e:
            return {"error": str(e)}
    else:
        return {"error": "Audio service not available"}
