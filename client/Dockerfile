# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app
COPY ./package.json  ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with static file server + Traefik
FROM alpine:3.18

# Install Traefik and a static file server (busybox)
RUN apk add --no-cache busybox traefik

# Copy built React app from builder stage
COPY --from=builder /app/build /usr/share/traefik/html

# Copy Traefik static + dynamic config
COPY .traefik/traefik.yml /etc/traefik/traefik.yml
COPY .traefik/traefik_dynamic.yml /etc/traefik/traefik_dynamic.yml

# Expose Traefik dashboard (optional) and HTTP
EXPOSE 80 8080

# Serve static files AND start Traefik
CMD busybox httpd -f -p 80 -h /usr/share/traefik/html & \
    traefik --configFile=/etc/traefik/traefik.yml
