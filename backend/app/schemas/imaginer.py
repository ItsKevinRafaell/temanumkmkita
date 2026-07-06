from pydantic import BaseModel


class GenerateCoverResponse(BaseModel):
    article_id: str
    slug: str
    cover_image_url: str
    prompt_used: str


class BulkGenerateProgress(BaseModel):
    total: int
    completed: int
    failed: int
    skipped: int
    results: list[GenerateCoverResponse]
    errors: list[dict[str, str]]
