# Changelog

## 1.2 (2026-10-03)

- Installer pins HyperFrames to the tested version (0.8.114). Use `--latest` to override.
- Installer asks before installing the HyperFrames skills, and adds `--skip-hyperframes`, `--no-telemetry` and `--yes`.
- Installer moves an existing copy to `~/.claude/skill-backups/` instead of deleting it.
- New rule in `SKILL.md`: everything runs locally. No cloud rendering, publishing, paid TTS, uploads or credits without the user's explicit approval. Screen recording and dev servers only for an agreed capture.
- `scripts/contact_sheet.sh` validates its numeric arguments and no longer passes them into `python -c`.
- README: "What it runs on your machine" section, installer options, recommended model note.
- Added `SECURITY.md` and this changelog.

## 1.1 (2026-10-03)

- Tighter description; `license`, `compatibility` and `metadata` (version, requires) frontmatter.
- Stronger autonomy rule and an explicit "run `npx hyperframes skills update` first" step.
- Contents sections on long references, script tables in `sound.md` and `qa-delivery.md`, a "Last verified" date in `platforms.md`.
- Usage lines on every Python script, and a note in the template README on when to use the template.

## 1.0 (2026-10-02)

- First release: the 9-phase director and editor process, 11 reference files, 8 helper scripts, a tested edit generator template, document templates, install scripts and examples.
