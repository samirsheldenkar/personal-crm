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
