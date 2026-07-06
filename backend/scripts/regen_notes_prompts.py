"""Regenerate notes column for existing articles dengan prompt generator baru.

Run sekali setelah upgrade prompt_generator:
  cd backend && python3 scripts/regen_notes_prompts.py --dry-run
  cd backend && python3 scripts/regen_notes_prompts.py

Notes lama dipake sebagai "original_prompt" untuk di-strip dari kata tro.
"""

from __future__ import annotations

import argparse
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import Base, SessionLocal, engine  # noqa: E402
from app.models import Article  # noqa: E402

from content_batches.prompt_generator import build_image_alt, build_image_prompt  # noqa: E402

PROMPT_SECTION_RE = re.compile(
    r"##\s*Cover Image Prompt\s*\n+(.*?)(?:\n##|\Z)",
    flags=re.DOTALL,
)


def _extract_original_prompt(notes: str | None) -> str | None:
    """Pull existing prompt from notes (kalau ada)."""
    if not notes:
        return None
    m = PROMPT_SECTION_RE.search(notes)
    if not m:
        return None
    return m.group(1).strip() or None


def _build_new_notes(article: Article) -> str:
    original = _extract_original_prompt(article.notes)
    prompt = build_image_prompt(
        title=article.title,
        slug=article.slug,
        pillar_name=article.category or "",
        focus_keyword=article.focus_keyword or "",
        original_prompt=original,
    )
    alt = build_image_alt(
        title=article.title,
        pillar_name=article.category or "",
        original_alt=None,
        focus_keyword=article.focus_keyword or "",
    )
    return (
        "## Cover Image Prompt\n"
        f"{prompt}\n\n"
        "## Image Alt Text\n"
        f"{alt}"
    ).strip()


def run(dry_run: bool = False) -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        rows = db.query(Article).all()
        touched = 0
        for row in rows:
            new_notes = _build_new_notes(row)
            if (row.notes or "").strip() != new_notes.strip():
                touched += 1
                if dry_run:
                    print(f"[dry-run] would upgrade notes: {row.slug}")
                    continue
                row.notes = new_notes
                print(f"upgraded notes: {row.slug}")
        if not dry_run:
            db.commit()
        print(f"Rows {'would be updated' if dry_run else 'updated'}: {touched}")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    run(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
