@echo off
cd /d D:\hyperframes-studio\irena-video2
echo ==== %date% %time% LINT ==== > lintcheck.log
call npx hyperframes lint >> lintcheck.log 2>&1
echo ==== LINT EXIT=%ERRORLEVEL% ==== >> lintcheck.log
echo ==== %date% %time% CHECK ==== >> lintcheck.log
call npx hyperframes check >> lintcheck.log 2>&1
echo ==== CHECK EXIT=%ERRORLEVEL% ==== >> lintcheck.log
echo ==== DOM DONE ==== >> lintcheck.log
