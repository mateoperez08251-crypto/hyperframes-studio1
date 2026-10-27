$ErrorActionPreference = 'Stop'
$taskProjectRoot = Split-Path -Parent $PSScriptRoot
$taskOutput = Join-Path $taskProjectRoot 'irena-cine-20s.mp4'
$taskTemporary = "$taskOutput.assembling"
$taskFiles = @("$taskOutput.partial") + (0..3 | ForEach-Object { Join-Path $taskProjectRoot ".transfer/part-$_" })
$taskTotal = ($taskFiles | ForEach-Object { (Get-Item -LiteralPath $_).Length } | Measure-Object -Sum).Sum
if ($taskTotal -ne 79331914) { throw "Incomplete download: $taskTotal / 79331914 bytes" }
$taskWriter = [System.IO.File]::Open($taskTemporary, [System.IO.FileMode]::CreateNew)
try {
    foreach ($taskFile in $taskFiles) {
        $taskReader = [System.IO.File]::OpenRead($taskFile)
        try { $taskReader.CopyTo($taskWriter) } finally { $taskReader.Dispose() }
    }
} finally { $taskWriter.Dispose() }
$taskActualHash = (Get-FileHash -LiteralPath $taskTemporary -Algorithm SHA256).Hash
if ($taskActualHash -ne '9C9669AA9FD621B80085ADA2C358BFBF2743CC3567A821EA6698E9431302F86C') { throw 'SHA256 mismatch; source parts preserved' }
Move-Item -LiteralPath $taskTemporary -Destination $taskOutput
Write-Output 'Master assembled and SHA256 verified: 79331914 bytes'
