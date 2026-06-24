"""Admin login flow tests — covers login, register, auth middleware, JWT."""
import os, sys
from datetime import datetime, timezone
from pathlib import Path

os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key-32chars-minimum!!")
os.environ.setdefault("AUTH_ALLOWED_EMAIL_DOMAINS", "example.test")
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from jose import jwt

from app.core.database import Base, get_db
from app.core import security
from app.core.security import hash_password, create_access_token
from app.main import app
from app.models import User


def _client(tmp_path):
    engine = create_engine(f"sqlite:///{tmp_path}/auth-test.db")
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


def _make_token(username: str) -> str:
    return create_access_token(username)


# ─── Login Tests ─────────────────────────────────────────────────────────────

def test_login_success(tmp_path):
    security._rate_limit_buckets.clear()
    client, Session = _client(tmp_path)
    db = Session()
    db.add(User(id="u1", username="admin", email="admin@example.test",
                password_hash=hash_password("correctpass"),
                created_at=datetime.now(timezone.utc).isoformat()))
    db.commit(); db.close()

    r = client.post("/api/auth/login", json={"email": "admin@example.test", "password": "correctpass"})
    assert r.status_code == 200
    body = r.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"
    app.dependency_overrides.clear()


def test_login_wrong_password(tmp_path):
    security._rate_limit_buckets.clear()
    client, Session = _client(tmp_path)
    db = Session()
    db.add(User(id="u1", username="admin", email="admin@example.test",
                password_hash=hash_password("correctpass"),
                created_at=datetime.now(timezone.utc).isoformat()))
    db.commit(); db.close()

    r = client.post("/api/auth/login", json={"email": "admin@example.test", "password": "wrongpass"})
    assert r.status_code == 401
    app.dependency_overrides.clear()


def test_login_unknown_email(tmp_path):
    security._rate_limit_buckets.clear()
    client, _ = _client(tmp_path)
    r = client.post("/api/auth/login", json={"email": "nobody@example.test", "password": "x"})
    assert r.status_code == 401
    app.dependency_overrides.clear()


def test_login_whitespace_email(tmp_path):
    security._rate_limit_buckets.clear()
    client, Session = _client(tmp_path)
    db = Session()
    db.add(User(id="u1", username="admin", email="admin@example.test",
                password_hash=hash_password("pass123"),
                created_at=datetime.now(timezone.utc).isoformat()))
    db.commit(); db.close()

    r = client.post("/api/auth/login", json={"email": "  Admin@EXAMPLE.TEST  ", "password": "pass123"})
    assert r.status_code == 200
    app.dependency_overrides.clear()


def test_login_domain_block(tmp_path):
    security._rate_limit_buckets.clear()
    client, _ = _client(tmp_path)
    r = client.post("/api/auth/login", json={"email": "admin@gmail.com", "password": "x"})
    assert r.status_code == 400
    app.dependency_overrides.clear()


def test_login_rate_limit_ip(tmp_path):
    security._rate_limit_buckets.clear()
    client, Session = _client(tmp_path)
    db = Session()
    db.add(User(id="u1", username="admin", email="admin@example.test",
                password_hash=hash_password("correctpass"),
                created_at=datetime.now(timezone.utc).isoformat()))
    db.commit(); db.close()

    # user rate limit is 10 per 300s (stricter than IP limit of 20)
    for _ in range(10):
        r = client.post("/api/auth/login", json={"email": "admin@example.test", "password": "wrong"})
        assert r.status_code == 401

    # 11th request should be rate limited
    r = client.post("/api/auth/login", json={"email": "admin@example.test", "password": "wrong"})
    assert r.status_code == 429
    app.dependency_overrides.clear()
    security._rate_limit_buckets.clear()


# ─── Register Tests ──────────────────────────────────────────────────────────

def test_register_valid(tmp_path):
    security._rate_limit_buckets.clear()
    client, Session = _client(tmp_path)
    db = Session()
    admin = User(id="u1", username="admin", email="admin@example.test",
                 password_hash=hash_password("adminpass"),
                 created_at=datetime.now(timezone.utc).isoformat())
    db.add(admin); db.commit(); db.close()

    token = _make_token("admin")
    r = client.post("/api/auth/register", json={
        "username": "newuser", "email": "new@example.test", "password": "newpass123"
    }, headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    app.dependency_overrides.clear()


def test_register_duplicate_email(tmp_path):
    security._rate_limit_buckets.clear()
    client, Session = _client(tmp_path)
    db = Session()
    db.add(User(id="u1", username="admin", email="admin@example.test",
                password_hash=hash_password("adminpass"),
                created_at=datetime.now(timezone.utc).isoformat()))
    db.add(User(id="u2", username="existing", email="dup@example.test",
                password_hash=hash_password("pass"),
                created_at=datetime.now(timezone.utc).isoformat()))
    db.commit(); db.close()

    token = _make_token("admin")
    r = client.post("/api/auth/register", json={
        "username": "newuser", "email": "dup@example.test", "password": "newpass"
    }, headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 400
    app.dependency_overrides.clear()


def test_register_missing_auth(tmp_path):
    security._rate_limit_buckets.clear()
    client, _ = _client(tmp_path)
    r = client.post("/api/auth/register", json={
        "username": "hacker", "email": "hacker@example.test", "password": "pass"
    })
    assert r.status_code == 401
    app.dependency_overrides.clear()


# ─── Auth Middleware Tests ───────────────────────────────────────────────────

def test_get_me_valid_token(tmp_path):
    security._rate_limit_buckets.clear()
    client, Session = _client(tmp_path)
    db = Session()
    db.add(User(id="u1", username="admin", email="admin@example.test",
                password_hash=hash_password("pass"),
                created_at=datetime.now(timezone.utc).isoformat()))
    db.commit(); db.close()

    token = _make_token("admin")
    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    app.dependency_overrides.clear()


def test_get_me_missing_token(tmp_path):
    security._rate_limit_buckets.clear()
    client, _ = _client(tmp_path)
    r = client.get("/api/auth/me")
    assert r.status_code == 401
    app.dependency_overrides.clear()


def test_get_me_expired_token(tmp_path):
    security._rate_limit_buckets.clear()
    client, _ = _client(tmp_path)
    from datetime import timedelta
    from jose import JWTError

    expired = jwt.encode(
        {"sub": "admin", "exp": datetime.now(timezone.utc) - timedelta(hours=1)},
        "test-secret-key-32chars-minimum!!", algorithm="HS256"
    )
    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {expired}"})
    assert r.status_code == 401
    app.dependency_overrides.clear()


def test_get_me_tampered_token(tmp_path):
    security._rate_limit_buckets.clear()
    client, _ = _client(tmp_path)
    r = client.get("/api/auth/me", headers={"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.tampered.signature"})
    assert r.status_code == 401
    app.dependency_overrides.clear()
