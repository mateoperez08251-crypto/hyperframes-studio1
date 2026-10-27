# Guarda tu clave de Kimi de forma permanente (solo para tu usuario de Windows).
$k = Read-Host "Pega tu clave de Kimi (sk-...)" -AsSecureString
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($k))
if (-not $plain.StartsWith("sk-")) { Write-Host "Eso no parece una clave (debe empezar por sk-)"; exit 1 }
[Environment]::SetEnvironmentVariable("MOONSHOT_API_KEY", $plain, "User")
$env:MOONSHOT_API_KEY = $plain
Write-Host "Clave guardada. Probando..."
node "$PSScriptRoot\kimi.js" --fast --effort low "Responde solo: OK, Kimi conectado"
