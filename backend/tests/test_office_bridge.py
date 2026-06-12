import os
import sys
from pathlib import Path

os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient

from app.main import app


def test_office_health_route_available():
    client = TestClient(app)
    response = client.get("/api/office/health")

    assert response.status_code == 200
    assert response.json() == {"ok": True, "source": "temanumkmkita"}
