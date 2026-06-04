import hashlib
import hmac
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import bcrypt

from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_HOURS


bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_and_upgrade_password(plain: str, hashed: str, db_session, user_id: str) -> bool:
    if len(hashed) == 64 and all(c in '0123456789abcdef' for c in hashed):
        legacy_hash = hmac.new(SECRET_KEY.encode(), plain.encode(), hashlib.sha256).hexdigest()
        if hmac.compare_digest(legacy_hash, hashed):
            from app.models import User
            new_hash = bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()
            user = db_session.query(User).filter(User.id == user_id).first()
            if user:
                user.password_hash = new_hash
                db_session.commit()
            return True
        return False
    return bcrypt.checkpw(plain.encode(), hashed.encode())


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
