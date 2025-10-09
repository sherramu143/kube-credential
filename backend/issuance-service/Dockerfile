FROM node:20-bullseye

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install dependencies (builds sqlite3 for Linux)
RUN npm install --build-from-source

RUN npm install cors @types/cors --save
# Copy rest of the source code
COPY . .

# Build TypeScript if needed
RUN npm run build

# Command to run
CMD ["node", "dist/index.js"]

