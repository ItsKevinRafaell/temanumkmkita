from pydantic import BaseModel


class SiteSettingsOut(BaseModel):
    id: str
    instagram_url: str | None = None
    facebook_url: str | None = None
    linkedin_url: str | None = None
    tiktok_url: str | None = None
    youtube_url: str | None = None
    twitter_url: str | None = None
    address: str | None = None
    phone: str | None = None
    updated_at: str | None = None
    model_config = {"from_attributes": True}


class SiteSettingsUpdate(BaseModel):
    instagram_url: str | None = None
    facebook_url: str | None = None
    linkedin_url: str | None = None
    tiktok_url: str | None = None
    youtube_url: str | None = None
    twitter_url: str | None = None
    address: str | None = None
    phone: str | None = None
