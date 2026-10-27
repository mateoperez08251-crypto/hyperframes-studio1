param(
  [string]$Video = "irena-vitral-fine.mp4",
  [string]$Out   = "irena-vitral-musica.mp4",
  [double]$MusicVol = 0.40,  # volumen base de la musica (antes del ducking)
  [double]$DuckRatio = 4     # cuanto baja la musica cuando habla el narrador (mas alto = baja mas)
)
Set-Location D:\hyperframes-studio\vitral
$music = "D:\hyperframes-studio\Atmospheric Ambient Track (Extended).mp3"

# [0:a] = voz + efectos originales, [1:a] = musica
# - musica: fade-in 2s, fade-out 114-118s, volumen bajo
# - sidechaincompress: la musica baja cuando suena la voz
# - amix sin normalizar + loudnorm a -14 LUFS (redes)
$fc = "[0:a]asplit=2[voz][key];" +
      "[1:a]afade=t=in:st=0:d=2,afade=t=out:st=113:d=5,volume=$MusicVol,apad[mus];" +
      "[mus][key]sidechaincompress=threshold=0.03:ratio=${DuckRatio}:attack=15:release=450:makeup=1[duck];" +
      "[voz][duck]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]"

ffmpeg -nostdin -hide_banner -loglevel error -y -i $Video -i $music `
  -filter_complex $fc -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart $Out
"EXIT=$LASTEXITCODE  ->  $Out"
