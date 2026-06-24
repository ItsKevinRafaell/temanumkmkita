#!/usr/bin/env python3
"""
Non-interactive admin seed script for TemanUMKMKita.
Creates admin user with default credentials if not exists.

Usage:
  cd backend && python scripts/seed_admin_noninteractive.py
  # or with custom credentials:
  ADMIN_EMAIL=admin@temanumkmkita.com ADMIN_PASSWORD=secret123 python scripts/seed_admin_noninteractive.py

Environment variables:
  ADMIN_EMAIL     - Admin email (default: admin@temanumkmkita.com)
  ADMIN_PASSWORD  - Admin password (default: admin123)
  ADMIN_USERNAME - Admin username (default: admin)
"""
import os
import sys
import uuid

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.database import SessionLocal
from app.models import User
from app.core.security import hash_password
from datetime import datetime, timezone


def main():
    email = os.getenv("ADMIN_EMAIL", "admin@temanumkmkita.com")
    password = os.getenv("ADMIN_PASSWORD", "admin123")
    username = os.getenv("ADMIN_USERNAME", "admin")

    if len(password) < 8:
        print("ERROR: Password must be at least 8 characters")
        sys.exit(1)

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"Admin user '{email}' already exists.")
            print(f"User ID: {existing.id}")
            sys.exit(0)

        user = User(
            id=str(uuid.uuid4()),
            username=username,
            email=email,
            password_hash=hash_password(password),
            created_at=datetime.now(timezone.utc).isoformat(),
        )
        db.add(user)
        db.commit()
        print(f"SUCCESS: Admin user created")
        print(f"  Email: {email}")
        print(f"  Username: {username}")
        print(f"  Password: {password}")
        print(f"  ID: {user.id}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
