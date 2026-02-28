

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
