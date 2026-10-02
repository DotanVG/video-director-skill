# Capturing footage

Use this when the user has no footage, too little, or the wrong moments, and agrees that you (or they) record new material.

## Contents
1. Choose a method
2. Screen capture with ffmpeg
3. Browser games and web apps with Playwright
4. Scripted gameplay (bots with real input)
5. Mobile emulation and touch
6. Native games and engine recorders
7. Recording hygiene
8. The clip index

## 1. Choose a method

| Source | Best method |
| --- | --- |
| Browser game or web app | Playwright drives a real Chrome window; ffmpeg records the screen region (sharpest), or Playwright `recordVideo` (simplest, lower quality) |
| Native desktop game | Engine recorder (exact frames) or OBS / ffmpeg screen capture |
| Mobile app or game | Device screen recording, simulator / emulator recording, or browser mobile emulation for web builds |
| Website tour / SaaS | Playwright with scripted scrolls, clicks and a visible cursor if wanted; or `npx hyperframes capture` for site visuals |
| The user plays | Give them a shot list and recording settings; they record with OBS / built-in recorder |

## 2. Screen capture with ffmpeg

Record only the game region, at the target fps, visually lossless, then edit from the mezzanine file.

```
# Windows (gdigrab)
ffmpeg -f gdigrab -framerate 30 -draw_mouse 0 -i desktop -vf "crop=1920:1080:0:60" -c:v libx264 -preset veryfast -crf 15 -pix_fmt yuv420p out.mp4
# macOS (avfoundation; list devices with: ffmpeg -f avfoundation -list_devices true -i "")
ffmpeg -f avfoundation -framerate 30 -capture_cursor 0 -i "1:none" -vf "crop=1920:1080:0:0" -c:v libx264 -crf 15 -pix_fmt yuv420p out.mp4
# Linux X11
ffmpeg -f x11grab -framerate 30 -video_size 1920x1080 -i :0.0+0,0 -c:v libx264 -crf 15 -pix_fmt yuv420p out.mp4
```

Stop ffmpeg gracefully by writing `q` to its stdin so the file is finalized. Measure the crop box once (screenshot the screen, find the game canvas) and keep it in a table per mode (desktop, mobile landscape, mobile portrait). HiDPI scaling changes physical pixel coordinates: account for the device scale factor.

## 3. Browser games and web apps with Playwright

- Launch real Chrome (`channel: 'chrome'`, headed), kiosk or fullscreen, no infobars, autoplay allowed, a fixed device scale factor so the canvas maps to a known physical size.
- Bring the window to the front and keep it there (a small OS helper is fine). Never press Escape in fullscreen: it exits fullscreen and the desktop gets recorded.
- Start the dev server yourself (`npm run dev -- --host 127.0.0.1 --port <port>`) and wait for it.
- Read game state through a debug hook (`window.game`, a store, or an exposed API) with `page.evaluate`, so the script knows phase, level, player position, enemies, meters.
- Restart into a known state (scene restart, URL params, level select) before each clip.

## 4. Scripted gameplay (bots with real input)

A bot plays with real keyboard, mouse and touch events, so the footage is the real game:

- Loop: read state, decide (move toward pickups, kite enemies, attack when in range, dash when cornered), send key down/up and mouse moves, repeat every 50-100 ms.
- Stage moments: wait until the screen is full of enemies, then trigger the special ability; let the timer run out on purpose for a failure clip; stand still to let a horde build.
- Use dev cheats only to keep the run alive or to fill a meter (invincible health, full ultimate meter). Write which cheats were used in the clip index.
- One plan per clip (`node run.mjs <plan>`), each recording 20-60 s, with an `until` condition (next level reached, boss defeated, N seconds after the event).

## 5. Mobile emulation and touch

- Playwright context with `isMobile: true`, `hasTouch: true`, a landscape phone viewport (for example 1536x710 CSS px) and a device scale factor. A portrait viewport records rotate-your-device gates.
- Drive touch controls with `page.touchscreen` or CDP `Input.dispatchTouchEvent` so the on-screen joystick and buttons react.
- Say it honestly in notes: emulated touch in Chrome, not a physical phone.
- For native mobile: iOS Simulator `xcrun simctl io booted recordVideo out.mov`, Android `adb shell screenrecord /sdcard/out.mp4` (3 min limit per file), or the device's built-in recorder.

## 6. Native games and engine recorders

- Unity: Recorder package (Movie Recorder, fixed frame rate, capture the Game View at target resolution).
- Unreal: Movie Render Queue / Sequencer for cinematic cameras; for gameplay use a fixed-timestep capture or OBS.
- Godot 4: Movie Maker mode (`--write-movie out.avi --fixed-fps 30`) renders deterministic frames.
- Otherwise OBS: Display or Game Capture, CQP/CRF about 15-18, the target resolution and fps, separate audio tracks if you need the game sound.

## 7. Recording hygiene

- Turn off OS notifications, chat apps and update popups. A single popup ruins a clip; scan every contact sheet for one.
- Hide the system cursor unless it is the game's own cursor.
- Record a little longer than needed before and after each event.
- Record silent if music will be replaced, or keep game audio on a separate track for SFX use.
- Keep originals untouched; edit from copies in the project's `assets/`.

## 8. The clip index

Write `CLIPS.md` (template in `assets/doc-templates/CLIPS.md`): file, resolution, length, what happens with approximate timestamps, which cheats were active, known problems (popup at 8 s, cursor visible). Then make a 1 fps contact sheet per clip with `scripts/contact_sheet.sh` (ffmpeg tiles of frames with burned-in timestamps; arguments: video, fps, columns, tile width, output, start, duration) and a tighter one (4-5 fps) around each candidate moment before cutting. Notes are approximate; frames are truth.
