# Formats: one timeline, many aspects

Keep the same timeline, the same audio and the same beats across aspects. Each aspect has its own scene files with re-laid type and its own camera framing.

## 16:9 (1920x1080)
The master. Text in the middle 80 percent; footage full-bleed; device frames side by side.

## 9:16 (1080x1920)
- Full-bleed footage from a 16:9 source needs scale >= 1.778 (cover), which shows about 32 percent of the source width. Choose a focus point per shot (the character, the action) and check that it stays in the column for the whole range; use pans when the action moves.
- Total scale stays under the quality limit (about 2.5x for 1080p pixel art), so 9:16 punch-ins are gentler (2.0-2.4x).
- The full source height is visible at 1.778x, so top HUD elements (timers, health) sit near the top edge where platform overlays live. To feature them, place the frame lower with a dark gradient band above (template `cam(..., { y: 300 })`).
- Stack slam lines vertically (one or two words per line), 120-230 px, inside 864 px width, out of the top 130 px and bottom 320 px.
- Landscape mobile captures: crop full-bleed around the subject and the touch controls; or show the real rotate-your-device gate as a beat.
- The end card stacks: art on top, text centered below, credits on two lines (one div per line, no `<br>`).

## 1:1 (1080x1080) and 4:5 (1080x1350)
For feeds (Instagram feed, LinkedIn, X). A 1920x1080 source covers 1:1 at scale 1.0 (showing 56 percent of the width) and 4:5 at scale 1.25 (45 percent). Frame like 9:16 but with more horizontal room. Type sizes sit between the 16:9 and 9:16 values.

## Verification per aspect
Snapshot the same proof times in every aspect. Typical misses: the subject outside the 9:16 column, text over a platform overlay, a line too wide only in the portrait cut, an end-card element cropped by the slow zoom.
