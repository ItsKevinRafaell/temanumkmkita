from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Author(Base):
    __tablename__ = "authors"
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    role = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    photo_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    created_at = Column(String(255), nullable=False)

    articles = relationship("Article", back_populates="author")
