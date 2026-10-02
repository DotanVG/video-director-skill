# Director's playbook

## Contents
1. The hook line
2. Arcs by video type
3. Pacing by length
4. Copy rules
5. Shot list and timing table
6. Music strategy and A/B/C versions
7. Director's review checklist

## 1. The hook line

Write one sentence that is the whole video. Example shape: "You are the X. Y is the real enemy." or "Do Z in one click." Every scene must serve it. If a scene would fit any video, cut it.

Test the first 2 seconds alone: muted, on a phone. Would someone stop scrolling? If not, swap in your strongest visual or sharpest line.

## 2. Arcs by video type

| Type | Arc | Notes |
| --- | --- | --- |
| Game trailer (store) | Hook gameplay (0-3 s) > core loop > escalation (bigger enemies, boss, special ability) > stakes / unique mechanic > platforms > title + CTA | Real gameplay early. Logo at the end. See `game-trailers.md`. |
| Game teaser / social | Provocative line or moment > one mechanic > the twist > title + date or URL | Can open on text if the line is strong; keep it under 4 s. |
| Game jam trailer | Premise in one line > loop > theme tie-in > play-in-browser CTA | Mention the jam and theme only if true and the user wants it. |
| Product / SaaS launch | Problem in one line > product moment that solves it > 2-3 proof beats (UI zoom-ins) > CTA | Never redraw screenshots; zoom into the real UI. |
| App store preview | Core action within 1 s > 3 key flows > end on the main screen | Platform rules: real app footage only (see `platforms.md`). |
| Sizzle / highlight reel | Cold open on the best moment > rhythmic montage by theme > emotional peak > logo | Music drives everything. |
| Explainer cutdown | Question > answer visual > 3 supporting beats > takeaway | Use captions; assume muted. |
| Event recap | Energy shot > people > key moments > thanks + next date | Faces and crowd reactions. |

Classic three-part structure for anything persuasive: **Hook > Genre / what it is > Content / proof**, then the ask.

## 3. Pacing by length

| Length | Scenes | Average shot | Text screens |
| --- | --- | --- | --- |
| 6 s | 1-2 | 1-2 s | 1 |
| 15 s | 3-4 | 0.5-1.5 s | 2-3 |
| 30 s | 6-7 | 0.5-2 s, one held 3-4 s shot | 6-8 |
| 60 s | 10-14 | 1-3 s | 8-12 |
| 90-120 s | 3 acts | 1-4 s | sparse; let footage breathe |

At 120 BPM a bar is 2 s: a 30 s video is 15 bars. Plan scenes in 2-bar (4 s) blocks and the end card in 3 bars (6 s).

Rhythm inside a scene: fast cuts (1 beat or 2 beats) for energy, then one long held shot for the money moment, then a punctuation (hard cut to black, flash, freeze on the title).

## 4. Copy rules

- Facts only from the user's material. No invented awards, review quotes, player counts, prices or dates.
- Short imperative or declarative lines: 1 to 4 words per screen for slams, up to 7 for a small label.
- One accent word per screen (the verb or the stake).
- Read it aloud on the beat grid: if a line cannot be read in the time it is on screen (about 3 words per second for slams, 1 s minimum hold), cut words or extend.
- Credits: the user's credit list, exact spelling, small, on the end card.
- No em dashes in on-screen copy unless the brand uses them; prefer periods.

## 5. Shot list and timing table

Before building, write `SCRIPT_FINAL.md` with one row per scene and a row per inner cut:

| Time | Picture (clip, range) | Camera | Words (beat) | SFX |

Pick shots from contact sheets, not from notes. For each shot record the subject's position in the frame (x, y as fractions) so camera focus math is ready, and note anything to avoid (popups, debug overlays, cursor).

## 6. Music strategy and A/B/C versions

The picture is locked to one grid; versions only swap the soundtrack and its accents. Typical trio:

- **A, one track**: the energetic track from frame 1, offset so a downbeat lands at 0.0, fade in 0.3 s, fade out over the last bar or 1.5 s. Best for feeds.
- **B, calm-to-hit**: a calm or dark track under the hook, then a hard switch to the energetic track exactly on the first action cut, covered by a short impact SFX. Best story beat; strongest for store pages and YouTube.
- **C, bookend**: the energetic track for the body, then a one-bar crossfade into the brand or title theme for the end card, offset so its final phrase resolves at the last frame. Ends on identity.

Write `renders/AB_TEST.md` with one line per file on how the music changes the feel, plus your pick per platform and why.

## 7. Director's review checklist

Watch the contact sheet and, if possible, the video at full speed:

- First 2 seconds: does it hook muted?
- Can every line be read in its time? Is any text overlapping, cropped, or on top of UI?
- Does every scene change land on a bar line and every slam on a beat?
- Is the subject visible in every punch-in (not cropped out, not hidden by an overlay)?
- Is there a held moment where the viewer can breathe?
- Is the end card readable for at least 3 seconds with the URL/CTA fully built?
- Does the sound carry the energy without SFX clutter? Is loudness on target?
