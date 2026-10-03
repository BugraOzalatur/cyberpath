@echo off
setlocal

rem Removes the CyberPath Windows service. C:\cyberpath and the database are kept.
set "SERVICE_EXE=C:\cyberpath\service\winsw\cyberpath-server.exe"

net session >nul 2>&1
if errorlevel 1 (
    echo ERROR: run this script as Administrator. >&2
    exit /b 1
)

if not exist "%SERVICE_EXE%" (
    echo Service wrapper not found: %SERVICE_EXE%
    exit /b 0
)

"%SERVICE_EXE%" stop
"%SERVICE_EXE%" uninstall

echo Service removed. C:\cyberpath and the database were not deleted.
