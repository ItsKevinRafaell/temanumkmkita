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

SETTINGS_ID = "1"
