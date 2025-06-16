#ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:latest
ARG BUILD_FROM
# ---- Stage 1: Pull Node.js 20 from official Alpine-based image ----
FROM node:22-alpine AS node

# ---- Stage 2: Main Add-on image (Home Assistant Alpine base) ----
FROM $BUILD_FROM

# Create necessary directories
RUN mkdir -p /run/nginx /usr/local/bin /usr/local/lib /usr/local/include /usr/local/share

# Copy only Node.js runtime (node + npm + required libs)
COPY --from=node /usr/local/bin /usr/local/bin
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/lib /usr/lib

# Optionally: Add nginx if needed
RUN apk add --no-cache nginx

# Verify node and npm versions (optional)
RUN node -v && npm -v

# Set working directory
WORKDIR /app

# Copy files needed for install
COPY next_build_output/package.json .
COPY next_build_output/package-lock.json .
COPY next_build_output/.npmrc .npmrc

# Install prod deps
RUN npm ci --only=production

# Copy rest of build output
COPY next_build_output/.next .next/
COPY next_build_output/public public/

# Copy NGINX config and startup script
COPY ingress.conf /etc/nginx/http.d/
COPY run.sh /
RUN chmod +x /run.sh

# Expose ports
EXPOSE 3000 8099
CMD ["/run.sh"]
