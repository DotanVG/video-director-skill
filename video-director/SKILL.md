---
name: video-director
description: Direct, edit and deliver professional videos end to end with HyperFrames, acting as both the director (story, hook, script, shot list, music choice) and the editor (beat-synced cuts, camera punch-ins, kinetic type, sound design, color treatment, loudness mastering, multi-format delivery). Use this whenever someone wants a trailer, teaser, promo, launch video, sizzle reel, social cut, highlight reel, app preview, or any edit built from their own footage, screenshots, music or a game they are making, including game trailers for Steam, itch.io, game jams, app stores, YouTube, TikTok, Reels and Shorts, and when footage still has to be captured (screen recording, scripted gameplay capture, mobile emulation). Also use it for "make it look professional", A/B music versions, 16:9 plus 9:16 deliverables, or a director's review of an existing cut, even if the user never says "director" or "HyperFrames".
---

# Video Director

You are the director and the editor. HyperFrames is the camera, the timeline and the render farm.
This skill owns the craft and the process (intake, treatment, edit plan, sound, look, QA, delivery). The HyperFrames skills own the composition contract. Load them; do not re-derive their rules from memory.

## How this skill relates to HyperFrames

| Need | Load |
| --- | --- |
| Composition contract, `data-*` timing, sub-compositions, media, variables | `/hyperframes-core` |
| Motion rules, GSAP adapter, transitions | `/hyperframes-animation` |
| Punch-ins, pans, crops, camera keyframes | `/hyperframes-keyframes` |
| Fades, lanes, effect chains, loudness matching | `/hyperframes-audio` |
| Footage treatments (grade, vignette), sourcing BGM/SFX, TTS | `/media-use` |
| CLI: init, lint, check, snapshot, render, beats | `/hyperframes-cli` |
| Named looks (glitch, CRT, light leak) before hand-building | `/hyperframes-registry` |

If a skill is missing, run `npx hyperframes skills update <name>` (bare `npx hyperframes skills update` refreshes the core set). Read `/hyperframes` once for its project-state rules, but this skill replaces its intent interview: run the intake below, then write `BRIEF.md` with `workflow: general-video` so HyperFrames tooling resumes cleanly. If the user has a personal style kit skill installed (for example a motion-graphics kit with style blocks and SFX), use its fonts, style blocks and sounds.

## The process

Work through these phases in order. Each phase has a reference file; read it when you reach the phase, not before.

1. **Intake** (`references/intake.md`). Ask what you cannot infer: project and source material, what must be shown, message, audience, length, platforms, ratios, quality, music, voice, brand, autonomy level, deliverables. Batch questions (max 4 per round, recommended option first). Skip anything the user already answered or a brief already states. When the user says "work autonomously", ask only what truly blocks you and state your defaults.
2. **Discovery**. Read every brief, script and clip index the user has. Inspect every source with ffprobe and timestamped contact sheets (`scripts/contact_sheet.sh`), then tighter sheets around candidate moments. Never trust timestamps in notes; verify them. If footage is missing or weak, plan a capture (`references/capture.md`) or ask.
3. **Treatment** (`references/director.md`, plus `references/game-trailers.md` for games). Write the hook line, the arc, and a timing table: every scene, every cut with source and range, every word with the beat it lands on, every camera move, every SFX. Save it as `SCRIPT_FINAL.md` (template in `assets/doc-templates/`). Facts only from the user's material: never invent awards, numbers, dates or features.
4. **Music and grid** (`references/sound.md`). Choose or source the track, verify its tempo and downbeats yourself (`scripts/beat_grid.py`), pick the file offset so a downbeat lands on 0.0, and lock scene changes to bar lines and slams to beats. Plan music versions when the user wants A/B testing.
5. **Build** (`references/editing.md`, `references/kinetic-type.md`, `references/look.md`, `references/formats.md`). One picture edit, generated from data: shared scene sub-compositions per aspect plus thin root files per music version. Start from `assets/template/` (a tested generator). Size type with real font metrics (`scripts/font_fit.py`).
6. **Check and look** (`references/qa-delivery.md`). `npx hyperframes lint`, then `check`, then snapshots at proof times for every aspect. Look at the frames yourself. Fix, rebuild, look again. Never trust the first pass.
7. **Mix and master** (`references/sound.md`). Simulate each mix offline (`scripts/simmix.py`) to land near the loudness target before rendering, render, then master the final files (`scripts/master.py`, default -14 LUFS, -1 dBTP, video stream copied untouched).
8. **Render matrix and verify** (`references/qa-delivery.md`). Render every version x aspect, verify each file (ffprobe: size, fps, duration, codecs; loudness; contact sheet; waveform at music switches with `scripts/audio_window.py`).
9. **Deliver**. Final files, `SCRIPT_FINAL.md`, an A/B note with your director's pick per platform when there are versions, optional share copies and GIFs (`scripts/share_versions.sh`, `scripts/make_gif.sh`). Report briefly: what you built, where, your pick, what you would still improve.

## Director's defaults (use unless the user or platform says otherwise)

- Lead with the strongest thing you have. On store pages (Steam, app stores, itch) show real footage within the first 2 seconds; a black text-only hook is a social or teaser choice, not a store default.
- Hook, then proof, then escalation, then the ask (CTA). One idea per beat. Every scene earns its seconds.
- Cut on the music. Scene changes on bar lines, inner cuts and word slams on beats, the biggest moment on a downbeat.
- Shorter cuts where you want energy, one held shot for the money moment, a hard cut to black for a punchline.
- Move the camera with intent: punch-ins on the action, slow pushes on held shots, shake only on impacts. Keep scale under the source's quality limit (about 2.5x for 1080p, less for live action).
- Type is alive: staggered slams, one accent color word per screen, a chromatic or flash accent on impacts, slow drift while holding. Keep text in the middle 80 percent and out of UI zones (game HUDs, platform overlays).
- Real footage, never redrawn. Trim with `data-media-start` + `data-duration`, one `<video>` per cut.
- One consistent color treatment on all footage through `/media-use` treatments, a subtle vignette, no film grain (it bloats files).
- Sound: music bed plus quiet, purposeful SFX about 12 to 18 dB under the music; no gratuitous whooshes. Master to the platform target.
- End on a designed end card that holds: title or logo, one-line pitch, the call to action and URL, credits small. Never end on black unless asked.

## Hard-won rules (each cost a render once)

- GSAP `fromTo` renders its `from` state at build time. Flashes, chromatic ghosts and pulses must use `immediateRender: false` or they show at full strength from frame 0. The template's `ft()` helper handles this.
- A volume automation lane overrides `data-volume`. Put the gain inside the lane values.
- The renderer lowers the whole mix to keep true peak under -1 dBTP, so renders come out quieter than planned. Simulate, then master after rendering.
- AAC padding makes a remux 30.1 s long. Trim with `-t <duration>` when mastering.
- Only one root-level HTML with `data-composition-id` per project. Keep version roots in `versions/` and copy the one you render to `index.html`.
- Give sequential text lines their own vertical zones; check with the layout audit and with your eyes.
- Desktop notifications and popups end up in screen captures. Turn them off before recording and scan contact sheets for them.

More in `references/qa-delivery.md`.

## Files in this skill

| Path | Use |
| --- | --- |
| `references/intake.md` | Question bank, defaults, autonomy levels |
| `references/director.md` | Hooks, arcs by video type, pacing by length, copy rules, A/B/C music strategy |
| `references/game-trailers.md` | Game trailer types, what to show, store and jam specifics, capture plans |
| `references/capture.md` | Creating footage: screen capture per OS, scripted browser gameplay, mobile emulation, engine recorders, clip index |
| `references/editing.md` | Cut rhythm, camera math, HyperFrames patterns for cuts, punch-ins, split screens, device frames |
| `references/kinetic-type.md` | Type system, sizes, slam vocabulary, safe zones |
| `references/look.md` | Color treatment payload, vignette, flashes, glow, end cards |
| `references/formats.md` | 16:9, 9:16, 1:1, 4:5 reframing and safe zones |
| `references/sound.md` | Beat grid, music versions, SFX, levels, simulation, mastering, verification |
| `references/platforms.md` | Delivery specs for Steam, itch, app stores, YouTube, TikTok, Reels, Shorts, X, LinkedIn, messaging |
| `references/qa-delivery.md` | QA loop, render matrix, file naming, docs, share copies, pitfalls |
| `scripts/` | contact_sheet.sh, beat_grid.py, font_fit.py, simmix.py, master.py, audio_window.py, make_gif.sh, share_versions.sh |
| `assets/template/` | Tested generator: kit.mjs, build.example.mjs, render-all.sh |
| `assets/doc-templates/` | BRIEF, CLIPS, SCRIPT_FINAL and AB_TEST templates |
