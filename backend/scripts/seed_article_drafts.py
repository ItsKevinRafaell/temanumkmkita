"""
Seed generated article drafts into the CMS.

Usage:
  cd backend
  python scripts/seed_article_drafts.py --list
  python scripts/seed_article_drafts.py --month 2026-07 --dry-run
  python scripts/seed_article_drafts.py --month 2026-07
  python scripts/seed_article_drafts.py --all

Seeder policy:
  - Seeds one selected month.
  - Creates articles as draft only.
  - Skips existing slugs.
  - Uses first author by name if available.
  - Resolves pillar by name if available.
"""

from __future__ import annotations

import argparse
import importlib
import json
import os
import sys
import uuid


sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, os.path.dirname(__file__))

from content_batches.common import ArticleDraft, build_blocks, words_in_blocks
from content_batches.generated import build_generated_month
from content_calendar_2026_2027 import MONTH_TOPICS, TOPICS


AVAILABLE_BATCHES = {
    "2026-07": "content_batches.batch_2026_07",
}


def load_batch(month: str) -> list[ArticleDraft]:
    module_name = AVAILABLE_BATCHES.get(month)
    if not module_name:
        if month in MONTH_TOPICS:
            return build_generated_month(month)
        known = ", ".join(sorted(MONTH_TOPICS))
        raise SystemExit(f"Unknown month '{month}'. Available: {known}")
    module = importlib.import_module(module_name)
    articles = getattr(module, "ARTICLES", None)
    if not isinstance(articles, list):
        raise SystemExit(f"Batch {module_name} does not expose ARTICLES list")
    return articles


def list_batches() -> None:
    for month in sorted(MONTH_TOPICS):
        articles = load_batch(month)
        mode = "curated" if month in AVAILABLE_BATCHES else "generated"
        print(f"{month}: {len(articles)} drafts ({mode})")


def dry_run(month: str) -> None:
    articles = load_batch(month)
    schedule = schedule_by_title(month)
    print(f"Month: {month}")
    print(f"Drafts: {len(articles)}")
    for i, article in enumerate(articles, start=1):
        blocks = build_blocks(article)
        word_count = words_in_blocks(blocks)
        publish_date = schedule.get(article.title, "unscheduled")
        print(
            f"{i:02d}. {article.slug} | {article.category} | "
            f"{publish_date} | {word_count} words | CTA {article.target_cta}"
        )


def schedule_by_title(month: str) -> dict[str, str]:
    return {
        topic.title: topic.publish_date
        for topic in TOPICS
        if topic.publish_date.startswith(f"{month}-")
    }


def scheduled_at(publish_date: str | None) -> str | None:
    if not publish_date:
        return None
    return f"{publish_date}T00:00:00+00:00"


def seed(month: str) -> None:
    from sqlalchemy import asc

    from app.core.database import Base, SessionLocal, engine
    from app.core.utils import now_iso
    from app.models import Article, Author, ContentPillar

    articles = load_batch(month)
    schedule = schedule_by_title(month)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        author = db.query(Author).order_by(asc(Author.name)).first()
        created = 0
        skipped = 0
        scheduled = 0
        for article in articles:
            planned_publish_at = scheduled_at(schedule.get(article.title))
            existing = db.query(Article).filter(Article.slug == article.slug).first()
            if existing:
                if not existing.published_at and planned_publish_at:
                    existing.published_at = planned_publish_at
                    scheduled += 1
                    print(f"update schedule: {article.slug} -> {planned_publish_at[:10]}")
                else:
                    print(f"skip existing: {article.slug}")
                skipped += 1
                continue

            pillar = db.query(ContentPillar).filter(ContentPillar.name == article.pillar_name).first()
            blocks = build_blocks(article)
            row = Article(
                id=str(uuid.uuid4()),
                title=article.title,
                slug=article.slug,
                excerpt=article.excerpt,
                content=json.dumps(blocks, ensure_ascii=False),
                cover_image=None,
                category=article.category,
                tags=json.dumps(article.tags, ensure_ascii=False),
                status="draft",
                pillar_id=pillar.id if pillar else None,
                author_id=author.id if author else None,
                featured=False,
                read_time=article.read_time,
                published_at=planned_publish_at,
                created_at=now_iso(),
                updated_at=None,
                seo_title=article.seo_title,
                meta_description=article.meta_description,
                focus_keyword=article.focus_keyword,
            )
            db.add(row)
            created += 1
            print(f"create draft: {article.slug}")

        db.commit()
        author_note = author.slug if author else "none"
        print(f"Month: {month}")
        print(f"Created/skipped/scheduled: {created}/{skipped}/{scheduled}")
        print(f"Author: {author_note}")
    finally:
        db.close()


def seed_all(dry_run_only: bool = False) -> None:
    for month in sorted(MONTH_TOPICS):
        print("")
        if dry_run_only:
            dry_run(month)
        else:
            seed(month)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--list", action="store_true", help="List available monthly batches.")
    parser.add_argument("--month", help="Month to seed, e.g. 2026-07.")
    parser.add_argument("--all", action="store_true", help="Seed every monthly batch in the 2026-2027 calendar.")
    parser.add_argument("--dry-run", action="store_true", help="Preview selected month without importing app config or touching DB.")
    args = parser.parse_args()

    if args.list:
        list_batches()
        return
    if args.all:
        seed_all(dry_run_only=args.dry_run)
        return
    if not args.month:
        parser.error("--month is required unless --list or --all is used")
    if args.dry_run:
        dry_run(args.month)
        return
    seed(args.month)


if __name__ == "__main__":
    main()
