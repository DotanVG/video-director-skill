# Security policy

## Reporting a problem

Please report security issues privately through GitHub: open the repository's **Security** tab and choose **Report a vulnerability**. Don't open a public issue for security problems.

Useful things to include: the affected file (skill instruction, script or installer), how to reproduce it, and what an attacker could achieve.

## Scope

- `video-director/SKILL.md` and `references/`: instructions that could make an agent take unsafe actions, such as uploading files, spending credits or running commands it shouldn't.
- `video-director/scripts/` and `assets/template/`: unsafe handling of input, paths or shell commands.
- `install.sh` and `install.ps1`: anything that changes your machine beyond what the README describes.

HyperFrames itself is a separate project by HeyGen. Report issues in HyperFrames to its maintainers.

## Supported versions

Only the latest release gets fixes.
