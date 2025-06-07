FROM node:20

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
# Install all dependencies so that the TypeScript build can run
RUN npm ci

# Copy the rest of the application code
COPY . .

# Compile the TypeScript sources
RUN npm run build

# Remove development dependencies to keep the image slim
RUN npm prune --omit=dev
