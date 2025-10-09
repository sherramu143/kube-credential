# Use official Node.js LTS image
FROM node:20-bullseye

# Create app directory
WORKDIR /app

# Copy dependency files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --build-from-source
RUN npm install cors @types/cors --save

# Copy the service code
COPY . .

# ✅ Explicitly copy the shared database file from parent folder
COPY ../shared/credentials.db ./shared/credentials.db

# Build TypeScript
RUN npm run build

# Expose port (Render detects this)
EXPOSE 4002

# Environment variable for DB path
ENV DB_PATH=/app/shared/credentials.db

# Run the app
CMD ["node", "dist/index.js"]
