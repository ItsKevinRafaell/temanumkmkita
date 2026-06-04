from pydantic import BaseModel


class TopicBase(BaseModel):
    pillar_id: str | None = None
    title: str
    focus_keyword: str | None = None
    search_volume: int | None = None
    difficulty: int | None = None
    notes: str | None = None
    status: str = "planned"


class TopicCreate(TopicBase):
    pass


class TopicUpdate(BaseModel):
    pillar_id: str | None = None
    title: str | None = None
    focus_keyword: str | None = None
    search_volume: int | None = None
    difficulty: int | None = None
    notes: str | None = None
    status: str | None = None
    position_x: float | None = None
    position_y: float | None = None


class TopicOut(TopicBase):
    id: str
    position_x: float
    position_y: float
    created_at: str
    model_config = {"from_attributes": True}
