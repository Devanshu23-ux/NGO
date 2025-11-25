# Use nginx without rate-limit issues
FROM ghcr.io/nginxinc/nginx-unprivileged:alpine

# Copy your site into nginx web root (no need to delete)
COPY public/ /usr/share/nginx/html/

# Healthcheck to ensure nginx is serving
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q -O /dev/null http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]