import uuid
import hashlib
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.mime.text import MIMEText
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import PasswordResetToken, User
from app.schemas import (
    LoginRequest, PasswordResetConfirm, PasswordResetRequest,
    RegisterRequest, TokenOut, UserOut,
)
from app.core.config import (
    AUTH_ALLOWED_EMAIL_DOMAINS,
    FRONTEND_URL,
    SMTP_FROM,
    SMTP_HOST,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_USER,
)
from app.core.security import (
    check_rate_limit,
    hash_password,
    verify_and_upgrade_password,
    create_access_token,
    require_auth,
)
from app.core.utils import now_iso

router = APIRouter(prefix="/api/auth", tags=["auth"])
RESET_TOKEN_EXPIRE_MINUTES = 60


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()[:64]
    return request.client.host if request.client else "unknown"


def _email_domain(email: str) -> str:
    return email.rsplit("@", 1)[-1].lower()


def _ensure_allowed_email(email: str) -> None:
    if AUTH_ALLOWED_EMAIL_DOMAINS and _email_domain(email) not in AUTH_ALLOWED_EMAIL_DOMAINS:
        raise HTTPException(status_code=400, detail="Gunakan email resmi yang sudah ditentukan.")


def _send_password_reset_email(to_email: str, reset_url: str) -> bool:
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        return False
    msg = MIMEText(
        "\n".join([
            "Halo,",
            "",
            "Ada permintaan reset password untuk akun admin TemanUMKMKita.",
            "Buka link berikut untuk membuat password baru:",
            reset_url,
            "",
            f"Link berlaku {RESET_TOKEN_EXPIRE_MINUTES} menit. Abaikan email ini kalau kamu tidak meminta reset password.",
        ]),
        "plain",
        "utf-8",
    )
    msg["Subject"] = "Reset password TemanUMKMKita"
    msg["From"] = SMTP_FROM or SMTP_USER
    msg["To"] = to_email

    if SMTP_PORT == 465:
        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=30)
    else:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30)
        server.starttls()
    try:
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_FROM or SMTP_USER, [to_email], msg.as_string())
    finally:
        server.quit()
    return True


@router.post("/login", response_model=TokenOut)
def login(data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    ip = _client_ip(request)
    email = data.email.strip().lower()
    _ensure_allowed_email(email)
    username_key = email[:100]
    check_rate_limit(f"login:ip:{ip}", 20, 300)
    check_rate_limit(f"login:user:{username_key}", 10, 300)
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_and_upgrade_password(data.password, user.password_hash, db, user.id):
        raise HTTPException(status_code=401, detail="Email atau password salah")
    token = create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def me(username: str = Depends(require_auth), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/register", response_model=UserOut, dependencies=[Depends(require_auth)])
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    _ensure_allowed_email(data.email)
    email_owner = db.query(User).filter(User.email == data.email).first()
    if email_owner:
        raise HTTPException(status_code=400, detail="Email already exists")
    username = data.username or data.email.split("@", 1)[0]
    existing = db.query(User).filter(User.username == username).first()
    if existing:
        suffix = data.email.rsplit("@", 1)[0].replace(".", "-")
        username = f"{suffix}-{uuid.uuid4().hex[:6]}"
    user = User(
        id=str(uuid.uuid4()),
        username=username,
        email=data.email,
        password_hash=hash_password(data.password),
        created_at=now_iso(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/password/forgot")
def request_password_reset(data: PasswordResetRequest, request: Request, db: Session = Depends(get_db)):
    check_rate_limit(f"password-reset:{_client_ip(request)}", 5, 300)
    if AUTH_ALLOWED_EMAIL_DOMAINS and _email_domain(data.email) not in AUTH_ALLOWED_EMAIL_DOMAINS:
        return {"ok": True, "message": "Jika email terdaftar dan SMTP aktif, instruksi reset password akan dikirim."}
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        raw_token = secrets.token_urlsafe(32)
        expires_at = _utc_now() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
        db.add(PasswordResetToken(
            id=str(uuid.uuid4()),
            user_id=user.id,
            token_hash=_hash_reset_token(raw_token),
            expires_at=expires_at.isoformat(),
            created_at=_utc_now().isoformat(),
        ))
        db.commit()
        reset_url = f"{FRONTEND_URL}/admin/reset-password?token={raw_token}"
        try:
            sent = _send_password_reset_email(user.email, reset_url)
            if not sent:
                print("[PASSWORD_RESET] SMTP not configured; reset email not sent.", flush=True)
        except Exception as exc:
            print(f"[PASSWORD_RESET] email failed: {type(exc).__name__}: {exc}", flush=True)
    return {"ok": True, "message": "Jika email terdaftar dan SMTP aktif, instruksi reset password akan dikirim."}


@router.post("/password/reset")
def reset_password(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    token_hash = _hash_reset_token(data.token)
    row = db.query(PasswordResetToken).filter(PasswordResetToken.token_hash == token_hash).first()
    if not row or row.used_at:
        raise HTTPException(status_code=400, detail="Token reset tidak valid atau sudah dipakai.")
    try:
        expires_at = datetime.fromisoformat(row.expires_at)
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
    except ValueError:
        raise HTTPException(status_code=400, detail="Token reset tidak valid.")
    if expires_at < _utc_now():
        raise HTTPException(status_code=400, detail="Token reset sudah kedaluwarsa.")
    user = db.query(User).filter(User.id == row.user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User tidak ditemukan.")
    user.password_hash = hash_password(data.password)
    row.used_at = _utc_now().isoformat()
    db.commit()
    return {"ok": True}
