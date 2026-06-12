"""
Idempotent migration for admin email and password reset tokens.
Usage: cd backend && python scripts/migrate_v5_password_reset.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import inspect, text

from app.core.database import engine


def _table_exists(inspector, table_name: str) -> bool:
    return table_name in inspector.get_table_names()


def _column_exists(inspector, table_name: str, column_name: str) -> bool:
    if not _table_exists(inspector, table_name):
        return False
    return column_name in {column["name"] for column in inspector.get_columns(table_name)}


def _index_exists(inspector, table_name: str, index_name: str) -> bool:
    if not _table_exists(inspector, table_name):
        return False
    return index_name in {index["name"] for index in inspector.get_indexes(table_name)}


def main() -> None:
    inspector = inspect(engine)
    with engine.begin() as conn:
        if _table_exists(inspector, "users") and not _column_exists(inspector, "users", "email"):
            conn.execute(text("ALTER TABLE users ADD COLUMN email VARCHAR(255) NULL"))
            print("+ users.email added")
        else:
            print("= users.email ready")

        inspector = inspect(engine)
        if _table_exists(inspector, "users") and not _index_exists(inspector, "users", "uq_users_email"):
            conn.execute(text("CREATE UNIQUE INDEX uq_users_email ON users (email)"))
            print("+ uq_users_email added")
        else:
            print("= uq_users_email ready")

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id VARCHAR(36) NOT NULL,
                user_id VARCHAR(36) NOT NULL,
                token_hash VARCHAR(64) NOT NULL,
                expires_at VARCHAR(255) NOT NULL,
                used_at VARCHAR(255) NULL,
                created_at VARCHAR(255) NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY uq_password_reset_token_hash (token_hash),
                KEY idx_password_reset_user_id (user_id),
                KEY idx_password_reset_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """))
        print("= password_reset_tokens ready")


if __name__ == "__main__":
    main()
