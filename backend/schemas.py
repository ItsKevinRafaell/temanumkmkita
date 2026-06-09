from pydantic import BaseModel
from typing import Optional, List


class ArticleCategoryBase(BaseModel):
    name: str
    slug: str


class ArticleCategoryOut(ArticleCategoryBase):
    id: str

    model_config = {"from_attributes": True}


# ── Authors (defined early — ArticleOut references AuthorOut) ─────────────────

class AuthorBase(BaseModel):
    name: str
    slug: str
    role: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None


class AuthorCreate(AuthorBase):
    pass


class AuthorUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None


class AuthorOut(AuthorBase):
    id: str
    created_at: str

    model_config = {"from_attributes": True}


# ── Articles ───────────────────────────────────────────────────────────────────

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
    pillar_id: Optional[str] = None
    author_id: Optional[str] = None


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
    pillar_id: Optional[str] = None
    author_id: Optional[str] = None


class ArticleOut(ArticleBase):
    id: str
    created_at: str
    updated_at: Optional[str] = None
    author: Optional[AuthorOut] = None

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


# ── Content Pillars ────────────────────────────────────────────────────────────

class PillarBase(BaseModel):
    niche: str
    name: str
    description: Optional[str] = None
    focus_keyword: Optional[str] = None


class PillarCreate(PillarBase):
    pass


class PillarUpdate(BaseModel):
    niche: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    focus_keyword: Optional[str] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None


class PillarOut(PillarBase):
    id: str
    position_x: float
    position_y: float
    created_at: str

    model_config = {"from_attributes": True}


# ── Content Topics ─────────────────────────────────────────────────────────────

class TopicBase(BaseModel):
    pillar_id: Optional[str] = None
    title: str
    focus_keyword: Optional[str] = None
    search_volume: Optional[int] = None
    difficulty: Optional[int] = None
    notes: Optional[str] = None
    status: str = "planned"


class TopicCreate(TopicBase):
    pass


class TopicUpdate(BaseModel):
    pillar_id: Optional[str] = None
    title: Optional[str] = None
    focus_keyword: Optional[str] = None
    search_volume: Optional[int] = None
    difficulty: Optional[int] = None
    notes: Optional[str] = None
    status: Optional[str] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None


class TopicOut(TopicBase):
    id: str
    position_x: float
    position_y: float
    created_at: str

    model_config = {"from_attributes": True}


# ── Site Settings ──────────────────────────────────────────────────────────────

class SiteSettingsOut(BaseModel):
    id: str
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    tiktok_url: Optional[str] = None
    youtube_url: Optional[str] = None
    twitter_url: Optional[str] = None
    logo_url: Optional[str] = None
    logo_light_url: Optional[str] = None
    favicon_url: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    clients_active: Optional[str] = None
    projects_completed: Optional[str] = None
    founded_year: Optional[str] = None
    primary_service_areas: Optional[str] = None
    response_time: Optional[str] = None
    show_testimonials: Optional[bool] = False
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}


class SiteSettingsUpdate(BaseModel):
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    tiktok_url: Optional[str] = None
    youtube_url: Optional[str] = None
    twitter_url: Optional[str] = None
    logo_url: Optional[str] = None
    logo_light_url: Optional[str] = None
    favicon_url: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    clients_active: Optional[str] = None
    projects_completed: Optional[str] = None
    founded_year: Optional[str] = None
    primary_service_areas: Optional[str] = None
    response_time: Optional[str] = None
    show_testimonials: Optional[bool] = False


# ── Integration Token ──────────────────────────────────────────────────────────

class IntegrationTokenOut(BaseModel):
    id: str
    created_at: str
    token_prefix: str  # first 8 chars of plain token for display

    model_config = {"from_attributes": True}


class IntegrationTokenCreate(BaseModel):
    pass  # no input needed


# ── Portfolio ──────────────────────────────────────────────────────────────────

class PortfolioBase(BaseModel):
    service_slug: str
    title: str
    category: Optional[str] = None
    image_url: str
    sort_order: int = 0


class PortfolioCreate(PortfolioBase):
    pass


class PortfolioUpdate(BaseModel):
    service_slug: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = None


class PortfolioOut(PortfolioBase):
    id: str
    created_at: str

    model_config = {"from_attributes": True}
