import io
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from auth import require_auth

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "uploads")
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB

API_BASE = os.getenv("API_BASE_URL", "https://api.temanumkmkita.com")


def _to_webp(content: bytes) -> bytes:
    try:
        from PIL import Image
        img = Image.open(io.BytesIO(content))
        # Preserve transparency for RGBA/P images
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
        out = io.BytesIO()
        img.save(out, format="WEBP", quality=85, method=4)
        return out.getvalue()
    except Exception:
        return content  # fallback: return original if Pillow fails


@router.post("")
async def upload_image(
    file: UploadFile = File(...),
    _: str = Depends(require_auth),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Hanya jpeg, png, webp, gif yang diizinkan")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="Ukuran file maksimal 5MB")

    webp_content = _to_webp(content)
    filename = f"{uuid.uuid4()}.webp"

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(webp_content)

    return {"url": f"{API_BASE}/uploads/{filename}"}
