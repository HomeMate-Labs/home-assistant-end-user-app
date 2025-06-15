# Set base image
ARG BUILD_FROM
FROM $BUILD_FROM

# Install dependencies
RUN apk --no-cache add nodejs npm nginx \
  && mkdir -p /run/nginx

WORKDIR /app

# Copy files needed for install
COPY next_build_output/package.json .
COPY next_build_output/package-lock.json .

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
