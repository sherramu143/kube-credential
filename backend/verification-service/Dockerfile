# Use official Node.js LTS image
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Copy dependency files first for caching
COPY package*.json ./

# Install dependencies (including sqlite3)
RUN npm install --build-from-source
RUN npm install cors @types/cors --save

# Copy the service code
COPY . .

# ✅ Create shared folder and copy the credentials DB
RUN mkdir -p ./shared
COPY ../shared/credentials.db ./shared/credentials.db

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4002

# Set environment variable for DB path
ENV DB_PATH=/app/shared/credentials.db

# Run the app
CMD ["node", "dist/index.js"]
