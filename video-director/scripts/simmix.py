#!/usr/bin/env python3
"""Simulate a HyperFrames audio mix offline with ffmpeg and report integrated loudness and peak.

Usage:
  python simmix.py audio-plan.json                 # every version in the plan
  python simmix.py audio-plan.json --version A     # one version
  python simmix.py audio-plan.json --version A --wav mix_A.wav   # also write the mix to listen to
  python simmix.py --onsets assets/sfx/*.wav       # onset and peak time of SFX files (for alignment)

Plan format (the template's build.mjs writes it as work/audio-plan.json):
{
  "duration": 30,
  "versions": {
    "A": [ {"src": "assets/audio/music.wav", "start": 0, "dur": 30, "ms": 14,
            "lane": [[0, 0], [0.3, 0.75], [28.5, 0.75], [30, 0]]},
           {"src": "assets/sfx/hit.wav", "start": 2.97, "dur": 0.2, "ms": 0, "vol": 0.3} ]
  }
}
"lane" is a volume automation lane in clip-local seconds (it replaces data-volume, like HyperFrames).
Paths are relative to the current directory (run it from the project root).
"""
import argparse, json, re, subprocess, sys


def lane_expr(pts):
    expr = f"{pts[-1][1]}"
    for (t0, v0), (t1, v1) in reversed(list(zip(pts, pts[1:]))):
        expr = f"if(lt(t,{t1}),({v0}+({v1}-{v0})*(t-{t0})/({t1}-{t0}+1e-9)),{expr})"
    return f"if(lt(t,{pts[0][0]}),{pts[0][1]},{expr})"


def simulate(items, duration, wav=None):
    args = ["ffmpeg", "-hide_banner", "-v", "info"]
    fl = []
    for k, it in enumerate(items):
        args += ["-ss", str(it.get("ms", 0)), "-t", str(it["dur"]), "-i", it["src"]]
        vol = f"volume='{lane_expr(it['lane'])}':eval=frame" if "lane" in it else f"volume={it.get('vol', 1)}"
        fl.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,asetpts=PTS-STARTPTS,{vol},"
                  f"adelay={int(round(it['start'] * 1000))}:all=1[a{k}]")
    tail = "[mix]" if wav else ",ebur128=peak=true[mix]"
    fl.append("".join(f"[a{k}]" for k in range(len(items))) +
              f"amix=inputs={len(items)}:normalize=0:duration=longest,atrim=0:{duration}" + tail)
    args += ["-filter_complex", ";".join(fl), "-map", "[mix]"]
    args += (["-y", wav] if wav else ["-f", "null", "-"])
    r = subprocess.run(args, capture_output=True, text=True)
    if wav:
        r = subprocess.run(["ffmpeg", "-hide_banner", "-i", wav, "-af", "ebur128=peak=true", "-f", "null", "-"],
                           capture_output=True, text=True)
    I = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    P = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)
    if not I:
        sys.exit("ffmpeg failed:\n" + r.stderr[-1500:])
    return float(I[-1]), float(P[-1])


def onsets(files):
    import numpy as np
    for f in files:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"],
                             capture_output=True).stdout
        x = np.abs(np.frombuffer(raw, dtype=np.int16).astype(np.float32)) / 32768
        if not len(x):
            print(f"{f}: no audio"); continue
        on = int(np.argmax(x > 0.03)); pk = int(np.argmax(x))
        print(f"{f}: onset {on/8000:.3f} s, peak {pk/8000:.3f} s, length {len(x)/8000:.2f} s, peak {20*np.log10(x[pk]+1e-9):.1f} dBFS")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("plan", nargs="?")
    ap.add_argument("--version")
    ap.add_argument("--wav")
    ap.add_argument("--onsets", nargs="+")
    a = ap.parse_args()
    if a.onsets:
        return onsets(a.onsets)
    plan = json.load(open(a.plan))
    for v, items in plan["versions"].items():
        if a.version and v != a.version:
            continue
        I, P = simulate(items, plan.get("duration", 30), a.wav)
        print(f"{v}: integrated {I:.1f} LUFS, true peak {P:.1f} dBFS")


if __name__ == "__main__":
    main()
