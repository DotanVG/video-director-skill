#!/usr/bin/env bash
# Render every version root in versions/ (or those matching $ONLY) to renders/<prefix>-<version>-<aspect>.mp4.
# Each root is copied to index.html (the render entry); index.html is restored by rebuilding at the end.
# Usage: ./render-all.sh            PREFIX=trailer ONLY=B CRF=20 ./render-all.sh
set -e
cd "$(dirname "$0")"
PREFIX="${PREFIX:-video}"; CRF="${CRF:-20}"
node build.mjs
mkdir -p renders
for root in versions/*.html; do
  name=$(basename "$root" .html)
  [ -n "${ONLY:-}" ] && [[ "$name" != *"$ONLY"* ]] && continue
  cp "$root" index.html
  echo "=== rendering $name"
  npx hyperframes render . -o "renders/$PREFIX-$name.mp4" --crf "$CRF" --quiet
done
node build.mjs
echo "done. Next: python <skill>/scripts/master.py renders/$PREFIX-*.mp4"
