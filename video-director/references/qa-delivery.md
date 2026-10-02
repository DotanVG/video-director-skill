# QA, render matrix, delivery

## Contents
1. The QA loop
2. Pitfalls and fixes
3. Render matrix
4. Verify every file
5. Documents to deliver
6. Share copies and GIFs
7. The final report

## 1. The QA loop

1. `node build.mjs` then `npx hyperframes lint` (fast) after every structural change.
2. `npx hyperframes check` (lint + runtime + layout + motion + contrast). A lint error disables the layout and contrast audits, so clear errors first.
3. `npx hyperframes snapshot . --no-end --describe false -o snapshots/<pass> --at <times>` with times at every scene midpoint and every proof moment (each slam landed, each punch-in, end card built). Snapshot each aspect (copy that aspect's version root to `index.html` first).
4. Read the contact sheets yourself. Look for: text overlapping text or UI, text cropped, subject out of frame, effects visible when they should not be, wrong colors, empty frames.
5. Fix in the generator, rebuild, re-snapshot. Then render one version and make a 1 fps contact sheet of the actual MP4 (renders can differ from snapshots).

Expected, explainable warnings are fine (intentional ghost layers, helper-wrapped GSAP that lint cannot see through, local media `data-start` inside sub-compositions). Report them honestly; do not report "clean" when it is not.

## 2. Pitfalls and fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Flash or colored overlay visible from frame 0; ghost text everywhere | `fromTo` renders its from-state at build | `immediateRender: false` on flash, ghost, pulse tweens and on repeated targets |
| Render quieter than planned | Lane overrides `data-volume`; renderer lowers mix for true peak | Gain inside lanes; simulate; master after render |
| Final file 30.1 s | AAC priming and padding on remux | `-t <duration>` and `atrim` when mastering |
| `multiple_root_compositions` lint error | Several root-level HTML files | Version roots in `versions/`, copy one to `index.html` per render |
| Overlay starts visible error | Hidden state set by `tl.set` at 0 | Put `opacity: 0` in CSS |
| Text overlap warnings between sequential lines | Shared boxes | Distinct boxes, or `data-layout-allow-overlap` when they never coexist |
| Low contrast on accent text over a bright effect | Accent color over light footage | Move the text, add a shade gradient, or change the accent on that screen |
| Video shows wrong frames or vanishes | `data-start` on both wrapper and video | Time the video only; animate an untimed wrapper |
| Popup or notification in footage | Captured during recording | Pick another range or re-record with notifications off |
| Subject lost in a 9:16 punch-in | Focus point valid at start only | Check the subject at both ends of the range; pan |
| Cover zoom crops credits | Transform origin centered | Anchor the zoom near the important corner |
| Render depends on network | GSAP from a CDN | Vendor `gsap.min.js` into `assets/vendor/` |

## 3. Render matrix

Render every version x aspect sequentially (each render copies its version root to `index.html`), with `--crf 18-20`:

```
./render-all.sh                 # all versions and aspects
ONLY=B-16x9 ./render-all.sh     # one
```

Budget about 3-5 minutes per 30 s 1080p render on a typical machine. Run renders in the background and verify each file as it lands.

## 4. Verify every file

- `ffprobe`: width x height, `r_frame_rate`, `nb_frames`, duration, h264 + aac, 48 kHz stereo.
- Loudness: `ffmpeg -i f.mp4 -af ebur128=peak=true -f null -` (integrated and true peak).
- Picture: `scripts/contact_sheet.sh f.mp4 1` and look at it.
- Sync: `scripts/audio_window.py` around music switches, crossfades and key hits.

## 5. Documents to deliver

- `SCRIPT_FINAL.md`: timing table, music offsets per version, SFX placements, treatment values, rebuild commands.
- `renders/AB_TEST.md`: each file, its loudness, one line on how the music changes the feel, the director's pick per platform with the reason, the sync checks.
- `BRIEF.md` and `CLIPS.md` if they were created.
Templates are in `assets/doc-templates/`.

## 6. Share copies and GIFs

```
scripts/share_versions.sh renders           # 480p copies in renders/share-480p/ (about 3 MB per 30 s)
scripts/make_gif.sh in.mp4 2.5 10 640 12 out.gif   # start, duration, width, fps
```

GIFs: 8-12 s highlights, 12-15 fps, 480-640 px wide for 16:9 and 270-360 px for 9:16, palette-generated, under about 10 MB.

## 7. The final report

Plain words, short: what you built, where the files are, your pick and why, what you would still improve, and anything unverified (for example "I could not listen to the mix; levels are measured, not heard").
