# Kube Credential — Credential Issuance & Verification System


A microservices-based system for issuing and verifying Kubernetes credentials using Node.js and Docker.

## Deployed Application

 **Live Demo:** [https://kube-credential-render.onrender.com/](https://kube-credential-render.onrender.com/)



## Overview

**Kube Credential** is a microservice-based application designed for issuing and verifying credentials in JSON format.
It demonstrates scalable microservice deployment using **Node.js (TypeScript)**, **React (TypeScript)**, and **Docker**, with a **PostgreSQL** backend hosted on **Render**.

This project was developed as part of the **Zupple Labs Pvt. Ltd. Full Stack Engineer Assignment**.

---

## System Architecture

### Components

| Component                | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| **Issuance Service**     | Issues new credentials and stores them in PostgreSQL.    |
| **Verification Service** | Verifies whether a credential has been issued.           |
| **Frontend (React)**     | Provides UI for issuing and verifying credentials.       |
| **Database**             | PostgreSQL hosted on Render for centralized persistence. |

### Architecture Diagram

```
          +-----------------------+
          |     React Frontend    |
          |-----------------------|
          |  /issuance  /verify   |
          +---------+-------------+
                    |
                    v
      +-------------+-------------+
      |       Backend (Node.js)   |
      |----------------------------|
      | Issuance Service (4001)    |
      | Verification Service (4002)|
      +-------------+--------------+
                    |
                    v
          +-----------------------+
          |   PostgreSQL DB       |
          | Render Hosted         |
          +-----------------------+
```

---

## Docker Setup

### Prerequisites

* **Docker** & **Docker Compose** installed
* **Node.js v18+** (for local development)
* Optional: **Render / AWS / Railway / GCP** for cloud deployment

### Local Setup

```bash
# Clone the repository
git clone https://github.com/sherramu143/kube-credential.git
cd kube-credential

# Start backend microservices
cd Backend
docker-compose up --build
```

**Expected Output:**

```
issuance-service      |  Issuance Service running on port 4001 (worker-XXX)
verification-service  |  Verification Service running on port 4002 (worker-YYY)
```

---

## Environment & Credentials

All required PostgreSQL database credentials are already included in the `docker-compose.yml` file using a reusable alias (`x-database-credentials`).

Both backend services — **Issuance Service** and **Verification Service** — automatically use these credentials when started via Docker Compose.

**Important Notes:**

* You **do not need to hardcode** any credentials in the backend code.
* Ensure the PostgreSQL instance on **Render** allows connections from your Docker host (local or cloud).
* If making this repository public, consider moving sensitive credentials to a `.env` file and referencing them in `docker-compose.yml` to avoid exposing them.

**Usage Example:**

```bash
docker-compose up --build
# Both services will connect to the PostgreSQL DB using credentials defined in docker-compose.yml
```

---

## API Endpoints

### 1️⃣ Issuance Service (Port 4001)

**POST /issue** — Issues a credential.

**Request Body:**

```json
{
  "data": {
    "name": "raju",
    "course": "cse",
    "email": "kirn@gmai.com"
  }
}
```

**Response:**

```json
[
  {
    "id": 1,
    "credential_id": "c3c854dd-bfa3-4ab7-9dd9-9d410269765f",
    "name": "raju",
    "issuer": "Issuance Service",
    "recipient": "kirn@gmai.com",
    "issueDate": "2025-10-12T11:47:23.471Z",
    "expiryDate": null,
    "status": "issued",
    "data": "{\"name\":\"raju\",\"course\":\"cse\",\"email\":\"kirn@gmai.com\"}"
  }
]
```

---

### 2️⃣ Verification Service (Port 4002)

**POST /verify** — Verifies a credential using `credential_id`.

**Request Body:**

```json
{
  "credential_id": "40a39342-b162-42aa-aa0b-0eaf1e0e9c44"
}
```

**Response (if verified):**

```json
{
  "verified": true,
  "credential": {
    "id": 1,
    "credential_id": "40a39342-b162-42aa-aa0b-0eaf1e0e9c44",
    "name": "Alice Johnson",
    "issuer": "Issuance Service",
    "recipient": "alice.johnson@example.com",
    "issuedate": "2025-10-12T13:09:00.685Z",
    "expirydate": "2026-10-12T00:00:00.000Z",
    "status": "issued",
    "data": {
      "name": "Alice Johnson",
      "email": "alice.johnson@example.com",
      "course": "Blockchain 101",
      "expiryDate": "2026-10-12"
    }
  },
  "worker_id": "worker-79"
}
```

**Response (if not verified):**

```json
{
  "verified": false,
  "message": "Credential not found"
}
```

---

## Frontend (React + TypeScript)

### Pages

| Page        | Description                         |
| ----------- | ----------------------------------- |
| `/issuance` | Input JSON → Issues new credentials |
| `/verify`   | Input JSON → Verifies credentials   |

### Local Development

```bash
cd Frontend
npm install
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## Docker Compose Environment (PostgreSQL)

```yaml
version: "3.9"

x-database-credentials: &db-creds
  DB_HOST: dpg-d3lpfemmcj7s73a4kn5g-a.oregon-postgres.render.com
  DB_PORT: 5432
  DB_NAME: credentialsdb_idzs
  DB_USER: dbuser
  DB_PASSWORD: "AAP7BlHLhuRLkbwqy9hxdrjmcFCEZ7cY"

services:
  issuance-service:
    build: ./issuance-service
    container_name: issuance-service
    ports:
      - "4001:4001"
    environment:
      <<: *db-creds

  verification-service:
    build: ./verification-service
    container_name: verification-service
    depends_on:
      - issuance-service
    ports:
      - "4002:4002"
    environment:
      <<: *db-creds
```

---

## Error Resolution Tips

### Node Modules / Build Issues

```bash
# If you encounter "Cannot find module" errors
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# For TypeScript build issues
npm run build
```

### Docker Build / NPM Issues

```bash
# Rebuild Docker images from scratch
docker-compose build --no-cache
docker-compose up
```

### PostgreSQL Connection Issues

* Ensure `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_PORT` match your Render PostgreSQL instance.
* Verify your Render DB allows external connections from Docker / local IP.

---

## Testing

```bash
cd Backend
npm test
```

---

## Deployment (Render / AWS / Railway)

### 1️⃣ Push Images to Docker Hub

```bash
docker build -t <username>/issuance-service ./issuance-service
docker push <username>/issuance-service

docker build -t <username>/verification-service ./verification-service
docker push <username>/verification-service
```

### 2️⃣ Deploy on Render

* Create two **Web Services** using the Docker images.
* Configure ports `4001` and `4002`.
* Point frontend API URLs to deployed backend endpoints.

---

## Project Structure

```
kube-credential/
├── Backend/
│   ├── issuance-service/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── verification-service/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── docker-compose.yml
├── Frontend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── k8s/
│   ├── issuance-service.yaml
│   ├── verification-service.yaml
│   └── ingress.yaml
└── README.md
```

---

## Design Decisions

* **PostgreSQL** for production-ready, centralized persistence.
* **Microservice isolation** for independent scalability and testing.
* **Docker Compose** used for local orchestration.
* **TypeScript** ensures type safety across backend & frontend.
* **Worker IDs** included for load-balanced traceability.

---

## Author

**Name:** Ramu Sher
**Email:** sherramu787@gmail.com
**phone:** 7995727830
**Role:** Full Stack Engineer Candidate
**Date:** October 2025

---

## License

This project is developed for evaluation purposes and not intended for production use