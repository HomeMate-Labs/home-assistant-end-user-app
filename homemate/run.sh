#!/usr/bin/env bash
set -e

CONFIG_PATH=/data/options.json

echo "[run.sh] Starting..."

# Extract token
token=$(jq --raw-output '.token // empty' "$CONFIG_PATH")
echo "[run.sh] Token from config: $token"

# Inject into frontend
rm -rf ./public/env-config.js
touch ./public/env-config.js
echo "window._env_ = { token: '${token}' }" >> ./public/env-config.js
echo "[run.sh] env-config.js created"

export NEXT_PUBLIC_TOKEN="${token}"
echo "[run.sh] NEXT_PUBLIC_TOKEN env var set"

# Start Next.js server in background
echo "[run.sh] Starting Next.js server (npm start) in background..."
npm start &
NEXTJS_PID=$!

# Give Next.js a moment to start
sleep 5

# Check if Next.js is still running
if ps -p $NEXTJS_PID > /dev/null; then
  echo "[run.sh] Next.js server is running (PID $NEXTJS_PID)"
else
  echo "[run.sh] ERROR: Next.js server failed to start"
  exit 1
fi

# Start NGINX in foreground
echo "[run.sh] Starting NGINX..."
nginx -g 'daemon off;'
