import os
import hashlib
import hmac
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    """SHA-256 HMAC with SECRET_KEY as key — no bcrypt dependency needed."""
    return hmac.new(SECRET_KEY.encode(), password.encode(), hashlib.sha256).hexdigest()


def verify_password(plain: str, hashed: str) -> bool:
    return hmac.compare_digest(hash_password(plain), hashed)


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": subject, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub: str = payload.get("sub")
        if not sub:
            raise ValueError("missing sub")
        return sub
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_auth(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)) -> str:
    return decode_token(credentials.credentials)
