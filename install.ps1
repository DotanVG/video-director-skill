# Install the video-director skill for Claude Code (Windows PowerShell).
#
# Usage: ./install.ps1 [-Project] [-SkipHyperFrames] [-Latest] [-NoTelemetry] [-Yes]
#   -Project           install into ./.claude/skills instead of ~/.claude/skills
#   -SkipHyperFrames   do not install or update the HyperFrames skills (do it yourself later)
#   -Latest            use the latest HyperFrames instead of the tested, pinned version
#   -NoTelemetry       turn off HyperFrames' anonymous usage telemetry (persists in ~/.hyperframes)
#   -Yes               do not ask before installing the HyperFrames skills
#
# What it changes on your machine:
#   - copies video-director/ into the skills folder; an existing copy is moved to
#     ~/.claude/skill-backups/ first (outside the skills folder, so it does not load twice)
#   - unless -SkipHyperFrames: runs "npx hyperframes@<version> skills update", which installs or
#     updates the HyperFrames skills for the AI coding tools it detects and removes HyperFrames
#     skills that are no longer published. Nothing else is installed.
param([switch]$Project, [switch]$SkipHyperFrames, [switch]$Latest, [switch]$NoTelemetry, [switch]$Yes)
$HfVersion = "0.8.114"   # tested with this HyperFrames release
$hf = if ($Latest) { "hyperframes@latest" } else { "hyperframes@$HfVersion" }

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$dest = if ($Project) { Join-Path (Get-Location) ".claude/skills" } else { Join-Path $HOME ".claude/skills" }
New-Item -ItemType Directory -Force $dest | Out-Null
$target = Join-Path $dest "video-director"
if (Test-Path $target) {
  $backupRoot = Join-Path $HOME ".claude/skill-backups"
  New-Item -ItemType Directory -Force $backupRoot | Out-Null
  $backup = Join-Path $backupRoot ("video-director-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
  Move-Item $target $backup
  Write-Output "existing copy moved to: $backup"
}
Copy-Item -Recurse (Join-Path $here "video-director") $target
Write-Output "installed: $target"

if ($NoTelemetry) {
  $env:HYPERFRAMES_NO_TELEMETRY = "1"
  npx --yes $hf telemetry disable *> $null
  if ($LASTEXITCODE -eq 0) { Write-Output "HyperFrames telemetry: disabled" }
  else { Write-Output "warning: could not disable telemetry (set HYPERFRAMES_NO_TELEMETRY=1)" }
}

if ($SkipHyperFrames) {
  Write-Output "skipped HyperFrames skills. Install them later with: npx $hf skills update"
} else {
  $go = $true
  if (-not $Yes -and [Environment]::UserInteractive -and -not [Console]::IsInputRedirected) {
    Write-Output "video-director needs the HyperFrames skills. This runs: npx $hf skills update"
    Write-Output "(installs/updates HyperFrames skills for the AI tools it detects, removes unpublished ones)"
    $ans = Read-Host "Continue? [Y/n]"
    if ($ans -match '^[nN]') { $go = $false }
  }
  if ($go) {
    npx --yes $hf skills update
    if ($LASTEXITCODE -ne 0) { Write-Output "warning: could not update HyperFrames skills (run: npx $hf skills update)" }
  } else {
    Write-Output "skipped. Install them later with: npx $hf skills update"
  }
}

Write-Output "checking tools..."
foreach ($t in "ffmpeg", "node", "python") {
  if (Get-Command $t -ErrorAction SilentlyContinue) { Write-Output "  $t ok" } else { Write-Output "  missing $t" }
}
Write-Output "optional Python packages: python -m pip install --user numpy fonttools brotli"
if (-not $NoTelemetry) {
  Write-Output "note: HyperFrames sends anonymous usage telemetry by default. Turn it off with"
  Write-Output "      npx $hf telemetry disable   (or set HYPERFRAMES_NO_TELEMETRY=1 or DO_NOT_TRACK=1)"
}
Write-Output "done. Restart Claude Code so the skill loads."
