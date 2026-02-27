# Step 11: Docker, DevOps & README

## Goal
Create production-ready Docker setup (multi-stage builds, docker-compose), nginx config for the SPA, `.env.example`, and a comprehensive README.

**Prerequisites:** Steps 1–10 completed (full backend + frontend working).

---

## 11.1 Backend Dockerfile — `server/Dockerfile`

```dockerfile
# ── Build Stage ──
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# ── Production Stage ──
FROM node:20-alpine AS runtime

WORKDIR /app

# Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled JS from builder
COPY --from=builder /app/dist ./dist

# Copy migrations and seeds (needed at runtime)
COPY src/db/migrations ./dist/db/migrations
COPY src/db/seeds ./dist/db/seeds

EXPOSE 3001

# Run migrations then start
CMD ["sh", "-c", "node dist/db/run-migrations.js && node dist/index.js"]
```

### Migration runner script — `server/src/db/run-migrations.ts`
```typescript
import knex from 'knex';
import knexConfig from './knexfile';

async function run() {
  const db = knex(knexConfig);
  console.log('Running migrations...');
  await db.migrate.latest();
  console.log('Migrations complete.');
  await db.destroy();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
```

**Notes:**
- Multi-stage build: final image has no TypeScript, no devDependencies
- Alpine base for smallest image size (~120 MB)
- Migrations run automatically on container start

---

## 11.2 Frontend Dockerfile — `client/Dockerfile`

```dockerfile
# ── Build Stage ──
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build-time env variable for API URL
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Production Stage ──
FROM nginx:1.27-alpine AS runtime

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Notes:**
- Vite build output is pure static files (~2 MB)
- Final image is nginx Alpine (~25 MB)
- `VITE_API_URL` set to `/api/v1` for production (nginx proxies to backend)

---

## 11.3 Nginx Configuration — `client/nginx.conf`

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;

    # API proxy — forward /api requests to the backend service
    location /api/ {
        proxy_pass http://api:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static assets — long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA fallback — all other routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 11.4 Docker Compose — `docker-compose.yml` (project root)

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-crm}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-crm_secret}
      POSTGRES_DB: ${DB_NAME:-personal_crm}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "${DB_PORT:-5432}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-crm}"]
      interval: 5s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ./server
      dockerfile: Dockerfile
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 3001
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: ${DB_NAME:-personal_crm}
      DB_USER: ${DB_USER:-crm}
      DB_PASSWORD: ${DB_PASSWORD:-crm_secret}
      JWT_SECRET: ${JWT_SECRET:-please-change-this-in-production}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-15m}
      JWT_REFRESH_EXPIRES_IN: ${JWT_REFRESH_EXPIRES_IN:-7d}
      CORS_ORIGIN: ${CORS_ORIGIN:-http://localhost}
    ports:
      - "3001:3001"

  web:
    build:
      context: ./client
      dockerfile: Dockerfile
      args:
        VITE_API_URL: /api/v1
    restart: unless-stopped
    depends_on:
      - api
    ports:
      - "${WEB_PORT:-80}:80"

volumes:
  pgdata:
```

**Key design decisions:**
- `db` uses a named volume `pgdata` for persistence
- `api` depends on `db` health check — won't start until Postgres is ready
- `web` proxies `/api/` to `api:3001` via nginx (no CORS needed in production)
- All secrets configurable via `.env` file

---

## 11.5 `.env.example` (project root)

```env
# ── Database ──
DB_HOST=db
DB_PORT=5432
DB_NAME=personal_crm
DB_USER=crm
DB_PASSWORD=crm_secret

# ── Authentication ──
# IMPORTANT: Change JWT_SECRET to a random 64+ character string in production!
JWT_SECRET=change-me-to-a-random-64-char-string
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── Server ──
PORT=3001
NODE_ENV=production
CORS_ORIGIN=http://localhost

# ── Web ──
WEB_PORT=80

# ── Client (build-time) ──
VITE_API_URL=/api/v1
```

---

## 11.6 `.dockerignore` files

### `server/.dockerignore`
```
node_modules
dist
.env
*.log
.git
```

### `client/.dockerignore`
```
node_modules
dist
.env
*.log
.git
```

---

## 11.7 README.md (project root)

Write a comprehensive README with the following sections:

### Structure
```markdown
# 🧑‍🤝‍🧑 Personal CRM

A self-hostable personal relationship manager inspired by Monica, Clay, and Dex.

## Features
- Contact management with custom fields, tags, and rich details
- Graph-structured relationships with interactive visualization
- Notes with markdown support and chronological timeline
- Keep-in-touch reminders and birthday tracking
- Full-text search across contacts and notes
- Responsive design for mobile and desktop
- Docker-ready for self-hosting

## Quick Start (Docker)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/personal-crm.git
   cd personal-crm
   ```

2. Copy and configure environment:
   ```bash
   cp .env.example .env
   # Edit .env — at minimum, change JWT_SECRET
   ```

3. Start all services:
   ```bash
   docker compose up -d --build
   ```

4. Open http://localhost in your browser
5. Register a new account and start adding contacts!

## Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm 9+

### Backend
```bash
cd server
cp ../.env.example ../.env  # configure DB connection
npm install
npm run migrate
npm run seed              # optional: load demo data
npm run dev               # starts on port 3001
```

### Frontend
```bash
cd client
npm install
npm run dev               # starts on port 5173
```

## Architecture
- **Backend**: Node.js + TypeScript + Express + Knex + PostgreSQL
- **Frontend**: React 18 + TypeScript + Vite + D3.js
- **Auth**: JWT (access + refresh tokens)
- **Database**: PostgreSQL 16 with full-text search

## API Documentation
See `server/docs/openapi.yaml` for the full OpenAPI 3.0 specification.

## Self-Hosting
Designed to run behind any reverse proxy (Traefik, Nginx, Caddy).
The Docker Compose setup includes:
- PostgreSQL with persistent volume
- API server with auto-migrations
- Nginx serving the SPA with API proxy

## License
MIT
```

---

## Verification
1. Docker build: `docker compose build` — both images build successfully
2. Docker up: `docker compose up -d` — all 3 containers reach "healthy" / "running" state
3. `docker compose ps` — shows `db`, `api`, `web` all up
4. Open `http://localhost` — frontend loads, login page renders
5. Register → create contacts → verify full flow works through Docker
6. `docker compose down -v` → `docker compose up -d` → migrations re-run, fresh DB works
7. `curl http://localhost/api/health` → `{"status":"ok"}`
