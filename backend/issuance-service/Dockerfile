# Use Node.js 20
FROM node:20-bullseye

WORKDIR /app

# Install build tools (for native modules)
RUN apt-get update && apt-get install -y python3 build-essential

# Copy package.json & package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4001

# Start the service
CMD ["node", "dist/index.js"]
