@echo off
setlocal
set HYPERFRAMES_RENDER_DETACHED=1
if not exist D:\hf-temp mkdir D:\hf-temp
set TEMP=D:\hf-temp
set TMP=D:\hf-temp
cd /d D:\hyperframes-studio\vitral
echo ==== %date% %time% RENDER ==== > render.log
"C:\Program Files\nodejs\node.exe" "C:\Users\yorgenis\AppData\Local\npm-cache\_npx\30c7b206fa5e0143\node_modules\hyperframes\bin\hyperframes.mjs" render --quality delivery --output irena-vitral.mp4 >> render.log 2>&1
echo ==== EXIT=%ERRORLEVEL% ==== >> render.log
echo ==== RENDER DONE, INICIANDO FINE-ENCODE ==== >> render.log
ffmpeg -nostdin -hide_banner -loglevel error -y -i irena-vitral.mp4 -c:v libx264 -profile:v high -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart irena-vitral-fine.mp4 >> render.log 2>&1
echo ==== FINE EXIT=%ERRORLEVEL% ==== >> render.log
ffmpeg -nostdin -hide_banner -loglevel error -y -i irena-vitral.mp4 -c:v libx264 -profile:v high -preset slow -crf 26 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart irena-vitral-redes.mp4 >> render.log 2>&1
echo ==== ALL DONE EXIT=%ERRORLEVEL% ==== >> render.log
