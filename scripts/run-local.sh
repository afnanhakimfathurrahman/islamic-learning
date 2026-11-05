#!/usr/bin/env bash
# Jalankan situs secara lokal untuk review. Usage: bash scripts/serve-local.sh [port]
# Buka http://localhost:<port>/ di browser HP (atau http://<ip-wifi>:<port>/ dari perangkat lain).
set -e
PORT="${1:-8080}"
cd "$(dirname "$0")/.."
IP=$(ifconfig 2>/dev/null | awk '/inet / && $2!="127.0.0.1"{print $2; exit}')
echo "Melayani $(pwd)"
echo "  Lokal : http://localhost:$PORT/"
[ -n "$IP" ] && echo "  Jaringan: http://$IP:$PORT/"
echo "Tekan Ctrl+C untuk berhenti."
exec python3 -I -m http.server "$PORT" --bind 0.0.0.0
