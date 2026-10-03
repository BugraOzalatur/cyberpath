@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "IMAGES_DIR=%SCRIPT_DIR%images"

where docker >nul 2>&1
if errorlevel 1 (
    echo ERROR: docker not found on PATH >&2
    exit /b 1
)

set "FOUND="
for %%f in ("%IMAGES_DIR%\cyberpath-*.tar") do (
    set "FOUND=1"
    echo Loading %%~nxf...
    docker load -i "%%f"
    if errorlevel 1 exit /b 1
)
if not defined FOUND (
    echo ERROR: no cyberpath-*.tar found in %IMAGES_DIR% >&2
    exit /b 1
)

echo.
docker images cyberpath/*

echo.
echo Next steps:
echo   1. copy .env.example .env   and set DB_PASSWORD
echo   2. docker compose up -d
echo   3. Open http://127.0.0.1:5180
