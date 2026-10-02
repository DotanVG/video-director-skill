# Editing craft and how to build it in HyperFrames

Read `/hyperframes-core` (sub-compositions, media) and `/hyperframes-keyframes` (camera moves) before writing composition HTML. This file is the editor's layer on top.

## Contents
1. Project architecture
2. Cuts
3. Camera: punch-ins, pushes, pans, shake
4. Transitions and punctuation
5. Split screens and device frames
6. Generating the edit from data

## 1. Project architecture

```
project/
  index.html                 the root being previewed or rendered (a copy of one version root)
  versions/<ver>-<aspect>.html   thin roots: scene hosts + that version's audio
  compositions/<aspect>/sN.html  one sub-composition per scene, per aspect
  assets/clips, assets/audio, assets/sfx, assets/vendor/gsap.min.js, fonts/
  build.mjs                  generates compositions/ and versions/ from one edit description
  render-all.sh              copies each version root to index.html and renders it
```

Why: the picture is identical across music versions (the same scene files), each aspect re-lays type and reframes footage in its own scene files, and only one root-level composition exists at a time (HyperFrames lint rejects several root-level compositions). Vendor GSAP locally so renders never depend on the network.

Scene sub-composition rules that bite:
- Put `<style>` and `<script>` inside the `<template>`.
- Host `id`, host `data-composition-id`, inner `data-composition-id` and the `window.__timelines` key share one id (`s1`). Give the inner root a different element id (`s1-root`) so ids stay unique.
- Media inside a sub-composition uses scene-local `data-start`.
- Never put `data-start` on a wrapper of a timed `<video>`; animate an untimed inner wrapper (`.cam`) instead.

## 2. Cuts

- One `<video>` element per cut: `data-start` (scene-local), `data-duration`, `data-media-start` (source in point), `muted` for silent footage, `class="clip"`, a unique id.
- Hard cut = adjacent windows. Cut on beats; cut on action (mid-swing, at impact, at the flash).
- Pick ranges from contact sheets; avoid frames with popups, loading screens, debug text, or the subject leaving the frame.
- Shot length guide at 120 BPM: 0.5 s (one beat) for impacts, 1 s for action, 2-4 s held for the hero moment.
- A cut inside a scene can hide behind text that persists across it (the word holds while the picture changes), with a small scale pulse on the cut.

## 3. Camera: punch-ins, pushes, pans, shake

Wrap each video in an untimed `.cam` div sized to the source frame (1920x1080), `transform-origin: 0 0`, and tween `x`, `y`, `scale` on it. Frame a subject at source fractions (fx, fy) with scale s on a canvas W x H:

```
s = max(s, W/1920, H/1080)            // never show outside the frame
x = W/2 - fx*1920*s ; clamp to [W - 1920*s, 0]
y = H/2 - fy*1080*s ; clamp to [H - 1080*s, 0]
```

The template's `cam(fx, fy, s, {y})` does this; pass `{y}` to place the frame deliberately below the top edge (for example to clear a phone overlay with a dark band above).

- Punch-in: a short (0.1-0.2 s) or instant jump to a tighter frame on an impact, then hold or drift.
- Push: a slow scale increase over a held shot (about 5-10 percent per second at most).
- Punch-out: jump from tight to wide on the reveal (the big ability firing, the crowd).
- Pan: move fx across a wide scene on a held shot, `power1.inOut`.
- Shake: a deterministic keyframe list of small x/y offsets on a scene-level wrapper, 0.2-0.3 s, only on impacts.
- Respect source quality: pixel art and UI tolerate about 2.5x on 1080p; live action much less. `image-rendering: pixelated` keeps pixel art crisp.
- The subject moves during a shot: check its position at the start and end of the range and set focus points for both.

## 4. Transitions and punctuation

- Default transition: the hard cut on a beat.
- Flash frame: a full-frame white or accent div from opacity 0.2-0.9 to 0 over 0.15-0.4 s on the cut or impact (`immediateRender: false`).
- Hard cut to black for a punchline, holding the line on black for half a bar.
- Whip or match cuts: use `/hyperframes-animation` transitions or registry blocks; search the catalog before hand-building any named transition.
- Avoid dissolves in energetic edits; reserve crossfades for music-led calm moments.

## 5. Split screens and device frames

- Desktop: a browser window (rounded rect, top bar with three dots and the real URL in an address pill) containing the gameplay video with `object-fit: cover`.
- Phone: rounded body (radius about 60 px at 700 px width), inset screen with its own radius and `overflow: hidden`, a notch on the correct side for the orientation, a slight tilt, a deep shadow. The video inside is the real mobile capture.
- Bring them in on beats (slam from the side with a small rotation), let the whole stage push slowly, dim them under a stamp line when the message lands.

## 6. Generating the edit from data

Hand-writing many cuts across several aspects is error-prone. Generate HTML from one description (`assets/template/kit.mjs` + `build.example.mjs`): shots as `[clip, mediaStart, duration, focusX, focusY, scale16x9, scale9x16]`, words as lines with sizes per aspect and slam times, scenes with start and duration, versions with their audio. Rebuild after every change; never hand-edit generated files.
