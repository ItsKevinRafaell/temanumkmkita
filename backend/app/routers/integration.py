import hashlib
import secrets
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import IntegrationToken
from app.schemas import IntegrationTokenOut
from app.core.security import require_auth
from app.core.utils import now_iso

router = APIRouter(prefix="/api/integration", tags=["integration"])


def hash_token(plain: str) -> str:
    return hashlib.sha256(plain.encode()).hexdigest()


@router.get("/token", response_model=IntegrationTokenOut | None, dependencies=[Depends(require_auth)])
def get_token(db: Session = Depends(get_db)):
    row = db.query(IntegrationToken).first()
    if not row:
        return None
    row.token_prefix = row.token_hash[:8]
    return row


@router.post("/token", dependencies=[Depends(require_auth)])
def create_token(db: Session = Depends(get_db)):
    db.query(IntegrationToken).delete()
    db.commit()

    plain_token = secrets.token_hex(32)
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
    deleted = db.query(IntegrationToken).delete()
    db.commit()
    return {"ok": True, "revoked": deleted}
