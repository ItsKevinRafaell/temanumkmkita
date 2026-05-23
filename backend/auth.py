import os
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
bearer_scheme = HTTPBearer()


def require_auth(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    if credentials.credentials != SECRET_KEY:
        raise HTTPException(status_code=401, detail="Invalid token")
    return credentials.credentials
