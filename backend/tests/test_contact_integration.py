import os
import sys
from pathlib import Path

os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.models import ContactSubmission
from app.routers import contact


def _session_factory(tmp_path):
    engine = create_engine(f"sqlite:///{tmp_path}/contact-integration.db")
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine)


def test_lead_intake_status_reports_config_without_secret(monkeypatch):
    monkeypatch.setattr(contact, "CRM_API_URL", "https://api.kantorteman.my.id")
    monkeypatch.setattr(contact, "CRM_API_KEY", "secret-key-value")

    status = contact.lead_intake_status()

    assert status["status"] == "ok"
    assert status["crm_configured"] is True
    assert status["crm_api_host"] == "api.kantorteman.my.id"
    assert status["target_path"] == "/api/leads/external"
    assert "secret-key-value" not in str(status)


def test_forward_to_crm_posts_kantorteman_payload_and_marks_sent(tmp_path, monkeypatch):
    Session = _session_factory(tmp_path)
    monkeypatch.setattr(contact, "SessionLocal", Session)
    monkeypatch.setattr(contact, "CRM_API_URL", "https://api.kantorteman.my.id/")
    monkeypatch.setattr(contact, "CRM_API_KEY", "bridge-key")

    db = Session()
    db.add(ContactSubmission(
        id="submission-1",
        name="Toko Test",
        phone="081234567890",
        email="owner@example.test",
        service="web_development",
        message="Butuh website",
        created_at="2026-06-11T00:00:00+07:00",
        sent_to_crm=False,
    ))
    db.commit()
    db.close()

    captured = {}

    class FakeResponse:
        status_code = 201
        text = '{"success":true}'

    class FakeClient:
        def __init__(self, timeout):
            self.timeout = timeout

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            return None

        def post(self, url, json, headers):
            captured["url"] = url
            captured["json"] = json
            captured["headers"] = headers
            return FakeResponse()

    monkeypatch.setattr(contact.httpx, "Client", FakeClient)

    payload = {
        "business_name": "Toko Test",
        "phone_number": "081234567890",
        "email": "owner@example.test",
        "message": "Butuh website",
        "product_interest": "web_development",
        "source": "website_temanumkmkita",
    }
    contact._forward_to_crm("submission-1", payload)

    assert captured["url"] == "https://api.kantorteman.my.id/api/leads/external"
    assert captured["headers"] == {"X-API-Key": "bridge-key"}
    assert captured["json"] == payload

    db = Session()
    saved = db.query(ContactSubmission).filter(ContactSubmission.id == "submission-1").one()
    assert saved.sent_to_crm is True
    db.close()
