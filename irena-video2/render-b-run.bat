@echo off
setlocal
set HYPERFRAMES_RENDER_DETACHED=1
cd /d D:\hyperframes-studio\irena-video2
echo ==== %date% %time% RENDER ==== > render.log
"C:\Program Files\nodejs\node.exe" "C:\Users\yorgenis\AppData\Local\npm-cache\_npx\30c7b206fa5e0143\node_modules\hyperframes\bin\hyperframes.mjs" render --quality delivery --output irena-sendler-b.mp4 >> render.log 2>&1
echo ==== EXIT=%ERRORLEVEL% ==== >> render.log
echo ==== RENDER DONE, INICIANDO FINE-ENCODE ==== >> render.log
ffmpeg -nostdin -hide_banner -loglevel error -y -i irena-sendler-b.mp4 -c:v libx264 -profile:v high -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart irena-sendler-b-fine.mp4 >> render.log 2>&1
echo ==== FINE EXIT=%ERRORLEVEL% ==== >> render.log
