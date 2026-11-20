@echo off
setlocal
cd /d "%~dp0"
set PORT=8080
set URL=http://localhost:%PORT%/

powershell -NoProfile -Command "try { $c = Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction Stop; if ($c) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %ERRORLEVEL%==0 (
  echo Serveur deja actif sur le port %PORT%.
  start "" "%URL%"
  exit /b 0
)

echo Demarrage du serveur portfolio sur le port %PORT%...
start "" "%URL%"

where py >nul 2>&1
if %ERRORLEVEL%==0 (
  py -m http.server %PORT%
  exit /b %ERRORLEVEL%
)

where python >nul 2>&1
if %ERRORLEVEL%==0 (
  python -m http.server %PORT%
  exit /b %ERRORLEVEL%
)

echo Python introuvable — fallback PowerShell HttpListener.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve-localhost.ps1" -Port %PORT%
exit /b %ERRORLEVEL%
