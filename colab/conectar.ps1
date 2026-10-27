param([Parameter(Mandatory)][string]$HostName)
# Registra/actualiza el alias "colab" en ~/.ssh/config y prueba la conexion.
$key = "D:\hyperframes-studio\colab\colab_key"
$cf  = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
$HostName = $HostName -replace '^https?://','' -replace '/.*$',''

# Windows OpenSSH exige que la llave privada solo la lea el usuario
icacls $key /inheritance:r /grant:r "$($env:USERNAME):(R)" | Out-Null

$cfgDir = "$env:USERPROFILE\.ssh"; New-Item -ItemType Directory -Force $cfgDir | Out-Null
$cfg = "$cfgDir\config"
$old = if (Test-Path $cfg) { Get-Content $cfg -Raw } else { "" }
$old = [regex]::Replace($old, '(?ms)^# >>> colab >>>.*?# <<< colab <<<\r?\n?', '')
$block = @"
# >>> colab >>>
Host colab
  HostName $HostName
  User root
  IdentityFile $key
  ProxyCommand "$cf" access ssh --hostname %h
  StrictHostKeyChecking no
  UserKnownHostsFile NUL
  ServerAliveInterval 30
# <<< colab <<<
"@
Set-Content $cfg ($old.TrimEnd() + "`r`n" + $block + "`r`n") -Encoding ascii
ssh colab "echo CONECTADO; nvidia-smi --query-gpu=name,memory.total --format=csv,noheader; echo CPUs: `$(nproc)"
