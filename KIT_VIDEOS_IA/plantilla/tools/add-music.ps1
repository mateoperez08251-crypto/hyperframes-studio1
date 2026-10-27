param(
  [Parameter(Mandatory)][string]$Video,      # p.ej. mi-video-fine.mp4
  [Parameter(Mandatory)][string]$Music,      # ruta del mp3 de musica
  [string]$Out = "",                          # por defecto <video>-musica.mp4
  [double]$MusicVol = 0.40,                   # volumen base de la musica
  [double]$DuckRatio = 4,                     # cuanto baja al hablar (mas alto = baja mas)
  [switch]$Loop,                              # repetir la musica si es mas corta que el video
  [switch]$Redes                              # crear tambien la version ligera para redes
)
# Mezcla musica de fondo bajo la voz SIN re-renderizar el video.
$ErrorActionPreference = "Stop"
if (-not $Out) { $Out = [IO.Path]::GetFileNameWithoutExtension($Video) -replace '-fine$','' ; $Out += "-musica.mp4" }
$dur = [double](ffprobe -v error -show_entries format=duration -of csv=p=0 $Video)
$fo  = [math]::Max(0, $dur - 5)
$loopArg = if ($Loop) { @("-stream_loop","-1") } else { @() }

$fc = "[0:a]asplit=2[voz][key];" +
      "[1:a]afade=t=in:st=0:d=2,afade=t=out:st=${fo}:d=5,volume=$MusicVol,apad[mus];" +
      "[mus][key]sidechaincompress=threshold=0.03:ratio=${DuckRatio}:attack=15:release=450:makeup=1[duck];" +
      "[voz][duck]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]"

ffmpeg -nostdin -hide_banner -loglevel error -y -i $Video @loopArg -i $Music `
  -filter_complex $fc -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart $Out
if ($LASTEXITCODE) { throw "ffmpeg fallo ($LASTEXITCODE)" }

if ($Redes) {
  $r = $Out -replace '\.mp4$','-redes.mp4'
  ffmpeg -nostdin -hide_banner -loglevel error -y -i $Out -c:v libx264 -profile:v high -preset slow -crf 26 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart $r
}
# Verificacion de volumen
$ErrorActionPreference = "Continue"
cmd /c "ffmpeg -nostdin -hide_banner -i `"$Out`" -af ebur128=peak=true -f null - 2>&1" | Select-String '^\s+(I:|Peak:)'
"OK -> $Out"
