#!/usr/bin/env bash
set -euo pipefail

# Removes the CyberPath systemd service. The install directory (/opt/cyberpath) and the database are kept.
UNIT="cyberpath-server.service"

if [ "$(id -u)" -ne 0 ]; then
    echo "ERROR: run as root (sudo $0)" >&2
    exit 1
fi

if systemctl list-unit-files "$UNIT" >/dev/null 2>&1; then
    systemctl stop "$UNIT" 2>/dev/null || true
    systemctl disable "$UNIT" 2>/dev/null || true
fi
rm -f "/etc/systemd/system/$UNIT"
systemctl daemon-reload

echo "Service removed. /opt/cyberpath and the database were not deleted."
