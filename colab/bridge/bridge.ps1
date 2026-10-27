param(
    [ValidateSet('connect', 'status', 'list', 'get')][string]$Action = 'status',
    [string]$FileId = 'master',
    [string]$Output,
    [string]$Exports = (Join-Path $PSScriptRoot 'exports.json')
)
$ErrorActionPreference = 'Stop'
$taskPythonPath = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
if (-not (Test-Path -LiteralPath $taskPythonPath)) { throw 'Python runtime not found; configure taskPythonPath in bridge.ps1' }
$taskClientPath = Join-Path $PSScriptRoot 'client.py'
if ($Action -eq 'connect') {
    & $taskPythonPath (Join-Path $PSScriptRoot 'prepare.py') --exports $Exports
    if ($LASTEXITCODE -ne 0) { throw 'Bootstrap preparation failed' }
    $taskStateText = Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot 'bootstrap.local.py') | ssh -o ConnectTimeout=15 colab 'python -'
    if ($LASTEXITCODE -ne 0) { throw 'Remote bootstrap failed' }
    $taskState = ($taskStateText -join "`n") | ConvertFrom-Json
    $taskConfigPath = Join-Path $PSScriptRoot 'connection.local.json'
    $taskConfig = Get-Content -Raw -LiteralPath $taskConfigPath | ConvertFrom-Json
    $taskConfig.url = $taskState.url
    $taskConfig | ConvertTo-Json | Set-Content -LiteralPath $taskConfigPath -Encoding utf8
    & $taskPythonPath $taskClientPath status
} elseif ($Action -eq 'get') {
    if (-not $Output) { throw '-Output is required for a download' }
    & $taskPythonPath $taskClientPath get $FileId $Output --report (Join-Path $PSScriptRoot 'benchmark-last.json')
} else {
    & $taskPythonPath $taskClientPath $Action
}
if ($LASTEXITCODE -ne 0) { throw 'Bridge command failed; partial downloads are retained for resume' }
