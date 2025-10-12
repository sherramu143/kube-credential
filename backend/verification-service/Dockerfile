FROM node:20-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y python3 build-essential

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Build TypeScript -> dist
RUN npm run build

EXPOSE 4002
CMD ["npm", "start"]
