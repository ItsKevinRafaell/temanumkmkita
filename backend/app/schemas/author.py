from pydantic import BaseModel


class AuthorBase(BaseModel):
    name: str
    slug: str
    role: str | None = None
    bio: str | None = None
    photo_url: str | None = None
    linkedin_url: str | None = None


class AuthorCreate(AuthorBase):
    pass


class AuthorUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    role: str | None = None
    bio: str | None = None
    photo_url: str | None = None
    linkedin_url: str | None = None


class AuthorOut(AuthorBase):
    id: str
    created_at: str
    model_config = {"from_attributes": True}
