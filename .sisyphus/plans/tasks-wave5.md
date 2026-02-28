

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
