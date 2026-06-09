from sqlalchemy import Boolean, Column, String
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
    logo_url = Column(String(500), nullable=True)
    logo_light_url = Column(String(500), nullable=True)
    favicon_url = Column(String(500), nullable=True)
    address = Column(String(500), nullable=True)
    phone = Column(String(100), nullable=True)
    clients_active = Column(String(50), nullable=True)
    projects_completed = Column(String(50), nullable=True)
    founded_year = Column(String(20), nullable=True)
    primary_service_areas = Column(String(255), nullable=True)
    response_time = Column(String(255), nullable=True)
    show_testimonials = Column(Boolean, default=False)
    updated_at = Column(String(255), nullable=True)
