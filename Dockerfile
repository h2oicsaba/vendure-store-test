# Build stage
FROM node:20-alpine AS builder

# Set build arguments
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

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

# Install dependencies based on the environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Install dependencies based on environment
RUN if [ "$NODE_ENV" = "production" ]; then \
      yarn install --production --frozen-lockfile; \
    else \
      yarn install --frozen-lockfile; \
    fi

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
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Health check (only in production)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD ["/bin/sh", "/healthcheck.sh"]

# Run the application using the start script from package.json
CMD ["yarn", "start"]
