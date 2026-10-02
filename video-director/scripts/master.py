#!/usr/bin/env python3
# Usage: python master.py renders/*.mp4 [--lufs -14] [--tp -1] [--duration 30] [--raw-dir work/raw]
"""Master rendered videos to a loudness target with two-pass EBU R128 loudnorm.

Usage:
  python master.py renders/*.mp4 [--lufs -14] [--tp -1] [--duration 30] [--raw-dir work/raw]

- The video stream is copied untouched; audio is re-encoded AAC 192 kbps 48 kHz.
- The original render is kept in --raw-dir (first run only), and mastering always starts from it,
  so running the script twice does not stack processing.
- --duration trims to an exact length (AAC padding otherwise makes a 30 s file read 30.1 s).
  Defaults to the video stream's duration.
"""
import argparse, json, os, re, shutil, subprocess


def probe_duration(f):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=duration",
                          "-of", "csv=p=0", f], capture_output=True, text=True).stdout.strip()
    return float(out) if out else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--lufs", type=float, default=-14.0)
    ap.add_argument("--tp", type=float, default=-1.0)
    ap.add_argument("--lra", type=float, default=11.0)
    ap.add_argument("--duration", type=float, default=None)
    ap.add_argument("--raw-dir", default="work/raw")
    a = ap.parse_args()
    os.makedirs(a.raw_dir, exist_ok=True)
    for f in a.files:
        raw = os.path.join(a.raw_dir, os.path.basename(f))
        if not os.path.exists(raw):
            shutil.copy2(f, raw)
        dur = a.duration or probe_duration(raw)
        base = f"loudnorm=I={a.lufs}:TP={a.tp}:LRA={a.lra}"
        r = subprocess.run(["ffmpeg", "-hide_banner", "-i", raw, "-af", base + ":print_format=json", "-f", "null", "-"],
                           capture_output=True, text=True)
        m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", r.stderr, re.S).group(0))
        af = (f"{base}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
              f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=summary,"
              f"aresample=48000" + (f",atrim=0:{dur}" if dur else ""))
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", raw, "-map", "0:v", "-map", "0:a", "-c:v", "copy", "-af", af,
               "-c:a", "aac", "-b:a", "192k"] + (["-t", str(dur)] if dur else []) + ["-movflags", "+faststart", f]
        subprocess.run(cmd, check=True)
        out = subprocess.run(["ffmpeg", "-hide_banner", "-i", f, "-af", "ebur128=peak=true", "-f", "null", "-"],
                             capture_output=True, text=True).stderr
        I = re.findall(r"I:\s+(-?[\d.]+) LUFS", out)[-1]
        P = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", out)[-1]
        print(f"{os.path.basename(f)}: {m['input_i']} LUFS / {m['input_tp']} dBTP -> {I} LUFS, true peak {P} dBTP")


if __name__ == "__main__":
    main()
