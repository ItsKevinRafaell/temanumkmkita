import hashlib
import secrets
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import IntegrationToken
from schemas import IntegrationTokenOut
from auth import require_auth

router = APIRouter(prefix="/api/integration", tags=["integration"])


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def hash_token(plain: str) -> str:
    return hashlib.sha256(plain.encode()).hexdigest()


@router.get("/token", response_model=Optional[IntegrationTokenOut], dependencies=[Depends(require_auth)])
def get_token(db: Session = Depends(get_db)):
    """Return current token info (id, created_at, token_prefix) or null if none exists."""
    row = db.query(IntegrationToken).first()
    if not row:
        return None
    # token_prefix is not stored — return placeholder showing token exists
    # We store only the hash, so we cannot recover the prefix.
    # Use a sentinel prefix to indicate the token is active but prefix is unknown after restart.
    row.token_prefix = row.token_hash[:8]
    return row


@router.post("/token", dependencies=[Depends(require_auth)])
def create_token(db: Session = Depends(get_db)):
    """Generate a new integration token. Deletes any existing tokens first.
    Returns the plain token ONCE — it cannot be retrieved again."""
    # Revoke all existing tokens
    db.query(IntegrationToken).delete()
    db.commit()

    plain_token = secrets.token_hex(32)  # 64-char hex string
    token_hash = hash_token(plain_token)

    row = IntegrationToken(
        token_hash=token_hash,
        created_at=now_iso(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    return {
        "token": plain_token,
        "id": row.id,
        "created_at": row.created_at,
        "token_prefix": plain_token[:8],
    }


@router.delete("/token", dependencies=[Depends(require_auth)])
def revoke_token(db: Session = Depends(get_db)):
    """Delete all integration tokens (revoke access)."""
    deleted = db.query(IntegrationToken).delete()
    db.commit()
    return {"ok": True, "revoked": deleted}
