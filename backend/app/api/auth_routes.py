from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import timedelta

from app.db.session import get_db
from app.services.auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, require_role
)
from app.models.all_models import (
    User, UserRole, CompanyProfile, CandidateProfile
)
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ─── Pydantic Schemas ─────────────────────────────────────

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "candidate"  # "candidate" or "company"
    # Company-specific
    company_name: Optional[str] = None
    industry: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    # Candidate fields
    headline: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    experience_years: Optional[int] = None
    education: Optional[list] = None
    certifications: Optional[list] = None
    portfolio_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    location: Optional[str] = None
    # Company fields
    company_name: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None


# ─── Helper ───────────────────────────────────────────────

def serialize_user(user: User) -> dict:
    """Serialize user object to dict for API response."""
    data = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role.value if user.role else "candidate",
        "avatar_url": user.avatar_url,
        "phone": user.phone,
        "is_active": user.is_active,
        "created_at": str(user.created_at) if user.created_at else None,
    }

    if user.role == UserRole.COMPANY and user.company_profile:
        data["company_profile"] = {
            "company_name": user.company_profile.company_name,
            "industry": user.company_profile.industry,
            "company_size": user.company_profile.company_size,
            "description": user.company_profile.description,
            "website": user.company_profile.website,
            "logo_url": user.company_profile.logo_url,
            "location": user.company_profile.location,
        }

    if user.role == UserRole.CANDIDATE and user.candidate_profile:
        data["candidate_profile"] = {
            "headline": user.candidate_profile.headline,
            "bio": user.candidate_profile.bio,
            "resume_url": user.candidate_profile.resume_url,
            "skills": user.candidate_profile.skills or [],
            "experience_years": user.candidate_profile.experience_years,
            "education": user.candidate_profile.education or [],
            "certifications": user.candidate_profile.certifications or [],
            "portfolio_url": user.candidate_profile.portfolio_url,
            "linkedin_url": user.candidate_profile.linkedin_url,
            "location": user.candidate_profile.location,
        }

    return data


# ─── Endpoints ────────────────────────────────────────────

@router.post("/register", response_model=dict)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user (candidate or company)."""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == req.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Validate role
    try:
        role = UserRole(req.role)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'candidate' or 'company'"
        )

    # Company registration requires company_name
    if role == UserRole.COMPANY and not req.company_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company name is required for company registration"
        )

    # Create user
    user = User(
        email=req.email,
        hashed_password=get_password_hash(req.password),
        full_name=req.full_name,
        role=role,
        is_active=True,
    )
    db.add(user)
    await db.flush()

    # Create role-specific profile
    if role == UserRole.CANDIDATE:
        profile = CandidateProfile(user_id=user.id)
        db.add(profile)
    elif role == UserRole.COMPANY:
        profile = CompanyProfile(
            user_id=user.id,
            company_name=req.company_name,
            industry=req.industry,
        )
        db.add(profile)

    await db.commit()
    await db.refresh(user)

    # Generate token
    access_token = create_access_token(
        data={"sub": user.email, "role": role.value},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": serialize_user(user)
    }


@router.post("/login", response_model=dict)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login and receive JWT token."""
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalars().first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact support.",
        )

    # Eagerly load profile relationship
    if user.role == UserRole.COMPANY:
        await db.refresh(user, ["company_profile"])
    elif user.role == UserRole.CANDIDATE:
        await db.refresh(user, ["candidate_profile"])

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": serialize_user(user)
    }


@router.get("/me", response_model=dict)
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get the current authenticated user's profile."""
    # Eagerly load profile relationship
    if current_user.role == UserRole.COMPANY:
        await db.refresh(current_user, ["company_profile"])
    elif current_user.role == UserRole.CANDIDATE:
        await db.refresh(current_user, ["candidate_profile"])

    return {"user": serialize_user(current_user)}


@router.put("/me", response_model=dict)
async def update_me(
    req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update the current user's profile."""
    # Update base user fields
    if req.full_name is not None:
        current_user.full_name = req.full_name
    if req.phone is not None:
        current_user.phone = req.phone
    if req.avatar_url is not None:
        current_user.avatar_url = req.avatar_url

    # Update candidate profile
    if current_user.role == UserRole.CANDIDATE:
        await db.refresh(current_user, ["candidate_profile"])
        profile = current_user.candidate_profile
        if not profile:
            profile = CandidateProfile(user_id=current_user.id)
            db.add(profile)
            await db.flush()

        if req.headline is not None: profile.headline = req.headline
        if req.bio is not None: profile.bio = req.bio
        if req.skills is not None: profile.skills = req.skills
        if req.experience_years is not None: profile.experience_years = req.experience_years
        if req.education is not None: profile.education = req.education
        if req.certifications is not None: profile.certifications = req.certifications
        if req.portfolio_url is not None: profile.portfolio_url = req.portfolio_url
        if req.linkedin_url is not None: profile.linkedin_url = req.linkedin_url
        if req.location is not None: profile.location = req.location

    # Update company profile
    if current_user.role == UserRole.COMPANY:
        await db.refresh(current_user, ["company_profile"])
        profile = current_user.company_profile
        if not profile:
            profile = CompanyProfile(user_id=current_user.id, company_name=req.company_name or "My Company")
            db.add(profile)
            await db.flush()

        if req.company_name is not None: profile.company_name = req.company_name
        if req.industry is not None: profile.industry = req.industry
        if req.company_size is not None: profile.company_size = req.company_size
        if req.description is not None: profile.description = req.description
        if req.website is not None: profile.website = req.website
        if req.location is not None: profile.location = req.location

    await db.commit()

    # Reload for response
    if current_user.role == UserRole.COMPANY:
        await db.refresh(current_user, ["company_profile"])
    elif current_user.role == UserRole.CANDIDATE:
        await db.refresh(current_user, ["candidate_profile"])

    return {"user": serialize_user(current_user)}
