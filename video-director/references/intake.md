# Intake: what to ask, what to assume

The goal of intake is a brief you could hand to another editor. Ask only what you cannot infer from the user's message, their files, or a `BRIEF.md` / script that already exists. Read those first.

## How to ask

- Use the question tool when available, at most 4 questions per round, 2 to 4 options each, recommended option first and labelled "(Recommended)". Free text is always possible.
- Group by what blocks you first: source material and deliverables before style.
- If the user asked you to work autonomously, ask only blockers (missing footage you cannot capture, unclear legal claims, a choice that changes everything). State every default you picked in your first progress note.
- Never ask about things a sensible default covers. Say the default and move on.

## The question bank

### 1. Project and source material
- What is the video about? Product, game, app, event, person, topic.
- Where is the material? Folders of footage, screenshots, stills, logos, cover art, brand kit, music, voice-over, an existing cut, a repo, a live URL, a build that can be run.
- Is there a script or must-say copy? Any facts that must or must not appear (claims, prices, dates, awards, credits)?
- Should I capture new footage? (game playthrough, app walkthrough, site tour). If yes, who plays: the user, or scripted capture (see `capture.md`).

### 2. Message and audience
- One sentence the viewer must remember (the hook line).
- Who watches, where, with or without sound? (Feeds autoplay muted: text must carry the message.)
- Desired action: wishlist, play now, download, sign up, visit URL, follow.

### 3. Format and delivery
- Length: 6 s bumper, 15 s, 30 s (default for trailers and social), 60 s, 90 to 120 s (store trailer, launch).
- Platforms: Steam, itch.io, App Store, Google Play, YouTube, Shorts, TikTok, Reels, X, LinkedIn, Discord, WhatsApp, website hero. Map each to aspect, length and loudness with `platforms.md`.
- Aspect ratios: 16:9 (default), 9:16, 1:1, 4:5. One timeline can serve several aspects with re-laid type and reframed footage (`formats.md`).
- Quality: 1080p30 default; 60 fps for fast games; 4K only if sources are 4K. Also a light share copy (480p) and GIFs?
- File naming and folder.

### 4. Director's view (style)
- Tone: epic, playful, eerie, premium, punchy, calm, funny.
- Reference videos or a previous cut to beat.
- Brand: fonts, colors, logo, do and don't. If none, propose one display font, one text color, one accent.
- Type style: kinetic slams, clean captions, minimal lower thirds, none.
- Effects appetite: subtle, punchy (shake, flashes, chroma), stylized (glitch, CRT, film).

### 5. Sound
- Music: provided tracks, game or product soundtrack, licensed library, generated, or none.
- Several music versions for A/B testing? (see `director.md`, music strategy)
- Voice-over or narration? Captions?
- SFX: from the product or game, a kit, or sourced. Loudness target if they have one.

### 6. Process
- Autonomy: fully autonomous to final renders, or checkpoints (treatment, first cut, final)?
- Approvals before any upload or publishing. Default: everything stays local.

## Defaults when unanswered

| Topic | Default |
| --- | --- |
| Length | 30 s |
| Aspect | 16:9; add 9:16 when any short-form platform is named |
| Frame rate | 30 fps (60 if the game or UI is fast and the source is 60) |
| Codec | H.264 + AAC 48 kHz stereo, CRF 18 to 20 |
| Loudness | -14 LUFS integrated, -1 dBTP |
| Type | One display font from the user's kit or a bundled open font, all caps for slams, one accent color |
| Music | User's own track first; otherwise propose sourcing via `/media-use` |
| SFX | Few, purposeful, 12 to 18 dB under music |
| Delivery | Local files only, no publishing |

## Write the brief

Record the answers in `BRIEF.md` (template: `assets/doc-templates/BRIEF.md`) with `workflow: general-video` and `flow: automation` (or `companion` for checkpoint-driven work) so HyperFrames tooling resumes the project correctly.
