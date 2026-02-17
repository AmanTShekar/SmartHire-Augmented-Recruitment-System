from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.all_models import Candidate, Application
from app.services.ai_loader import ai_manager
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import json

router = APIRouter(prefix="/candidates", tags=["candidates"])

class CandidateCreate(BaseModel):
    full_name: str
    email: EmailStr
    experience_years: Optional[int] = 0
    skills: Optional[List[str]] = []

class CandidateResponse(BaseModel):
    id: int
    full_name: str
    email: str
    resume_url: Optional[str]
    skills: Optional[List[str]]
    experience_years: Optional[int]
    
    class Config:
        from_attributes = True

@router.post("/", response_model=CandidateResponse)
async def create_candidate(
    candidate: CandidateCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new candidate"""
    db_candidate = Candidate(
        full_name=candidate.full_name,
        email=candidate.email,
        experience_years=candidate.experience_years,
        skills=candidate.skills
    )
    db.add(db_candidate)
    await db.commit()
    await db.refresh(db_candidate)
    return db_candidate

@router.get("/", response_model=List[CandidateResponse])
async def list_candidates(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """List all candidates"""
    result = await db.execute(
        select(Candidate).offset(skip).limit(limit)
    )
    candidates = result.scalars().all()
    return candidates

@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(
    candidate_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific candidate"""
    result = await db.execute(
        select(Candidate).where(Candidate.id == candidate_id)
    )
    candidate = result.scalars().first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@router.post("/{candidate_id}/parse-resume")
async def parse_resume(
    candidate_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Parse resume and extract skills using AI"""
    # Get candidate
    result = await db.execute(
        select(Candidate).where(Candidate.id == candidate_id)
    )
    candidate = result.scalars().first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Read file content
    content = await file.read()
    
    # TODO: Implement actual resume parsing with NLP
    # For now, return mock data
    extracted_skills = ["Python", "FastAPI", "React", "PostgreSQL"]
    
    # Update candidate
    candidate.skills = extracted_skills
    candidate.resume_url = f"/uploads/resumes/{candidate_id}_{file.filename}"
    
    await db.commit()
    await db.refresh(candidate)
    
    return {
        "candidate_id": candidate_id,
        "extracted_skills": extracted_skills,
        "resume_url": candidate.resume_url
    }

@router.delete("/{candidate_id}")
async def delete_candidate(
    candidate_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a candidate"""
    result = await db.execute(
        select(Candidate).where(Candidate.id == candidate_id)
    )
    candidate = result.scalars().first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    await db.delete(candidate)
    await db.commit()
    return {"message": "Candidate deleted successfully"}
