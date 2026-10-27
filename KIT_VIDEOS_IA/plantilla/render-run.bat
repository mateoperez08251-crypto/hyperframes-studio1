@echo off
REM ============================================================
REM  Render desacoplado + versiones fine (alta) y redes (ligera)
REM  Copiar a la carpeta del proyecto. Uso:  render-run.bat [nombre]
REM  Lanzar desde el agente con:
REM    Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
REM      CommandLine='cmd.exe /c D:\hyperframes-studio\<proy>\render-run.bat';
REM      CurrentDirectory='D:\hyperframes-studio\<proy>' }
REM ============================================================
setlocal
cd /d "%~dp0"
set NAME=%~1
if "%NAME%"=="" for %%I in ("%~dp0.") do set NAME=%%~nxI

REM Temporales en D: (C: esta casi lleno -> el render se cortaba)
set HYPERFRAMES_RENDER_DETACHED=1
if not exist D:\hf-temp mkdir D:\hf-temp
set TEMP=D:\hf-temp
set TMP=D:\hf-temp

echo ==== %date% %time% RENDER %NAME% ==== > render.log
call npx --yes hyperframes@0.8.193 render --quality delivery --output %NAME%.mp4 >> render.log 2>&1
echo ==== EXIT=%ERRORLEVEL% ==== >> render.log
if not exist %NAME%.mp4 (echo ==== ERROR: no se genero %NAME%.mp4 ==== >> render.log & exit /b 1)

ffmpeg -nostdin -hide_banner -loglevel error -y -i %NAME%.mp4 -c:v libx264 -profile:v high -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart %NAME%-fine.mp4 >> render.log 2>&1
echo ==== FINE EXIT=%ERRORLEVEL% ==== >> render.log
ffmpeg -nostdin -hide_banner -loglevel error -y -i %NAME%.mp4 -c:v libx264 -profile:v high -preset slow -crf 26 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart %NAME%-redes.mp4 >> render.log 2>&1
echo ==== ALL DONE EXIT=%ERRORLEVEL% ==== >> render.log
