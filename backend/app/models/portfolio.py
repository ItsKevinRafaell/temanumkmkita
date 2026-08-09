import uuid
from sqlalchemy import Column, String, Integer
from app.core.database import Base


class Portfolio(Base):
    __tablename__ = "portfolios"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    service_slug = Column(String(100), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    category = Column(String(255), nullable=True)
    image_url = Column(String(1000), nullable=False)
    link_url = Column(String(1000), nullable=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(String(32), nullable=False)
