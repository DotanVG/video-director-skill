#!/usr/bin/env bash
# Install the video-director skill for Claude Code (macOS, Linux, Git Bash on Windows).
# Usage: ./install.sh            (user-level: ~/.claude/skills)
#        ./install.sh --project  (project-level: ./.claude/skills)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
dest="$HOME/.claude/skills"
[ "${1:-}" = "--project" ] && dest="$(pwd)/.claude/skills"
mkdir -p "$dest"
rm -rf "$dest/video-director"
cp -r "$here/video-director" "$dest/video-director"
echo "installed: $dest/video-director"

echo "installing / refreshing the HyperFrames skills it builds on..."
npx --yes hyperframes skills update || echo "warning: could not update HyperFrames skills (run: npx hyperframes skills update)"

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
echo "done. Restart Claude Code so the skill loads."
