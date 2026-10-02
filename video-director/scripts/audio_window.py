#!/usr/bin/env python3
# Usage: python audio_window.py video.mp4 T0 T1 [--grid 0.5] [--step 0.005] [--png out.png]
"""Inspect the audio of a video or track around a moment: envelope table + waveform picture with a beat grid.

Usage:
  python audio_window.py final.mp4 3.5 4.5 [--grid 0.5] [--step 0.005] [--png out.png]

Prints the peak level every --step seconds between t0 and t1 (an ASCII bar per step) and writes a
showwavespic image of the window with vertical grid lines every --grid seconds, so you can confirm
that a music switch, a crossfade or a hit lands on the beat.
"""
import argparse, subprocess
import numpy as np


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("media"); ap.add_argument("t0", type=float); ap.add_argument("t1", type=float)
    ap.add_argument("--grid", type=float, default=0.5)
    ap.add_argument("--step", type=float, default=0.005)
    ap.add_argument("--png", default=None)
    ap.add_argument("--quiet-table", action="store_true")
    a = ap.parse_args()
    dur = a.t1 - a.t0
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(a.t0), "-t", str(dur), "-i", a.media, "-ac", "1",
                          "-ar", "48000", "-f", "s16le", "-"], capture_output=True).stdout
    x = np.abs(np.frombuffer(raw, dtype=np.int16).astype(np.float32)) / 32768
    w = max(1, int(a.step * 48000)); n = len(x) // w
    if not a.quiet_table and n:
        e = x[: n * w].reshape(n, w).max(1); top = e.max() + 1e-9
        for i in range(n):
            print(f"{a.t0 + i * a.step:8.3f}  {'#' * int(e[i] / top * 50):50s} {e[i]:.2f}")
    png = a.png or f"wave_{a.t0:g}-{a.t1:g}.png"
    width = 1600
    gridpx = max(1, int(width * a.grid / dur))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a.t0), "-t", str(dur), "-i", a.media,
                    "-filter_complex", f"[0:a]showwavespic=s={width}x300:colors=white,drawgrid=w={gridpx}:h=300:color=red@0.7[w]",
                    "-map", "[w]", "-frames:v", "1", png], check=True)
    print(f"waveform: {png} (grid every {a.grid} s from {a.t0} s)")


if __name__ == "__main__":
    main()
