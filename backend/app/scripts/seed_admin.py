"""
Seed script to create a platform admin account.
Run: python -m app.scripts.seed_admin
"""
import asyncio
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.session import AsyncSessionLocal, engine, Base
from app.models.all_models import User, UserRole
from app.services.auth import get_password_hash
from sqlalchemy import select


async def seed_admin():
    async with AsyncSessionLocal() as db:
        # Check if admin already exists
        result = await db.execute(select(User).where(User.email == "admin@smarthire.com"))
        existing = result.scalars().first()

        if existing:
            print("✔ Admin account already exists (admin@smarthire.com)")
            return

        admin = User(
            email="admin@smarthire.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Platform Admin",
            role=UserRole.ADMIN,
            is_active=True,
            is_superuser=True,
        )
        db.add(admin)
        await db.commit()
        print("✔ Admin account created:")
        print("  Email:    admin@smarthire.com")
        print("  Password: admin123")


if __name__ == "__main__":
    asyncio.run(seed_admin())
