from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.all_models import Application, Job, Candidate
from app.services.ai_loader import ai_manager
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/applications", tags=["applications"])

class ApplicationCreate(BaseModel):
    job_id: int
    candidate_id: int

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    status: str
    match_score: Optional[int]
    
    class Config:
        from_attributes = True

def calculate_match_score(job_requirements: List[str], candidate_skills: List[str]) -> int:
    """Calculate match score between job requirements and candidate skills"""
    if not job_requirements or not candidate_skills:
        return 0
    
    # Simple matching algorithm
    matches = sum(1 for req in job_requirements if any(req.lower() in skill.lower() for skill in candidate_skills))
    score = int((matches / len(job_requirements)) * 100)
    return min(score, 100)

@router.post("/", response_model=ApplicationResponse)
async def create_application(
    application: ApplicationCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Submit a new job application"""
    # Verify job exists
    job_result = await db.execute(
        select(Job).where(Job.id == application.job_id)
    )
    job = job_result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Verify candidate exists
    candidate_result = await db.execute(
        select(Candidate).where(Candidate.id == application.candidate_id)
    )
    candidate = candidate_result.scalars().first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Calculate match score
    match_score = calculate_match_score(
        job.requirements or [],
        candidate.skills or []
    )
    
    # Create application
    db_application = Application(
        job_id=application.job_id,
        candidate_id=application.candidate_id,
        status="applied",
        match_score=match_score
    )
    db.add(db_application)
    await db.commit()
    await db.refresh(db_application)
    
    # TODO: Add background task for deeper AI analysis
    # background_tasks.add_task(analyze_application, db_application.id)
    
    return db_application

@router.get("/", response_model=List[ApplicationResponse])
async def list_applications(
    skip: int = 0,
    limit: int = 100,
    job_id: Optional[int] = None,
    candidate_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all applications with optional filters"""
    query = select(Application).offset(skip).limit(limit)
    
    if job_id:
        query = query.where(Application.job_id == job_id)
    if candidate_id:
        query = query.where(Application.candidate_id == candidate_id)
    
    result = await db.execute(query)
    applications = result.scalars().all()
    return applications

@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(
    application_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific application"""
    result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    application = result.scalars().first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.put("/{application_id}", response_model=ApplicationResponse)
async def update_application(
    application_id: int,
    application_update: ApplicationUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update application status"""
    result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    application = result.scalars().first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application_update.status:
        application.status = application_update.status
    
    await db.commit()
    await db.refresh(application)
    return application

@router.post("/{application_id}/recalculate-score")
async def recalculate_match_score(
    application_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Recalculate match score for an application"""
    result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    application = result.scalars().first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Get job and candidate
    job_result = await db.execute(select(Job).where(Job.id == application.job_id))
    job = job_result.scalars().first()
    
    candidate_result = await db.execute(select(Candidate).where(Candidate.id == application.candidate_id))
    candidate = candidate_result.scalars().first()
    
    # Recalculate score
    new_score = calculate_match_score(
        job.requirements or [],
        candidate.skills or []
    )
    
    application.match_score = new_score
    await db.commit()
    await db.refresh(application)
    
    return {"application_id": application_id, "new_score": new_score}
