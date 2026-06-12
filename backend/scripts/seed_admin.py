"""
Run once to create the first admin user.
Usage: cd backend && python scripts/seed_admin.py
"""
import uuid
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.database import SessionLocal
from app.models import User
from app.core.security import hash_password
from datetime import datetime, timezone


def main():
    username = input("Admin username: ").strip()
    email = input("Admin email (optional, for password reset): ").strip().lower() or None
    password = input("Admin password: ").strip()
    if not username or not password:
        print("Username dan password tidak boleh kosong.")
        sys.exit(1)

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.username == username).first()
        if existing:
            print(f"User '{username}' sudah ada.")
            sys.exit(1)
        user = User(
            id=str(uuid.uuid4()),
            username=username,
            email=email,
            password_hash=hash_password(password),
            created_at=datetime.now(timezone.utc).isoformat(),
        )
        db.add(user)
        db.commit()
        print(f"Admin user '{username}' berhasil dibuat.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
