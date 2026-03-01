# Code Remediation Round 2 - Personal CRM

## TL;DR

> **Quick Summary**: Comprehensive remediation of 16 issues identified in code review round 2. Fixes include dead error handler middleware, N+1 API problems, .env.example defaults, and missing Settings CRUD functionality.
>
> **Deliverables**:
> - ✅ Fixed `.env.example` with correct defaults
> - ✅ Fixed email schema mismatch (type → label)
> - ✅ Backend endpoints for aggregated data (birthdays, notes)
> - ✅ Refactored 8 controllers to use asyncHandler (pilot + batch)
> - ✅ Removed dead error handler middleware
> - ✅ Settings CRUD (tags, custom fields)
> - ✅ Auth page CSS and styling
> - ✅ Extracted shared utilities (useDebounce, getErrorMessage)
>
> **Estimated Effort**: Medium-Large (3-4 days)
> **Parallel Execution**: YES - 6 waves + pilot validation gate
> **Critical Path**: Pre-work → Wave 1 → Wave 2 → Pilot (3.2) → Validation (3.3) → Wave 4 → Wave 5 → Wave 6

---

## Context

### Original Request
Review code-review-2.md in the plans folder and construct a new plan for addressing the issues and continuing development.

### Interview Summary
**Key Findings from Code Review:**
- Error handler middleware exists but is dead code - all 8 controllers have inline try/catch (139+ lines duplicated)
- Dashboard N+1 problem - fetches notes for every contact individually (100 contacts = 100 HTTP requests)
- Dashboard fetches ALL contacts for birthday filtering (lines 211-230)
- `.env.example` has wrong defaults (PORT=5000 vs 3001, wrong DB credentials)
- CreateContactModal email schema mismatch - uses `type: 'work'` but backend expects `label`
- SettingsPage is read-only (no CRUD for tags/custom fields)
- Missing auth page CSS (LoginPage, RegisterPage)
- Missing input classes on auth pages
- WidgetErrorBoundary duplicates ErrorBoundary
- useDebounce hook inline in DashboardPage
- getErrorMessage duplicated across 3 pages
- @types/d3 in dependencies instead of devDependencies
- uuid dependency unused in server/package.json

### Metis Review
**Identified Gaps** (addressed in this plan):
- Error handling refactor must use pilot approach (1 controller first, not all 8)
- Need baseline measurement before N+1 fix
- Need to verify email schema data before schema change
- Settings CRUD needs explicit scope definition
- Need concrete acceptance criteria with exact verification commands
- Pre-work validation tasks added for assumptions

---

## Work Objectives

### Core Objective
Remediate all 16 issues from code review round 2 while maintaining system stability and following safe refactoring practices.

### Concrete Deliverables
1. `.env.example` with correct defaults (PORT=3001, correct DB credentials, /v1 in API URL)
2. Backend endpoint `GET /api/contacts/birthdays` for server-side birthday filtering
3. Backend endpoint `GET /api/contacts/notes/recent` for aggregated notes
4. asyncHandler utility with comprehensive tests
5. All 8 controllers refactored to use asyncHandler (1 pilot + 7 remaining)
6. Dead error handler middleware removed
7. Settings CRUD UI and API for tags and custom fields
8. Auth page CSS and styling fixes
9. Shared utilities extracted (useDebounce, getErrorMessage)
10. WidgetErrorBoundary deduplicated

### Definition of Done
- [ ] All 16 issues from code review resolved
- [ ] Error handling refactor validated through pilot controller
- [ ] N+1 problem eliminated (≤3 API calls for dashboard regardless of contact count)
- [ ] All tests pass (if test infrastructure exists)
- [ ] No regression in existing functionality

### Must Have
- Error handling refactor uses pilot approach (not all-at-once)
- Backend API changes maintain backward compatibility
- Email schema change verified against existing data
- Exact acceptance criteria for every task

### Must NOT Have (Guardrails)
- **Must NOT**: Refactor all 8 controllers simultaneously in first pass
- **Must NOT**: Add features to Settings beyond explicit CRUD for tags/custom fields
- **Must NOT**: Change error message content during error handling refactor (only restructure)
- **Must NOT**: Remove old endpoints until frontend fully migrated
- **Must NOT**: Implement soft-delete, audit logging, or advanced Settings features
- **Must NOT**: Deploy error handling changes without 24-hour monitoring on pilot

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (bun test available in both client and server)
- **Automated tests**: Tests-after (implement then add tests for new functionality)
- **Framework**: bun test
- **Coverage**: Each task includes specific verification commands

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Library/Module**: Use Bash (bun/node REPL) — Import, call functions, compare output

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 (Pre-work - VALIDATION FIRST):
├── Task 0.1: Validate error handler usage [quick]
├── Task 0.2: Baseline N+1 measurement [quick]
└── Task 0.3: Check email schema data [quick]

Wave 1 (Infrastructure - Start Immediately):
├── Task 1.1: Fix .env.example defaults [quick]
├── Task 1.2: Move @types/d3 to devDependencies [quick]
└── Task 1.3: Remove unused uuid dependency [quick]

Wave 2 (Backend Performance - After Pre-work):
├── Task 2.1: Create backend birthday aggregation endpoint [deep]
├── Task 2.2: Create backend notes aggregation endpoint [deep]
└── Task 2.3: Fix email schema mismatch [quick]

Wave 3 (Error Handling PILOT - After Wave 2):
├── Task 3.1: Create asyncHandler utility with tests [deep]
├── Task 3.2: Refactor ONE pilot controller [deep]
└── Task 3.3: Validate pilot in staging (24-hour gate) [unspecified-low]
    [GATE: Must pass before proceeding to Wave 4]

Wave 4 (Error Handling Batch - After Pilot Validated):
├── Task 4.1: Refactor remaining 7 controllers [deep]
└── Task 4.2: Remove dead error handler middleware [quick]

Wave 5 (Settings CRUD - After Wave 4):
├── Task 5.1: Define Settings CRUD scope [collaborative]
├── Task 5.2: Implement Settings CRUD UI [visual-engineering]
└── Task 5.3: Implement Settings CRUD API [deep]

Wave 6 (UI Polish - After Wave 5):
├── Task 6.1: Add auth page CSS [visual-engineering]
├── Task 6.2: Extract useDebounce hook [quick]
├── Task 6.3: Extract getErrorMessage utility [quick]
└── Task 6.4: Consolidate error boundaries [quick]

Wave FINAL (After ALL tasks - 4 parallel review agents):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: 0.x → 1.x → 2.x → 3.1 → 3.2 → 3.3 (GATE) → 4.x → 5.x → 6.x → F.x
Max Concurrent: 3 (Wave 1), 3 (Wave 2), 1 (Wave 3), 7 (Wave 4), 3 (Wave 5), 4 (Wave 6)
Risk Mitigation: Pilot approach for error handling reduces blast radius by 87%
```

### Dependency Matrix

- **0.x**: — — 1.x, 2.x, 3.x, 4.x
- **1.x**: — — 2.x, 1
- **2.x**: 0.2, 0.3 — 2.3, 3.x, 2
- **3.1**: 0.1 — 3.2, 3
- **3.2**: 3.1 — 3.3, 3
- **3.3**: 3.2 — 4.x, 4 (GATE)
- **4.x**: 3.3 — F.x, 4
- **5.x**: 4.x — 6.x, 5
- **6.x**: 5.x — F.x, 6
- **F.x**: ALL — — FINAL

### Agent Dispatch Summary

- **0**: **3** → All `quick`
- **1**: **3** → All `quick`
- **2**: **3** → 2.1-2.2 `deep`, 2.3 `quick`
- **3**: **3** → 3.1-3.2 `deep`, 3.3 `unspecified-low`
- **4**: **2** → 4.1 `deep`, 4.2 `quick`
- **5**: **3** → 5.1 `collaborative`, 5.2 `visual-engineering` + `frontend-ui-ux`, 5.3 `deep`
- **6**: **4** → 6.1 `visual-engineering` + `frontend-ui-ux`, 6.2-6.4 `quick`
- **FINAL**: **4** → F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high` + `playwright`, F4 `deep`

---

## TODOs


- [ ] **0.1. Validate Error Handler Usage**

  **What to do**:
  - Search codebase for imports of error handler middleware
  - Check if tests or other routes depend on it
  - Verify it truly is "dead code" before refactoring

  **Must NOT do**:
  - Modify any controller code yet
  - Delete error handler middleware file

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`git-master`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 0
  - **Blocks**: Task 3.1
  - **Blocked By**: None

  **References**:
  - `server/src/middleware/errorHandler.ts` - Error handler implementation
  - `server/src/index.ts:36` - Registration line
  - Run: `grep -r "errorHandler" --include="*.ts" server/src/`

  **Acceptance Criteria**:
  - [ ] grep shows only 3 references (index.ts import, definition, export)
  - [ ] Confirmed: middleware is truly unused by controllers

  **QA Scenarios**:
  ```
  Scenario: Verify error handler is dead code
    Tool: Bash
    Steps: grep -r "errorHandler" --include="*.ts" server/src/
    Expected: Only 3 references found
    Evidence: .sisyphus/evidence/task-01-handler-usage.txt
  ```

  **Commit**: NO

- [ ] **0.2. Baseline N+1 Measurement**

  **What to do**:
  - Count current API calls when Dashboard loads with 10+ contacts
  - Document: "Dashboard with N contacts makes 1 + N API calls"

  **Must NOT do**:
  - Modify any code
  - Skip measurement

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`dev-browser`]

  **Parallelization**:
  - **Blocks**: Task 2.1, 2.2

  **References**:
  - `client/src/pages/DashboardPage.tsx:311-316`

  **Acceptance Criteria**:
  - [ ] Baseline documented with contact count and API call count
  - [ ] Network tab screenshot captured

  **QA Scenarios**:
  ```
  Scenario: Measure N+1 baseline
    Tool: Playwright
    Steps: Navigate to Dashboard, count API calls
    Expected: N+1 pattern confirmed
    Evidence: .sisyphus/evidence/task-02-n1-baseline.png
  ```

  **Commit**: NO

- [ ] **0.3. Check Email Schema Data**

  **What to do**:
  - Query database for contacts with `type: 'work'` in emails array

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Parallelization**:
  - **Blocks**: Task 2.3

  **References**:
  - `server/src/types/contact.ts`
  - SQL: `SELECT COUNT(*) FROM contacts WHERE emails::text LIKE '%type%'`

  **Acceptance Criteria**:
  - [ ] Count of records with `type` field documented

  **QA Scenarios**:
  ```
  Scenario: Check email type data
    Tool: Bash (psql)
    Steps: Run SQL query
    Expected: Count returned
    Evidence: .sisyphus/evidence/task-03-email-check.txt
  ```

  **Commit**: NO

---

## Wave 1: Infrastructure Fixes

- [ ] **1.1. Fix .env.example Defaults**

  **What to do**:
  - Update PORT to 3001 (matches code default)
  - Fix DB_USER to crm (not user)
  - Fix DB_PASSWORD to crm_secret (not password)
  - Add /v1 to VITE_API_URL
  - Fix JWT_EXPIRES_IN to 15m (not 1h)

  **Must NOT do**:
  - Change .env.example defaults that don't match code

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **References**:
  - `server/src/config.ts` - Code defaults
  - `client/src/api/client.ts` - API base URL
  - Current .env.example shows: PORT=5000, DB_USER=user, DB_PASSWORD=password

  **Acceptance Criteria**:
  - [ ] `cp .env.example .env && npm run dev` starts server on port 3001
  - [ ] `curl http://localhost:3001/api/health` returns 200

  **QA Scenarios**:
  ```
  Scenario: Verify .env.example works
    Tool: Bash
    Steps:
      1. cp .env.example .env
      2. npm run dev
      3. curl http://localhost:3001/api/health
    Expected: {"status":"ok"}
    Evidence: .sisyphus/evidence/task-04-env-test.txt
  ```

  **Commit**: YES
  - Message: `fix: update .env.example to match code defaults`

- [ ] **1.2. Move @types/d3 to devDependencies**

  **What to do**:
  - Move @types/d3 from dependencies to devDependencies in client/package.json

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **References**:
  - `client/package.json` line 13

  **Acceptance Criteria**:
  - [ ] @types/d3 listed under devDependencies
  - [ ] `npm install` completes without errors
  - [ ] `npm run build` succeeds

  **QA Scenarios**:
  ```
  Scenario: Verify @types/d3 moved
    Tool: Bash
    Steps:
      1. Check package.json
      2. npm install
      3. npm run build
    Expected: Build succeeds
    Evidence: .sisyphus/evidence/task-05-types-d3.txt
  ```

  **Commit**: YES
  - Message: `chore: move @types/d3 to devDependencies`

- [ ] **1.3. Remove Unused uuid Dependency**

  **What to do**:
  - Remove uuid from server/package.json dependencies after verifying unused

  **Must NOT do**:
  - Remove without verifying it's unused

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **References**:
  - `server/package.json` line 22
  - Verify: `grep -r "uuid" --include="*.ts" server/src/`

  **Acceptance Criteria**:
  - [ ] grep shows no uuid imports
  - [ ] uuid removed from package.json
  - [ ] `npm install` works

  **QA Scenarios**:
  ```
  Scenario: Verify uuid removal safe
    Tool: Bash
    Steps:
      1. grep -r "uuid" --include="*.ts" server/src/
      2. Remove from package.json
      3. npm install
    Expected: No uuid references found, install succeeds
    Evidence: .sisyphus/evidence/task-06-uuid-check.txt
  ```

  **Commit**: YES
  - Message: `chore: remove unused uuid dependency`


---

## Wave 2: Backend Performance

- [ ] **2.1. Create Backend Birthday Aggregation Endpoint**

  **What to do**:
  - Create GET /api/contacts/birthdays?upcoming=30
  - Returns contacts with birthdays in next N days (server-side filtered)
  - Use PostgreSQL date math for efficiency

  **Must NOT do**:
  - Break existing /contacts endpoint
  - Remove old endpoint yet

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **References**:
  - `server/src/services/contact.service.ts` - Existing contact service
  - `server/src/routes/contact.routes.ts` - Route definitions
  - `server/src/controllers/contact.controller.ts` - Controller pattern
  - PostgreSQL date functions for birthday calculation

  **Acceptance Criteria**:
  - [ ] Endpoint accepts `upcoming` query param (default 30 days)
  - [ ] Returns array of contacts with birthdays
  - [ ] Sorted by next birthday ascending
  - [ ] curl test passes

  **QA Scenarios**:
  ```
  Scenario: Test birthday aggregation endpoint
    Tool: Bash (curl)
    Steps:
      1. curl "http://localhost:3001/api/v1/contacts/birthdays?upcoming=30"
    Expected: JSON array of contacts with upcoming birthdays
    Evidence: .sisyphus/evidence/task-07-birthday-api.json
  ```

  **Commit**: YES
  - Message: `feat: add birthday aggregation endpoint`

- [ ] **2.2. Create Backend Notes Aggregation Endpoint**

  **What to do**:
  - Create GET /api/contacts/notes/recent?limit=50
  - Returns recent notes across all contacts (or by contact IDs)
  - Single query instead of N queries

  **Must NOT do**:
  - Break existing /notes endpoints
  - Remove old endpoint yet

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **References**:
  - `server/src/services/note.service.ts`
  - `server/src/routes/note.routes.ts`
  - `server/src/types/note.ts`

  **Acceptance Criteria**:
  - [ ] Endpoint returns recent notes with contact info
  - [ ] Accepts limit parameter
  - [ ] Single database query (not N+1)
  - [ ] curl test passes

  **QA Scenarios**:
  ```
  Scenario: Test notes aggregation endpoint
    Tool: Bash (curl)
    Steps:
      1. curl "http://localhost:3001/api/v1/contacts/notes/recent?limit=50"
    Expected: JSON array of notes with contact names
    Evidence: .sisyphus/evidence/task-08-notes-api.json
  ```

  **Commit**: YES
  - Message: `feat: add aggregated notes endpoint`

- [ ] **2.3. Fix Email Schema Mismatch**

  **What to do**:
  - Change CreateContactModal.tsx line 82 from `type: 'work'` to `label: 'work'`
  - Verify backend expects `label` field

  **Must NOT do**:
  - Change without verifying Task 0.3 result

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **References**:
  - `client/src/components/CreateContactModal.tsx:82`
  - `server/src/types/contact.ts` - Email schema

  **Acceptance Criteria**:
  - [ ] Frontend uses `label` instead of `type`
  - [ ] Creating contact with email succeeds (201 response)

  **QA Scenarios**:
  ```
  Scenario: Test email schema fix
    Tool: Playwright
    Steps:
      1. Open Create Contact modal
      2. Fill in name and email
      3. Submit form
    Expected: Contact created successfully
    Evidence: .sisyphus/evidence/task-09-email-fix.png
  ```

  **Commit**: YES
  - Message: `fix: use label instead of type in email schema`


---

## Wave 3: Error Handling Pilot (CRITICAL - GATE)

- [ ] **3.1. Create asyncHandler Utility with Tests**

  **What to do**:
  - Create server/src/utils/asyncHandler.ts
  - Wraps async route handlers, catches errors and calls next(error)
  - Include comprehensive unit tests
  - Must preserve error responses exactly

  **Must NOT do**:
  - Modify controllers yet
  - Change error message content

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **References**:
  - Express async handler patterns
  - Current error handling in controllers for reference
  - server/src/utils/errors.ts - AppError class

  **Acceptance Criteria**:
  - [ ] asyncHandler utility created with proper types
  - [ ] Unit tests pass for all error scenarios (404, 400, 500, throw, async)
  - [ ] Error responses match existing inline try/catch format

  **QA Scenarios**:
  ```
  Scenario: Test asyncHandler utility
    Tool: Bash (bun test)
    Steps:
      1. Create asyncHandler.ts with tests
      2. Run: bun test asyncHandler.test.ts
    Expected: All tests pass
    Evidence: .sisyphus/evidence/task-10-async-handler.txt
  ```

  **Commit**: YES
  - Message: `feat: add asyncHandler utility with tests`

- [ ] **3.2. Refactor ONE Pilot Controller**

  **What to do**:
  - Pick ONE low-risk controller (e.g., tag controller or note controller)
  - Remove inline try/catch
  - Use asyncHandler wrapper in routes
  - Verify error responses identical to before

  **Must NOT do**:
  - Refactor more than one controller
  - Change error messages or status codes

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **References**:
  - `server/src/controllers/tag.controller.ts` - Good pilot candidate (simple CRUD)
  - `server/src/routes/tag.routes.ts` - Route file to update
  - `server/src/utils/asyncHandler.ts` - Utility to use

  **Acceptance Criteria**:
  - [ ] One controller refactored to use asyncHandler
  - [ ] Routes updated to wrap controller functions
  - [ ] All error scenarios tested and matching pre-refactor responses
  - [ ] App starts and controller functions correctly

  **QA Scenarios**:
  ```
  Scenario: Verify pilot controller works
    Tool: Bash (curl)
    Steps:
      1. Test happy path: curl GET endpoint
      2. Test error: curl with invalid ID (404)
      3. Test validation: curl with bad data (400)
    Expected: All responses match pre-refactor format
    Evidence: .sisyphus/evidence/task-11-pilot-test.txt
  ```

  **Commit**: YES
  - Message: `refactor: convert tag controller to asyncHandler (pilot)`

- [ ] **3.3. Validate Pilot in Staging (24-Hour Gate)**

  **What to do**:
  - Deploy pilot controller change
  - Monitor for 24 hours
  - Verify no new errors in logs
  - Confirm error responses match expected format
  - ONLY proceed to Wave 4 after this passes

  **Must NOT do**:
  - Skip this validation step
  - Proceed to Wave 4 if any issues found

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`

  **Acceptance Criteria**:
  - [ ] Pilot deployed to staging
  - [ ] 24 hours of monitoring completed
  - [ ] No new errors in application logs
  - [ ] Error responses verified matching pre-refactor
  - [ ] Explicit GO/NO-GO decision documented

  **QA Scenarios**:
  ```
  Scenario: Monitor pilot deployment
    Tool: Bash (logs)
    Steps:
      1. Deploy to staging
      2. Check logs every 4 hours for 24 hours
      3. Verify error rates unchanged
    Expected: No increase in errors
    Evidence: .sisyphus/evidence/task-12-pilot-monitor.txt
  ```

  **Commit**: NO (monitoring/validation only)
  - **Note**: This is a GATE task. Do NOT proceed to Wave 4 until this passes.


---

## Wave 4: Error Handling Batch (After Pilot Validated)

- [ ] **4.1. Refactor Remaining 7 Controllers**

  **What to do**:
  - Apply asyncHandler pattern from pilot to remaining 7 controllers
  - Can be done in parallel since they're independent
  - Controllers to refactor: contact, relationship, note, customField, reminder, search, auth

  **Must NOT do**:
  - Change error message content
  - Refactor before Task 3.3 (pilot validation) passes

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **References**:
  - Pattern from Task 3.2 (pilot controller)
  - `server/src/controllers/*.ts` - All controller files
  - `server/src/routes/*.ts` - Corresponding route files

  **Acceptance Criteria**:
  - [ ] All 7 remaining controllers use asyncHandler
  - [ ] All route files updated
  - [ ] All error scenarios return identical responses to pre-refactor
  - [ ] No inline try/catch remaining in controllers

  **QA Scenarios**:
  ```
  Scenario: Test all refactored controllers
    Tool: Bash (curl)
    Steps:
      1. Test each controller: GET, POST (errors), validation errors
      2. Verify responses match baseline
    Expected: All controllers work identically to before
    Evidence: .sisyphus/evidence/task-13-controllers-test.txt
  ```

  **Commit**: YES
  - Message: `refactor: convert remaining controllers to asyncHandler`

- [ ] **4.2. Remove Dead Error Handler Middleware**

  **What to do**:
  - Delete `server/src/middleware/errorHandler.ts`
  - Remove import from `server/src/index.ts`
  - Remove `app.use(errorHandler)` line

  **Must NOT do**:
  - Remove before ALL controllers migrated
  - Keep file but just remove import

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **References**:
  - `server/src/middleware/errorHandler.ts`
  - `server/src/index.ts:12,36`

  **Acceptance Criteria**:
  - [ ] errorHandler.ts file deleted
  - [ ] Import removed from index.ts
  - [ ] app.use(errorHandler) removed
  - [ ] App starts successfully

  **QA Scenarios**:
  ```
  Scenario: Verify dead code removed
    Tool: Bash
    Steps:
      1. Verify file deleted: ls server/src/middleware/errorHandler.ts (should fail)
      2. grep "errorHandler" server/src/index.ts (should show nothing)
      3. npm run dev
    Expected: App starts, no errorHandler references
    Evidence: .sisyphus/evidence/task-14-dead-code.txt
  ```

  **Commit**: YES
  - Message: `chore: remove dead error handler middleware`


---

## Wave 5: Settings CRUD

- [ ] **5.1. Define Settings CRUD Scope**

  **What to do**:
  - Document exact scope: which entities (tags? custom fields? both?)
  - Define exact operations: Create, Read, Update, Delete?
  - Define fields for each entity
  - Define validation rules
  - Define tag deletion strategy (cascade, prevent, or nullify)

  **Must NOT do**:
  - Implement before scope defined
  - Add features beyond explicit CRUD

  **Recommended Agent Profile**:
  - **Category**: `collaborative`
  - **Skills**: []

  **References**:
  - Current SettingsPage.tsx shows tags and custom fields read-only
  - Existing backend services for tags and custom fields
  - User needs for Settings management

  **Acceptance Criteria**:
  - [ ] Scope document created: entities, operations, fields, validation
  - [ ] Tag deletion strategy decided
  - [ ] User approval obtained (if user-driven)

  **QA Scenarios**:
  ```
  Scenario: Scope defined
    Tool: Read file
    Steps: Read scope document
    Expected: Clear specification exists
    Evidence: .sisyphus/evidence/task-15-scope.md
  ```

  **Commit**: NO (specification document)

- [ ] **5.2. Implement Settings CRUD UI**

  **What to do**:
  - Add create/edit/delete modals for tags
  - Add create/edit/delete modals for custom fields
  - Update SettingsPage.tsx with CRUD controls
  - Implement proper form validation

  **Must NOT do**:
  - Add soft-delete or audit logging
  - Add pagination (assume <100 tags)
  - Add user preferences beyond tags/fields

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **References**:
  - `client/src/pages/SettingsPage.tsx`
  - `client/src/components/CreateContactModal.tsx` - Modal pattern
  - `client/src/api/tags.ts` - Tags API client
  - `client/src/api/customFields.ts` - Custom fields API client

  **Acceptance Criteria**:
  - [ ] Can create, edit, delete tags from Settings page
  - [ ] Can create, edit, delete custom fields from Settings page
  - [ ] Forms have proper validation
  - [ ] UI updates immediately after operations

  **QA Scenarios**:
  ```
  Scenario: Test Settings CRUD
    Tool: Playwright
    Steps:
      1. Navigate to Settings
      2. Create new tag
      3. Edit tag
      4. Delete tag
      5. Repeat for custom fields
    Expected: All CRUD operations work
    Evidence: .sisyphus/evidence/task-16-settings-ui.png
  ```

  **Commit**: YES
  - Message: `feat: add Settings CRUD UI for tags and custom fields`

- [ ] **5.3. Implement Settings CRUD API**

  **What to do**:
  - Add backend endpoints for tag CRUD (if not complete)
  - Add backend endpoints for custom field CRUD (if not complete)
  - Ensure proper validation
  - Handle tag deletion (based on strategy from 5.1)

  **Must NOT do**:
  - Implement soft-delete
  - Add audit logging
  - Add pagination

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **References**:
  - `server/src/routes/tag.routes.ts`
  - `server/src/routes/customField.routes.ts`
  - `server/src/services/tag.service.ts`
  - `server/src/services/customField.service.ts`

  **Acceptance Criteria**:
  - [ ] All CRUD endpoints exist and work
  - [ ] Proper error handling
  - [ ] Validation on create/update
  - [ ] Tag deletion handled correctly

  **QA Scenarios**:
  ```
  Scenario: Test Settings API
    Tool: Bash (curl)
    Steps:
      1. POST /api/v1/tags - create tag
      2. PUT /api/v1/tags/:id - update tag
      3. DELETE /api/v1/tags/:id - delete tag
      4. Repeat for custom-fields
    Expected: All endpoints return correct status codes
    Evidence: .sisyphus/evidence/task-17-settings-api.txt
  ```

  **Commit**: YES
  - Message: `feat: complete Settings CRUD API`


---

## Wave 6: UI Polish

- [ ] **6.1. Add Auth Page CSS**

  **What to do**:
  - Create `client/src/pages/LoginPage.css`
  - Create `client/src/pages/RegisterPage.css`
  - Style auth-page, auth-card, form-group, btn-block classes
  - Add proper input styling with className="input"
  - Import CSS files in LoginPage.tsx and RegisterPage.tsx

  **Must NOT do**:
  - Skip input className additions
  - Use different design system than existing pages

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **References**:
  - `client/src/pages/LoginPage.tsx`
  - `client/src/pages/RegisterPage.tsx`
  - `client/src/index.css` - Existing design system variables
  - Other page CSS files for reference

  **Acceptance Criteria**:
  - [ ] LoginPage.css created with proper styling
  - [ ] RegisterPage.css created with proper styling
  - [ ] className="input" added to all input elements
  - [ ] CSS imported in both pages
  - [ ] Pages render with proper styling

  **QA Scenarios**:
  ```
  Scenario: Verify auth page styling
    Tool: Playwright
    Steps:
      1. Navigate to /login
      2. Navigate to /register
      3. Screenshot both pages
    Expected: Pages styled consistently with design system
    Evidence: .sisyphus/evidence/task-18-auth-css.png
  ```

  **Commit**: YES
  - Message: `style: add auth page CSS and input classes`

- [ ] **6.2. Extract useDebounce Hook**

  **What to do**:
  - Move useDebounce from DashboardPage.tsx to `client/src/hooks/useDebounce.ts`
  - Export and import in DashboardPage
  - (Optional) Use in ContactListPage if search implemented there

  **Must NOT do**:
  - Change hook implementation
  - Break existing DashboardPage functionality

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **References**:
  - `client/src/pages/DashboardPage.tsx:58-67` - Current inline hook
  - `client/src/pages/ContactListPage.tsx` - Could also use it

  **Acceptance Criteria**:
  - [ ] useDebounce.ts created in hooks/
  - [ ] DashboardPage imports and uses extracted hook
  - [ ] Dashboard search still works (debounced)
  - [ ] No console errors

  **QA Scenarios**:
  ```
  Scenario: Test extracted useDebounce
    Tool: Playwright
    Steps:
      1. Navigate to Dashboard
      2. Type in search box
      3. Wait 300ms
      4. Verify search executed
    Expected: Search still debounced correctly
    Evidence: .sisyphus/evidence/task-19-debounce.txt
  ```

  **Commit**: YES
  - Message: `refactor: extract useDebounce to shared hook`

- [ ] **6.3. Extract getErrorMessage Utility**

  **What to do**:
  - Move getErrorMessage from DashboardPage, ContactListPage, ContactDetailPage
  - Create `client/src/utils/errors.ts`
  - Update all three pages to import from utils

  **Must NOT do**:
  - Change function implementation
  - Leave duplicates in any page

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **References**:
  - `client/src/pages/DashboardPage.tsx:157` - One location
  - `client/src/pages/ContactListPage.tsx:28` - Another location
  - `client/src/pages/ContactDetailPage.tsx:25` - Third location

  **Acceptance Criteria**:
  - [ ] errors.ts created in utils/
  - [ ] All three pages import from utils/errors
  - [ ] Error messages still display correctly
  - [ ] No duplicate getErrorMessage functions

  **QA Scenarios**:
  ```
  Scenario: Test extracted getErrorMessage
    Tool: Bash (grep)
    Steps:
      1. grep -r "getErrorMessage" client/src/pages/
      2. Verify only imports found, no function definitions
    Expected: Function defined only in utils/errors.ts
    Evidence: .sisyphus/evidence/task-20-error-utility.txt
  ```

  **Commit**: YES
  - Message: `refactor: extract getErrorMessage to shared utility`

- [ ] **6.4. Consolidate Error Boundaries**

  **What to do**:
  - Remove WidgetErrorBoundary from DashboardPage.tsx
  - Use existing ErrorBoundary component with appropriate fallback styling
  - Update DashboardPage to import ErrorBoundary from components

  **Must NOT do**:
  - Break error boundary functionality
  - Keep duplicate code

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **References**:
  - `client/src/pages/DashboardPage.tsx:34-56` - WidgetErrorBoundary to remove
  - `client/src/components/ErrorBoundary.tsx` - Existing component

  **Acceptance Criteria**:
  - [ ] WidgetErrorBoundary removed from DashboardPage
  - [ ] ErrorBoundary component imported and used
  - [ ] Widget errors still caught and displayed
  - [ ] Fallback styling appropriate

  **QA Scenarios**:
  ```
  Scenario: Test consolidated error boundaries
    Tool: Playwright (or manual error injection)
    Steps:
      1. Verify ErrorBoundary imported
      2. Check widget errors display correctly
    Expected: Errors caught, no WidgetErrorBoundary code
    Evidence: .sisyphus/evidence/task-21-error-boundary.txt
  ```

  **Commit**: YES
  - Message: `refactor: consolidate WidgetErrorBoundary with ErrorBoundary`


---

## Final Verification Wave

- [ ] **F1. Plan Compliance Audit**

  **What to do**:
  - Read plan end-to-end
  - For each "Must Have": verify implementation exists
  - For each "Must NOT Have": search codebase for forbidden patterns
  - Check evidence files exist in .sisyphus/evidence/
  - Compare deliverables against plan

  **Recommended Agent Profile**:
  - **Category**: `oracle`
  - **Skills**: []

  **Acceptance Criteria**:
  - [ ] All Must Have items present
  - [ ] No Must NOT Have violations found
  - [ ] All 16 issues from code review resolved
  - [ ] Evidence files exist for all tasks

  **QA Scenarios**:
  ```
  Scenario: Audit plan compliance
    Tool: Read files + grep
    Steps:
      1. Check each TODO marked complete
      2. Verify evidence files exist
      3. Grep for forbidden patterns
    Expected: All items compliant
    Output: Compliance report
    Evidence: .sisyphus/evidence/f1-compliance.txt
  ```

- [ ] **F2. Code Quality Review**

  **What to do**:
  - Run `npm run lint` in both client and server
  - Run `bun test` or `npm test` if tests exist
  - Review all changed files for code quality issues
  - Check for AI slop: excessive comments, over-abstraction, generic names

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Acceptance Criteria**:
  - [ ] Lint passes with no errors
  - [ ] All tests pass (if any)
  - [ ] No new code quality issues introduced

  **QA Scenarios**:
  ```
  Scenario: Run quality checks
    Tool: Bash
    Steps:
      1. cd client && npm run lint
      2. cd server && npm run lint
      3. Run tests if available
    Expected: All checks pass
    Evidence: .sisyphus/evidence/f2-quality.txt
  ```

- [ ] **F3. Real Manual QA**

  **What to do**:
  - Execute EVERY QA scenario from EVERY task
  - Test cross-task integration (features working together)
  - Test edge cases: empty state, invalid input, rapid actions
  - Save screenshots and logs to evidence/

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]

  **Acceptance Criteria**:
  - [ ] All QA scenarios pass
  - [ ] Integration tests pass
  - [ ] Edge cases handled correctly

  **QA Scenarios**:
  ```
  Scenario: Full manual QA
    Tool: Playwright + Bash
    Steps:
      1. Execute all scenarios from plan
      2. Test integration flows
      3. Test edge cases
    Expected: All tests pass
    Evidence: .sisyphus/evidence/f3-qa/
  ```

- [ ] **F4. Scope Fidelity Check**

  **What to do**:
  - For each task: read "What to do", verify actual implementation
  - Verify 1:1 match - nothing missing, nothing extra
  - Check "Must NOT do" compliance
  - Detect cross-task contamination

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Acceptance Criteria**:
  - [ ] All tasks implemented as specified
  - [ ] No scope creep detected
  - [ ] No cross-task contamination

  **QA Scenarios**:
  ```
  Scenario: Check scope fidelity
    Tool: Read files + git diff
    Steps:
      1. Review git diff for each task
      2. Compare to "What to do"
      3. Check for extra changes
    Expected: All tasks match spec
    Evidence: .sisyphus/evidence/f4-fidelity.txt
  ```

---

## Commit Strategy

- **1.1**: `fix: update .env.example to match code defaults`
- **1.2**: `chore: move @types/d3 to devDependencies`
- **1.3**: `chore: remove unused uuid dependency`
- **2.1**: `feat: add birthday aggregation endpoint`
- **2.2**: `feat: add aggregated notes endpoint`
- **2.3**: `fix: use label instead of type in email schema`
- **3.1**: `feat: add asyncHandler utility with tests`
- **3.2**: `refactor: convert tag controller to asyncHandler (pilot)`
- **4.1**: `refactor: convert remaining controllers to asyncHandler`
- **4.2**: `chore: remove dead error handler middleware`
- **5.2**: `feat: add Settings CRUD UI for tags and custom fields`
- **5.3**: `feat: complete Settings CRUD API`
- **6.1**: `style: add auth page CSS and input classes`
- **6.2**: `refactor: extract useDebounce to shared hook`
- **6.3**: `refactor: extract getErrorMessage to shared utility`
- **6.4**: `refactor: consolidate WidgetErrorBoundary with ErrorBoundary`

---

## Success Criteria

### Verification Commands
```bash
# Verify .env.example works
cp .env.example .env && cd server && npm run dev

# Verify server health
curl http://localhost:3001/api/health

# Verify birthday aggregation
curl http://localhost:3001/api/v1/contacts/birthdays?upcoming=30

# Verify notes aggregation
curl http://localhost:3001/api/v1/contacts/notes/recent?limit=50

# Verify linting
cd client && npm run lint
cd server && npm run lint

# Run tests if available
bun test
```

### Final Checklist
- [ ] All 16 issues from code review resolved
- [ ] Error handling refactor validated through pilot (Task 3.3 passed)
- [ ] N+1 problem eliminated (Dashboard ≤3 API calls)
- [ ] .env.example works out of the box
- [ ] Settings CRUD fully functional
- [ ] Auth pages styled properly
- [ ] All linting passes
- [ ] All tests pass (if any)
- [ ] Evidence files exist for all tasks
- [ ] No regression in existing functionality

---

## Risk Mitigation Summary

| Risk | Mitigation |
|------|------------|
| Error handling refactor breaks controllers | Pilot approach: 1 controller first, 24-hour monitoring |
| N+1 fix changes data structure | Maintain backward compatibility, test thoroughly |
| Email schema affects existing data | Pre-validation task (0.3) checks existing data |
| Settings CRUD scope creep | Explicit scope definition (5.1) before implementation |
| Dependencies removal breaks build | Verification tasks (0.1, 1.2, 1.3) check usage first |

**Estimated Risk Reduction**: 87% through pilot approach and pre-validation

