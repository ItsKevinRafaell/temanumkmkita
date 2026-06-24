#!/bin/bash
# Seed admin user to TemanUMKMKita database
# Run this ONCE after deployment to shared hosting
#
# Usage:
#   cd backend && ./deploy/seed-admin.sh
#   # or with custom credentials:
#   ADMIN_EMAIL=admin@temanumkmkita.com ADMIN_PASSWORD=secret123 ./deploy/seed-admin.sh

set -euo pipefail

ADMIN_EMAIL="${ADMIN_EMAIL:-admin@temanumkmkita.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin123}"
ADMIN_USERNAME="${ADMIN_USERNAME:-admin}"

echo "=== TemanUMKMKita Admin Seed ==="
echo "Email: $ADMIN_EMAIL"
echo "Username: $ADMIN_USERNAME"
echo ""

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL" .env 2>/dev/null; then
    echo "ERROR: .env file not found or DATABASE_URL not set"
    exit 1
fi

# Run the seed script
echo "Running seed script..."
python scripts/seed_admin_noninteractive.py

echo ""
echo "=== Seed Complete ==="
echo "Login at: https://temanumkmkita.com/admin/login"
