# Sound: music grid, versions, SFX, mix, master

## Contents
1. Choosing music
2. Verifying tempo and downbeats
3. Locking the edit to the grid
4. Music versions (A/B/C)
5. SFX
6. Building the mix in HyperFrames
7. Simulating loudness before rendering
8. Mastering after rendering
9. Verifying switches and crossfades

## 1. Choosing music

Prefer the product's or game's own music (identity, no licensing risk). Note each track's sections: intro, strong steady section, breakdowns, final phrase and tail. Measure loudness per section (`ffmpeg -ss <s> -t <d> -i track.wav -af ebur128 -f null -`). If nothing fits, source or generate through `/media-use`.

## 2. Verifying tempo and downbeats

Beat detectors often report double tempo (they count half-beats) and do not know where bar 1 is. Verify yourself:

```
python scripts/beat_grid.py track.wav --start 14 --end 44
```

It estimates the beat period by autocorrelating onsets, then folds low-frequency onsets (kick drum) over one bar to find which beat is the downbeat, and prints a bar phase and the file offsets where a downbeat falls. Ambient tracks without a pulse have no grid: place them by phrase (look at the waveform with `scripts/audio_window.py`) and resolve their final phrase on the last frame.

Also run `npx hyperframes beats` on the project if you want the HyperFrames beat map for audio-reactive visuals.

## 3. Locking the edit to the grid

Choose the file offset so a downbeat lands on 0.0 of the video. Then at tempo T:
- beat = 60 / T, bar = 4 beats (2 s at 120 BPM)
- scene changes on bar lines, inner cuts on beats, word slams on beats or eighth notes, the biggest hit on a downbeat
- trailer length in whole bars where possible (30 s at 120 BPM = 15 bars)

## 4. Music versions (A/B/C)

Keep one picture. Make thin root files per version; only the audio and its accents differ.

- **A**: one track from the strong section, fade in 0.3 s, fade out over the last 1.5 s.
- **B**: calm track under the hook, then a hard switch on the first action cut. Cut the calm track with a 20-30 ms fade so it does not click, start the energetic track on a downbeat exactly at the cut, and cover the seam with a short impact SFX whose peak lands on the cut (offset its `data-media-start` so the transient sits at the cut).
- **C**: energetic body, then a one-bar crossfade into the title theme, offset so the theme's last phrase resolves on the last frame (find the phrase end in the waveform).

## 5. SFX

- Few and meaningful: an impact on the hero word, the product's or game's own sounds on matching picture (a pickup sound on "FEED", a door on a door), a tick on a countdown, a soft chime on the end card.
- No stacks of whooshes. One whoosh at most per 10 s, on a real motion.
- Level: about 12 to 18 dB under the music's momentary loudness. Short transients (ticks, snaps under 0.2 s) read quieter than their 400 ms momentary value, so they can sit nearer -18 to -25 on that meter. Measure with ebur128 momentary values.
- Align by transient, not file start: find each file's onset and peak (`scripts/simmix.py --onsets`) and shift `data-start` so the peak hits the beat.
- SFX placements stay identical across music versions.

## 6. Building the mix in HyperFrames

- Every `<audio>` needs a unique `id`, `src`, `data-start`, `data-duration`, `data-media-start`, and its own `data-track-index` (overlapping clips on one track trigger lint warnings).
- Fades and gain live in a volume automation lane (`data-automation`), which overrides `data-volume`. Multiply the gain into the lane values. Read `/hyperframes-audio` for lane syntax (clip-local `t`).
- Music under narration needs a voiceover carve (`/hyperframes-audio`, `carve.mjs`), not just a duck.

## 7. Simulating loudness before rendering

Renders take minutes; simulate the mix first:

```
python scripts/simmix.py audio-plan.json          # integrated LUFS and sample peak per version
```

`audio-plan.json` lists every element with src, start, duration, media start and either a lane or a volume (the template's build writes it). Adjust the music gain until each version lands near the target.

## 8. Mastering after rendering

The HyperFrames renderer protects true peak by lowering the whole mix (about 1 dB is typical), so renders land under target. Master each final file:

```
python scripts/master.py renders/*.mp4 --lufs -14 --tp -1 --duration 30
```

Two-pass EBU R128 loudnorm, video stream copied untouched, audio re-encoded AAC 192 kbps, trimmed to the exact duration (AAC padding otherwise adds about 0.1 s), raw renders kept in `work/raw/`. Targets: -14 LUFS for YouTube, social and stores; -16 for podcasts and some web players; follow the platform or publisher if they specify.

## 9. Verifying switches and crossfades

```
python scripts/audio_window.py final.mp4 3.5 4.5 --grid 0.5     # envelope table + waveform picture with beat grid
```

Confirm a B switch lands within about 10 ms of the cut and the kicks after it sit on grid lines; confirm a C crossfade starts and ends on its bar lines and the final phrase resolves before the last frame.
