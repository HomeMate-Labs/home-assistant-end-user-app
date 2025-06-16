ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:latest
# Stage 1: Build with official Node
FROM node:22-alpine AS builder

WORKDIR /app
COPY next_build_output/package.json .
COPY next_build_output/package-lock.json .
COPY next_build_output/.npmrc .npmrc
RUN npm ci --only=production
COPY next_build_output/.next .next/
COPY next_build_output/public public/

# Stage 2: Minimal Home Assistant base with nginx
FROM $BUILD_FROM

RUN apk --no-cache add nginx && mkdir -p /run/nginx

WORKDIR /app

# Copy only the built output
COPY --from=builder /app ./

# Copy NGINX config and startup script
COPY ingress.conf /etc/nginx/http.d/
COPY run.sh /
RUN chmod +x /run.sh

# Expose ports
EXPOSE 3000 8099
CMD ["/run.sh"]
