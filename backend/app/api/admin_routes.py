from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.session import get_db
from app.services.auth import get_current_user, require_role
from app.models.all_models import (
    User, UserRole, Job, Application, Interview, CandidateProfile, CompanyProfile
)

router = APIRouter(prefix="/admin", tags=["Admin"])


# ─── Dependency: require admin role ──────────────────────
async def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


# ─── Stats ───────────────────────────────────────────────
@router.get("/stats")
async def get_admin_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get platform-wide statistics."""
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    total_candidates = (await db.execute(
        select(func.count(User.id)).where(User.role == UserRole.CANDIDATE)
    )).scalar() or 0
    total_companies = (await db.execute(
        select(func.count(User.id)).where(User.role == UserRole.COMPANY)
    )).scalar() or 0
    total_jobs = (await db.execute(
        select(func.count(Job.id)).where(Job.is_active == True)
    )).scalar() or 0
    total_applications = (await db.execute(select(func.count(Application.id)))).scalar() or 0
    total_interviews = (await db.execute(select(func.count(Interview.id)))).scalar() or 0

    return {
        "total_users": total_users,
        "total_candidates": total_candidates,
        "total_companies": total_companies,
        "total_jobs": total_jobs,
        "total_applications": total_applications,
        "total_interviews": total_interviews,
    }


# ─── Users ───────────────────────────────────────────────
@router.get("/users")
async def list_users(
    skip: int = 0,
    limit: int = 50,
    role: str = None,
    search: str = None,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """List all users with optional role filter and search."""
    query = select(User)

    if role:
        try:
            role_enum = UserRole(role)
            query = query.where(User.role == role_enum)
        except ValueError:
            pass

    if search:
        query = query.where(
            (User.full_name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%"))
        )

    query = query.order_by(User.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()

    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role.value if u.role else "candidate",
            "is_active": u.is_active,
            "created_at": str(u.created_at) if u.created_at else None,
        }
        for u in users
    ]


# ─── Toggle User Active Status ──────────────────────────
@router.put("/users/{user_id}/toggle")
async def toggle_user_status(
    user_id: int,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Activate or deactivate a user account."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot toggle your own account")

    user.is_active = not user.is_active
    await db.commit()

    return {
        "id": user.id,
        "is_active": user.is_active,
        "message": f"User {'activated' if user.is_active else 'deactivated'}"
    }


# ─── System Info ─────────────────────────────────────────
@router.get("/system")
async def get_system_info(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get system health and configuration info."""
    # Test DB connection
    db_healthy = True
    try:
        await db.execute(select(func.count(User.id)))
    except Exception:
        db_healthy = False

    return {
        "database": {
            "status": "healthy" if db_healthy else "error",
            "engine": "PostgreSQL (Async)",
        },
        "api": {
            "status": "healthy",
            "version": "2.0.0",
        },
        "ai_models": {
            "nlp": "Available",
            "vision": "Available",
            "audio": "Available",
        },
        "planned_features": [
            {"name": "Coding Challenge Environment", "status": "coming_soon", "eta": "Q3 2026"},
            {"name": "Video Interview Recording", "status": "planned", "eta": "Q4 2026"},
            {"name": "Advanced Analytics Dashboard", "status": "planned", "eta": "Q3 2026"},
            {"name": "Webhook Integrations", "status": "planned", "eta": "Q4 2026"},
        ]
    }


# ─── Activity Feed ───────────────────────────────────────
@router.get("/activity")
async def get_activity(
    limit: int = 20,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get recent platform activity."""
    # Recent users
    recent_users = (await db.execute(
        select(User).order_by(User.created_at.desc()).limit(5)
    )).scalars().all()

    # Recent applications
    recent_apps = (await db.execute(
        select(Application).order_by(Application.created_at.desc()).limit(5)
    )).scalars().all()

    activities = []

    for u in recent_users:
        activities.append({
            "type": "user_registered",
            "message": f"{u.full_name or u.email} joined as {u.role.value if u.role else 'candidate'}",
            "timestamp": str(u.created_at) if u.created_at else None,
        })

    for a in recent_apps:
        activities.append({
            "type": "application_submitted",
            "message": f"Application #{a.id} submitted for Job #{a.job_id}",
            "timestamp": str(a.created_at) if a.created_at else None,
        })

    # Sort by timestamp desc
    activities.sort(key=lambda x: x.get("timestamp") or "", reverse=True)
    return activities[:limit]
