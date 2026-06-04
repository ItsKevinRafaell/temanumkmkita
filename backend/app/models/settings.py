from sqlalchemy import Column, String
from app.core.database import Base


class SiteSettings(Base):
    __tablename__ = "site_settings"
    id = Column(String(36), primary_key=True, default="1")
    instagram_url = Column(String(500), nullable=True)
    facebook_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    tiktok_url = Column(String(500), nullable=True)
    youtube_url = Column(String(500), nullable=True)
    twitter_url = Column(String(500), nullable=True)
    address = Column(String(500), nullable=True)
    phone = Column(String(100), nullable=True)
    updated_at = Column(String(255), nullable=True)
