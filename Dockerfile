# Use nginx without rate-limit issues
FROM ghcr.io/nginxinc/nginx-unprivileged:alpine

# Copy your site into nginx web root
COPY public/ /usr/share/nginx/html/

# Healthcheck (exec form - SonarQube compliant)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD ["wget", "-q", "-O", "/dev/null", "http://localhost/"]

# Expose port 80
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]