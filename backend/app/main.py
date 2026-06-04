from fastapi import FastAPI
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
)

Base.metadata.create_all(bind=engine)

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
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

_uploads_dir = os.path.join(os.path.dirname(__file__), "..", "..", "public", "uploads")
os.makedirs(_uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=_uploads_dir), name="uploads")


@app.get("/")
def root():
    return {"status": "ok", "service": "Teman UMKM Kita API"}
