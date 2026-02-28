# Personal CRM — Self-Hostable Relationship Manager

## TL;DR

**Quick Summary**: Build a self-hostable personal CRM with PostgreSQL backend, React frontend, and D3.js relationship graph visualization.

**Deliverables**: 
- Complete Node.js/Express API with PostgreSQL
- React 18 + Vite frontend with premium design system
- D3.js force-directed relationship graph
- Docker multi-stage production setup
- OpenAPI 3.0 specification

**Estimated Effort**: Large (20-25 tasks across 5 waves)
**Parallel Execution**: YES — 5 waves, 70% faster than sequential
**Critical Path**: Wave 1 (foundation) → Wave 2 (backend APIs) → Wave 4 (frontend pages) → Wave 5 (integration) → Final Verification

---

## Context

### Original Request
Build a self-hostable personal CRM focused on people and relationships (not sales pipelines), inspired by Monica, Clay, and Dex.

### Existing Plans Analysis
The existing 11-step sequential plans provide an excellent technical blueprint but suffer from:
1. Sequential structure — 11 steps with heavy dependencies waste ~70% of possible parallelization
2. Manual verification — curl commands require human intervention
3. No agent categorization — tasks not marked with complexity/skill requirements
4. No guardrails — scope boundaries not explicitly defined
5. No final verification — missing comprehensive end-to-end testing

### Key Decisions from Analysis
- Preserve: Tech stack (Node.js/TS, PostgreSQL, React/Vite, D3.js), database schema, API design
- Restructure: Convert 11 sequential steps into 5 parallel execution waves
- Enhance: Add agent-executable QA scenarios, evidence capture, final verification
- Guard: Explicitly exclude email notifications, real-time chat, bulk import

---

## Work Objectives

### Core Objective
Deliver a production-ready Personal CRM application with full CRUD for contacts, relationship graph visualization, notes with markdown, tags, custom fields, reminders, and full-text search.

### Concrete Deliverables
- Backend API (`server/`) with 40+ endpoints, JWT auth, PostgreSQL persistence
- React frontend (`client/`) with 8+ pages, responsive design, D3.js graph
- Docker production setup with multi-stage builds
- OpenAPI 3.0 specification (`server/docs/openapi.yaml`)
- Comprehensive test data and verification scenarios

### Definition of Done
- [ ] All TODOs completed with evidence captured in `.sisyphus/evidence/`
- [ ] Final verification wave: ALL 4 review agents APPROVE
- [ ] Docker compose builds and runs successfully
- [ ] Full user flow works (register → create contact → add relationship → view graph)

### Must Have
- JWT-based authentication (register, login, refresh)
- Contacts CRUD with rich details
- Relationship graph with 17 directed relationship types
- Notes with markdown support
- Tags (many-to-many with contacts)
- Custom fields (user-defined field types)
- Reminders (keep-in-touch scheduling)
- Full-text search across contacts and notes
- D3.js force-directed graph visualization
- Responsive design (desktop + mobile)
- Docker self-hosting setup

### Must NOT Have (Guardrails)
- Email notifications or SMTP integration
- Real-time chat or WebSocket features
- Bulk import/export (CSV, vCard, etc.)
- Multi-tenancy
- Advanced analytics or reporting
- Social media API integrations
- Push notifications
- Mobile native apps (web-only)
- Performance optimization for >10k contacts
- OAuth/Social login (email/password only)
- Admin dashboard
- File uploads/attachments

---

## Verification Strategy

### Test Infrastructure Decision
- **Infrastructure exists**: NO — will create minimal test setup
- **Automated tests**: NO — complexity exceeds value for v1
- **Agent-Executed QA**: YES — mandatory for all tasks
- **Evidence capture**: YES — every task has evidence requirements

### QA Policy
Every task MUST include agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

**Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
**API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
**Database**: Use Bash (psql) — Query tables, verify data
**Docker**: Use Bash (docker compose) — Build, run, health check

---

## Execution Strategy

### Parallel Execution Waves

**Wave 1** (Foundation — Start Immediately, 5 tasks):
- Task 1: Project scaffolding + root configs
- Task 2: Backend dependencies + TypeScript config
- Task 3: Database schema migrations (8 files)
- Task 4: Shared types + Zod schemas
- Task 5: Frontend Vite init + design system CSS

**Wave 2** (Backend APIs — After Wave 1, MAX PARALLEL, 8 tasks):
- Task 6: Auth module (types, service, controller, routes)
- Task 7: Contacts API (CRUD + search + timeline)
- Task 8: Relationships API (edges + graph query)
- Task 9: Notes API
- Task 10: Tags API (incl. contact_tags)
- Task 11: Custom Fields API
- Task 12: Reminders API
- Task 13: Search API + OpenAPI spec

**Wave 3** (Frontend Foundation — After Wave 1, 4 tasks):
- Task 14: API client + auth context
- Task 15: App shell (sidebar, routing, layout)
- Task 16: Login/Register pages
- Task 17: Shared components (Avatar, Badge, Modal, etc.)

**Wave 4** (Frontend Features — After Wave 2 + Wave 3, 5 tasks):
- Task 18: Dashboard page
- Task 19: Contact list page
- Task 20: Contact detail page
- Task 21: Settings pages (tags + custom fields)
- Task 22: Relationship graph component (D3.js)

**Wave 5** (Integration + Docker — After Wave 4, 4 tasks):
- Task 23: Seed data + integration testing
- Task 24: Docker multi-stage setup
- Task 25: README + documentation
- Task 26: Final route mounting + polish

**Wave FINAL** (Verification — After ALL tasks, 4 tasks):
- Task F1: Plan compliance audit
- Task F2: Code quality review
- Task F3: Real QA with Playwright
- Task F4: Scope fidelity check

Critical Path: T1→T2→T3→T4→T6→T7→T14→T15→T16→T18→T19→T20→T23→F1-F4
Parallel Speedup: ~70% faster than sequential
Max Concurrent: 8 tasks (Wave 2)

---

## TODOs

---

## Final Verification Wave

### F1. Plan Compliance Audit — oracle
Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
Output: Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT

### F2. Code Quality Review — unspecified-high
Run `tsc --noEmit` + linter + check for `as any`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
Output: Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT

### F3. Real Manual QA — unspecified-high + playwright
Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Save to `.sisyphus/evidence/final-qa/`.
Output: Scenarios [N/N pass] | Integration [N/N] | VERDICT

### F4. Scope Fidelity Check — deep
For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance. Detect cross-task contamination.
Output: Tasks [N/N compliant] | Unaccounted [CLEAN/N files] | VERDICT

---

## Commit Strategy

**When to commit**: After each task completes successfully (after QA scenarios pass)

**Commit format**: `feat(scope): description`

Examples:
- `feat(db): add user and contact migrations`
- `feat(auth): implement JWT authentication`
- `feat(frontend): add dashboard page with contact cards`

**Pre-commit verification**: Run QA scenarios and capture evidence first

---
---
- [ ] **Task 1: Project Scaffolding & Root Configuration**

  **What to do**: Create root directory structure, environment files, and git configuration for the personal CRM monorepo.
  - Create `.env.example` with database, auth, and server configs
  - Create `.gitignore` with node_modules, dist, build, .env
  - Create root `README.md` (minimal placeholder for now)
  - Create `server/` and `client/` directories

  **Must NOT do**:
  - Do NOT install dependencies yet (Task 2 and 5 handle that)
  - Do NOT create any source code files
  - Do NOT initialize git repo (already exists)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Simple file creation with no logic
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T2-T5)
  - **Parallel Group**: Wave 1
  - **Blocks**: T2-T5 (they write into these directories)
  - **Blocked By**: None

  **Acceptance Criteria**:

  **QA Scenario: Verify directory structure exists**
  ```
  Tool: Bash
  Preconditions: None
  Steps:
    1. Run: ls -la /home/samir/personal-crm/
    2. Verify: .env.example exists
    3. Verify: .gitignore exists
    4. Verify: server/ directory exists
    5. Verify: client/ directory exists
  Expected Result: All files and directories present
  Evidence: .sisyphus/evidence/task-1-directory-structure.txt
  ```

  **QA Scenario: Verify .env.example contents**
  ```
  Tool: Bash
  Preconditions: Task 1 complete
  Steps:
    1. Run: cat /home/samir/personal-crm/.env.example | grep -E 'DATABASE_URL|JWT_SECRET|PORT'
  Expected Result: All required env vars defined
  Evidence: .sisyphus/evidence/task-1-env-example.txt
  ```

  **Evidence to Capture**:
  - [ ] Directory listing showing all created files
  - [ ] Contents of .env.example

  **Commit**: YES
  - Message: `chore: add project scaffolding and root configuration`
  - Files: `.env.example`, `.gitignore`, `server/`, `client/`
  - Pre-commit: N/A (no code to test)

---

- [ ] **Task 2: Backend Dependencies & TypeScript Configuration**

  **What to do**: Initialize the server package with package.json, install all dependencies, and configure TypeScript.
  - Create `server/package.json` with all dependencies
  - Create `server/tsconfig.json` targeting ES2022
  - Install dependencies: `cd server && npm install`
  - Verify TypeScript compilation works

  **Must NOT do**:
  - Do NOT create any source files yet (Task 4 creates types)
  - Do NOT run migrations yet (Task 3)
  - Do NOT create database connection yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Package management and config setup
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T1, T3-T5)
  - **Parallel Group**: Wave 1
  - **Blocks**: T4-T13 (they import from server)
  - **Blocked By**: T1 (needs server/ directory)

  **Acceptance Criteria**:

  **QA Scenario: Verify package.json created**
  ```
  Tool: Bash
  Preconditions: Task 1 complete
  Steps:
    1. Run: cat /home/samir/personal-crm/server/package.json | jq '.name, .dependencies.express, .devDependencies.typescript'
  Expected Result: name = personal-crm-server, express present, typescript present
  Evidence: .sisyphus/evidence/task-2-package-json.json
  ```

  **QA Scenario: Verify TypeScript compiles**
  ```
  Tool: Bash
  Preconditions: npm install complete
  Steps:
    1. Run: cd /home/samir/personal-crm/server && npx tsc --noEmit
    2. Verify: exit code 0 (no errors)
  Expected Result: Compilation succeeds with no errors
  Evidence: .sisyphus/evidence/task-2-tsc-output.txt
  ```

  **Evidence to Capture**:
  - [ ] package.json contents
  - [ ] tsconfig.json contents
  - [ ] npm install output
  - [ ] TypeScript compilation output

  **Commit**: YES
  - Message: `chore(server): add package.json and TypeScript config`
  - Files: `server/package.json`, `server/tsconfig.json`, `server/node_modules/`
  - Pre-commit: `cd server && npx tsc --noEmit`

---

- [ ] **Task 3: Database Schema Migrations**

  **What to do**: Create all 8 Knex migration files for the complete database schema.
  - Migration 001: users table
  - Migration 002: contacts table with indexes
  - Migration 003: relationships table with enum type
  - Migration 004: notes table
  - Migration 005: tags and contact_tags tables
  - Migration 006: custom_field_definitions and custom_field_values tables
  - Migration 007: reminders table
  - Migration 008: full-text search indexes (tsvector)

  **Must NOT do**:
  - Do NOT run migrations yet (no DB connection)
  - Do NOT create seed data (Task 23)
  - Do NOT modify existing migration files after creation

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: SQL/DDL work, straightforward implementation
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T1, T2, T4, T5)
  - **Parallel Group**: Wave 1
  - **Blocks**: T6-T13 (APIs need tables to exist)
  - **Blocked By**: T1 (needs server/src/db/ directory)

  **Acceptance Criteria**:

  **QA Scenario: Verify all migration files exist**
  ```
  Tool: Bash
  Preconditions: Task 1 complete
  Steps:
    1. Run: ls -la /home/samir/personal-crm/server/src/db/migrations/ | wc -l
    2. Verify: 8 migration files present (plus . and ..)
  Expected Result: 10 lines total (8 files + 2 directory entries)
  Evidence: .sisyphus/evidence/task-3-migration-files.txt
  ```

  **QA Scenario: Verify migration syntax is valid**
  ```
  Tool: Bash
  Preconditions: Task 2 complete
  Steps:
    1. Run: cd /home/samir/personal-crm/server && npx tsc --noEmit src/db/migrations/*.ts 2>&1
  Expected Result: No compilation errors
  Evidence: .sisyphus/evidence/task-3-migration-syntax.txt
  ```

  **Evidence to Capture**:
  - [ ] Directory listing of all 8 migration files
  - [ ] Contents of first migration (users)
  - [ ] TypeScript compilation output

  **Commit**: YES
  - Message: `feat(db): add complete schema migrations`
  - Files: `server/src/db/migrations/*.ts`
  - Pre-commit: `cd server && npx tsc --noEmit src/db/migrations/*.ts`

---

- [ ] **Task 4: Shared Types & Zod Schemas**

  **What to do**: Create TypeScript interfaces and Zod validation schemas for all API resources.
  - `server/src/types/auth.ts` — Register, Login, Refresh schemas + JWT payload
  - `server/src/types/contact.ts` — Create, Update, List query schemas + ContactRow interface
  - `server/src/types/relationship.ts` — Create schema + Graph types + RelationshipType enum
  - `server/src/types/note.ts` — Create, Update schemas
  - `server/src/types/tag.ts` — Create, Update, Assign schemas
  - `server/src/types/customField.ts` — Create, Update schemas + field types
  - `server/src/types/reminder.ts` — Create, Update schemas with validation rules
  - `server/src/types/search.ts` — Search query + SearchResult interfaces
  - `server/src/utils/errors.ts` — AppError class

  **Must NOT do**:
  - Do NOT create service or controller logic
  - Do NOT create database queries yet
  - Do NOT add business logic to schemas

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Type definitions only, no runtime logic
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T1-T3, T5)
  - **Parallel Group**: Wave 1
  - **Blocks**: T6-T13 (APIs use these types)
  - **Blocked By**: T1 (needs server/src/types/ directory)

  **Acceptance Criteria**:

  **QA Scenario: Verify all type files exist**
  ```
  Tool: Bash
  Preconditions: Task 1 complete
  Steps:
    1. Run: find /home/samir/personal-crm/server/src/types -name '*.ts' | sort
  Expected Result: All 8 type files present
  Evidence: .sisyphus/evidence/task-4-type-files.txt
  ```

  **QA Scenario: Verify Zod schemas compile**
  ```
  Tool: Bash
  Preconditions: Task 2 complete
  Steps:
    1. Run: cd /home/samir/personal-crm/server && npx tsc --noEmit src/types/*.ts src/utils/*.ts
  Expected Result: No compilation errors
  Evidence: .sisyphus/evidence/task-4-types-compile.txt
  ```

  **Evidence to Capture**:
  - [ ] List of all type files created
  - [ ] Contents of auth.ts (shows Zod usage)
  - [ ] TypeScript compilation output

  **Commit**: YES
  - Message: `feat(types): add Zod schemas and TypeScript interfaces`
  - Files: `server/src/types/*.ts`, `server/src/utils/errors.ts`
  - Pre-commit: `cd server && npx tsc --noEmit src/types/*.ts src/utils/*.ts`

---

- [ ] **Task 5: Frontend Vite Initialization & Design System**

  **What to do**: Initialize the React frontend with Vite, install dependencies, and create the global design system CSS.
  - Run: `npx -y create-vite@latest client -- --template react-ts`
  - Install additional deps: `cd client && npm install react-router-dom d3 @types/d3`
  - Create `client/src/index.css` with complete design system
  - Create `client/index.html` with proper meta tags
  - Create `client/src/main.tsx` entry point

  **Must NOT do**:
  - Do NOT create page components yet (Tasks 16-22)
  - Do NOT set up routing yet (Task 15)
  - Do NOT create API client yet (Task 14)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: Frontend design system requires UI/UX expertise
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T1-T4)
  - **Parallel Group**: Wave 1
  - **Blocks**: T14-T22 (all frontend tasks)
  - **Blocked By**: T1 (needs client/ directory)

  **Acceptance Criteria**:

  **QA Scenario: Verify Vite project initialized**
  ```
  Tool: Bash
  Preconditions: Task 1 complete
  Steps:
    1. Run: ls /home/samir/personal-crm/client/src/
    2. Verify: App.tsx, main.tsx, vite-env.d.ts exist
  Expected Result: Vite template files present
  Evidence: .sisyphus/evidence/task-5-vite-init.txt
  ```

  **QA Scenario: Verify design system CSS created**
  ```
  Tool: Bash
  Preconditions: Vite init complete
  Steps:
    1. Run: cat /home/samir/personal-crm/client/src/index.css | head -20
    2. Verify: CSS custom properties (variables) defined
  Expected Result: Variables like --color-primary-500 present
  Evidence: .sisyphus/evidence/task-5-design-system.txt
  ```

  **Evidence to Capture**:
  - [ ] Directory listing showing Vite structure
  - [ ] First 50 lines of index.css showing CSS variables
  - [ ] package.json showing react-router-dom and d3 installed

  **Commit**: YES
  - Message: `chore(client): initialize Vite with React and design system`
  - Files: `client/` (all files), `client/package.json`, `client/src/index.css`
  - Pre-commit: N/A

---

## Final Verification Wave

### F1. Plan Compliance Audit — oracle
Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
Output: Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT

### F2. Code Quality Review — unspecified-high
Run `tsc --noEmit` + linter + check for `as any`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
Output: Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT

### F3. Real Manual QA — unspecified-high + playwright
Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Save to `.sisyphus/evidence/final-qa/`.
Output: Scenarios [N/N pass] | Integration [N/N] | VERDICT

### F4. Scope Fidelity Check — deep
For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance. Detect cross-task contamination.
Output: Tasks [N/N compliant] | Unaccounted [CLEAN/N files] | VERDICT

---

## Commit Strategy

**When to commit**: After each task completes successfully (after QA scenarios pass)

**Commit format**: `feat(scope): description`

Examples:
- `feat(db): add user and contact migrations`
- `feat(auth): implement JWT authentication`
- `feat(frontend): add dashboard page with contact cards`

**Pre-commit verification**: Run QA scenarios and capture evidence first

---

## Success Criteria

### Verification Commands
```bash
# Backend build
cd server && npm run build  # Expected: TypeScript compiles without errors

# Frontend build
cd client && npm run build  # Expected: Vite production build succeeds

# Docker compose
docker compose up --build  # Expected: All 3 containers (db, api, web) start

# Health check
curl http://localhost/api/health  # Expected: {"status":"ok"}
```

### Final Checklist
- [ ] All Must Have features implemented
- [ ] All Must NOT Have features explicitly excluded
- [ ] All QA scenarios pass with evidence captured
- [ ] Final verification wave: ALL 4 review agents APPROVE
- [ ] Docker compose runs successfully
- [ ] Full user flow verified: Register → Create contact → Add relationship → View graph



---

- [ ] **Task 6: Auth Module — JWT Authentication**

  **What to do**: Implement complete JWT authentication with register, login, and refresh endpoints.
  - `server/src/services/auth.service.ts` — Business logic (hash passwords, generate tokens)
  - `server/src/controllers/auth.controller.ts` — Request handlers
  - `server/src/routes/auth.routes.ts` — Route definitions
  - `server/src/middleware/auth.ts` — JWT verification middleware
  - `server/src/config.ts` — Load and validate environment variables
  - `server/src/db/connection.ts` — Knex database connection
  - `server/src/index.ts` — Bootstrap Express app

  **Must NOT do**:
  - Do NOT implement email verification
  - Do NOT add password reset via email
  - Do NOT add rate limiting
  - Do NOT implement OAuth providers

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Security-sensitive code with multiple components
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T7-T13 in Wave 2)
  - **Parallel Group**: Wave 2
  - **Blocks**: T7-T22 (all APIs need auth middleware)
  - **Blocked By**: T2 (needs server package), T3 (needs DB connection), T4 (needs types)

  **Acceptance Criteria**:

  **QA Scenario: Register new user**
  ```
  Tool: Bash (curl)
  Preconditions: Server running, DB migrated
  Steps:
    1. POST /api/v1/auth/register with {email: "test@test.com", password: "password123"}
    2. Verify: Status 201
    3. Verify: Response contains tokens {accessToken, refreshToken}
    4. Verify: User created in database
  Expected Result: 201 with tokens
  Evidence: .sisyphus/evidence/task-6-register.json
  ```

  **QA Scenario: Login existing user**
  ```
  Tool: Bash (curl)
  Preconditions: User registered
  Steps:
    1. POST /api/v1/auth/login with {email: "test@test.com", password: "password123"}
    2. Verify: Status 200
    3. Verify: Response contains tokens
  Expected Result: 200 with tokens
  Evidence: .sisyphus/evidence/task-6-login.json
  ```

  **QA Scenario: Protected route requires auth**
  ```
  Tool: Bash (curl)
  Preconditions: Server running
  Steps:
    1. GET /api/v1/contacts without Authorization header
    2. Verify: Status 401
    3. Repeat with invalid token
    4. Verify: Status 401
  Expected Result: 401 Unauthorized
  Evidence: .sisyphus/evidence/task-6-auth-middleware.txt
  ```

  **Evidence to Capture**:
  - [ ] Register response JSON
  - [ ] Login response JSON
  - [ ] Auth middleware test output

  **Commit**: YES
  - Message: `feat(auth): implement JWT authentication`
  - Files: `server/src/services/auth.service.ts`, `server/src/controllers/auth.controller.ts`, `server/src/routes/auth.routes.ts`, `server/src/middleware/auth.ts`, `server/src/config.ts`, `server/src/db/connection.ts`, `server/src/index.ts`
  - Pre-commit: `cd server && npm run build` (must compile)

---

- [ ] **Task 7: Contacts API — Full CRUD with Search**

  **What to do**: Implement complete contacts API with pagination, filtering, and full-text search.
  - `server/src/services/contact.service.ts` — Business logic
  - `server/src/controllers/contact.controller.ts` — Request handlers
  - `server/src/routes/contact.routes.ts` — Route definitions
  - Features: list (paginated), create, get, update, delete, archive/unarchive, timeline

  **Must NOT do**:
  - Do NOT add bulk operations
  - Do NOT add import/export
  - Do NOT add contact merging

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Complex service with multiple queries and relationships
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6, T8-T13)
  - **Parallel Group**: Wave 2
  - **Blocks**: T18-T20 (frontend pages need contacts)
  - **Blocked By**: T3 (needs DB tables), T4 (needs types), T6 (needs auth)

  **Acceptance Criteria**:

  **QA Scenario: Create contact**
  ```
  Tool: Bash (curl)
  Preconditions: Authenticated user, server running
  Steps:
    1. POST /api/v1/contacts with {firstName: "Alice", lastName: "Chen"}
    2. Verify: Status 201
    3. Verify: Response contains contact with id
  Expected Result: 201 with created contact
  Evidence: .sisyphus/evidence/task-7-create.json
  ```

  **QA Scenario: List contacts with pagination**
  ```
  Tool: Bash (curl)
  Preconditions: Contacts exist
  Steps:
    1. GET /api/v1/contacts?page=1&limit=10
    2. Verify: Status 200
    3. Verify: Response has {contacts: [], total, page, limit}
  Expected Result: 200 with paginated list
  Evidence: .sisyphus/evidence/task-7-list.json
  ```

  **QA Scenario: Full-text search**
  ```
  Tool: Bash (curl)
  Preconditions: Contact "Alice Chen" exists
  Steps:
    1. GET /api/v1/contacts?search=alice
    2. Verify: Status 200
    3. Verify: Alice Chen in results
  Expected Result: 200 with matching contacts
  Evidence: .sisyphus/evidence/task-7-search.json
  ```

  **Evidence to Capture**:
  - [ ] Create contact response
  - [ ] List contacts response
  - [ ] Search response

  **Commit**: YES
  - Message: `feat(contacts): implement CRUD API with search`
  - Files: `server/src/services/contact.service.ts`, `server/src/controllers/contact.controller.ts`, `server/src/routes/contact.routes.ts`
  - Pre-commit: `cd server && npm run build`

---

- [ ] **Task 8: Relationships API — Graph Edges**

  **What to do**: Implement relationship graph API with directed edges and graph query.
  - `server/src/services/relationship.service.ts` — Business logic
  - `server/src/controllers/relationship.controller.ts` — Request handlers
  - `server/src/routes/relationship.routes.ts` — Route definitions
  - Features: create, delete, list, getGraph (1-hop neighborhood)

  **Must NOT do**:
  - Do NOT add graph traversal beyond 1 hop
  - Do NOT add relationship suggestions
  - Do NOT add relationship strength metrics

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Graph queries require careful SQL construction
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6, T7, T9-T13)
  - **Parallel Group**: Wave 2
  - **Blocks**: T22 (graph component needs API)
  - **Blocked By**: T3 (needs DB tables), T4 (needs types), T6 (needs auth), T7 (needs contacts)

  **Acceptance Criteria**:

  **QA Scenario: Create relationship**
  ```
  Tool: Bash (curl)
  Preconditions: Two contacts exist
  Steps:
    1. POST /api/v1/relationships with {fromContactId, toContactId, type: "friend"}
    2. Verify: Status 201
    3. Verify: Relationship created in DB
  Expected Result: 201 with created relationship
  Evidence: .sisyphus/evidence/task-8-create.json
  ```

  **QA Scenario: Get contact graph**
  ```
  Tool: Bash (curl)
  Preconditions: Contact with relationships exists
  Steps:
    1. GET /api/v1/contacts/:id/graph
    2. Verify: Status 200
    3. Verify: Response has {nodes: [], edges: [], centerId}
  Expected Result: 200 with graph data
  Evidence: .sisyphus/evidence/task-8-graph.json
  ```

  **Evidence to Capture**:
  - [ ] Create relationship response
  - [ ] Graph query response

  **Commit**: YES
  - Message: `feat(relationships): implement graph edges API`
  - Files: `server/src/services/relationship.service.ts`, `server/src/controllers/relationship.controller.ts`, `server/src/routes/relationship.routes.ts`
  - Pre-commit: `cd server && npm run build`

---

- [ ] **Task 9: Notes API**

  **What to do**: Implement notes API for contact notes with markdown support.
  - `server/src/services/note.service.ts` — Business logic
  - `server/src/controllers/note.controller.ts` — Request handlers
  - `server/src/routes/note.routes.ts` — Route definitions
  - Features: list, create, update, delete

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Straightforward CRUD
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6-T8, T10-T13)
  - **Parallel Group**: Wave 2
  - **Blocks**: T20 (contact detail page shows notes)
  - **Blocked By**: T3 (needs DB tables), T4 (needs types), T6 (needs auth)

  **Acceptance Criteria**:

  **QA Scenario: Create note**
  ```
  Tool: Bash (curl)
  Preconditions: Contact exists
  Steps:
    1. POST /api/v1/contacts/:id/notes with {body: "Met at conference", format: "markdown"}
    2. Verify: Status 201
  Expected Result: 201 with created note
  Evidence: .sisyphus/evidence/task-9-create.json
  ```

  **Commit**: YES
  - Message: `feat(notes): implement notes API`
  - Files: `server/src/services/note.service.ts`, `server/src/controllers/note.controller.ts`, `server/src/routes/note.routes.ts`
  - Pre-commit: `cd server && npm run build`

---

- [ ] **Task 10: Tags API**

  **What to do**: Implement tags API with contact assignment.
  - `server/src/services/tag.service.ts` — Business logic
  - `server/src/controllers/tag.controller.ts` — Request handlers
  - `server/src/routes/tag.routes.ts` — Route definitions
  - Features: list, create, update, delete, assignToContact, removeFromContact

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Straightforward CRUD with many-to-many
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6-T9, T11-T13)
  - **Parallel Group**: Wave 2
  - **Blocks**: T20, T21 (contact and settings pages need tags)
  - **Blocked By**: T3 (needs DB tables), T4 (needs types), T6 (needs auth)

  **Acceptance Criteria**:

  **QA Scenario: Create tag**
  ```
  Tool: Bash (curl)
  Preconditions: Authenticated user
  Steps:
    1. POST /api/v1/tags with {name: "Family", color: "#ef4444"}
    2. Verify: Status 201
  Expected Result: 201 with created tag
  Evidence: .sisyphus/evidence/task-10-create.json
  ```

  **QA Scenario: Assign tag to contact**
  ```
  Tool: Bash (curl)
  Preconditions: Tag and contact exist
  Steps:
    1. POST /api/v1/contacts/:id/tags with {tagIds: ["..."]}
    2. Verify: Status 200
  Expected Result: 200 with updated contact tags
  Evidence: .sisyphus/evidence/task-10-assign.json
  ```

  **Commit**: YES
  - Message: `feat(tags): implement tags API with contact assignment`
  - Files: `server/src/services/tag.service.ts`, `server/src/controllers/tag.controller.ts`, `server/src/routes/tag.routes.ts`
  - Pre-commit: `cd server && npm run build`

---

- [ ] **Task 11: Custom Fields API**

  **What to do**: Implement custom fields API for user-defined fields.
  - `server/src/services/customField.service.ts` — Business logic
  - `server/src/controllers/customField.controller.ts` — Request handlers
  - `server/src/routes/customField.routes.ts` — Route definitions
  - Features: list, create, update, delete definitions

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Straightforward CRUD
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6-T10, T12-T13)
  - **Parallel Group**: Wave 2
  - **Blocks**: T20, T21 (contact and settings pages need custom fields)
  - **Blocked By**: T3 (needs DB tables), T4 (needs types), T6 (needs auth)

  **Acceptance Criteria**:

  **QA Scenario: Create custom field**
  ```
  Tool: Bash (curl)
  Preconditions: Authenticated user
  Steps:
    1. POST /api/v1/custom-fields with {name: "Met at", fieldType: "text"}
    2. Verify: Status 201
  Expected Result: 201 with created custom field
  Evidence: .sisyphus/evidence/task-11-create.json
  ```

  **Commit**: YES
  - Message: `feat(custom-fields): implement custom fields API`
  - Files: `server/src/services/customField.service.ts`, `server/src/controllers/customField.controller.ts`, `server/src/routes/customField.routes.ts`
  - Pre-commit: `cd server && npm run build`

---

- [ ] **Task 12: Reminders API**

  **What to do**: Implement reminders API for keep-in-touch scheduling.
  - `server/src/services/reminder.service.ts` — Business logic
  - `server/src/controllers/reminder.controller.ts` — Request handlers
  - `server/src/routes/reminder.routes.ts` — Route definitions
  - Features: list, create, update, delete

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Straightforward CRUD with date calculations
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6-T11, T13)
  - **Parallel Group**: Wave 2
  - **Blocks**: T18 (dashboard shows reminders)
  - **Blocked By**: T3 (needs DB tables), T4 (needs types), T6 (needs auth)

  **Acceptance Criteria**:

  **QA Scenario: Create reminder**
  ```
  Tool: Bash (curl)
  Preconditions: Contact exists
  Steps:
    1. POST /api/v1/reminders with {contactId: "...", type: "keep_in_touch", intervalDays: 30}
    2. Verify: Status 201
    3. Verify: due_date calculated automatically
  Expected Result: 201 with created reminder
  Evidence: .sisyphus/evidence/task-12-create.json
  ```

  **Commit**: YES
  - Message: `feat(reminders): implement reminders API`
  - Files: `server/src/services/reminder.service.ts`, `server/src/controllers/reminder.controller.ts`, `server/src/routes/reminder.routes.ts`
  - Pre-commit: `cd server && npm run build`

---

- [ ] **Task 13: Search API & OpenAPI Specification**

  **What to do**: Implement global search across contacts and notes, plus complete OpenAPI spec.
  - `server/src/services/search.service.ts` — Full-text search logic
  - `server/src/controllers/search.controller.ts` — Request handlers
  - `server/src/routes/search.routes.ts` — Route definitions
  - `server/docs/openapi.yaml` — Complete OpenAPI 3.0 spec

  **Must NOT do**:
  - Do NOT add Elasticsearch or external search service
  - Do NOT add fuzzy search

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: PostgreSQL full-text search + comprehensive documentation
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6-T12)
  - **Parallel Group**: Wave 2
  - **Blocks**: T18 (dashboard search widget)
  - **Blocked By**: T3 (needs DB tables), T4 (needs types), T6 (needs auth), T7 (needs contacts), T9 (needs notes)

  **Acceptance Criteria**:

  **QA Scenario: Search contacts and notes**
  ```
  Tool: Bash (curl)
  Preconditions: Contacts and notes exist
  Steps:
    1. GET /api/v1/search?q=alice
    2. Verify: Status 200
    3. Verify: Response contains contacts and/or notes
  Expected Result: 200 with search results
  Evidence: .sisyphus/evidence/task-13-search.json
  ```

  **QA Scenario: OpenAPI spec validates**
  ```
  Tool: Bash
  Preconditions: OpenAPI spec created
  Steps:
    1. Run: cat server/docs/openapi.yaml | head -50
    2. Verify: Valid OpenAPI 3.0 structure
  Expected Result: Valid OpenAPI spec present
  Evidence: .sisyphus/evidence/task-13-openapi.txt
  ```

  **Commit**: YES
  - Message: `feat(search): implement full-text search and OpenAPI spec`
  - Files: `server/src/services/search.service.ts`, `server/src/controllers/search.controller.ts`, `server/src/routes/search.routes.ts`, `server/docs/openapi.yaml`
  - Pre-commit: `cd server && npm run build`


---

- [ ] **Task 14: Frontend API Client & Auth Context**

  **What to do**: Create the API client with auth token handling and React auth context.
  - `client/src/api/client.ts` — Base fetch wrapper with token refresh
  - `client/src/api/auth.ts` — Auth API functions
  - `client/src/api/contacts.ts` — Contacts API functions
  - `client/src/api/relationships.ts` — Relationships API functions
  - `client/src/api/notes.ts` — Notes API functions
  - `client/src/api/tags.ts` — Tags API functions
  - `client/src/api/customFields.ts` — Custom fields API functions
  - `client/src/api/reminders.ts` — Reminders API functions
  - `client/src/api/search.ts` — Search API functions
  - `client/src/context/AuthContext.tsx` — Auth state management

  **Must NOT do**:
  - Do NOT implement React Query/TanStack Query (keep it simple)
  - Do NOT add request caching
  - Do NOT add offline support

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: API wrappers and context setup
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T15-T17 in Wave 3)
  - **Parallel Group**: Wave 3
  - **Blocks**: T15-T22 (all frontend features need API client)
  - **Blocked By**: T5 (needs client/ directory), T6 (needs auth endpoints), T7 (needs contact endpoints)

  **Acceptance Criteria**:

  **QA Scenario: API client TypeScript compiles**
  ```
  Tool: Bash
  Preconditions: Client dependencies installed
  Steps:
    1. Run: cd /home/samir/personal-crm/client && npx tsc --noEmit
    2. Verify: No compilation errors
  Expected Result: TypeScript compilation succeeds
  Evidence: .sisyphus/evidence/task-14-tsc.txt
  ```

  **QA Scenario: Auth context exists**
  ```
  Tool: Bash
  Preconditions: Task 5 complete
  Steps:
    1. Run: cat /home/samir/personal-crm/client/src/context/AuthContext.tsx | grep "AuthProvider\|useAuth"
    2. Verify: Both exports present
  Expected Result: Auth context exports found
  Evidence: .sisyphus/evidence/task-14-auth-context.txt
  ```

  **Commit**: YES
  - Message: `feat(client): add API client and auth context`
  - Files: `client/src/api/*.ts`, `client/src/context/AuthContext.tsx`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 15: App Shell — Sidebar, Routing & Layout**

  **What to do**: Create the application shell with sidebar navigation, routing, and responsive layout.
  - `client/src/App.tsx` — Main app with routing
  - `client/src/components/AppLayout.tsx` — Layout with sidebar
  - `client/src/components/Sidebar.tsx` — Navigation sidebar
  - `client/src/components/TopBar.tsx` — Mobile top bar
  - `client/src/AppLayout.css` — Layout styles

  **Must NOT do**:
  - Do NOT implement page components (T18-T22)
  - Do NOT implement settings pages (T21)
  - Do NOT add complex animations

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: UI layout requires frontend expertise
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T14, T16, T17)
  - **Parallel Group**: Wave 3
  - **Blocks**: T18-T22 (pages need layout)
  - **Blocked By**: T5 (needs client/ directory), T14 (needs API client)

  **Acceptance Criteria**:

  **QA Scenario: Vite dev server starts**
  ```
  Tool: Bash
  Preconditions: Client dependencies installed
  Steps:
    1. Run: cd /home/samir/personal-crm/client && npm run dev &
    2. Wait 5 seconds
    3. Run: curl -s http://localhost:5173 | grep "root"
  Expected Result: HTML returned with root div
  Evidence: .sisyphus/evidence/task-15-vite-start.txt
  ```

  **QA Scenario: Sidebar component renders**
  ```
  Tool: playwright (screenshot)
  Preconditions: Dev server running
  Steps:
    1. Navigate to http://localhost:5173/login
    2. Take screenshot
    3. Verify: Login page with centered form visible
  Expected Result: Login page renders
  Evidence: .sisyphus/evidence/task-15-login-page.png
  ```

  **Commit**: YES
  - Message: `feat(client): add app shell with sidebar and routing`
  - Files: `client/src/App.tsx`, `client/src/components/AppLayout.tsx`, `client/src/components/Sidebar.tsx`, `client/src/components/TopBar.tsx`, `client/src/AppLayout.css`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 16: Login & Register Pages**

  **What to do**: Create authentication pages with forms and validation.
  - `client/src/pages/LoginPage.tsx` — Login form
  - `client/src/pages/RegisterPage.tsx` — Registration form
  - `client/src/pages/AuthPages.css` — Shared auth styles

  **Must NOT do**:
  - Do NOT add password reset flow
  - Do NOT add email verification
  - Do NOT add OAuth buttons

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: Form UI requires frontend expertise
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T14-T15, T17)
  - **Parallel Group**: Wave 3
  - **Blocks**: T18-T22 (protected pages need auth)
  - **Blocked By**: T5 (needs client/ directory), T14 (needs auth context)

  **Acceptance Criteria**:

  **QA Scenario: Login form works**
  ```
  Tool: playwright
  Preconditions: Server running with seeded user
  Steps:
    1. Navigate to http://localhost:5173/login
    2. Fill email: demo@example.com
    3. Fill password: demo1234
    4. Click "Sign In"
    5. Verify: Redirected to dashboard
  Expected Result: Login succeeds, dashboard loads
  Evidence: .sisyphus/evidence/task-16-login-flow.png
  ```

  **Commit**: YES
  - Message: `feat(client): add login and register pages`
  - Files: `client/src/pages/LoginPage.tsx`, `client/src/pages/RegisterPage.tsx`, `client/src/pages/AuthPages.css`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 17: Shared UI Components**

  **What to do**: Create reusable UI components for the design system.
  - `client/src/components/Avatar.tsx` — Contact avatars with initials
  - `client/src/components/Badge.tsx` — Tag badges
  - `client/src/components/Button.tsx` — Button variants
  - `client/src/components/Input.tsx` — Form inputs
  - `client/src/components/Modal.tsx` — Modal dialogs
  - `client/src/components/EmptyState.tsx` — Empty state display
  - `client/src/components/SearchInput.tsx` — Search with icon

  **Must NOT do**:
  - Do NOT add complex component library
  - Do NOT add component tests
  - Do NOT add Storybook

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: UI component implementation
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T14-T16)
  - **Parallel Group**: Wave 3
  - **Blocks**: T18-T22 (pages use these components)
  - **Blocked By**: T5 (needs client/ directory)

  **Acceptance Criteria**:

  **QA Scenario: Components TypeScript compiles**
  ```
  Tool: Bash
  Preconditions: Task 5 complete
  Steps:
    1. Run: cd /home/samir/personal-crm/client && npx tsc --noEmit src/components/*.tsx
  Expected Result: No compilation errors
  Evidence: .sisyphus/evidence/task-17-components.txt
  ```

  **Commit**: YES
  - Message: `feat(client): add shared UI components`
  - Files: `client/src/components/Avatar.tsx`, `client/src/components/Badge.tsx`, `client/src/components/Button.tsx`, `client/src/components/Input.tsx`, `client/src/components/Modal.tsx`, `client/src/components/EmptyState.tsx`, `client/src/components/SearchInput.tsx`
  - Pre-commit: `cd client && npx tsc --noEmit`


---

- [ ] **Task 18: Dashboard Page**

  **What to do**: Implement the dashboard with widgets for recent contacts, birthdays, reminders, and activity.
  - `client/src/pages/DashboardPage.tsx` — Main dashboard
  - `client/src/pages/DashboardPage.css` — Dashboard styles
  - Features: Welcome header, global search, recent contacts, upcoming birthdays, reminders, activity feed

  **Must NOT do**:
  - Do NOT add real-time updates
  - Do NOT add charts/analytics
  - Do NOT add data export

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: Complex UI with multiple widgets
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T19-T22 in Wave 4)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: T7 (needs contacts API), T12 (needs reminders API), T14 (needs API client), T15 (needs layout), T17 (needs components)

  **Acceptance Criteria**:

  **QA Scenario: Dashboard loads with data**
  ```
  Tool: playwright
  Preconditions: User logged in, contacts exist
  Steps:
    1. Navigate to http://localhost:5173/
    2. Verify: Dashboard visible
    3. Verify: "Good morning" greeting shown
    4. Verify: Recent contacts widget visible
  Expected Result: Dashboard renders with data
  Evidence: .sisyphus/evidence/task-18-dashboard.png
  ```

  **Commit**: YES
  - Message: `feat(client): add dashboard page`
  - Files: `client/src/pages/DashboardPage.tsx`, `client/src/pages/DashboardPage.css`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 19: Contact List Page**

  **What to do**: Implement the contacts list with filters, search, and create modal.
  - `client/src/pages/ContactListPage.tsx` — Contact list
  - `client/src/pages/ContactListPage.css` — List styles
  - Features: Card grid, search, tag filter, sort, pagination, create modal

  **Must NOT do**:
  - Do NOT add bulk operations
  - Do NOT add import/export
  - Do NOT add contact merging

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: Complex UI with filters and modals
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T18, T20-T22)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: T7 (needs contacts API), T10 (needs tags API), T14 (needs API client), T15 (needs layout), T16 (needs auth), T17 (needs components)

  **Acceptance Criteria**:

  **QA Scenario: Contact list displays**
  ```
  Tool: playwright
  Preconditions: User logged in, contacts exist
  Steps:
    1. Navigate to http://localhost:5173/contacts
    2. Verify: Contact list visible
    3. Verify: Contact cards shown
    4. Click on a contact card
    5. Verify: Navigates to contact detail
  Expected Result: Contact list renders and navigation works
  Evidence: .sisyphus/evidence/task-19-contact-list.png
  ```

  **Commit**: YES
  - Message: `feat(client): add contact list page`
  - Files: `client/src/pages/ContactListPage.tsx`, `client/src/pages/ContactListPage.css`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 20: Contact Detail Page**

  **What to do**: Implement contact detail with tabs for overview, notes/timeline, and relationships.
  - `client/src/pages/ContactDetailPage.tsx` — Contact detail
  - `client/src/pages/ContactDetailPage.css` — Detail styles
  - Features: Header with actions, Overview tab, Notes & Timeline tab, Relationships tab

  **Must NOT do**:
  - Do NOT add file attachments
  - Do NOT add contact merge
  - Do NOT add sharing

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: Complex page with tabs and forms
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T18-T19, T21-T22)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: T7-T11 (needs all APIs), T14-T17 (needs frontend foundation)

  **Acceptance Criteria**:

  **QA Scenario: Contact detail shows tabs**
  ```
  Tool: playwright
  Preconditions: User logged in, contact exists
  Steps:
    1. Navigate to http://localhost:5173/contacts/:id
    2. Verify: Contact header visible
    3. Verify: Three tabs present (Overview, Notes, Relationships)
    4. Click each tab
    5. Verify: Tab content changes
  Expected Result: Tabs work correctly
  Evidence: .sisyphus/evidence/task-20-contact-detail.png
  ```

  **Commit**: YES
  - Message: `feat(client): add contact detail page`
  - Files: `client/src/pages/ContactDetailPage.tsx`, `client/src/pages/ContactDetailPage.css`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 21: Settings Pages**

  **What to do**: Implement settings pages for tags and custom fields management.
  - `client/src/pages/SettingsPage.tsx` — Settings shell with navigation
  - `client/src/pages/settings/TagsManager.tsx` — Tags CRUD
  - `client/src/pages/settings/FieldsManager.tsx` — Custom fields CRUD
  - `client/src/pages/SettingsPage.css` — Settings styles

  **Must NOT do**:
  - Do NOT add user profile settings
  - Do NOT add notification settings
  - Do NOT add integrations

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: Form-heavy UI
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T18-T20, T22)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: T10-T11 (needs tags and custom fields APIs), T14-T17 (needs frontend foundation)

  **Acceptance Criteria**:

  **QA Scenario: Settings pages work**
  ```
  Tool: playwright
  Preconditions: User logged in
  Steps:
    1. Navigate to http://localhost:5173/settings
    2. Verify: Redirected to /settings/tags
    3. Verify: Tags manager visible
    4. Navigate to /settings/fields
    5. Verify: Fields manager visible
  Expected Result: Settings navigation works
  Evidence: .sisyphus/evidence/task-21-settings.png
  ```

  **Commit**: YES
  - Message: `feat(client): add settings pages`
  - Files: `client/src/pages/SettingsPage.tsx`, `client/src/pages/settings/TagsManager.tsx`, `client/src/pages/settings/FieldsManager.tsx`, `client/src/pages/SettingsPage.css`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 22: Relationship Graph Component**

  **What to do**: Implement the D3.js force-directed relationship graph visualization.
  - `client/src/components/RelationshipGraph.tsx` — D3.js graph component
  - `client/src/components/RelationshipGraph.css` — Graph styles
  - Features: Force simulation, zoom/pan, click navigation, tooltips

  **Must NOT do**:
  - Do NOT add graph editing (drag to create edges)
  - Do NOT add graph export
  - Do NOT add multiple hops

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: D3.js visualization requires frontend expertise
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T18-T21)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: T8 (needs relationships API), T14-T17 (needs frontend foundation)

  **Acceptance Criteria**:

  **QA Scenario: Graph renders**
  ```
  Tool: playwright
  Preconditions: User logged in, contact with relationships exists
  Steps:
    1. Navigate to http://localhost:5173/contacts/:id
    2. Click "Relationships" tab
    3. Verify: D3.js graph visible
    4. Verify: Nodes and edges shown
  Expected Result: Graph renders correctly
  Evidence: .sisyphus/evidence/task-22-graph.png
  ```

  **Commit**: YES
  - Message: `feat(client): add D3.js relationship graph`
  - Files: `client/src/components/RelationshipGraph.tsx`, `client/src/components/RelationshipGraph.css`
  - Pre-commit: `cd client && npx tsc --noEmit`


---

- [ ] **Task 23: Seed Data & Integration Testing**

  **What to do**: Create database seed file with demo data and run integration tests.
  - `server/src/db/seeds/001_demo_data.ts` — Seed with demo user and contacts
  - Integration test: Full user flow

  **Must NOT do**:
  - Do NOT create production seed data
  - Do NOT add destructive seeds

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Requires coordination of all APIs
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T24 in Wave 5)
  - **Parallel Group**: Wave 5
  - **Blocks**: T25-T26 (needs working app)
  - **Blocked By**: T3 (needs migrations), T6-T22 (needs all features)

  **Acceptance Criteria**:

  **QA Scenario: Seed data creates demo user**
  ```
  Tool: Bash
  Preconditions: Database running
  Steps:
    1. Run: cd server && npm run migrate
    2. Run: cd server && npm run seed
    3. Run: psql -c "SELECT email FROM users;"
    4. Verify: demo@example.com exists
  Expected Result: Demo user created
  Evidence: .sisyphus/evidence/task-23-seed.txt
  ```

  **Commit**: YES
  - Message: `feat(db): add demo seed data`
  - Files: `server/src/db/seeds/001_demo_data.ts`
  - Pre-commit: `cd server && npm run build`

---

- [ ] **Task 24: Docker Multi-Stage Setup**

  **What to do**: Create production-ready Docker configuration.
  - `server/Dockerfile` — Multi-stage backend build
  - `client/Dockerfile` — Multi-stage frontend build
  - `client/nginx.conf` — Nginx config with SPA fallback
  - `docker-compose.yml` — Full stack orchestration
  - `server/.dockerignore` — Backend ignore file
  - `client/.dockerignore` — Frontend ignore file
  - `server/src/db/run-migrations.ts` — Migration runner

  **Must NOT do**:
  - Do NOT add Kubernetes configs
  - Do NOT add CI/CD pipelines
  - Do NOT add production reverse proxy (nginx included)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Docker multi-stage builds require expertise
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T23 in Wave 5)
  - **Parallel Group**: Wave 5
  - **Blocks**: T25-T26
  - **Blocked By**: T6-T13 (needs backend), T14-T22 (needs frontend)

  **Acceptance Criteria**:

  **QA Scenario: Docker compose builds**
  ```
  Tool: Bash
  Preconditions: Docker daemon running
  Steps:
    1. Run: docker compose build
    2. Verify: Both images build successfully
    3. Run: docker compose up -d
    4. Wait 10 seconds
    5. Run: curl http://localhost/api/health
    6. Verify: {"status":"ok"}
  Expected Result: All services start
  Evidence: .sisyphus/evidence/task-24-docker.txt
  ```

  **Commit**: YES
  - Message: `feat(docker): add multi-stage production setup`
  - Files: `server/Dockerfile`, `client/Dockerfile`, `client/nginx.conf`, `docker-compose.yml`, `.dockerignore`
  - Pre-commit: `docker compose build`

---

- [ ] **Task 25: README & Documentation**

  **What to do**: Create comprehensive README with setup instructions.
  - `README.md` — Project documentation

  **Must NOT do**:
  - Do NOT add video tutorials
  - Do NOT add contributing guidelines (single user)
  - Do NOT add changelogs

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Reason**: Documentation writing
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T23-T24, T26)
  - **Parallel Group**: Wave 5
  - **Blocks**: None
  - **Blocked By**: T24 (needs Docker setup complete)

  **Acceptance Criteria**:

  **QA Scenario: README exists**
  ```
  Tool: Bash
  Preconditions: None
  Steps:
    1. Run: ls /home/samir/personal-crm/README.md
    2. Verify: File exists
    3. Run: head -50 /home/samir/personal-crm/README.md
    4. Verify: Contains Quick Start section
  Expected Result: README with setup instructions
  Evidence: .sisyphus/evidence/task-25-readme.txt
  ```

  **Commit**: YES
  - Message: `docs: add comprehensive README`
  - Files: `README.md`
  - Pre-commit: N/A

---

- [ ] **Task 26: Final Route Mounting & Polish**

  **What to do**: Finalize backend route mounting and add polish.
  - `server/src/index.ts` — Mount all routes
  - Final checks and polish

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Final integration
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T23-T25)
  - **Parallel Group**: Wave 5
  - **Blocks**: T23 (integration testing needs all routes)
  - **Blocked By**: T6-T13 (all routes must exist)

  **Acceptance Criteria**:

  **QA Scenario: All routes mounted**
  ```
  Tool: Bash
  Preconditions: Server running
  Steps:
    1. Run: curl http://localhost:3001/api/v1/auth/register -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"password123"}'
    2. Verify: 201 response
    3. Run: curl http://localhost:3001/api/v1/contacts -H "Authorization: Bearer <token>"
    4. Verify: 200 response
  Expected Result: All routes working
  Evidence: .sisyphus/evidence/task-26-routes.txt
  ```

  **Commit**: YES
  - Message: `feat(server): finalize route mounting`
  - Files: `server/src/index.ts`
  - Pre-commit: `cd server && npm run build`
