import os
import uuid
import httpx
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from database import SessionLocal, get_db
from models import ContactSubmission

router = APIRouter(prefix="/api", tags=["contact"])

CRM_API_URL = os.getenv("CRM_API_URL", "").strip()
CRM_API_KEY = os.getenv("CRM_API_KEY", "").strip()


VALID_SERVICES = {
    "web_development",
    "seo_google_maps",
    "kelola_sosial_media",
    "maintenance_website",
    "desain_logo",
}


class ContactFormIn(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    service: Optional[str] = None
    message: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Nama tidak boleh kosong")
        return v.strip()[:255]

    @field_validator("phone")
    @classmethod
    def phone_not_empty(cls, v: str) -> str:
        digits = "".join(c for c in v if c.isdigit())
        if len(digits) < 8:
            raise ValueError("Nomor WhatsApp tidak valid")
        return v.strip()[:50]

    @field_validator("service")
    @classmethod
    def service_valid(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            raise ValueError("Layanan wajib dipilih")
        if v not in VALID_SERVICES:
            raise ValueError(f"Layanan tidak valid: {v}")
        return v

    @field_validator("message")
    @classmethod
    def cap_message(cls, v: Optional[str]) -> Optional[str]:
        return (v or "").strip()[:1000] or None


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _forward_to_crm(submission_id: str, payload: dict):
    """Background task: POST to CRM, mark sent_to_crm if success."""
    if not CRM_API_URL or not CRM_API_KEY:
        return
    db = SessionLocal()
    try:
        with httpx.Client(timeout=15) as client:
            resp = client.post(
                f"{CRM_API_URL.rstrip('/')}/api/leads/external",
                json=payload,
                headers={"X-API-Key": CRM_API_KEY},
            )
            if resp.status_code in (200, 201):
                sub = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()
                if sub:
                    sub.sent_to_crm = True
                    db.commit()
            else:
                print(f"[CONTACT] CRM responded {resp.status_code}: {resp.text[:200]}", flush=True)
    except Exception as e:
        print(f"[CONTACT] CRM forward failed: {e}", flush=True)
    finally:
        db.close()


@router.post("/contact-form", status_code=201)
def submit_contact_form(
    body: ContactFormIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    submission = ContactSubmission(
        id=str(uuid.uuid4()),
        name=body.name,
        phone=body.phone,
        email=body.email,
        service=body.service,
        message=body.message,
        created_at=_now_iso(),
        sent_to_crm=False,
    )
    db.add(submission)
    db.commit()

    payload = {
        "business_name": body.name,
        "phone_number": body.phone,
        "email": body.email,
        "message": body.message,
        "product_interest": body.service,
        "source": "website_temanumkmkita",
    }
    background_tasks.add_task(_forward_to_crm, submission.id, payload)

    return {"success": True, "submission_id": submission.id}
