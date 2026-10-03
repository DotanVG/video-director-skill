#!/usr/bin/env bash
# Install the video-director skill for Claude Code (macOS, Linux, Git Bash on Windows).
#
# Usage: ./install.sh [options]
#   --project            install into ./.claude/skills instead of ~/.claude/skills
#   --skip-hyperframes   do not install or update the HyperFrames skills (do it yourself later)
#   --latest             use the latest HyperFrames instead of the tested, pinned version
#   --no-telemetry       turn off HyperFrames' anonymous usage telemetry (persists in ~/.hyperframes)
#   -y, --yes            do not ask before installing the HyperFrames skills
#
# What it changes on your machine:
#   - copies video-director/ into the skills folder; an existing copy is moved to
#     ~/.claude/skill-backups/ first (outside the skills folder, so it does not load twice)
#   - unless --skip-hyperframes: runs "npx hyperframes@<version> skills update", which installs or
#     updates the HyperFrames skills for the AI coding tools it detects and removes HyperFrames
#     skills that are no longer published. Nothing else is installed.
set -euo pipefail
HF_VERSION="0.8.114"   # tested with this HyperFrames release

here="$(cd "$(dirname "$0")" && pwd)"
dest="$HOME/.claude/skills"; skip_hf=0; latest=0; no_tel=0; yes=0
for arg in "$@"; do
  case "$arg" in
    --project) dest="$(pwd)/.claude/skills" ;;
    --skip-hyperframes) skip_hf=1 ;;
    --latest) latest=1 ;;
    --no-telemetry) no_tel=1 ;;
    -y|--yes) yes=1 ;;
    -h|--help) sed -n '2,16p' "$0"; exit 0 ;;
    *) echo "unknown option: $arg (see --help)"; exit 1 ;;
  esac
done
hf="hyperframes@$HF_VERSION"; [ "$latest" = 1 ] && hf="hyperframes@latest"

mkdir -p "$dest"
if [ -e "$dest/video-director" ]; then
  backup="$HOME/.claude/skill-backups/video-director-$(date +%Y%m%d-%H%M%S)"
  mkdir -p "$(dirname "$backup")"
  mv "$dest/video-director" "$backup"
  echo "existing copy moved to: $backup"
fi
cp -r "$here/video-director" "$dest/video-director"
echo "installed: $dest/video-director"

if [ "$no_tel" = 1 ]; then
  export HYPERFRAMES_NO_TELEMETRY=1
  npx --yes "$hf" telemetry disable >/dev/null 2>&1 && echo "HyperFrames telemetry: disabled" \
    || echo "warning: could not disable telemetry (set HYPERFRAMES_NO_TELEMETRY=1 in your shell)"
fi

if [ "$skip_hf" = 1 ]; then
  echo "skipped HyperFrames skills. Install them later with: npx $hf skills update"
else
  go=1
  if [ "$yes" = 0 ] && [ -t 0 ]; then
    echo "video-director needs the HyperFrames skills. This runs: npx $hf skills update"
    echo "(installs/updates HyperFrames skills for the AI tools it detects, removes unpublished ones)"
    read -r -p "Continue? [Y/n] " ans
    case "$ans" in [nN]*) go=0 ;; esac
  fi
  if [ "$go" = 1 ]; then
    npx --yes "$hf" skills update || echo "warning: could not update HyperFrames skills (run: npx $hf skills update)"
  else
    echo "skipped. Install them later with: npx $hf skills update"
  fi
fi

echo "checking tools..."
command -v ffmpeg >/dev/null && echo "  ffmpeg ok" || echo "  missing ffmpeg (https://ffmpeg.org/download.html)"
command -v node >/dev/null && echo "  node $(node --version)" || echo "  missing Node.js 22+"
py=""
for c in python3 python; do
  if command -v "$c" >/dev/null && "$c" -c "import sys" >/dev/null 2>&1; then py="$c"; break; fi
done
if [ -n "$py" ]; then
  "$py" -c "import numpy" 2>/dev/null && echo "  numpy ok" || echo "  optional: $py -m pip install --user numpy"
  "$py" -c "import fontTools, brotli" 2>/dev/null && echo "  fonttools ok" || echo "  optional: $py -m pip install --user fonttools brotli"
else
  echo "  missing Python 3 (needed for the helper scripts)"
fi
if [ "$no_tel" = 0 ]; then
  echo "note: HyperFrames sends anonymous usage telemetry by default. Turn it off with"
  echo "      npx $hf telemetry disable   (or set HYPERFRAMES_NO_TELEMETRY=1 or DO_NOT_TRACK=1)"
fi
echo "done. Restart Claude Code so the skill loads."
