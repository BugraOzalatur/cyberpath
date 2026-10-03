@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "BASE_DIR=%SCRIPT_DIR%.."
set "SERVICE_DIR=%BASE_DIR%\server"

cd /d "%SERVICE_DIR%"

for %%f in (cyberpath-api*.jar) do set "JAR=%%f"
if not defined JAR (
    echo ERROR: server JAR not found in %SERVICE_DIR% >&2
    exit /b 1
)

java %JAVA_OPTS% -jar "%JAR%" %*
