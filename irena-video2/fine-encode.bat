@echo off
setlocal
cd /d D:\hyperframes-studio\irena-video
echo ==== %date% %time% ==== >> fine.log
ffmpeg -nostdin -hide_banner -loglevel error -y -i irena-sendler-20s.mp4 -c:v libx264 -profile:v high -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart irena-sendler-fine.mp4 >> fine.log 2>&1
echo ==== EXIT=%ERRORLEVEL% ==== >> fine.log
