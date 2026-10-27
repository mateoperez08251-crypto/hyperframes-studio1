@echo off
cd /d D:\hyperframes-studio\qwen20-work
echo ==== %date% %time% ==== > transcribe.log
npx --yes hyperframes@0.8.193 transcribe "audio\voz65.wav" --engine parakeet --language es --dir "audio\trans65" --json >> transcribe.log 2>&1
echo ==== EXIT=%ERRORLEVEL% ==== >> transcribe.log