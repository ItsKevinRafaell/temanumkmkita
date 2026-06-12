import json
import urllib.error
import urllib.request

from fastapi import HTTPException, Request, Response

from app.core.config import HERMES_GATEWAY_TOKEN, HERMES_GATEWAY_URL


SKIPPED_RESPONSE_HEADERS = {
    "connection",
    "content-length",
    "content-encoding",
    "transfer-encoding",
}


def _gateway_url(path: str, query: str = "") -> str:
    if not HERMES_GATEWAY_URL:
        raise HTTPException(status_code=503, detail="Hermes gateway not configured")
    url = f"{HERMES_GATEWAY_URL.rstrip('/')}/{path.lstrip('/')}"
    return f"{url}?{query}" if query else url


def hermes_login(email: str, password: str) -> dict:
    body = json.dumps({"email": email, "password": password}).encode("utf-8")
    request = urllib.request.Request(
        _gateway_url("/api/auth/login"),
        data=body,
        method="POST",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise HTTPException(status_code=exc.code, detail=detail[:500])
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Hermes gateway unavailable: {exc}")


async def proxy_office_request(path: str, request: Request) -> Response:
    headers: dict[str, str] = {}
    for name in ("accept", "authorization", "content-type"):
        value = request.headers.get(name)
        if value:
            headers[name] = value
    gateway_token = request.headers.get("x-gateway-token") or HERMES_GATEWAY_TOKEN
    if gateway_token:
        headers["x-gateway-token"] = gateway_token

    method = request.method.upper()
    body = None if method in {"GET", "HEAD"} else await request.body()
    upstream = urllib.request.Request(
        _gateway_url(f"/api/office/{path}", request.url.query),
        data=body,
        method=method,
        headers=headers,
    )
    try:
        with urllib.request.urlopen(upstream, timeout=300) as response:
            content = response.read()
            response_headers = {
                key: value
                for key, value in response.headers.items()
                if key.lower() not in SKIPPED_RESPONSE_HEADERS
            }
            return Response(content=content, status_code=response.status, headers=response_headers)
    except urllib.error.HTTPError as exc:
        content = exc.read()
        response_headers = {
            key: value
            for key, value in exc.headers.items()
            if key.lower() not in SKIPPED_RESPONSE_HEADERS
        }
        return Response(content=content, status_code=exc.code, headers=response_headers)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Hermes gateway unavailable: {exc}")
