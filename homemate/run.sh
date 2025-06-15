#!/usr/bin/env bash
set -e

CONFIG_PATH=/data/options.json

# Extract token from Home Assistant add-on config
token=$(jq --raw-output '.token // empty' "$CONFIG_PATH")

# Inject into the frontend as a JS file that can be loaded
rm -rf ./public/env-config.js
touch ./public/env-config.js
echo "window._env_ = { token: '${token}' }" >> ./public/env-config.js

# Also export it for runtime environment use (if needed)
export NEXT_PUBLIC_TOKEN="${token}"

# Start Next.js server (port 3000) in background
npm start &

# Start NGINX in foreground (port 8099 for ingress)
nginx -g 'daemon off;'
