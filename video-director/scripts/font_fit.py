#!/usr/bin/env python3
# Usage: python font_fit.py font.woff2 --max-width 1536 [--size PX] [--tracking EM] "LINE" ["LINE" ...]
"""Measure text widths with real font metrics and find the largest size that fits.

Usage:
  python font_fit.py fonts/Display.woff2 --max-width 1536 "LINE ONE" "LINE TWO."
  python font_fit.py fonts/Display.woff2 --size 190 "LINE"        # width at a given size
Options:
  --max-width   allowed width in px (80 percent of the canvas: 1536 for 1920, 864 for 1080)
  --size        font size in px to report widths at
  --tracking    letter-spacing in em (for example 0.2 for letterspaced labels)
Requires: pip install fonttools brotli   (brotli only for .woff2)
Widths use glyph advances (no kerning), which is slightly conservative for most display faces.
"""
import argparse
from fontTools.ttLib import TTFont


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("font")
    ap.add_argument("lines", nargs="+")
    ap.add_argument("--max-width", type=float, default=1536)
    ap.add_argument("--size", type=float, default=None)
    ap.add_argument("--tracking", type=float, default=0.0)
    a = ap.parse_args()
    f = TTFont(a.font)
    cmap, hm, upm = f.getBestCmap(), f["hmtx"], f["head"].unitsPerEm
    missing = set()

    def width(s, px):
        w = 0.0
        for ch in s:
            g = cmap.get(ord(ch))
            if g is None:
                missing.add(ch); g = cmap.get(ord(" "))
            w += hm[g][0] / upm * px + a.tracking * px
        return w

    print(f"{'line':32s} {'w@100px':>8s} {'max size':>9s}" + (f" {'w@'+str(int(a.size))+'px':>9s}" if a.size else ""))
    for s in a.lines:
        per100 = width(s, 100)
        fit = a.max_width / per100 * 100
        extra = f" {width(s, a.size):9.0f}" if a.size else ""
        print(f"{s[:32]:32s} {per100:8.0f} {fit:9.0f}{extra}")
    if missing:
        print("missing glyphs (fell back to space width): " + "".join(sorted(missing)))


if __name__ == "__main__":
    main()
