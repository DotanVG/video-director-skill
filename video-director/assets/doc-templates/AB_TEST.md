# <Project> video: music A/B/C test

Same picture edit in every file; only the music (and its accents) changes. All files: <duration> s, <fps> fps, H.264 + AAC 48 kHz stereo.

| File | Size | Loudness | How the music changes the feel |
| --- | --- | --- | --- |
| <prefix>-A-16x9.mp4 | 1920x1080 | <-14.0 LUFS, -1.1 dBTP> | <one line> |
| <prefix>-B-16x9.mp4 | 1920x1080 | | |
| <prefix>-A-9x16.mp4 | 1080x1920 | | |

## Director's pick
- Long-form and stores (16:9): **<version>**, because <reason tied to how people watch there>.
- Short-form feeds (9:16): **<version>**, because <reason>.

## Sync checks
- <Switch at X s lands within N ms of the cut; kicks after it sit on the grid (waveform image).>
- <Crossfade starts and ends on bar lines; final phrase resolves before the last frame.>

## Checks done on every file
ffprobe (size, fps, duration, codecs), integrated loudness and true peak, a 1 fps contact sheet, waveform pictures at music changes.
