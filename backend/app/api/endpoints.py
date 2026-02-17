from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.auth import verify_password, create_access_token, get_current_user
from app.models.all_models import User
from sqlalchemy import select
from datetime import timedelta
from app.core.config import settings

# Import all sub-routers
from app.api import candidates, jobs, applications, interviews, auth_routes, admin_routes, resume_routes

router = APIRouter()

# Include all sub-routers
router.include_router(auth_routes.router)
router.include_router(candidates.router)
router.include_router(jobs.router)
router.include_router(applications.router)
router.include_router(interviews.router)
router.include_router(admin_routes.router)
router.include_router(resume_routes.router)

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # Async DB query to find user
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value if user.role else "candidate"},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "SmartHire API (Power Stack)"}
