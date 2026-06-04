import uuid
from sqlalchemy import Column, String
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True)
    username = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(String(255), nullable=False)
