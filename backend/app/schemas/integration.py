from pydantic import BaseModel


class IntegrationTokenOut(BaseModel):
    id: str
    created_at: str
    token_prefix: str
    model_config = {"from_attributes": True}


class IntegrationTokenCreate(BaseModel):
    pass
