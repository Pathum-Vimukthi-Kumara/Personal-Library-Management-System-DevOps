# 📚 Personal Library Management System

 [![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com)

A full-stack, containerized web application for cataloging and managing a personal library. Features include book CRUD, search, user registration, file uploads for covers, REST APIs, and automated deployment tooling.

## ✨ Key Features
- Book catalog: add, edit, delete, and search books with cover images
- User flows: registration and login with backend validation
- File uploads: cover images stored under `uploads/images`
- REST API: Java Spring Boot backend consumed by a React frontend
- Dev/prod parity: Dockerfiles and Docker Compose manifests
- Infra & automation: Terraform, Ansible, and Jenkins pipeline

## 🧩 Tech Stack
- Frontend: React, JavaScript, Tailwind CSS, Nginx
- Backend: Java, Spring Boot, Maven
- Database: SQL (schema under `Backend/library_schema.sql`)
- Containerization: Docker, Docker Compose
- Infrastructure: Terraform, Ansible
- CI/CD: Jenkins

## 🚀 Quick Start (Development)
Prerequisites: Docker, Docker Compose, Node.js (optional), Java (optional).

1) Start with Docker Compose (recommended):

```bash
docker compose -f compose.yaml up --build
```

2) Backend locally (optional):

```bash
cd Backend
./mvnw spring-boot:run    # Windows: mvnw.cmd spring-boot:run
```

3) Frontend locally (optional):

```bash
cd frontend/frontend
npm install
npm start
```

Access the frontend at `http://localhost:3000` (dev server) and the API at `http://localhost:8080` (or ports defined in your env).

## 📦 Production
- Build production images and run `compose.prod.yaml` for a production deployment; use Nginx to serve the frontend and reverse-proxy API requests.

```bash
docker compose -f compose.prod.yaml up --build -d
```

## 🛠 Infrastructure & Deployment
- Terraform: `infrastructure/terraform/`
- Ansible: `infrastructure/ansible/` (roles and playbooks)
- Jenkins pipeline: `jenkinsfile`

## 🧪 Tests
- Frontend tests: run `npm test` in `frontend/frontend`
- Backend tests: run `./mvnw test` in `Backend`

## 📄 License
MIT — see `LICENSE`.

---
