from sqlalchemy import Column, String, Text, Integer, Boolean, Float, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.core.database import Base


class Article(Base):
    __tablename__ = "articles"

    # Primary key
    id = Column(String(36), primary_key=True)

    # Content fields
    title = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, nullable=False)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    cover_image = Column(String(500), nullable=True)

    # Categorization fields (indexed for filtering)
    category = Column(String(255), nullable=True, index=True)
    tags = Column(Text, default="[]")
    status = Column(String(50), default="draft", index=True)
    pillar_id = Column(String(36), nullable=True, index=True)

    # Author reference (indexed for joins)
    author_id = Column(String(36), ForeignKey("authors.id"), nullable=True, index=True)

    # Metrics
    featured = Column(Boolean, default=False)
    read_time = Column(Integer, default=5)

    # Timestamps (indexed for sorting)
    published_at = Column(String(255), nullable=True, index=True)
    created_at = Column(String(255), nullable=False)
    updated_at = Column(String(255), nullable=True)

    # SEO fields
    seo_title = Column(String(500), nullable=True)
    meta_description = Column(Text, nullable=True)
    focus_keyword = Column(String(255), nullable=True)

    # Relationships
    author = relationship("Author", back_populates="articles")

    # Composite indexes for common query patterns
    __table_args__ = (
        Index("ix_articles_published_status", "published_at", "status"),
        Index("ix_articles_author_category", "author_id", "category"),
    )
