# Step 1: Project Initialization & Configuration

## Goal
Set up the monorepo folder structure, root configs, `.env.example`, and initialize both `server/` and `client/` packages with all dependencies, TypeScript configs, and npm scripts.

---

## 1.1 Root Directory

Create the following files at the repository root `/Users/samir/personal-crm/`:

### `.env.example`
```env
# ── Database ──
DATABASE_URL=postgresql://crm:crm_secret@localhost:5432/personal_crm
DB_HOST=localhost
DB_PORT=5432
DB_NAME=personal_crm
DB_USER=crm
DB_PASSWORD=crm_secret

# ── Auth ──
JWT_SECRET=change-me-to-a-random-64-char-string
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── Server ──
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# ── Client ──
VITE_API_URL=http://localhost:3001/api/v1
```

### `.gitignore`
```
node_modules/
dist/
build/
.env
*.log
.DS_Store
```

---

## 1.2 Backend — `server/`

### `server/package.json`
```json
{
  "name": "personal-crm-server",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "knex migrate:latest --knexfile src/db/knexfile.ts",
    "migrate:make": "knex migrate:make --knexfile src/db/knexfile.ts -x ts",
    "seed": "knex seed:run --knexfile src/db/knexfile.ts",
    "seed:make": "knex seed:make --knexfile src/db/knexfile.ts -x ts"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "knex": "^3.1.0",
    "pg": "^8.13.1",
    "uuid": "^11.1.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.9",
    "@types/node": "^22.13.4",
    "@types/uuid": "^10.0.0",
    "tsx": "^4.19.3",
    "typescript": "^5.7.3"
  }
}
```

### `server/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### `server/src/config.ts`
Load and validate all environment variables using `dotenv` and export a typed `config` object:
```typescript
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'personal_crm',
    user: process.env.DB_USER || 'crm',
    password: process.env.DB_PASSWORD || 'crm_secret',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
};
```

### `server/src/db/knexfile.ts`
Knex configuration pointing at Postgres using the `config` object:
```typescript
import type { Knex } from 'knex';
import { config } from '../config';

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './seeds',
    extension: 'ts',
  },
};

export default knexConfig;
```

### `server/src/db/connection.ts`
Create and export a shared Knex instance:
```typescript
import knex from 'knex';
import knexConfig from './knexfile';

const db = knex(knexConfig);
export default db;
```

### `server/src/index.ts`
Minimal Express bootstrap (routes will be added in later steps):
```typescript
import express from 'express';
import cors from 'cors';
import { config } from './config';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes will be mounted here in later steps:
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/contacts', contactRoutes);
// etc.

app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});

export default app;
```

### Folder structure to create (empty placeholder files or dirs)
```
server/src/routes/          # Route files (step 3–7)
server/src/controllers/     # Controller files (step 3–7)
server/src/services/        # Service files (step 3–7)
server/src/middleware/       # Auth middleware (step 3)
server/src/types/           # TypeScript interfaces + Zod schemas (step 3–7)
server/src/db/migrations/   # Migration files (step 2)
server/src/db/seeds/        # Seed files (step 2)
server/docs/                # OpenAPI spec (step 7)
```

---

## 1.3 Frontend — `client/`

### Initialize with Vite
Run:
```bash
cd /Users/samir/personal-crm
npx -y create-vite@latest client -- --template react-ts
```
This creates the Vite + React + TypeScript scaffold.

### After init, install additional dependencies
```bash
cd client
npm install react-router-dom d3 @types/d3
```

### Folder structure to create inside `client/src/`
```
client/src/api/             # API client (step 8)
client/src/components/      # Reusable components (step 8–10)
client/src/context/         # Auth context (step 8)
client/src/hooks/           # Custom hooks (step 8)
client/src/pages/           # Page components (step 9–10)
```

---

## 1.4 Install Dependencies

```bash
cd /Users/samir/personal-crm/server && npm install
cd /Users/samir/personal-crm/client && npm install
```

---

## Verification
- `cd server && npx tsc --noEmit` — compiles with zero errors
- `cd client && npm run build` — Vite production build succeeds
- `cd server && npm run dev` — starts and responds to `GET /api/health` with `{"status":"ok"}`
