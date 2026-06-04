from pydantic import BaseModel


class PortfolioBase(BaseModel):
    service_slug: str
    title: str
    category: str | None = None
    image_url: str
    sort_order: int = 0


class PortfolioCreate(PortfolioBase):
    pass


class PortfolioUpdate(BaseModel):
    service_slug: str | None = None
    title: str | None = None
    category: str | None = None
    image_url: str | None = None
    sort_order: int | None = None


class PortfolioOut(PortfolioBase):
    id: str
    created_at: str
    model_config = {"from_attributes": True}
