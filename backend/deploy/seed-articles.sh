#!/bin/bash
# Seed SEO articles to TemanUMKMKita database
#
# Usage:
#   cd backend
#   ./deploy/seed-articles.sh              # Seed current month
#   ./deploy/seed-articles.sh --month 2026-07
#   ./deploy/seed-articles.sh --all        # Seed all months
#   ./deploy/seed-articles.sh --dry-run   # Preview without saving

set -euo pipefail

MONTH=""
DRY_RUN=false
SEED_ALL=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --month)
            MONTH="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --all)
            SEED_ALL=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Default to current month if not specified
if [ -z "$MONTH" ] && [ "$SEED_ALL" = false ]; then
    MONTH="2026-07"
fi

echo "=== TemanUMKMKita Article Seed ==="
echo ""

if [ "$DRY_RUN" = true ]; then
    echo "DRY RUN MODE - No changes will be made"
    echo ""
    python scripts/seed_article_drafts.py --dry-run --month "$MONTH" 2>/dev/null || \
        python scripts/seed_article_drafts.py --month "$MONTH" --dry-run
elif [ "$SEED_ALL" = true ]; then
    echo "Seeding ALL months (2026-07 to 2027-12)..."
    echo ""
    for m in 2026-07 2026-08 2026-09 2026-10 2026-11 2026-12 2027-01 2027-02 2027-03 2027-04 2027-05 2027-06; do
        echo ">>> Seeding $m..."
        python scripts/seed_article_drafts.py --month "$m"
        echo ""
    done
else
    echo "Seeding month: $MONTH"
    echo ""
    python scripts/seed_article_drafts.py --month "$MONTH"
fi

echo ""
echo "=== Seed Complete ==="
echo "Check admin panel: https://temanumkmkita.com/admin/posts"
