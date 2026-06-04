from sqlalchemy import Column, String, Text
from app.core.database import Base


class ArticleCategory(Base):
    __tablename__ = "article_categories"
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
