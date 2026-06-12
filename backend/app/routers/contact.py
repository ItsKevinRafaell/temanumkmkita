import os
import uuid
import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, Request
from sqlalchemy.orm import Session
from urllib.parse import urlparse

from app.core.database import SessionLocal, get_db
from app.core.config import CRM_API_URL, CRM_API_KEY
from app.core.security import check_rate_limit
from app.core.utils import now_iso
from app.models import ContactSubmission
from app.schemas.contact import ContactFormIn

router = APIRouter(prefix="/api", tags=["contact"])


def _crm_host(url: str) -> str:
    parsed = urlparse((url or "").strip())
    return parsed.netloc or parsed.path.split("/")[0]


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()[:64]
    return request.client.host if request.client else "unknown"


@router.get("/integrations/kantorteman/lead-intake/status")
def lead_intake_status():
    return {
        "service": "temanumkmkita",
        "flow": "lead_intake",
        "status": "ok" if CRM_API_URL and CRM_API_KEY else "unconfigured",
        "crm_configured": bool(CRM_API_URL and CRM_API_KEY),
        "crm_api_host": _crm_host(CRM_API_URL) if CRM_API_URL else "",
        "target_path": "/api/leads/external",
        "source": "website_temanumkmkita",
    }


def _forward_to_crm(submission_id: str, payload: dict):
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
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    check_rate_limit(f"contact-form:{_client_ip(request)}", 10, 300)
    submission = ContactSubmission(
        id=str(uuid.uuid4()),
        name=body.name,
        phone=body.phone,
        email=body.email,
        service=body.service,
        message=body.message,
        created_at=now_iso(),
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
