# Look: color, effects, end card

## Footage treatment

Use the canonical HyperFrames media treatment (`/media-use`, `references/media-treatments.md`), applied as `data-color-grading` on every `<video>` so all footage matches. Do not imitate grades, vignettes or grain with CSS filters or overlay divs; that bypasses the shader path and Studio controls.

Inspect the source first (contact sheet): flat captures and game footage usually want contrast and deeper blacks; live action usually wants a restrained correction. A starting payload for flat game or screen footage:

```json
{
  "intensity": 0.85,
  "adjust": { "contrast": 0.16, "blacks": -0.12, "shadows": -0.04, "highlights": -0.05, "vibrance": 0.14, "saturation": 0.04 },
  "details": { "vignette": 0.24, "vignetteFeather": 0.7 }
}
```

Discover controls with `npx hyperframes media-treatment --capabilities --json` and `--capability <family> --json`. For UI where exact brand colors matter, prefer no grade and polish with framing and motion. No film grain unless the user asks: it multiplies file size.

In attributes, write the JSON double-quoted with `&quot;` entities.

## Effects vocabulary

| Effect | How | When |
| --- | --- | --- |
| Flash | full-frame div, opacity peak to 0 | impacts, cuts, the big ability |
| Color flash | accent or warm color div | danger, sunlight, blood |
| Chromatic hit | red and cyan ghost copies of a text line, screen blend | word impacts |
| Shake | scene wrapper x/y keyframes, 0.2-0.3 s | explosions, slams |
| Glow | radial gradient div behind the hero element, scale breathing | end card, logos |
| Dim | ink-colored div over screens at 0.35-0.45 | to make a stamp line pop |
| Stamp slab | rotated dark rectangle behind a red line | "NO DOWNLOAD." style messages |
| Named looks (glitch, CRT, light leak) | search `npx hyperframes catalog --query "<look>" --json` first | stylized pieces |

Keep effects tied to beats; one strong accent beats five weak ones.

## Backgrounds for text-only scenes

Near-black with a subtle radial gradient (a slightly lighter or tinted center) reads richer than flat black. A faint accent glow can rise on the hero word.

## End card

- Clean the key art first: crop letterbox bars, de-block JPEG artifacts, upscale with care (`ffmpeg -vf "crop=...,deblock=filter=strong:block=8,scale=3*iw:3*ih:flags=lanczos,unsharp=5:5:0.5"`), keep pixel art crisp.
- Composition (16:9): art on the left (about 640 px), text column on the right; (9:16): art on top, text centered below.
- Motion: art rises and scales in with a flash, slow zoom 1.0 to 1.06 anchored so important art (credits on the art, faces) never crops; glow breathes; text builds one element per beat; the URL pill pops last and pulses its glow; a final small accent (lightning flicker, sparkle) near the end.
- Contents: title, one-line pitch, play or buy line, platform line, URL, event or jam line, credits small. Hold the fully built card at least 3 s.
