#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/images"

if ! command -v docker >/dev/null 2>&1; then
    echo "ERROR: docker not found on PATH" >&2
    exit 1
fi

shopt -s nullglob
images=("$IMAGES_DIR"/cyberpath-*.tar)
if [ ${#images[@]} -eq 0 ]; then
    echo "ERROR: no cyberpath-*.tar found in $IMAGES_DIR" >&2
    exit 1
fi

for image in "${images[@]}"; do
    echo "Loading $(basename "$image")..."
    docker load -i "$image"
done

echo
docker images cyberpath/*

cat <<EOF

Next steps:
  1. cp .env.example .env   and set DB_PASSWORD
  2. docker compose up -d
  3. Open http://127.0.0.1:5180
EOF
