import uuid
from sqlalchemy import Column, String, Boolean
from app.core.database import Base


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    phone = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True)
    service = Column(String(255), nullable=True)
    message = Column(String(2000), nullable=True)
    created_at = Column(String(255), nullable=False)
    sent_to_crm = Column(Boolean, default=False)
