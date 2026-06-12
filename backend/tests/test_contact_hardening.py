import os
import sys
from pathlib import Path

os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core import security
from app.core.database import Base, get_db
from app.main import app


def _client(tmp_path):
    engine = create_engine(f"sqlite:///{tmp_path}/contact-hardening.db")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)

    def override_db():
        db = Session()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_db
    return TestClient(app)


def test_contact_form_rate_limit_blocks_repeated_submissions(tmp_path):
    security._rate_limit_buckets.clear()
    client = _client(tmp_path)
    payload = {
        "name": "Toko Test",
        "phone": "081234567890",
        "email": "owner@example.test",
        "service": "web_development",
        "message": "Butuh website",
    }

    for _ in range(10):
        response = client.post("/api/contact-form", json=payload)
        assert response.status_code == 201

    blocked = client.post("/api/contact-form", json=payload)
    assert blocked.status_code == 429
    app.dependency_overrides.clear()
    security._rate_limit_buckets.clear()
