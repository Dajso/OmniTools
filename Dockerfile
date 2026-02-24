# Stage 1: Build the Next.js static site
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build static export
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine AS runner

# Remove default nginx config to avoid conflicts
RUN rm -f /etc/nginx/conf.d/default.conf

# Install curl for health check
RUN apk add --no-cache curl

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check using curl (more reliable than busybox wget)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
