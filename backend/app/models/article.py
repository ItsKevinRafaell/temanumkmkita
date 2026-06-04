from sqlalchemy import Column, String, Text, Integer, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Article(Base):
    __tablename__ = "articles"
    id = Column(String(36), primary_key=True)
    title = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, nullable=False)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    cover_image = Column(String(500), nullable=True)
    category = Column(String(255), nullable=True)
    tags = Column(Text, default="[]")
    status = Column(String(50), default="draft")
    featured = Column(Boolean, default=False)
    read_time = Column(Integer, default=5)
    published_at = Column(String(255), nullable=True)
    created_at = Column(String(255), nullable=False)
    updated_at = Column(String(255), nullable=True)
    seo_title = Column(String(500), nullable=True)
    meta_description = Column(Text, nullable=True)
    focus_keyword = Column(String(255), nullable=True)
    pillar_id = Column(String(36), nullable=True)
    author_id = Column(String(36), ForeignKey("authors.id"), nullable=True)

    author = relationship("Author", back_populates="articles")
