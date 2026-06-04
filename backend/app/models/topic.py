from sqlalchemy import Column, String, Text, Integer, Float, ForeignKey
from app.core.database import Base


class ContentTopic(Base):
    __tablename__ = "content_topics"
    id = Column(String(36), primary_key=True)
    pillar_id = Column(String(36), ForeignKey("content_pillars.id"), nullable=True)
    title = Column(String(500), nullable=False)
    focus_keyword = Column(String(255), nullable=True)
    search_volume = Column(Integer, nullable=True)
    difficulty = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="planned")
    position_x = Column(Float, default=0)
    position_y = Column(Float, default=0)
    created_at = Column(Text, nullable=False)
