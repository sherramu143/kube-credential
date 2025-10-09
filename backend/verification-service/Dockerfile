# Use official Node.js LTS image
FROM node:20-bullseye

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm install --build-from-source
RUN npm install cors @types/cors --save

# Copy the service code including shared DB
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 4002

ENV DB_PATH=/app/shared/credentials.db

CMD ["node", "dist/index.js"]
