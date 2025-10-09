FROM node:20-bullseye

WORKDIR /app

# Copy package.json files first
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install --save-dev @types/express @types/node
RUN npm install cors @types/cors --save

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose your port
EXPOSE 4002

# Start the service
CMD ["node", "dist/index.js"]

