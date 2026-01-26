# 📚 Personal Library Management System

[![Build Status](https://img.shields.io/badge/build-N/A-lightgrey)](https://example.com)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com)


A full-stack, containerized web application to catalog and manage a personal library. Add, search, borrow/return books, upload cover images, and manage users built for maintainability, local development parity, and automated deployments.

## ✨ Key Features
- Browse and search a book catalog with metadata and cover images
- Add, edit, and remove books; upload covers into `uploads/images`
- User registration and login flows with backend validation
- REST API backend consumed by a React frontend
- Dockerized services and Docker Compose manifests for dev/prod
- Infrastructure provisioning with Terraform and Ansible
- Jenkins pipeline for CI/CD automation

## 🧩 Tech Stack
- Frontend: React, JavaScript, Tailwind CSS, Nginx (for static serving)
- Backend: Java, Spring Boot, Maven
- Database: Relational (SQL schema under `Backend/library_schema.sql`)
- Storage: Local uploads in `uploads/images` (container-friendly)
- Containerization: Docker, Docker Compose (`compose.yaml`, `compose.prod.yaml`)
- Infrastructure: Terraform, Ansible (playbooks & roles)
- CI/CD: Jenkins (`jenkinsfile`)
- Tooling: NPM, PostCSS, Tailwind, Git

## 📂 Project Structure (top-level)
- `Backend/` — Spring Boot application, `pom.xml`, `mvnw` wrappers, API and resources
- `frontend/frontend/` — React app, `package.json`, build & Dockerfile
- `infrastructure/` — Terraform configs, Ansible playbooks & roles
- `uploads/` — uploaded images used by the app
- `compose.yaml` & `compose.prod.yaml` — Docker Compose development and production configs

## 🚀 Quick Start (Development)
Prerequisites: Docker, Docker Compose, Java (for local backend builds if not using Docker), Node.js (if running frontend locally).

1) Build and run everything with Docker Compose (recommended):

```bash
docker compose -f compose.yaml up --build
```

2) Backend (if running locally without Docker):

```bash
cd Backend
./mvnw spring-boot:run    # or on Windows: mvnw.cmd spring-boot:run
```

3) Frontend (if running locally without Docker):

```bash
cd frontend/frontend
npm install
npm start
```

After startup, open the frontend at `http://localhost:3000` (or the address shown by the frontend dev server) and the API at `http://localhost:8080`.

## 📦 Production (containerized)
- Build production images for services and run using `compose.prod.yaml`.
- Use Nginx (provided) to serve the static frontend and reverse-proxy API requests to the backend container.

```bash
docker compose -f compose.prod.yaml up --build -d
```

## 🛠 Infrastructure & Deployment
- Infrastructure provisioning: `infrastructure/terraform/`
- Configuration & deployment automation: `infrastructure/ansible/` (playbooks & roles)
- CI/CD pipeline: `jenkinsfile` — builds, tests, image creation, and deployment steps

## 🧪 Tests
- Frontend tests: `frontend/frontend/src/*.test.js` (run with `npm test`)
- Backend tests: `Backend/src/test/java` (run with `./mvnw test`)

## 🤝 Contributing
Contributions are welcome — create issues or pull requests. Follow these steps:

1. Fork the repo and create a branch for your feature/fix.
2. Run tests locally and ensure formatting/linting passes.
3. Open a pull request with a clear description of changes.

## 📄 License
This project uses the MIT license. See the `LICENSE` file for details.

## 📬 Contact
For questions or collaboration, open an issue or contact the repository owner.

---
