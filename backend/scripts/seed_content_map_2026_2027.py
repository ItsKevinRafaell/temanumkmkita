"""
Seed content taxonomy, pillars, and 120 planned topics for 2026-2027.

Usage:
  cd backend
  python scripts/seed_content_map_2026_2027.py --dry-run
  python scripts/seed_content_map_2026_2027.py

This script is idempotent by category slug, pillar name, and topic title.
It does not delete old categories, pillars, topics, or articles.
"""

from __future__ import annotations

import argparse
import os
import sys
import uuid


sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, os.path.dirname(__file__))

from content_calendar_2026_2027 import CATEGORIES, PILLARS, TOPICS


def dry_run() -> None:
    print(f"Categories: {len(CATEGORIES)}")
    print(f"Pillars: {len(PILLARS)}")
    print(f"Topics: {len(TOPICS)}")
    print(f"First topic: {TOPICS[0].publish_date} - {TOPICS[0].title}")
    print(f"Last topic: {TOPICS[-1].publish_date} - {TOPICS[-1].title}")


def seed() -> None:
    from app.core.database import Base, SessionLocal, engine
    from app.core.utils import now_iso
    from app.models import ArticleCategory, ContentPillar, ContentTopic

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        created_categories = 0
        updated_categories = 0
        for item in CATEGORIES:
            row = db.query(ArticleCategory).filter(ArticleCategory.slug == item.slug).first()
            if row:
                row.name = item.name
                updated_categories += 1
            else:
                db.add(ArticleCategory(id=str(uuid.uuid4()), name=item.name, slug=item.slug))
                created_categories += 1

        db.flush()

        pillar_by_key = {}
        created_pillars = 0
        updated_pillars = 0
        for item in PILLARS:
            row = db.query(ContentPillar).filter(ContentPillar.name == item.name).first()
            if row:
                row.niche = item.niche
                row.description = item.description
                row.focus_keyword = item.focus_keyword
                row.position_x = item.position_x
                row.position_y = item.position_y
                updated_pillars += 1
            else:
                row = ContentPillar(
                    id=str(uuid.uuid4()),
                    niche=item.niche,
                    name=item.name,
                    description=item.description,
                    focus_keyword=item.focus_keyword,
                    position_x=item.position_x,
                    position_y=item.position_y,
                    created_at=now_iso(),
                )
                db.add(row)
                created_pillars += 1
            pillar_by_key[item.key] = row

        db.flush()

        created_topics = 0
        updated_topics = 0
        for i, item in enumerate(TOPICS):
            pillar = pillar_by_key[item.pillar_key]
            notes = (
                f"Publish date: {item.publish_date}\n"
                f"Category: {item.category}\n"
                f"Intent: {item.intent}\n"
                f"CTA: {item.cta}\n"
                "Source: CONTENT_SEO_2026_2027.md"
            )
            row = db.query(ContentTopic).filter(ContentTopic.title == item.title).first()
            if row:
                row.pillar_id = pillar.id
                row.focus_keyword = item.focus_keyword
                row.notes = notes
                row.status = "planned"
                row.position_x = pillar.position_x - 120 + (i % 4) * 90
                row.position_y = pillar.position_y + 180 + (i // 4) * 70
                updated_topics += 1
            else:
                db.add(ContentTopic(
                    id=str(uuid.uuid4()),
                    pillar_id=pillar.id,
                    title=item.title,
                    focus_keyword=item.focus_keyword,
                    search_volume=None,
                    difficulty=None,
                    notes=notes,
                    status="planned",
                    position_x=pillar.position_x - 120 + (i % 4) * 90,
                    position_y=pillar.position_y + 180 + (i // 4) * 70,
                    created_at=now_iso(),
                ))
                created_topics += 1

        db.commit()
        print(f"Categories created/updated: {created_categories}/{updated_categories}")
        print(f"Pillars created/updated: {created_pillars}/{updated_pillars}")
        print(f"Topics created/updated: {created_topics}/{updated_topics}")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print seed summary without importing app config or touching DB.")
    args = parser.parse_args()
    if args.dry_run:
        dry_run()
        return
    seed()


if __name__ == "__main__":
    main()
