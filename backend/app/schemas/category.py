from pydantic import BaseModel


class ArticleCategoryBase(BaseModel):
    name: str
    slug: str


class ArticleCategoryOut(ArticleCategoryBase):
    id: str
    model_config = {"from_attributes": True}


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
