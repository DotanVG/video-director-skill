# Kinetic type

## Contents
1. Type system
2. Sizing with real metrics (`scripts/font_fit.py`)
3. Safe zones
4. Slam vocabulary
5. Timing
6. Seek safety

## Type system

- One display face (heavy grotesk such as Archivo Black, Bricolage Grotesque ExtraBold, Anton, or the brand's font) for slams, all caps.
- One text face (Inter or the brand's) for labels, URL lines and credits.
- Colors: one text color (ivory or white on dark), one accent for the key word per screen, everything else neutral. Add a soft dark text shadow for footage.
- Local font files only: copy them into `fonts/` and declare `@font-face` inside each scene template (HyperFrames lint requires a face for every named family).

## Sizing with real metrics

Never guess widths. `scripts/font_fit.py` reads the font's real glyph advances (fontTools) and reports, per line, the width at 100 px and the largest size that fits a maximum width; `--size` adds the width at a chosen size and `--tracking` accounts for letter-spacing. Example: `python scripts/font_fit.py fonts/<Display>.woff2 --max-width 1536 "LINE ONE" "LINE TWO"`. Keep every line inside the middle 80 percent of the canvas width (1536 px of 1920, 864 px of 1080).

Starting points (heavy grotesk, 1080p):

| Use | 16:9 | 9:16 |
| --- | --- | --- |
| One-word slam | 230-300 px | 190-230 px |
| Two-line slam | 150-200 px per line | 120-190 px per line |
| 3-word line | up to 150 px | split into stacked lines |
| Label (letterspaced text face) | 40-50 px | 50-56 px |
| End card body | 40-46 px | 38-44 px |
| Credits | 18-20 px | 19-20 px |

Give every line its own vertical box (top + height = font size with line-height 1). Lines that appear in sequence at the same place still need distinct boxes unless one is gone before the other enters; mark intentional layering with `data-layout-allow-overlap`.

## Safe zones

- Footage with UI: no text over the HUD (often top 12 percent) or over the subject.
- 9:16 social: keep text out of roughly the top 130 px, the bottom 320 px and the right 120 px (platform buttons and captions); third-party guides differ by up to 30 px, so leave margin.
- Under bright footage, place a gradient shade (top, bottom or radial) behind text; check contrast in the HyperFrames audit.

## Slam vocabulary (all seek-safe GSAP, power4.out, 0.25-0.35 s)

| Move | From state | Good for |
| --- | --- | --- |
| left / right | x plus or minus 420, skewX 20, opacity 0 | first word of a pair, alternating |
| up | y 150, scaleY 0.3, opacity 0 | neutral |
| down | y -150, scaleY 1.7, opacity 0 | weight, falling |
| stretch | scaleX 2, scaleY 0.2, opacity 0 | wide words |
| big | scale 2.3, opacity 0 | the accent word, the final word |
| per letter | any of the above with a 0.025-0.035 s stagger | the hero word |
| rise | y 40, opacity 0 | labels, end card lines |

Accents on impact: chromatic ghosts (two copies of the line in red and cyan, screen blend, offset 15-30 px collapsing to 0 over 0.25 s), a flash div, a scene shake, a scale pulse when the picture cuts under a held word.

Alive while holding: a slow scale drift of 3 to 5 percent on the line container. Exit fast (opacity to 0 and y -24 over 0.12 s) just before the next beat.

## Timing

- A slam lands on a beat: start the tween about 0.0-0.05 s before the beat so the overshoot peaks on it.
- Words of one line can land on consecutive beats or eighth notes (0.25 s at 120 BPM).
- Minimum readable hold: about 1 s for 1-3 words; labels stagger word by word on eighth notes.

## Seek safety

- Every tween lives on the scene's one paused timeline. No timers, no random, no `repeat: -1`.
- `fromTo` applies its `from` values at build time. For any tween whose `from` state is visible (flashes at peak opacity, ghosts, pulses), set `immediateRender: false`, and for the second and later `fromTo` on the same target too. The template's `ft()` does both.
- Initial hidden states for overlays go in CSS (`opacity: 0`), not in a `tl.set` at 0.
