from pydantic import BaseModel, field_validator

VALID_SERVICES = {
    "web_development",
    "seo_google_maps",
    "kelola_sosial_media",
    "maintenance_website",
    "desain_logo",
}


class ContactFormIn(BaseModel):
    name: str
    phone: str
    email: str | None = None
    service: str | None = None
    message: str | None = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Nama tidak boleh kosong")
        return v.strip()[:255]

    @field_validator("phone")
    @classmethod
    def phone_not_empty(cls, v: str) -> str:
        digits = "".join(c for c in v if c.isdigit())
        if len(digits) < 8:
            raise ValueError("Nomor WhatsApp tidak valid")
        return v.strip()[:50]

    @field_validator("service")
    @classmethod
    def service_valid(cls, v: str | None) -> str | None:
        if v is None or v == "":
            raise ValueError("Layanan wajib dipilih")
        if v not in VALID_SERVICES:
            raise ValueError(f"Layanan tidak valid: {v}")
        return v

    @field_validator("message")
    @classmethod
    def cap_message(cls, v: str | None) -> str | None:
        return (v or "").strip()[:1000] or None
