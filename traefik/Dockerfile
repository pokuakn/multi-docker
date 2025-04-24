# Use the official Traefik image
FROM traefik:v3.0

# Set working directory
WORKDIR /etc/traefik

# Copy static configuration file (traefik.yml or traefik.toml)
COPY traefik.yml .

# Optional: Copy dynamic config if you have any
COPY dynamic.yml .

# Optional: Copy custom certificates or files if needed
# COPY certs/ ./certs/

# Expose ports for web and dashboard
EXPOSE 80
EXPOSE 443
EXPOSE 8080

# Start Traefik
CMD ["traefik", "--configFile=/etc/traefik/traefik.yml"]
