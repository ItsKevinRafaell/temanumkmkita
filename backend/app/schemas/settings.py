from pydantic import BaseModel


class SiteSettingsOut(BaseModel):
    id: str
    instagram_url: str | None = None
    facebook_url: str | None = None
    linkedin_url: str | None = None
    tiktok_url: str | None = None
    youtube_url: str | None = None
    twitter_url: str | None = None
    logo_url: str | None = None
    logo_light_url: str | None = None
    favicon_url: str | None = None
    address: str | None = None
    phone: str | None = None
    clients_active: str | None = None
    projects_completed: str | None = None
    founded_year: str | None = None
    primary_service_areas: str | None = None
    response_time: str | None = None
    show_testimonials: bool | None = False
    updated_at: str | None = None
    model_config = {"from_attributes": True}


class SiteSettingsUpdate(BaseModel):
    instagram_url: str | None = None
    facebook_url: str | None = None
    linkedin_url: str | None = None
    tiktok_url: str | None = None
    youtube_url: str | None = None
    twitter_url: str | None = None
    logo_url: str | None = None
    logo_light_url: str | None = None
    favicon_url: str | None = None
    address: str | None = None
    phone: str | None = None
    clients_active: str | None = None
    projects_completed: str | None = None
    founded_year: str | None = None
    primary_service_areas: str | None = None
    response_time: str | None = None
    show_testimonials: bool | None = False
