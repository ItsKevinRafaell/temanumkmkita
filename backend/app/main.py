from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.database import engine, Base
from app.routers import (
    articles,
    categories,
    auth,
    uploads,
    pillars,
    topics,
    settings,
    authors,
    integration,
    portfolios,
    contact,
    office,
    imaginer,
    tools,
)

Base.metadata.create_all(bind=engine)

# Idempotent column migrations (create_all tidak menambah kolom ke tabel lama)
from app.core.migrate import run_migrations
run_migrations()

app = FastAPI(
    title="Teman UMKM Kita API",
    description="Blog CMS API untuk temanumkmkita.com",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://temanumkmkita.com",
        "https://www.temanumkmkita.com",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    if request.url.scheme == "https":
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    return response

app.include_router(articles.router)
app.include_router(categories.router)
app.include_router(auth.router)
app.include_router(uploads.router)
app.include_router(pillars.router)
app.include_router(topics.router)
app.include_router(settings.router)
app.include_router(authors.router)
app.include_router(integration.router)
app.include_router(portfolios.router)
app.include_router(contact.router)
app.include_router(office.router)
app.include_router(imaginer.router)
app.include_router(tools.router)

_uploads_dir = os.path.join(os.path.dirname(__file__), "..", "..", "public", "uploads")
os.makedirs(_uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=_uploads_dir), name="uploads")


@app.get("/")
def root():
    return {"status": "ok", "service": "Teman UMKM Kita API"}
