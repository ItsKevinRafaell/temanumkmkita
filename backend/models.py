import uuid
from sqlalchemy import Column, String, Text, Integer, Boolean, Float, ForeignKey
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True)
    username = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(String(255), nullable=False)


class ArticleCategory(Base):
    __tablename__ = "article_categories"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)


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


class ContentPillar(Base):
    __tablename__ = "content_pillars"

    id            = Column(String(36), primary_key=True)
    niche         = Column(String(255), nullable=False)
    name          = Column(String(500), nullable=False)
    description   = Column(Text, nullable=True)
    focus_keyword = Column(String(255), nullable=True)
    position_x    = Column(Float, default=0)
    position_y    = Column(Float, default=0)
    created_at    = Column(Text, nullable=False)


class ContentTopic(Base):
    __tablename__ = "content_topics"

    id            = Column(String(36), primary_key=True)
    pillar_id     = Column(String(36), ForeignKey("content_pillars.id"), nullable=True)
    title         = Column(String(500), nullable=False)
    focus_keyword = Column(String(255), nullable=True)
    search_volume = Column(Integer, nullable=True)
    difficulty    = Column(Integer, nullable=True)
    notes         = Column(Text, nullable=True)
    status        = Column(String(50), default="planned")
    position_x    = Column(Float, default=0)
    position_y    = Column(Float, default=0)
    created_at    = Column(Text, nullable=False)


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id            = Column(String(36), primary_key=True, default="1")
    instagram_url = Column(String(500), nullable=True)
    facebook_url  = Column(String(500), nullable=True)
    linkedin_url  = Column(String(500), nullable=True)
    tiktok_url    = Column(String(500), nullable=True)
    youtube_url   = Column(String(500), nullable=True)
    twitter_url   = Column(String(500), nullable=True)
    address       = Column(String(500), nullable=True)
    phone         = Column(String(100), nullable=True)
    updated_at    = Column(String(255), nullable=True)


class Author(Base):
    __tablename__ = "authors"

    id          = Column(String(36), primary_key=True)
    name        = Column(String(255), nullable=False)
    slug        = Column(String(255), unique=True, nullable=False)
    role        = Column(String(255), nullable=True)
    bio         = Column(Text, nullable=True)
    photo_url   = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    created_at  = Column(String(255), nullable=False)


class IntegrationToken(Base):
    __tablename__ = "integration_tokens"

    id          = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    token_hash  = Column(String(64), unique=True, nullable=False)  # SHA-256 hex
    created_at  = Column(String(255), nullable=False)
