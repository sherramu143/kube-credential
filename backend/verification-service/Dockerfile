# Use official Node.js 20 LTS image (Debian-based)
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install build tools for native modules (optional but safe)
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Update npm to latest stable
RUN npm install -g npm@11.6.2

# Copy package.json & package-lock.json first for caching
COPY package*.json ./

# Install dependencies inside container
# Forces rebuild of sqlite3 to ensure Linux ELF binary
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the app (if using TypeScript or any build step)
RUN npm run build

# Expose port if needed
EXPOSE 4001

# Start the service
CMD ["node", "dist/index.js"]
