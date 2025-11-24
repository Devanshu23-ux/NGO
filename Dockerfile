# Use a lightweight nginx image
FROM nginx:alpine

# Remove default nginx static assets (optional)
RUN rm -rf /usr/share/nginx/html/*

# Copy the static site into nginx web root
COPY public/ /usr/share/nginx/html/

# Healthcheck to ensure nginx is serving
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q -O /dev/null http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
