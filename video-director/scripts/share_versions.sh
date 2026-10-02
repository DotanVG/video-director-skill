#!/usr/bin/env bash
# Light share copies (WhatsApp, Discord, Telegram, email) of every MP4 in a folder.
# Usage: share_versions.sh <renders_dir> [height=480] [crf=26]
# Landscape files become <h*16/9>x<h>, portrait files <h>x<h*16/9>, square stays square.
# Output: <renders_dir>/share-<h>p/<name>-<h>p.mp4  (H.264 main, AAC 96k, faststart; about 3 MB per 30 s at 480p)
set -euo pipefail
dir="$1"; h="${2:-480}"; crf="${3:-26}"
out="$dir/share-${h}p"; mkdir -p "$out"
for f in "$dir"/*.mp4; do
  [ -e "$f" ] || continue
  b=$(basename "$f" .mp4)
  W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$f" | tr -dc '0-9')
  H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$f" | tr -dc '0-9')
  if [ "$W" -gt "$H" ]; then sc="-2:$h"; elif [ "$W" -lt "$H" ]; then sc="$h:-2"; else sc="$h:$h"; fi
  ffmpeg -v error -y -i "$f" -vf "scale=$sc:flags=lanczos,setsar=1" -c:v libx264 -profile:v main -pix_fmt yuv420p \
    -crf "$crf" -preset slow -c:a aac -b:a 96k -ar 44100 -movflags +faststart "$out/$b-${h}p.mp4"
  echo "$out/$b-${h}p.mp4 $(du -h "$out/$b-${h}p.mp4" | cut -f1)"
done
