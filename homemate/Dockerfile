# ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:latest
ARG BUILD_FROM
FROM $BUILD_FROM

# Install dependencies
RUN apk --no-cache add curl tar nginx \
  && mkdir -p /run/nginx \
  && curl -fsSL https://nodejs.org/dist/v20.14.0/node-v20.14.0-linux-x64.tar.xz | tar -xJ -C /usr/local --strip-components=1 --no-same-owner \
  && ln -s /usr/local/bin/node /usr/bin/node \
  && ln -s /usr/local/bin/npm /usr/bin/npm

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
