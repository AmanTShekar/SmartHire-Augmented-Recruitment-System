from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.all_models import Job, Application, HiringRound, CandidateProfile, User, UserRole
from app.services.auth import get_current_user
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/jobs", tags=["jobs"])

class JobCreate(BaseModel):
    title: str
    description: str
    requirements: List[str]
    recruiter_id: int
    location: Optional[str] = None
    job_type: Optional[str] = "full_time"
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    is_active: Optional[bool] = None

class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    requirements: Optional[List[str]]
    recruiter_id: int
    is_active: bool
    location: Optional[str] = None
    job_type: Optional[str] = None
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    
    class Config:
        from_attributes = True

class RoundCreate(BaseModel):
    round_type: str  # resume_screen, aptitude_test, technical_assessment, ai_interview, coding_challenge, hr_interview
    round_name: str
    description: Optional[str] = None
    order: int = 1
    duration_minutes: int = 60
    max_marks: int = 100
    passing_marks: int = 50
    config: Optional[dict] = {}

@router.post("/", response_model=JobResponse)
async def create_job(
    job: JobCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new job posting"""
    db_job = Job(
        title=job.title,
        description=job.description,
        requirements=job.requirements,
        recruiter_id=job.recruiter_id,
        location=job.location,
        job_type=job.job_type,
        experience_level=job.experience_level,
        salary_range=job.salary_range,
    )
    db.add(db_job)
    await db.commit()
    await db.refresh(db_job)
    return db_job

@router.get("/", response_model=List[JobResponse])
async def list_jobs(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """List all job postings"""
    query = select(Job).offset(skip).limit(limit)
    if active_only:
        query = query.where(Job.is_active == True)
    
    result = await db.execute(query)
    jobs = result.scalars().all()
    return jobs

@router.get("/matched")
async def get_matched_jobs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get jobs matched to current candidate's skills with match scores."""
    if current_user.role != UserRole.CANDIDATE:
        raise HTTPException(status_code=403, detail="Only candidates can access matched jobs")

    # Get candidate profile
    await db.refresh(current_user, ["candidate_profile"])
    profile = current_user.candidate_profile
    candidate_skills = set(s.lower() for s in (profile.skills or [])) if profile else set()

    # Get active jobs
    result = await db.execute(select(Job).where(Job.is_active == True))
    jobs = result.scalars().all()

    matched = []
    for job in jobs:
        job_reqs = set(r.lower() for r in (job.requirements or []))
        if not job_reqs:
            score = 50  # Default score for jobs with no requirements
        elif not candidate_skills:
            score = 30
        else:
            overlap = len(candidate_skills & job_reqs)
            score = min(100, int((overlap / max(len(job_reqs), 1)) * 100))

        matched.append({
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "requirements": job.requirements or [],
            "location": job.location,
            "job_type": job.job_type,
            "experience_level": job.experience_level,
            "salary_range": job.salary_range,
            "match_score": score,
            "is_active": job.is_active,
        })

    matched.sort(key=lambda x: x["match_score"], reverse=True)
    return matched

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific job posting"""
    result = await db.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: int,
    job_update: JobUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a job posting"""
    result = await db.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Update fields
    if job_update.title is not None:
        job.title = job_update.title
    if job_update.description is not None:
        job.description = job_update.description
    if job_update.requirements is not None:
        job.requirements = job_update.requirements
    if job_update.is_active is not None:
        job.is_active = job_update.is_active
    
    await db.commit()
    await db.refresh(job)
    return job

@router.delete("/{job_id}")
async def delete_job(
    job_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a job posting"""
    result = await db.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    await db.delete(job)
    await db.commit()
    return {"message": "Job deleted successfully"}

@router.get("/{job_id}/applications")
async def get_job_applications(
    job_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get all applications for a specific job"""
    result = await db.execute(
        select(Application).where(Application.job_id == job_id)
    )
    applications = result.scalars().all()
    return applications


# ─── Round Management ────────────────────────────────────

@router.post("/{job_id}/rounds")
async def create_round(
    job_id: int,
    round_data: RoundCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a hiring round for a job."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    from app.models.all_models import RoundType
    try:
        round_type = RoundType(round_data.round_type)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid round type: {round_data.round_type}")

    hr = HiringRound(
        job_id=job_id,
        round_type=round_type,
        round_name=round_data.round_name,
        description=round_data.description,
        order=round_data.order,
        duration_minutes=round_data.duration_minutes,
        max_marks=round_data.max_marks,
        passing_marks=round_data.passing_marks,
        config=round_data.config or {},
    )
    db.add(hr)
    await db.commit()
    await db.refresh(hr)

    return {
        "id": hr.id,
        "job_id": hr.job_id,
        "round_type": hr.round_type.value,
        "round_name": hr.round_name,
        "description": hr.description,
        "order": hr.order,
        "duration_minutes": hr.duration_minutes,
        "max_marks": hr.max_marks,
        "passing_marks": hr.passing_marks,
        "config": hr.config,
    }


@router.get("/{job_id}/rounds")
async def get_rounds(
    job_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get all hiring rounds for a job."""
    result = await db.execute(
        select(HiringRound).where(HiringRound.job_id == job_id).order_by(HiringRound.order)
    )
    rounds = result.scalars().all()

    return [
        {
            "id": r.id,
            "job_id": r.job_id,
            "round_type": r.round_type.value,
            "round_name": r.round_name,
            "description": r.description,
            "order": r.order,
            "duration_minutes": r.duration_minutes,
            "max_marks": r.max_marks,
            "passing_marks": r.passing_marks,
            "config": r.config,
        }
        for r in rounds
    ]

