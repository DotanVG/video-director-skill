#!/usr/bin/env python3
# Usage: python beat_grid.py track.wav [--start S] [--end S] [--beats-per-bar 4] [--bpm N]
"""Verify a music track's tempo, beat phase and downbeats (bar 1) independently of beat detectors.

Usage:
  python beat_grid.py track.wav [--start 0] [--end <dur>] [--beats-per-bar 4] [--bpm <known>]

How it works:
  1. Decodes mono 8 kHz audio with ffmpeg (must be on PATH). Needs numpy.
  2. Tempo: autocorrelation of the broadband onset envelope (detectors often report double tempo;
     this prefers 70-180 BPM unless --bpm is given).
  3. Beat phase: folds the onset envelope over one beat period.
  4. Downbeat: folds the LOW band (<150 Hz, the kick) over one bar and picks the strongest beat.
  5. Prints downbeat times in the region (use one as data-media-start so a downbeat lands on 0.0)
     and the loudness of every bar so you can see the sections.
"""
import argparse, subprocess, sys
import numpy as np

SR, HOP = 8000, 80  # 10 ms hop


def decode(path, start, dur, lowpass=None):
    af = ["-af", f"lowpass=f={lowpass},lowpass=f={lowpass}"] if lowpass else []
    cmd = ["ffmpeg", "-v", "error", "-ss", str(start)] + (["-t", str(dur)] if dur else []) + [
        "-i", path, "-ac", "1", "-ar", str(SR)] + af + ["-f", "s16le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


def onset_env(x):
    n = len(x) // HOP
    e = np.sqrt((x[: n * HOP].reshape(n, HOP) ** 2).mean(1) + 1e-12)
    return np.maximum(0, np.diff(np.log(e + 1e-4), prepend=np.log(e[0] + 1e-4)))


def fold(env, period_frames, phase_steps):
    """Average env sampled at fractional period positions."""
    n_periods = int(len(env) // period_frames)
    prof = np.zeros(phase_steps)
    for k in range(phase_steps):
        idx = (np.arange(n_periods) * period_frames + k * period_frames / phase_steps).astype(int)
        idx = idx[idx < len(env)]
        # small window max to tolerate jitter
        prof[k] = np.mean([env[max(0, i - 1): i + 2].max() for i in idx])
    return prof


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("--start", type=float, default=0.0)
    ap.add_argument("--end", type=float, default=None)
    ap.add_argument("--beats-per-bar", type=int, default=4)
    ap.add_argument("--bpm", type=float, default=None)
    a = ap.parse_args()

    total = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.audio],
                                 capture_output=True, text=True).stdout.strip())
    end = a.end if a.end else total
    dur = end - a.start
    x = decode(a.audio, a.start, dur)
    low = decode(a.audio, a.start, dur, lowpass=150)
    env, envl = onset_env(x), onset_env(low)

    if a.bpm:
        period = 60.0 / a.bpm * 100
    else:
        s = env - env.mean()
        ac = np.correlate(s, s, "full")[len(s) - 1:]
        lo, hi = 25, 150  # 0.25 s .. 1.5 s
        lag = lo + int(np.argmax(ac[lo:hi]))
        # refine with parabolic interpolation
        if 1 <= lag < len(ac) - 1:
            y0, y1, y2 = ac[lag - 1], ac[lag], ac[lag + 1]
            lag = lag + 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2 + 1e-12)
        period = lag
        bpm = 6000.0 / period
        while bpm > 180: bpm /= 2; period *= 2
        while bpm < 70: bpm *= 2; period /= 2
        # snap to a near-integer BPM when within 0.6
        if abs(bpm - round(bpm)) < 0.6:
            bpm = round(bpm); period = 6000.0 / bpm
        strength = ac[int(round(period))] / (ac[0] + 1e-12)
        print(f"tempo estimate: {bpm:.2f} BPM (beat {period/100:.4f} s), autocorrelation strength {strength:.3f}")
        if strength < 0.05:
            print("  weak pulse: this may be ambient music without a steady beat; place it by phrase instead.")
    bpm = 6000.0 / period

    steps = 50
    prof = fold(env, period, steps)
    beat_phase = np.argmax(prof) / steps * period / 100  # seconds after region start
    bar = period * a.beats_per_bar
    profl = fold(envl, bar, a.beats_per_bar * steps)
    beat_strength = []
    for b in range(a.beats_per_bar):
        k = int(round((beat_phase * 100 / period + b) * steps)) % (a.beats_per_bar * steps)
        beat_strength.append(profl[max(0, k - 2): k + 3].max())
    down_beat = int(np.argmax(beat_strength))
    down_phase = (beat_phase + down_beat * period / 100) % (bar / 100)
    first_down = a.start + down_phase
    print(f"beat phase: beats at {a.start + beat_phase:.3f} s + n x {period/100:.4f} s (file time)")
    print("kick strength per beat in the bar: " + ", ".join(f"{i+1}:{v/max(beat_strength):.2f}" for i, v in enumerate(beat_strength)))
    print(f"downbeat (bar 1) at file time {first_down:.3f} s, then every {bar/100:.3f} s")
    downs = [first_down + i * bar / 100 for i in range(int(dur / (bar / 100)) + 1) if first_down + i * bar / 100 < end]
    print("downbeats in region: " + ", ".join(f"{d:.3f}" for d in downs[:24]) + (" ..." if len(downs) > 24 else ""))
    print("use one of these as data-media-start so a downbeat lands on 0.0 of the video")
    print("\nloudness per bar (RMS dBFS), to spot sections:")
    full = decode(a.audio, 0, None)
    row = []
    for d in downs:
        seg = full[int(d * SR): int((d + bar / 100) * SR)]
        if len(seg):
            row.append(f"{d:7.2f}s {20*np.log10(np.sqrt((seg**2).mean())+1e-9):6.1f}")
    for i in range(0, len(row), 4):
        print("   " + " | ".join(row[i:i + 4]))


if __name__ == "__main__":
    sys.exit(main())
