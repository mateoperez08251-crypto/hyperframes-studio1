@echo off
setlocal
set HYPERFRAMES_RENDER_DETACHED=1
cd /d D:\hyperframes-studio\qwen
echo ==== %date% %time% ==== >> render.log
"C:\Program Files\nodejs\node.exe" "C:\Users\yorgenis\AppData\Local\npm-cache\_npx\30c7b206fa5e0143\node_modules\hyperframes\bin\hyperframes.mjs" render --quality delivery --output qwen-3.8.mp4 >> render.log 2>&1
echo ==== EXIT=%ERRORLEVEL% ==== >> render.log