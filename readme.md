# GraphRunner

<p align="center">
  <img src="graphrunner-logo.png" alt="GraphRunner Logo" width="300" />
</p>

A full-featured backend example project for building and querying a **graph database** powered by **JanusGraph**, **Cassandra**, and **Gremlin**, with a modern **TypeScript + Express** stack. This is meant to showcase an optimised version for fast, efficient data ingestion, processing and retrieval of pre-computated data from a graph database.

Includes:
- 📦 Docker-based setup (JanusGraph + Cassandra + Prometheus)
- 🧠 Clean architecture (SOLID + use cases)
- ✨ Google OAuth2 authentication (Passport.js)
- 📊 Prometheus-ready monitoring (Prom-client)
- 🐛 Winston logging
- 🔁 Nodemon for dev reload
- ✅ Jest for unit testing
- 📘 OpenAPI documentation with Swagger UI

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- Docker + Docker Compose
- (Optional) [DBGate](https://dbgate.org) for Cassandra GUI

### Clone & Install

```bash
git clone https://github.com/your-repo/janusgraph-node-boilerplate.git
cd janusgraph-node-boilerplate/app
npm install
```


🐳 Running the Stack
1. Start Docker services
```bash
docker-compose up --build
```

This launches:

    Cassandra (port 9042)

    JanusGraph/Gremlin Server (port 8182)

    Prometheus (port 9090)

    The Node.js app runs locally on port 3000

2. Start the app in dev mode
```bash
npm run dev
```

🔐 Auth Setup (Google OAuth)

Create a .env file in app/:
```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
SESSION_SECRET=some-session-secret
```

🧪 Sample API Usage
Create a vertex:
```bash
curl -X POST http://localhost:3000/api/vertex \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "label": "person"}'
```

Get a vertex by ID:
```bash
curl http://localhost:3000/api/vertex/{id}
```

🧰 Folder Structure

```bash
app/
├── src/
│   ├── auth/               # OAuth strategies
│   ├── config/             # Gremlin client, environment
│   ├── controllers/        # Express route handlers
│   ├── domain/             # Entity interfaces
│   ├── infrastructure/     # Data access
│   ├── monitoring/         # Prometheus middleware
│   ├── routes/             # Express route definitions
│   ├── usecases/           # Business logic (CRUD ops)
│   ├── utils/              # Helpers
│   └── app.ts              # Express entry point
├── logger/                 # Winston logger
├── tests/                  # Jest unit tests
├── Dockerfile              # Container image
├── package.json
├── tsconfig.json
```

# 📊 Monitoring (Prometheus)

- Metrics endpoint: `http://localhost:3000/metrics`
- Prometheus UI: `http://localhost:9090`

### 📦 What's Included
- [`prom-client`](https://github.com/siimon/prom-client) integration for Node.js metrics
- A dedicated `/metrics` endpoint exposed by the app
- Dockerized Prometheus instance with a working `prometheus.yml`

### 🧠 What It Tracks
- Event loop lag
- Memory usage
- HTTP request durations
- Custom app metrics (extendable)

📘 API Documentation (OpenAPI)
- Swagger UI available at: [http://localhost:3000/docs](http://localhost:3000/docs)
- Describes all available endpoints (`POST`, `GET`, `PUT`, `DELETE`) for vertex operations
- Documentation auto-generated from JSDoc annotations using `swagger-jsdoc`

🛠 TODO List
- [ ] Integrate Redis for caching or temporary data storage

- [ ] Add OAuth-based authentication & authorization (no external providers)

- [ ] Integrate Vault for managing secrets instead of .env

- [x] Full Prometheus prometheus.yml config

- [ ] Prom-client integration

- [ ] GUI tool for JanusGraph (WIP)

- [ ] Import [CESNET-TimeSeries24 dataset](https://zenodo.org/records/13382427) for more complex operations and meaningful data visualization


🧾 License

MIT — use it, hack it, own it.