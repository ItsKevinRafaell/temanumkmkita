import os
import uuid
import httpx
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from database import get_db
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
        return v.strip()

    @field_validator("phone")
    @classmethod
    def phone_not_empty(cls, v: str) -> str:
        digits = "".join(c for c in v if c.isdigit())
        if len(digits) < 8:
            raise ValueError("Nomor WhatsApp tidak valid")
        return v.strip()

    @field_validator("service")
    @classmethod
    def service_valid(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            raise ValueError("Layanan wajib dipilih")
        if v not in VALID_SERVICES:
            raise ValueError(f"Layanan tidak valid: {v}")
        return v


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.post("/contact-form", status_code=201)
def submit_contact_form(body: ContactFormIn, db: Session = Depends(get_db)):
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

    sent_to_crm = False
    if CRM_API_URL and CRM_API_KEY:
        try:
            payload = {
                "business_name": body.name,
                "phone_number": body.phone,
                "email": body.email,
                "message": body.message,
                "product_interest": body.service,
                "source": "website_temanumkmkita",
            }
            resp = httpx.post(
                f"{CRM_API_URL.rstrip('/')}/api/leads/external",
                json=payload,
                headers={"X-API-Key": CRM_API_KEY},
                timeout=10,
            )
            if resp.status_code in (200, 201):
                sent_to_crm = True
                submission.sent_to_crm = True
                db.commit()
        except Exception as e:
            print(f"[CONTACT] CRM forward failed: {e}", flush=True)

    return {"success": True, "sent_to_crm": sent_to_crm}
