import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is required")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is required")

CRM_API_URL = os.getenv("CRM_API_URL", "").strip()
CRM_API_KEY = os.getenv("CRM_API_KEY", "").strip()
HERMES_GATEWAY_URL = os.getenv("HERMES_GATEWAY_URL", "").strip()
HERMES_GATEWAY_TOKEN = os.getenv("HERMES_GATEWAY_TOKEN", "").strip()

IMAGINER_API_KEY = os.getenv("IMAGINER_API_KEY", "").strip()
IMAGINER_BASE_URL = os.getenv("IMAGINER_BASE_URL", "https://imaginer.mirava.studio").rstrip("/")

# 9router (OpenAI-compatible) untuk tool AI teks (Generator Profil Google, dll).
ROUTER_BASE_URL = os.getenv("ROUTER_BASE_URL", "https://9router.kantorteman.my.id/v1").rstrip("/")
ROUTER_API_KEY = os.getenv("ROUTER_API_KEY", "").strip()
ROUTER_MODEL = os.getenv("ROUTER_MODEL", "mimo").strip()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://www.temanumkmkita.com").rstrip("/")
SMTP_HOST = os.getenv("SMTP_HOST", "").strip()
SMTP_PORT = int(os.getenv("SMTP_PORT", "587") or "587")
SMTP_USER = os.getenv("SMTP_USER", "").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip()
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER).strip()
AUTH_ALLOWED_EMAIL_DOMAINS = [
    domain.strip().lower()
    for domain in os.getenv("AUTH_ALLOWED_EMAIL_DOMAINS", "temanumkmkita.com").split(",")
    if domain.strip()
]

SETTINGS_ID = "1"
