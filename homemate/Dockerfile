ARG BUILD_FROM
FROM $BUILD_FROM

# Install node, nginx, and pnpm
RUN apk --no-cache add \
  nodejs \
  npm \
  nginx \
  && npm install -g pnpm \
  && mkdir -p /run/nginx

# Set working directory
WORKDIR /app

# Copy app build output and deps config
COPY next_build_output/.next/ .next/
COPY next_build_output/public/ public/
COPY next_build_output/package.json .
COPY next_build_output/pnpm-lock.yaml .

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy NGINX config and run script
COPY ingress.conf /etc/nginx/http.d/
COPY run.sh /
RUN chmod +x /run.sh

# Expose ports
EXPOSE 3000 8099

# Start script
CMD ["/run.sh"]
