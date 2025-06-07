# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies first for better layer caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Install curl for healthcheck
RUN apk --no-cache add curl

# Copy package files
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

# Copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/static ./static

# Copy .env file if it exists
COPY .env* ./

# Create healthcheck script
RUN echo '#!/bin/sh\n\
set -e\n\
# Check if the server is running\nif ! curl -f http://localhost:3000/health 2>/dev/null; then\n  echo "Health check failed: /health endpoint not available"\n  exit 1\nfi\n\
# Check if the admin API is accessible\nif ! curl -f http://localhost:3000/admin-api/ 2>/dev/null; then\n  echo "Health check failed: /admin-api/ endpoint not available"\n  exit 1\nfi\n\
echo "Health check passed"\nexit 0' > /healthcheck.sh && \
    chmod +x /healthcheck.sh

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD ["/bin/sh", "/healthcheck.sh"]

# Run the application
CMD ["node", "dist/index.js"]
