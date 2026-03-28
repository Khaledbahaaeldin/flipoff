@echo off
setlocal

cd /d "%~dp0"
set PORT=8080
set URL=http://localhost:%PORT%/

set PY_CMD=
where py >nul 2>&1
if %errorlevel%==0 set PY_CMD=py -3

if not defined PY_CMD (
  where python >nul 2>&1
  if %errorlevel%==0 set PY_CMD=python
)

if not defined PY_CMD (
  echo [FlipOff] Python was not found.
  echo Install Python 3 and run this script again.
  pause
  exit /b 1
)

echo [FlipOff] Starting local server on port %PORT%...
start "FlipOff Server" /MIN cmd /k "%PY_CMD% -m http.server %PORT%"

REM Wait briefly so the server can initialize.
timeout /t 2 /nobreak >nul

echo [FlipOff] Opening entry page: %URL%
start "" "%URL%"

endlocal
exit /b 0
