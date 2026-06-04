from sqlalchemy import Column, String, Text, Float
from app.core.database import Base


class ContentPillar(Base):
    __tablename__ = "content_pillars"
    id = Column(String(36), primary_key=True)
    niche = Column(String(255), nullable=False)
    name = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    focus_keyword = Column(String(255), nullable=True)
    position_x = Column(Float, default=0)
    position_y = Column(Float, default=0)
    created_at = Column(Text, nullable=False)
