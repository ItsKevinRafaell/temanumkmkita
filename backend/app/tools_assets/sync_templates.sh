#!/usr/bin/env bash
# sync_templates.sh — Sync A (A3): master template = SATU sumber, copy ke deployed.
#
# SUMBER (master, satu-satunya yang boleh diedit):
#   /root/.hermes/shared/projects/auto-web-prospek/{templates,render_data}
# TUJUAN (deployed, di repo git — JANGAN edit manual, selalu hasil sync):
#   <repo>/backend/app/tools_assets/{templates,render_data}
#
# ALUR EDIT TEMPLATE:
#   1. Edit di master (auto-web-prospek).
#   2. Jalanin skrip ini: bash sync_templates.sh
#   3. git add + commit + push branch (WAJIB push, per instruksi Kevin).
#
# CATATAN: catalog.py & preview_render.py TIDAK di-sync di sini (beda struktur,
# master ada di mvp/). Yang di-sync: templates/ + render_data/ (konten template).
set -euo pipefail

MASTER="/root/.hermes/shared/projects/auto-web-prospek"
DEST="$(cd "$(dirname "$0")" && pwd)"   # folder tools_assets tempat skrip ini

if [ ! -d "$MASTER/templates" ]; then
  echo "ERROR: master templates ga ketemu di $MASTER/templates" >&2
  exit 1
fi

echo "== Sync templates (master -> deployed) =="
# rsync kalau ada, fallback cp. --delete biar deployed = mirror master.
# EXCLUDE: _REMOVED-* (deprecated) biar ga ke-copy.
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete --exclude='_REMOVED-*' --exclude='_preview-contoh.html' "$MASTER/templates/" "$DEST/templates/"
  rsync -a --delete --exclude='*.py'       "$MASTER/render_data/" "$DEST/render_data/"
else
  rm -rf "$DEST/templates" "$DEST/render_data"
  mkdir -p "$DEST/templates" "$DEST/render_data"
  for d in "$MASTER"/templates/*/; do
    b="$(basename "$d")"
    case "$b" in _REMOVED-*) continue;; esac
    cp -r "$d" "$DEST/templates/$b"
    rm -f "$DEST/templates/$b/_preview-contoh.html"
  done
  for f in "$MASTER"/render_data/*.json; do
    [ -e "$f" ] && cp "$f" "$DEST/render_data/"
  done
fi

N_T=$(find "$DEST/templates" -name index.html | wc -l)
N_R=$(ls "$DEST/render_data"/*.json 2>/dev/null | wc -l)
echo "OK sync: $N_T template, $N_R render_data json."
echo "JANGAN LUPA: git add -A && git commit && git push branch."
