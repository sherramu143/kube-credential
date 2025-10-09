# Use official Node.js LTS image
FROM node:20-bullseye

# Create app directory
WORKDIR /app

# Copy dependency files first for caching
COPY package*.json ./

# Install dependencies (builds sqlite3 from source for Linux)
RUN npm install --build-from-source

# Add any extra dependencies you need (optional)
RUN npm install cors @types/cors --save

# Copy rest of the project files
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (Render detects this)
EXPOSE 3000

# Use environment variable for DB path (optional)
ENV DB_PATH=/app/shared/credentials.db

# Run the app
CMD ["node", "dist/index.js"]
