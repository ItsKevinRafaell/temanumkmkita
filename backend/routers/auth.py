import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import LoginRequest, TokenOut, UserOut
from auth import hash_password, verify_password, create_access_token, require_auth

router = APIRouter(prefix="/api/auth", tags=["auth"])


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.post("/login", response_model=TokenOut)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Username atau password salah")
    token = create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def me(username: str = Depends(require_auth), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/register", response_model=UserOut, dependencies=[Depends(require_auth)])
def register(data: LoginRequest, db: Session = Depends(get_db)):
    """Admin-only: create new admin user."""
    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    user = User(
        id=str(uuid.uuid4()),
        username=data.username,
        password_hash=hash_password(data.password),
        created_at=now_iso(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
