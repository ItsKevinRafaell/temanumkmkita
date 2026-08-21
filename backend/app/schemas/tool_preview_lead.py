from pydantic import BaseModel, field_validator


class PreviewLeadIn(BaseModel):
    """Lead dari tool Preview Bisnis (/tools/preview-bisnis).

    User isi form preview -> lihat preview GBP + simulasi SEO -> tekan CTA
    "kirim versi full / konsultasi" dengan WA/email. Itu = lead.
    """

    nama_usaha: str
    jenis_usaha: str
    kota: str
    wa: str | None = None
    email: str | None = None

    @field_validator("nama_usaha", "jenis_usaha", "kota")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field tidak boleh kosong")
        return v.strip()[:200]

    @field_validator("wa")
    @classmethod
    def clean_wa(cls, v: str | None) -> str | None:
        if v is None:
            return None
        digits = "".join(c for c in v if c.isdigit())
        return digits[:20] if digits else None

    @field_validator("email")
    @classmethod
    def clean_email(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()[:200]
        return v if v else None


class PreviewLeadOut(BaseModel):
    success: bool
    submission_id: str
