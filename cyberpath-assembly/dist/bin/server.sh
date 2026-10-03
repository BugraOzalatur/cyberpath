#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVICE_DIR="$BASE_DIR/server"

JAR="$(ls "$SERVICE_DIR"/cyberpath-api*.jar 2>/dev/null | head -1)"
if [ -z "$JAR" ]; then
    echo "ERROR: server JAR not found in $SERVICE_DIR" >&2
    exit 1
fi

cd "$SERVICE_DIR"
exec java ${JAVA_OPTS:-} -jar "$JAR" "$@"
