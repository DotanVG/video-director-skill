# Install the video-director skill for Claude Code (Windows PowerShell).
# Usage: ./install.ps1            (user-level: ~/.claude/skills)
#        ./install.ps1 -Project   (project-level: ./.claude/skills)
param([switch]$Project)
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$dest = if ($Project) { Join-Path (Get-Location) ".claude/skills" } else { Join-Path $HOME ".claude/skills" }
New-Item -ItemType Directory -Force $dest | Out-Null
$target = Join-Path $dest "video-director"
if (Test-Path $target) { Remove-Item -Recurse -Force $target }
Copy-Item -Recurse (Join-Path $here "video-director") $target
Write-Output "installed: $target"

Write-Output "installing / refreshing the HyperFrames skills it builds on..."
npx --yes hyperframes skills update

Write-Output "checking tools..."
foreach ($t in "ffmpeg", "node", "python") {
  if (Get-Command $t -ErrorAction SilentlyContinue) { Write-Output "  $t ok" } else { Write-Output "  missing $t" }
}
Write-Output "optional Python packages: python -m pip install --user numpy fonttools brotli"
Write-Output "done. Restart Claude Code so the skill loads."
