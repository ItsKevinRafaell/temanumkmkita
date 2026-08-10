"""Lightweight idempotent migrations — jalan otomatis tiap backend start.

PENTING: Base.metadata.create_all() TIDAK menambah kolom ke tabel yang sudah ada.
Jadi kolom baru pada tabel lama HARUS ditambah di sini. Aman diulang tiap boot
(cek kolom dulu sebelum ALTER) dan aman di MySQL lama (tanpa IF NOT EXISTS).
"""
from sqlalchemy import inspect, text

from app.core.database import engine


def _column_exists(inspector, table: str, column: str) -> bool:
    if table not in inspector.get_table_names():
        return False
    return column in {c["name"] for c in inspector.get_columns(table)}


def run_migrations() -> None:
    inspector = inspect(engine)
    with engine.begin() as conn:
        # v7: portfolios.link_url — link ke halaman porto (fitur admin porto->DB)
        if "portfolios" in inspector.get_table_names() and not _column_exists(
            inspector, "portfolios", "link_url"
        ):
            conn.execute(
                text("ALTER TABLE portfolios ADD COLUMN link_url VARCHAR(1000) NULL")
            )
            print("+ portfolios.link_url added")
        else:
            print("= portfolios.link_url ready")


if __name__ == "__main__":
    run_migrations()
