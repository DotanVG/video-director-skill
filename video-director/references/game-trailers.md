# Game trailers

## Contents
1. Trailer types
2. What to show
3. Store, jam and platform specifics
4. Planning the capture
5. HUD and UI in the frame
6. Platform beat (desktop, mobile, browser, console)
7. End card for games

## 1. Trailer types

| Type | Length | Purpose |
| --- | --- | --- |
| Announcement / teaser | 15-45 s | Mood, premise, one mechanic, title, wishlist CTA |
| Gameplay trailer (store page first video) | 30-90 s | Show what the player does, from the player's perspective |
| Launch trailer | 60-120 s | Breadth: modes, bosses, progression, quotes only if real |
| Update / feature trailer | 15-45 s | One new thing, before and after |
| Game jam trailer | 20-40 s | Premise, loop, theme tie-in, "play in browser" |
| Mobile store preview | 15-30 s | Core action in the first second, portrait or landscape per game |
| Social cutdowns | 6-30 s | One mechanic or one funny moment per clip, 9:16 |

## 2. What to show

Order of priority for the footage you need:

1. The core loop in action (the verb the player repeats).
2. The hook mechanic that makes it different.
3. Escalation: more enemies, harder waves, bigger space, a boss.
4. The power fantasy moment (ultimate, combo, big win).
5. Stakes and failure (the timer, death, game over screen) in one quick beat.
6. Variety: biomes, levels, characters, weapons.
7. Platforms and how to play (desktop, mobile touch controls, controller, browser, no install).
8. Title, call to action, URL or store.

Read the game's README, design docs and source code for true facts and mechanic names. Use the game's own words for mechanics.

## 3. Store, jam and platform specifics

- **Steam**: the first trailer should be mostly gameplay from the player's perspective. Get to gameplay in the first seconds (many viewers scrub). Upload the highest quality you have, up to 1920x1080, 30 or 60 fps, H.264 + AAC in MP4/MOV, 5000+ kbps. 16:9 preferred. Logos at the end, not the start. Steam transcodes audio to stereo.
- **itch.io**: trailers are embedded from YouTube or Vimeo; the cover image is 630x500 (or 315x250); an animated GIF cover plays on hover in listings (aim 5-15 s, under about 10 MB). Make a GIF cutdown.
- **Game jams**: mention the jam and theme only if true; show the theme tie-in in gameplay; CTA "Play free in your browser" when it is a web build; credit the team.
- **App Store previews**: 15-30 s, captured from the app itself, portrait or landscape per device class (for example 886x1920 or 1080x1920 for current iPhones), 30 fps, H.264 or ProRes 422 HQ, up to 500 MB, up to 3 previews per locale. Check current Apple specs before export.
- **Google Play**: the preview is a YouTube URL (watch URL, not a short link), landscape recommended for games, ads and monetization off on that video; the first 30 s autoplay.
- **Consoles and publishers** have their own ratings, legal lines and logo rules. Ask the user for their guidelines.

Always verify specs against current official docs before final export; platforms change them. See `platforms.md`.

## 4. Planning the capture

If the user's footage is missing, short, or does not show the late-game content, plan a capture (details in `capture.md`):

- A **clip plan**: one recording per beat you need (core loop, horde, boss, ultimate, failure, mobile, menu), each 20-60 s so you have choice.
- Use debug or cheat hooks to reach late content quickly (invincibility, full meters, level select, spawn rates). Note in the clip index which values were forced so the copy never claims something the footage fakes.
- Record at the delivery resolution or higher, at the game's real frame rate, with OS notifications off, no cursor unless it is the game's own, no desktop chrome.
- Write `CLIPS.md` (template in `assets/doc-templates/`): one row per clip with resolution, length, and approximate timestamps of key moments. Then verify the timestamps with contact sheets before cutting.

## 5. HUD and UI in the frame

- The game's HUD is part of the picture. Keep the HUD readable when it carries the story (a countdown, a health bar in a clutch moment).
- Do not place text over the HUD zones (often the top 10-15 percent). Punch-ins can crop the HUD out when it is not needed.
- In 9:16, the HUD often sits right under the platform's top overlay; reframe or add a dark band so it stays readable.
- Hide or crop debug text, FPS counters, editor gizmos and dev overlays.

## 6. Platform beat

When the game runs on several platforms, give it a beat:

- 16:9: a browser or desktop window frame with desktop gameplay next to a device frame (rounded rectangle, notch, landscape if the game is landscape) playing the mobile capture; the words build one per beat (for example DESKTOP. MOBILE. NO DOWNLOAD.). CSS frames are fine; the gameplay inside must be real.
- 9:16: the mobile capture full-bleed (cropped around the character and the touch controls). A real "rotate your device" gate from the game can be a joke beat that spins away into the landscape gameplay.
- Console: controller glyphs or platform badges only if the user provides official assets.

## 7. End card for games

Cover or key art (cleaned: cropped borders, de-blocked, upscaled with care), title, one-line genre pitch ("A reverse horde survival game"), CTA ("Wishlist on Steam", "Play free in your browser"), URL, jam or event line if relevant, credits small. Hold at least 3 s after the last element lands.
