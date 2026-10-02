#!/usr/bin/env bash
# High-quality GIF from a video segment (two-pass palette).
# Usage: make_gif.sh <in.mp4> <start_s> <duration_s> [width=640] [fps=12] [out.gif]
# Width is the output width; height follows the aspect. Use 480-640 for 16:9, 270-360 for 9:16.
set -euo pipefail
in="$1"; ss="$2"; dur="$3"; w="${4:-640}"; fps="${5:-12}"; out="${6:-${in%.*}-${ss}s.gif}"
pal="$(mktemp -u).png"
ffmpeg -v error -y -ss "$ss" -t "$dur" -i "$in" -vf "fps=$fps,scale=$w:-1:flags=lanczos,palettegen=stats_mode=diff" "$pal"
ffmpeg -v error -y -ss "$ss" -t "$dur" -i "$in" -i "$pal" \
  -lavfi "fps=$fps,scale=$w:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" "$out"
rm -f "$pal"
echo "$out $(du -h "$out" | cut -f1)"
