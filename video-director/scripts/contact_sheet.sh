#!/usr/bin/env bash
# Timestamped contact sheet of a video.
# Usage: contact_sheet.sh <video> [fps=1] [cols=6] [tile_width=384] [out.jpg] [start=0] [duration=all]
# Examples:
#   contact_sheet.sh clip.mp4                 # 1 frame per second, whole clip
#   contact_sheet.sh clip.mp4 5 4 640 sheet.jpg 32.4 4   # 5 fps around a moment
set -euo pipefail
in="$1"; fps="${2:-1}"; cols="${3:-6}"; w="${4:-384}"
out="${5:-${in%.*}_sheet.jpg}"; ss="${6:-0}"; dur="${7:-}"

# A bold font for the timestamp, per OS.
font=""
for f in "C:/Windows/Fonts/arialbd.ttf" "/System/Library/Fonts/Supplemental/Arial Bold.ttf" \
         "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"; do
  [ -f "$f" ] && font="$f" && break
done
fontarg=""
if [ -n "$font" ]; then fontarg="fontfile='$(echo "$font" | sed 's/:/\\:/')':"; fi

total=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
span="${dur:-$(python -c "print(max(0.1, $total - $ss))")}"
n=$(python -c "import math; print(max(1, math.ceil($span * $fps)))")
rows=$(python -c "import math; print(max(1, math.ceil($n / $cols)))")
durarg=(); [ -n "$dur" ] && durarg=(-t "$dur")

ffmpeg -v error -y -ss "$ss" "${durarg[@]}" -i "$in" -copyts \
  -vf "fps=$fps,scale=$w:-1,drawtext=${fontarg}text='%{pts\:hms}':x=6:y=6:fontsize=$((w/18)):fontcolor=yellow:box=1:boxcolor=black@0.6,tile=${cols}x${rows}:padding=4" \
  -frames:v 1 "$out"
echo "$out ($n frames, ${cols}x${rows})"
