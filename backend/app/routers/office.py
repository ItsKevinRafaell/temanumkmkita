from fastapi import APIRouter, Request

from app.core.hermes_proxy import proxy_office_request


router = APIRouter(prefix="/api/office", tags=["office"])


@router.get("/health")
async def office_health():
    return {"ok": True, "source": "temanumkmkita"}


@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"])
async def office_proxy(path: str, request: Request):
    return await proxy_office_request(path, request)
