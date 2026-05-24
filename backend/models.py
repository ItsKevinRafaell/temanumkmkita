from sqlalchemy import Column, String, Text, Integer, Boolean
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
