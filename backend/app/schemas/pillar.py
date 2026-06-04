from pydantic import BaseModel


class PillarBase(BaseModel):
    niche: str
    name: str
    description: str | None = None
    focus_keyword: str | None = None


class PillarCreate(PillarBase):
    pass


class PillarUpdate(BaseModel):
    niche: str | None = None
    name: str | None = None
    description: str | None = None
    focus_keyword: str | None = None
    position_x: float | None = None
    position_y: float | None = None


class PillarOut(PillarBase):
    id: str
    position_x: float
    position_y: float
    created_at: str
    model_config = {"from_attributes": True}
