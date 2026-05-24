import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from auth import require_auth

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "uploads")
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB

API_BASE = os.getenv("API_BASE_URL", "https://api.temanumkmkita.com")


@router.post("")
async def upload_image(
    file: UploadFile = File(...),
    _: str = Depends(require_auth),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Hanya jpeg, png, webp yang diizinkan")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="Ukuran file maksimal 5MB")

    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(content)

    return {"url": f"{API_BASE}/uploads/{filename}"}
