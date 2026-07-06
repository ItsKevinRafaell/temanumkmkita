"""Scrub image-prompt leak from existing article rows.

Run once after deploying migration v6_article_notes.sql.

What it does:
  * For every row in `articles`, find the trailing `<p>` block that starts
    with "Catatan untuk cover image:" and:
      - move it (prompt + alt) into `articles.notes`
      - if `notes` is already set, merge with a blank-line separator
      - drop the bogus block from the JSON content array
  * Rows where the body has no such block are left untouched.

Idempotent: re-running after a clean row changes nothing.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import Base, SessionLocal, engine  # noqa: E402
from app.models import Article  # noqa: E402

PROMPT_PREFIX = "Catatan untuk cover image:"


def _split_paragraph(paragraph: str) -> tuple[str | None, str | None]:
    """Extract prompt + alt from the trailing paragraph.

    Returns (prompt, alt) — either may be None if extraction fails.
    """
    prompt_match = re.search(
        r"Catatan untuk cover image:\s*(.*?)\s*(?:Alt text yang disarankan:|$)",
        paragraph,
        flags=re.DOTALL,
    )
    alt_match = re.search(
        r"Alt text yang disarankan:\s*(.+?)\s*\.?\s*$",
        paragraph,
        flags=re.DOTALL,
    )
    prompt = prompt_match.group(1).strip() if prompt_match else None
    alt = alt_match.group(1).strip().rstrip(".") if alt_match else None
    return prompt, alt


def _existing_notes(notes: str | None, prompt: str | None, alt: str | None) -> str:
    parts: list[str] = []
    if notes:
        parts.append(notes.strip())
    extras: list[str] = []
    if prompt:
        extras.append("## Cover Image Prompt")
        extras.append(prompt)
    if alt:
        extras.append("")
        extras.append("## Image Alt Text")
        extras.append(alt)
    if extras:
        if parts:
            parts.append("")
        parts.extend(extras)
    return "\n".join(p for p in parts if p is not None).strip()


def scrub_row(row: Article) -> bool:
    try:
        blocks = json.loads(row.content)
    except (TypeError, ValueError):
        return False

    target_idx: int | None = None
    last_paragraph = ""
    for idx, block in enumerate(blocks):
        if block.get("type") == "p" and isinstance(block.get("text"), str):
            if PROMPT_PREFIX in block["text"]:
                target_idx = idx
                last_paragraph = block["text"]

    if target_idx is None:
        return False

    prompt, alt = _split_paragraph(last_paragraph)
    if prompt is None and alt is None:
        return False

    new_notes = _existing_notes(row.notes, prompt, alt)
    new_blocks = [b for i, b in enumerate(blocks) if i != target_idx]

    row.content = json.dumps(new_blocks, ensure_ascii=False)
    row.notes = new_notes
    return True


def run(dry_run: bool) -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        rows = db.query(Article).all()
        touched = 0
        for row in rows:
            if scrub_row(row):
                touched += 1
                if dry_run:
                    print(f"[dry-run] would scrub: {row.slug}")
                else:
                    print(f"scrubbed: {row.slug}")
        if dry_run:
            db.rollback()
        else:
            db.commit()
        print(f"Rows {'would be updated' if dry_run else 'updated'}: {touched}")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    run(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
