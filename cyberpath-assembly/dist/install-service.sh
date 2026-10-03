#!/usr/bin/env bash
set -euo pipefail

# Installs CyberPath as a systemd service under /opt/cyberpath.
APP_USER="cyberpath"
INSTALL_DIR="/opt/cyberpath"
UNIT="cyberpath-server.service"
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$(id -u)" -ne 0 ]; then
    echo "ERROR: run as root (sudo $0)" >&2
    exit 1
fi

if ! command -v java >/dev/null 2>&1; then
    echo "WARNING: java not found on PATH. CyberPath needs Java 21 (e.g. Amazon Corretto 21)." >&2
fi

if ! id "$APP_USER" >/dev/null 2>&1; then
    useradd --system --no-create-home --shell /usr/sbin/nologin "$APP_USER"
    echo "Created system user $APP_USER"
fi

# Keep an existing configuration on upgrade
CONFIG="$INSTALL_DIR/server/application.properties"
SAVED_CONFIG=""
if [ -f "$CONFIG" ]; then
    SAVED_CONFIG="$(mktemp)"
    cp "$CONFIG" "$SAVED_CONFIG"
fi

mkdir -p "$INSTALL_DIR"
cp -R "$SRC_DIR"/bin "$SRC_DIR"/server "$SRC_DIR"/service "$INSTALL_DIR"/
if [ -n "$SAVED_CONFIG" ]; then
    cp "$SAVED_CONFIG" "$CONFIG"
    rm -f "$SAVED_CONFIG"
    echo "Kept existing configuration: $CONFIG"
fi

# Readable by the service user, writable only by root; the config holds the database password
chown -R root:"$APP_USER" "$INSTALL_DIR"
chmod -R u=rwX,g=rX,o= "$INSTALL_DIR"
chmod 750 "$INSTALL_DIR"/bin/*.sh
chmod 640 "$CONFIG"

install -m 644 "$INSTALL_DIR/service/systemd/$UNIT" "/etc/systemd/system/$UNIT"
systemctl daemon-reload

cat <<EOF

CyberPath installed to $INSTALL_DIR.

Next steps:
  1. Create the database:   sudo -u postgres createuser cyberpath -P && sudo -u postgres createdb -O cyberpath cyberpath
  2. Set the password in:   $CONFIG
  3. Start the service:     systemctl enable --now ${UNIT%.service}
  4. Open:                  http://127.0.0.1:8095
EOF
