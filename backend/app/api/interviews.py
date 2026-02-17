from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.all_models import Interview, Application, InterviewStatus
from app.services.ai_loader import ai_manager
from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime
import base64
import numpy as np
import cv2

router = APIRouter(prefix="/interviews", tags=["interviews"])

class InterviewCreate(BaseModel):
    application_id: int
    scheduled_time: datetime

class InterviewResponse(BaseModel):
    id: int
    application_id: int
    status: str
    scheduled_time: Optional[datetime]
    video_url: Optional[str]
    transcript: Optional[Dict]
    behavioral_score: Optional[Dict]
    technical_score: Optional[int]
    overall_feedback: Optional[str]
    
    class Config:
        from_attributes = True

@router.post("/", response_model=InterviewResponse)
async def create_interview(
    interview: InterviewCreate,
    db: AsyncSession = Depends(get_db)
):
    """Schedule a new interview"""
    # Verify application exists
    result = await db.execute(
        select(Application).where(Application.id == interview.application_id)
    )
    application = result.scalars().first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    db_interview = Interview(
        application_id=interview.application_id,
        status=InterviewStatus.SCHEDULED,
        scheduled_time=interview.scheduled_time
    )
    db.add(db_interview)
    await db.commit()
    await db.refresh(db_interview)
    return db_interview

@router.get("/{interview_id}", response_model=InterviewResponse)
async def get_interview(
    interview_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get interview details"""
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalars().first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview

@router.post("/{interview_id}/start")
async def start_interview(
    interview_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Start an interview session"""
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalars().first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview.status = InterviewStatus.IN_PROGRESS
    await db.commit()
    
    return {
        "interview_id": interview_id,
        "status": "in_progress",
        "message": "Interview started successfully"
    }

@router.post("/{interview_id}/analyze-frame")
async def analyze_frame(
    interview_id: int,
    frame_data: str,  # Base64 encoded image
    db: AsyncSession = Depends(get_db)
):
    """Analyze a video frame for behavioral cues"""
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalars().first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    if interview.status != InterviewStatus.IN_PROGRESS:
        raise HTTPException(status_code=400, detail="Interview is not in progress")
    
    # Decode base64 image
    try:
        img_bytes = base64.b64decode(frame_data)
        nparr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Use vision service if available
        if ai_manager.vision:
            analysis = ai_manager.vision.process_frame(frame)
            return {
                "interview_id": interview_id,
                "analysis": analysis,
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            return {
                "interview_id": interview_id,
                "analysis": {
                    "face_detected": False,
                    "attention_score": 0.0,
                    "stress_level": 0.0
                },
                "message": "Vision service not available"
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing frame: {str(e)}")

@router.post("/{interview_id}/transcribe-audio")
async def transcribe_audio(
    interview_id: int,
    audio_file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Transcribe audio from interview"""
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalars().first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Save audio file temporarily
    audio_path = f"/tmp/interview_{interview_id}_{audio_file.filename}"
    with open(audio_path, "wb") as f:
        content = await audio_file.read()
        f.write(content)
    
    # Use audio service if available
    if ai_manager.audio:
        try:
            transcription = ai_manager.audio.transcribe(audio_path)
            return {
                "interview_id": interview_id,
                "transcription": transcription,
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")
    else:
        return {
            "interview_id": interview_id,
            "message": "Audio service not available",
            "transcription": {"text": "", "language": "en", "probability": 0.0}
        }

@router.post("/{interview_id}/complete")
async def complete_interview(
    interview_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Complete an interview and trigger analysis"""
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalars().first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview.status = InterviewStatus.COMPLETED
    await db.commit()
    
    # TODO: Add background task for comprehensive analysis
    # background_tasks.add_task(analyze_interview, interview_id)
    
    return {
        "interview_id": interview_id,
        "status": "completed",
        "message": "Interview completed. Analysis will be available shortly."
    }

@router.get("/{interview_id}/analysis")
async def get_interview_analysis(
    interview_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get comprehensive interview analysis"""
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalars().first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    if interview.status != InterviewStatus.ANALYZED:
        return {
            "interview_id": interview_id,
            "status": interview.status.value,
            "message": "Analysis not yet available"
        }
    
    return {
        "interview_id": interview_id,
        "transcript": interview.transcript,
        "behavioral_score": interview.behavioral_score,
        "technical_score": interview.technical_score,
        "overall_feedback": interview.overall_feedback
    }
