from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import articles, categories

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


@app.get("/")
def root():
    return {"status": "ok", "service": "Teman UMKM Kita API"}
