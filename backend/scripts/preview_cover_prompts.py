"""Preview generated cover image prompts untuk 3 sample artikel.

Run:
  cd backend && python3 scripts/preview_cover_prompts.py

Output: 3 sample (title, prompt, alt) supaya lo bisa cek variasi sebelum bulk generate.
"""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from content_batches.batch_2026_07 import ARTICLES


def main() -> None:
    samples = [
        ARTICLES[0],   # Checklist Website UMKM Sebelum Pilih Vendor
        ARTICLES[3],   # Ciri Logo UMKM
        ARTICLES[5],   # Optimasi Google Business Profile
    ]
    for i, article in enumerate(samples, start=1):
        print(f"\n{'=' * 80}\nSAMPLE {i}: {article.title}\n{'=' * 80}")
        print(f"slug         : {article.slug}")
        print(f"category     : {article.category}")
        print(f"pillar_name  : {article.pillar_name}")
        print(f"focus_keyword: {article.focus_keyword}\n")
        print("ORIGINAL prompt (from batch):")
        print(f"  {article.image_prompt}\n")
        # Lazy import so we get the upgraded prompt without the seeder overhead.
        from content_batches.prompt_generator import (
            build_image_alt,
            build_image_prompt,
        )

        upgraded = build_image_prompt(
            title=article.title,
            slug=article.slug,
            pillar_name=article.pillar_name,
            focus_keyword=article.focus_keyword,
            original_prompt=article.image_prompt,
        )
        upgraded_alt = build_image_alt(
            title=article.title,
            pillar_name=article.pillar_name,
            original_alt=article.image_alt,
        )
        print("UPGRADED prompt:")
        print(f"  {upgraded}\n")
        print(f"ALT (upgraded):\n  {upgraded_alt}")


if __name__ == "__main__":
    main()
