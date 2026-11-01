#!/usr/bin/env bash
# Hentikan server lokal. Usage: bash scripts/stop-local.sh [port]   (default 8080)
PORT="${1:-8080}"
if pkill -f "http.server $PORT" 2>/dev/null; then
    echo "Server di port $PORT dihentikan."
else
    echo "Tidak ada server berjalan di port $PORT."
fi
