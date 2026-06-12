import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base, get_db
from app.core import security
from app.core.security import hash_password, verify_and_upgrade_password
from app.main import app
from app.models import PasswordResetToken, User
from app.routers import auth


def _client(tmp_path):
    engine = create_engine(f"sqlite:///{tmp_path}/password-reset.db")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)

    def override_db():
        db = Session()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_db
    return TestClient(app), Session


def test_password_reset_request_is_generic_and_sends_email(tmp_path, monkeypatch):
    security._rate_limit_buckets.clear()
    client, Session = _client(tmp_path)
    db = Session()
    db.add(User(
        id="user-1",
        username="admin",
        email="admin@example.test",
        password_hash=hash_password("oldpassword"),
        created_at=datetime.now(timezone.utc).isoformat(),
    ))
    db.commit()
    db.close()

    sent = {}

    def fake_send(to_email, reset_url):
        sent["to"] = to_email
        sent["url"] = reset_url
        return True

    monkeypatch.setattr(auth, "_send_password_reset_email", fake_send)

    response = client.post("/api/auth/password/forgot", json={"email": "admin@example.test"})

    assert response.status_code == 200
    assert "Jika email terdaftar" in response.json()["message"]
    assert sent["to"] == "admin@example.test"
    assert "/admin/reset-password?token=" in sent["url"]
    db = Session()
    assert db.query(PasswordResetToken).count() == 1
    db.close()
    app.dependency_overrides.clear()


def test_password_reset_confirm_changes_password_once(tmp_path):
    security._rate_limit_buckets.clear()
    client, Session = _client(tmp_path)
    db = Session()
    user = User(
        id="user-1",
        username="admin",
        email="admin@example.test",
        password_hash=hash_password("oldpassword"),
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    db.add(user)
    raw_token = "reset-token-for-test-1234567890-abcdef"
    db.add(PasswordResetToken(
        id="reset-1",
        user_id=user.id,
        token_hash=auth._hash_reset_token(raw_token),
        expires_at=(datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat(),
        created_at=datetime.now(timezone.utc).isoformat(),
    ))
    db.commit()
    db.close()

    response = client.post("/api/auth/password/reset", json={"token": raw_token, "password": "newpassword"})

    assert response.status_code == 200
    db = Session()
    user = db.query(User).filter_by(id="user-1").one()
    assert verify_and_upgrade_password("newpassword", user.password_hash, db, user.id)
    db.close()

    second = client.post("/api/auth/password/reset", json={"token": raw_token, "password": "anotherpassword"})
    assert second.status_code == 400
    app.dependency_overrides.clear()


def test_login_rate_limit_blocks_repeated_failures(tmp_path):
    security._rate_limit_buckets.clear()
    client, Session = _client(tmp_path)
    db = Session()
    db.add(User(
        id="user-1",
        username="admin",
        email="admin@example.test",
        password_hash=hash_password("correctpassword"),
        created_at=datetime.now(timezone.utc).isoformat(),
    ))
    db.commit()
    db.close()

    for _ in range(10):
        response = client.post("/api/auth/login", json={"username": "admin", "password": "wrongpassword"})
        assert response.status_code == 401

    blocked = client.post("/api/auth/login", json={"username": "admin", "password": "wrongpassword"})
    assert blocked.status_code == 429
    app.dependency_overrides.clear()
    security._rate_limit_buckets.clear()
