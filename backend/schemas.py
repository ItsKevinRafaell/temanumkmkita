from pydantic import BaseModel
from typing import Optional


class ArticleCategoryBase(BaseModel):
    name: str
    slug: str


class ArticleCategoryOut(ArticleCategoryBase):
    id: str

    model_config = {"from_attributes": True}


class ArticleBase(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: str
    cover_image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = "[]"
    status: Optional[str] = "draft"
    published_at: Optional[str] = None


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    status: Optional[str] = None
    published_at: Optional[str] = None


class ArticleOut(ArticleBase):
    id: str
    created_at: str
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}
