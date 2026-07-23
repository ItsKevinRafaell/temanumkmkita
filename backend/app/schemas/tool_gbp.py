from pydantic import BaseModel, field_validator


class GbpProfilIn(BaseModel):
    nama_usaha: str
    jenis_usaha: str
    kota: str
    keunikan: str | None = None

    @field_validator("nama_usaha", "jenis_usaha", "kota")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field tidak boleh kosong")
        return v.strip()[:300]

    @field_validator("keunikan")
    @classmethod
    def optional_text(cls, v: str | None) -> str | None:
        if v is not None:
            v = v.strip()[:500]
            return v if v else None
        return v


class GbpProfilOut(BaseModel):
    deskripsi: str
    keywords: list[str]
    template_review_baik: str
    template_review_buruk: str