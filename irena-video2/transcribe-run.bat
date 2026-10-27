@echo off
cd /d D:\hyperframes-studio\irena-video2
echo ==== %date% %time% ==== > transcribe.log
"C:\Program Files\nodejs\node.exe" "C:\Users\yorgenis\AppData\Local\npm-cache\_npx\30c7b206fa5e0143\node_modules\hyperframes\bin\hyperframes.mjs" transcribe "audio\trans.wav" --engine parakeet --language es --dir "audio\trans" --json >> transcribe.log 2>&1
echo ==== EXIT=%ERRORLEVEL% ==== >> transcribe.log
