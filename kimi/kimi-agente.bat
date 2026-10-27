@echo off
REM ============================================================
REM  Abre un agente con Kimi K3.1 Pro que SI ejecuta comandos
REM  (Claude Code apuntando a los servidores de Kimi/Moonshot).
REM  Doble clic para abrirlo. Requiere haber corrido set-key.ps1
REM ============================================================
setlocal
for /f "usebackq delims=" %%K in (`powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('MOONSHOT_API_KEY','User')"`) do set MOONSHOT_API_KEY=%%K
if "%MOONSHOT_API_KEY%"=="" (
  echo Falta tu clave. Ejecuta primero:
  echo   powershell -ExecutionPolicy Bypass -File D:\hyperframes-studio\kimi\set-key.ps1
  pause & exit /b 1
)
set ANTHROPIC_API_KEY=
set ANTHROPIC_BASE_URL=https://api.moonshot.ai/anthropic
set ANTHROPIC_AUTH_TOKEN=%MOONSHOT_API_KEY%
set MAIN=kimi-k3.1-pro
if /i "%~1"=="k3" (set MAIN=kimi-k3& shift)
set ANTHROPIC_MODEL=%MAIN%
set ANTHROPIC_SMALL_FAST_MODEL=kimi-k3
set ANTHROPIC_DEFAULT_HAIKU_MODEL=kimi-k3
set CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
REM Temporales en D: (C: casi lleno)
set TEMP=D:\hf-temp
set TMP=D:\hf-temp
if not exist D:\hf-temp mkdir D:\hf-temp
cd /d D:\hyperframes-studio
title Kimi (%MAIN%) - HyperFrames Studio
if /i "%MAIN%"=="kimi-k3" (claude) else (claude %*)
