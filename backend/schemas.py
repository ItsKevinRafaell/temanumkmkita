from pydantic import BaseModel
from typing import Optional, List


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
    featured: Optional[bool] = False
    read_time: Optional[int] = 5
    published_at: Optional[str] = None
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    focus_keyword: Optional[str] = None


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
    featured: Optional[bool] = None
    read_time: Optional[int] = None
    published_at: Optional[str] = None
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    focus_keyword: Optional[str] = None


class ArticleOut(ArticleBase):
    id: str
    created_at: str
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}


class PaginatedArticles(BaseModel):
    items: List[ArticleOut]
    total: int
    page: int
    per_page: int
    pages: int


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: str
    username: str
    created_at: str

    model_config = {"from_attributes": True}
