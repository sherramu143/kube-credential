
# Kube Credential — Credential Issuance & Verification System

## Overview

**Kube Credential** is a microservice-based application designed for issuing and verifying credentials in JSON format.
It demonstrates scalable microservice deployment using **Node.js (TypeScript)**, **React (TypeScript)**, and **Docker** — suitable for cloud (AWS / Render / GCP) deployment.

This project was developed as part of the **Zupple Labs Pvt. Ltd. Full Stack Engineer Assignment**.

---

##  System Architecture

### Components

| Component                | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| **Issuance Service**     | Issues new credentials and stores them in a local SQLite database. |
| **Verification Service** | Verifies if a credential has already been issued.                  |
| **Frontend (React)**     | Provides UI for issuing and verifying credentials.                 |
| **Shared Database**      | SQLite file mounted to both services for data persistence.         |

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
          |  Shared SQLite DB     |
          |  credentials.db       |
          +-----------------------+
```

---

##  Docker Setup

### Prerequisites

* **Docker** & **Docker Compose** installed
* **Node.js v18+** (for local dev)
* Optional: **Render / AWS / Railway / GCP** for cloud deployment

###  Local Setup

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

##  API Endpoints

### 1️ Issuance Service (Port 4001)

**POST /issue**
Issues a credential if not already issued.

#### Request:

```json
{
  "id": "user123",
  "name": "Ramu",
  "course": "Full Stack Engineer"
}
```

#### Response:

```json
{
  "message": "Credential issued by worker-874",
  "credential": {
    "id": "user123",
    "issuedAt": "2025-10-09T05:21:00Z"
  }
}
```

---

### 2️⃣ Verification Service (Port 4002)

**POST /verify**
Verifies whether a credential has been issued.

#### Request:

```json
{
  "id": "user123"
}
```

#### Response (if valid):

```json
{
  "message": "Credential verified by worker-503",
  "verified": true,
  "issuedAt": "2025-10-09T05:21:00Z"
}
```

#### Response (if invalid):

```json
{
  "message": "Credential not found",
  "verified": false
}
```

---

##  Frontend (React + TypeScript)

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

##  Kubernetes Deployment

### Example: `issuance-service.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: issuance-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: issuance-service
  template:
    metadata:
      labels:
        app: issuance-service
    spec:
      containers:
        - name: issuance-service
          image: <your-dockerhub-username>/issuance-service:latest
          ports:
            - containerPort: 4001
          volumeMounts:
            - name: shared-db
              mountPath: /app/shared
      volumes:
        - name: shared-db
          emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: issuance-service
spec:
  selector:
    app: issuance-service
  ports:
    - port: 4001
      targetPort: 4001
```

Repeat similarly for `verification-service.yaml`.

---

##  Testing

### Run Unit Tests

```bash
cd Backend
npm test
```

---

##  Deployment (Render / AWS / Railway)

### 1️ Push Images to Docker Hub

```bash
docker build -t <username>/issuance-service ./issuance-service
docker push <username>/issuance-service

docker build -t <username>/verification-service ./verification-service
docker push <username>/verification-service
```

### 2️ Deploy on Render or AWS

* Create two web services using these Docker images.
* Configure ports `4001` and `4002`.
* Point frontend API URLs to deployed backend endpoints.

---

##  Project Structure

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
│   └── shared/credentials.db
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

##  Design Decisions

* **SQLite** chosen for simplicity and lightweight persistence.
* **Microservice isolation** for independent scalability and testing.
* **Docker Compose** used for local orchestration.
* **TypeScript** ensures type safety across backend & frontend.
* **Worker IDs** included for load-balanced traceability.

---

##  Author

**Name:** Ramu Sher
**Email:** [ramusher143@gmail.com](mailto:ramusher143@gmail.com)
**Role:** Full Stack Engineer Candidate
**Date:** October 2025

---

##  License

This project is developed for evaluation purposes and not intended for production use
