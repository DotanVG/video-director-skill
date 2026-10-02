# Platform delivery specs

**Last verified: October 2026.** Specs change. Re-check the official page before a final export, and tell the user when you could not.

| Platform | Aspect | Resolution / fps | Length | Codec / container | Notes |
| --- | --- | --- | --- | --- | --- |
| Steam store trailer | 16:9 preferred (4:3 accepted) | up to 1920x1080, 30 or 60 fps | any; 30-90 s typical | MP4/MOV/WMV, H.264 + AAC preferred, 5000+ kbps | First trailer mostly gameplay from the player's view; audio becomes stereo. Source: partner.steamgames.com/doc/store/trailer |
| itch.io | 16:9 | YouTube / Vimeo embed | 30-90 s | via host | Cover 630x500 (or 315x250); animated GIF cover plays on hover, 5-15 s, keep under about 10 MB |
| App Store app preview | portrait or landscape per device class | for example 886x1920 or 1080x1920 (current iPhones), 30 fps | 15-30 s | MOV/M4V/MP4, H.264 or ProRes 422 HQ, up to 500 MB, AAC stereo 256 kbps+ | Must be captured from the app; up to 3 per locale. Source: developer.apple.com/help/app-store-connect (App preview specifications) |
| Google Play preview | landscape recommended for games | YouTube upload | first 30 s autoplay | YouTube watch URL | No playlists or short links, not age restricted, monetization off |
| YouTube | 16:9 | 1080p or 4K, source fps | any | MP4 H.264 + AAC | Normalizes to about -14 LUFS; custom thumbnail matters |
| YouTube Shorts | 9:16 | 1080x1920 | up to 3 min | MP4 | Safe zones like TikTok |
| TikTok | 9:16 | 1080x1920, 30-60 fps | up to 10 min for most accounts | MP4 H.264 + AAC | Text out of about top 130, bottom 320, right 120 px |
| Instagram Reels | 9:16 | 1080x1920 | uploads up to 20 min; keep under 3 min for reach (under 60 s for trailers) | MP4 | Same safe zones; cover frame 9:16 with a 1:1 center |
| X | 16:9, 1:1 or 9:16 | up to 1920x1200 | 140 s standard accounts | MP4/MOV, up to 512 MB | Autoplays muted; burned-in text matters |
| LinkedIn | 1:1 or 4:5 best in feed, 16:9 ok | 1080p | 3 s to 15 min | MP4, up to 5 GB | Professional tone, captions |
| Discord / WhatsApp / Telegram | as made | 480p-720p share copy | short | MP4 H.264 main profile, AAC, faststart | WhatsApp video messages are capped at about 16 MB; `scripts/share_versions.sh` makes 480p copies of about 3 MB per 30 s |
| Website hero | 16:9 or 21:9 | 1080p, 2-6 Mbps | 6-20 s loop | MP4 H.264 + WebM, muted | Seamless loop, no essential audio |

Loudness target defaults to -14 LUFS integrated, -1 dBTP, unless the platform or publisher specifies otherwise.

Delivery naming suggestion: `<project>-<version>-<aspect>.mp4` (for example `trailer-v2-B-menu-to-loop-16x9.mp4`), share copies `<same>-480p.mp4`, GIFs `<same>-<moment>.gif`.
