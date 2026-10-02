# Edit generator template

Tested with HyperFrames 0.8.x: `node build.mjs` then `npx hyperframes check` passes with 0 errors and renders in 16:9 and 9:16.

## Use

1. `npx hyperframes init <project> --non-interactive --example=blank --skill=general-video`
2. Copy `kit.mjs`, `render-all.sh` and `build.example.mjs` (renamed `build.mjs`) into the project.
3. Put assets where `build.mjs` expects them (fonts, `assets/vendor/gsap.min.js`, clips, art, music, SFX). Vendor GSAP: `curl -L -o assets/vendor/gsap.min.js https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js`.
4. Replace copy, ranges, focus points, sizes and timings with real values from your contact sheets, beat grid and font measurements.
5. `node build.mjs && npx hyperframes check`, then snapshot each aspect, then `./render-all.sh`, then master.

## What kit.mjs gives you

- `configure({ accent, text, ink, display, body, grade, sourceW, sourceH, fps })`
- Markup: `vid(id, src, start, dur, mediaStart)`, `camWrap(id, inner)`, `line(id, text, { size, top, accent, split, ghost, font })`
- Scene runtime (inside every scene script): `cam(fx, fy, scale, {y})`, `camMove(sel, t, dur, from, to, ease)`, `slam`, `slamEach`, `out`, `chroma`, `flash`, `shake`, `alive`, `pulse`, `fadeIn`, and `ft()` (a fromTo that never pre-renders accents)
- Audio: `music(id, src, start, dur, mediaStart, lanePoints, gain)`, `sfx(id, src, start, dur, mediaStart, volume)`
- `writeProject({ duration, aspects, scenes, versions, sfx, index })` writes `compositions/<aspect>/`, `versions/`, `index.html` and `work/audio-plan.json` (input for `scripts/simmix.py`)

Aspect keys: `L` 1920x1080, `P` 1080x1920, `S` 1080x1080, `F` 1080x1350.
