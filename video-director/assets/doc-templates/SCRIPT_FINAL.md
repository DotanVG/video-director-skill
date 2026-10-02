# <Project> video: final script and edit decision list

<duration> s, <fps> fps. Aspects: <list>. All aspects share one timeline and the same audio.
Grid: <track> at <BPM> BPM, beat <s>, bar <s>. Track offset <s> puts a downbeat on 0.0, so scene changes (<list>) sit on bar lines and slams on beats.

Hook: <one line>

## Timing table

| Time | Picture (clip, range) | Camera | Words (beat they land on) |
| --- | --- | --- | --- |
| 0.0-4.0 | <clip 12.0-16.0 or black> | <punch 1.5x on subject> | <WORD 0.0, WORD 0.5, HERO WORD 3.0 (accent)> |

Footage treatment: <payload values>. Type: <fonts, sizes, colors>. Safe zones respected: <HUD, platform overlays>.

## Music offsets per version

| Version | Element | File | File range | Video time | Gain and envelope |
| --- | --- | --- | --- | --- | --- |
| A | music | <file> | <14.0-44.0> | 0.0-30.0 | <0.75, fade in 0.3, out 28.5-30> |

## SFX placements (identical in all versions)

| Time | Sound | Source | Volume | Picture moment |
| --- | --- | --- | --- | --- |

## Mastering
Rendered, then two-pass loudnorm to <-14 LUFS, -1 dBTP>, video stream copied. Raw renders in work/raw/.

## Rebuild
```
node build.mjs
./render-all.sh
python <skill>/scripts/master.py renders/*.mp4
```
