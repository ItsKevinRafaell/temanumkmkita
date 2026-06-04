from pydantic import BaseModel
from app.schemas.author import AuthorOut


class ArticleBase(BaseModel):
    title: str
    slug: str
    excerpt: str | None = None
    content: str
    cover_image: str | None = None
    category: str | None = None
    tags: str | None = "[]"
    status: str | None = "draft"
    featured: bool | None = False
    read_time: int | None = 5
    published_at: str | None = None
    seo_title: str | None = None
    meta_description: str | None = None
    focus_keyword: str | None = None
    pillar_id: str | None = None
    author_id: str | None = None


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_image: str | None = None
    category: str | None = None
    tags: str | None = None
    status: str | None = None
    featured: bool | None = None
    read_time: int | None = None
    published_at: str | None = None
    seo_title: str | None = None
    meta_description: str | None = None
    focus_keyword: str | None = None
    pillar_id: str | None = None
    author_id: str | None = None


class ArticleOut(ArticleBase):
    id: str
    created_at: str
    updated_at: str | None = None
    author: AuthorOut | None = None
    model_config = {"from_attributes": True}


class ArticleSummaryOut(BaseModel):
    id: str
    title: str
    slug: str
    excerpt: str | None = None
    cover_image: str | None = None
    category: str | None = None
    tags: str | None = "[]"
    status: str | None = "draft"
    featured: bool | None = False
    read_time: int | None = 5
    published_at: str | None = None
    created_at: str
    updated_at: str | None = None
    author: AuthorOut | None = None
    model_config = {"from_attributes": True}


class PaginatedArticles(BaseModel):
    items: list[ArticleSummaryOut]
    total: int
    page: int
    per_page: int
    pages: int


class AdminPaginatedArticles(BaseModel):
    items: list[ArticleOut]
    total: int
    page: int
    per_page: int
    pages: int
