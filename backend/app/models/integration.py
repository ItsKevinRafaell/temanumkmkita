import uuid
from sqlalchemy import Column, String
from app.core.database import Base


class IntegrationToken(Base):
    __tablename__ = "integration_tokens"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    token_hash = Column(String(64), unique=True, nullable=False, index=True)
    created_at = Column(String(255), nullable=False)
