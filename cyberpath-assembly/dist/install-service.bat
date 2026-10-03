@echo off
setlocal

rem Installs CyberPath as a Windows service (WinSW) under C:\cyberpath.
set "SRC_DIR=%~dp0"
set "INSTALL_DIR=C:\cyberpath"
set "SERVICE_ID=cyberpath-server"
set "WINSW_URL=https://github.com/winsw/winsw/releases/download/v2.12.0/WinSW-x64.exe"

net session >nul 2>&1
if errorlevel 1 (
    echo ERROR: run this script as Administrator. >&2
    exit /b 1
)

where java >nul 2>&1
if errorlevel 1 echo WARNING: java not found on PATH. CyberPath needs Java 21 (e.g. Amazon Corretto 21).

rem Keep an existing configuration on upgrade
set "CONFIG=%INSTALL_DIR%\server\application.properties"
if exist "%CONFIG%" copy /y "%CONFIG%" "%TEMP%\cyberpath-application.properties" >nul

robocopy "%SRC_DIR%bin" "%INSTALL_DIR%\bin" /E /NFL /NDL /NJH /NJS >nul
robocopy "%SRC_DIR%server" "%INSTALL_DIR%\server" /E /NFL /NDL /NJH /NJS >nul
robocopy "%SRC_DIR%service" "%INSTALL_DIR%\service" /E /NFL /NDL /NJH /NJS >nul

if exist "%TEMP%\cyberpath-application.properties" (
    move /y "%TEMP%\cyberpath-application.properties" "%CONFIG%" >nul
    echo Kept existing configuration: %CONFIG%
)

set "WINSW_DIR=%INSTALL_DIR%\service\winsw"
if not exist "%WINSW_DIR%\%SERVICE_ID%.exe" (
    echo Downloading WinSW...
    curl -fsSL -o "%WINSW_DIR%\%SERVICE_ID%.exe" "%WINSW_URL%"
    if errorlevel 1 (
        echo ERROR: could not download WinSW from %WINSW_URL% >&2
        exit /b 1
    )
)

"%WINSW_DIR%\%SERVICE_ID%.exe" install
if errorlevel 1 exit /b 1

echo.
echo CyberPath installed to %INSTALL_DIR%.
echo.
echo Next steps:
echo   1. Create the PostgreSQL database "cyberpath" owned by user "cyberpath".
echo   2. Set the password in: %CONFIG%
echo   3. Start the service:   "%WINSW_DIR%\%SERVICE_ID%.exe" start
echo   4. Open:                http://127.0.0.1:8095
