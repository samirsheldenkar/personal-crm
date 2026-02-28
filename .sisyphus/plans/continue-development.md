# Personal CRM - Continue Development

## TL;DR

> **Quick Summary**: Complete the partially-built Personal CRM by fixing critical data loss issue, adding missing CSS styles, implementing essential modals, adding TypeScript types, and polishing the UI.
>
> **Deliverables**:
> - Fixed Docker setup (no data loss on restart)
> - Complete CSS styling for all components (~10 CSS files)
> - Create Contact modal with form validation
> - Delete confirmation modal
> - TypeScript interfaces replacing all `any` types
> - Error logging middleware
> - Dashboard features (birthdays, activity feed)
> - Clickable graph with colors and labels
> - Error boundaries and error states
>
> **Estimated Effort**: Large (7-10 days across 6 waves)
> **Parallel Execution**: YES — 6 waves, CSS can parallel with some backend work
> **Critical Path**: Wave 0 (data fix) → Wave 2 (CSS) → Wave 3 (modals) → Wave 4 (polish) → Wave 5 (graph) → Wave 6 (final)

---

## Context

### Original Request
Continue development of a partially-built Personal CRM based on the code review findings.

### Code Review Analysis
**Status**: Backend is well-implemented (~85% complete), Frontend is functional but incomplete (~60% complete)

**Critical Issues Found**:
1. **DATA LOSS**: Docker runs `npm run seed` on every restart, wiping all user data
2. **MISSING CSS**: ~50+ CSS classes referenced but not defined (components render unstyled)
3. **NO CREATE CONTACT**: Button shows `alert('Add contact - TODO')` - users can't add contacts
4. **NO TYPES**: Frontend uses `any[]` for all data - no type safety
5. **NO LOGGING**: Backend errors swallowed silently - no debugging possible
6. **GRAPH LIMITATIONS**: No click navigation, hardcoded colors, no labels
7. **DASHBOARD INCOMPLETE**: Missing birthdays, activity feed, debounced search

### Key Decisions from User Interview
- **Scope**: Complete (7-10 days) - fix everything, not just critical
- **CSS Approach**: Create proper CSS files for each component
- **Modals**: Essential only - Create Contact + Delete Confirmation (inline editing for rest)
- **Backend Routes**: Verify first before assuming they need fixing (VITE_API_URL may be the issue)

### Metis Review Findings
- Wave 0 (Docker fix) is CRITICAL and BLOCKING - data loss prevents all testing
- Wave 2 (CSS) blocks Waves 3-6 - can't verify UI without styles
- CSS scope underestimated - need component-specific files, not just index.css additions
- ~50+ CSS classes need styling across 10 components
- Add error boundaries (was missed)
- Backend routes might already be correct - verify VITE_API_URL first

---

## Work Objectives

### Core Objective
Transform the partially-functional Personal CRM into a production-ready application with complete styling, functional CRUD operations, proper TypeScript types, and polished user experience.

### Concrete Deliverables
- Fixed Docker Compose configuration (data persists across restarts)
- 10+ CSS files for component/page styling
- Create Contact modal with validation
- Delete confirmation modal
- TypeScript interfaces for all API responses
- Error logging middleware with request IDs
- Dashboard widgets (birthdays, activity feed)
- Debounced search implementation
- Clickable relationship graph
- Error boundaries for crash protection
- Error states for all async operations

### Definition of Done
- [ ] All TODOs completed with evidence captured in `.sisyphus/evidence/`
- [ ] Final verification wave: ALL 4 review agents APPROVE
- [ ] Docker compose builds and runs successfully
- [ ] Data persists across `docker-compose down && up`
- [ ] Full user flow works: Register → Create contact → Add relationship → View graph → Search → Delete
- [ ] No `any` types in frontend
- [ ] All CSS classes have corresponding styles
- [ ] Errors logged server-side with request IDs

### Must Have
- Fixed Docker seed command (no data loss)
- CSS for all components (Sidebar, AppLayout, ContactListPage, ContactDetailPage, DashboardPage, SettingsPage, RelationshipGraph)
- Create Contact modal with form validation
- Delete confirmation modal
- TypeScript interfaces for Contact, Tag, Note, Reminder, Relationship
- Error logging middleware
- Dashboard birthdays widget
- Dashboard activity feed
- Debounced search
- Graph click navigation to contacts
- Graph color coding by relationship type
- Error boundaries
- Error states for API failures

### Must NOT Have (Guardrails)
- Full design system overhaul (only fix missing styles)
- Dark mode toggle
- Animation library additions
- Image upload/avatar handling
- Real-time updates (WebSocket)
- Export/Import features
- Email notifications
- Mobile native apps (web-only)
- Comprehensive test suite
- Storybook
- Backend route refactoring (verify first)
- Edit modals for tags/custom fields (inline only)
- OAuth/Social login
- Admin dashboard
- File uploads/attachments

---

## Verification Strategy

### Test Infrastructure Decision
- **Infrastructure exists**: NO — will use agent-executed QA only
- **Automated tests**: NO — manual verification via QA scenarios
- **Agent-Executed QA**: YES — mandatory for all tasks
- **Evidence capture**: YES — every task has evidence requirements

### QA Policy
Every task MUST include agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

**Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
**API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
**Database**: Use Bash (psql) — Query tables, verify data persistence
**Docker**: Use Bash (docker compose) — Build, run, verify data persists

---

## Execution Strategy

### Parallel Execution Waves

**Wave 0** (Critical Data Fix — Start Immediately, MUST complete first):
- Fix Docker Compose seed command (1-2 hours)
- Verify API connectivity
- Blocks ALL other work (data loss prevents testing)

**Wave 1** (Backend Foundation — After Wave 0, 1 day):
- Add error logging middleware with requestId
- Add request logging
- Standardize error handling

**Wave 2** (CSS Foundation — After Wave 0, 2 days) — CAN PARALLEL WITH WAVE 3:
- Create component CSS files (10+ files)
- Add utility classes for common patterns
- Import Google Fonts (Inter)
- Fix design system variables
- Blocks Waves 3-6 (can't test UI without styles)

**Wave 3** (Essential Modals — After Wave 2, 2 days):
- Create Contact modal (form, validation, API integration)
- Delete confirmation modal
- Blocks Wave 4 (needs working create flow)

**Wave 4** (Frontend Polish — After Wave 3, 2 days):
- Replace all `any` types with proper interfaces
- Add dashboard features (birthdays, activity feed)
- Implement debounced search
- Add error boundaries
- Inline editing for contacts
- Blocks Wave 5 (needs complete data flow)

**Wave 5** (Graph Improvements — After Wave 4, 1 day):
- Add click handlers for node navigation
- Color coding by relationship type
- Add relationship type labels
- Responsive sizing
- Blocks Wave 6 (needs complete graph)

**Wave 6** (Final Polish — After Wave 5, 1 day):
- Data persistence verification
- Error boundary verification
- Final integration testing
- Cleanup and verification

**Wave FINAL** (Verification — After ALL tasks, 4 parallel):
- Task F1: Plan compliance audit (oracle)
- Task F2: Code quality review (unspecified-high)
- Task F3: Real QA with Playwright (unspecified-high + playwright)
- Task F4: Scope fidelity check (deep)

Critical Path: Wave 0 → Wave 2 → Wave 3 → Wave 4 → Wave 5 → Wave 6 → Final
Parallel Speedup: ~40% faster than sequential
Max Concurrent: 2 (Wave 2 + Wave 3 can overlap partially)

### Agent Dispatch Summary

- **Wave 0**: `quick` (Docker config fix)
- **Wave 1**: `deep` (Express middleware)
- **Wave 2**: `visual-engineering` + `frontend-ui-ux` (CSS architecture)
- **Wave 3**: `visual-engineering` + `frontend-ui-ux` + `dev-browser` (modals)
- **Wave 4**: `deep` (TypeScript types, dashboard features)
- **Wave 5**: `artistry` or `deep` (D3.js graph improvements)
- **Wave 6**: `unspecified-low` + `dev-browser` (final polish)
- **FINAL**: `oracle`, `unspecified-high`, `deep` (verification)

---

## TODOs




---

### Wave 0: Critical Data Fix (1-2 hours) — START FIRST

- [x] **Task 0.1: Fix Docker Compose Seed Command**

  **What to do**: Remove `npm run seed` from docker-compose.yml startup command to prevent data loss on every container restart.
  
  - Edit `/home/samir/personal-crm/docker-compose.yml`
  - Change line 40 from `sh -c "npm run migrate && npm run seed && node dist/index.js"` to `sh -c "npm run migrate && node dist/index.js"`
  - Add separate `seed` service or document manual seed command

  **Must NOT do**:
  - Do NOT remove seed script entirely - keep it for manual use
  - Do NOT modify Dockerfile
  - Do NOT change migration behavior

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Simple configuration change
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO - must complete first
  - **Parallel Group**: Wave 0 (blocking)
  - **Blocks**: ALL other tasks (data loss prevents testing)
  - **Blocked By**: None

  **References**:
  - `docker-compose.yml:40` - Current seed command that runs on every startup
  - `server/package.json` - Seed script definition

  **Acceptance Criteria**:

  **QA Scenario: Verify data persists after restart**
  ```
  Tool: Bash
  Preconditions: Docker running with existing data
  Steps:
    1. docker-compose down
    2. docker-compose up -d
    3. Wait 10 seconds
    4. curl -s http://localhost:3001/api/v1/contacts -H "Authorization: Bearer $TOKEN" | jq '.contacts | length'
  Expected Result: Returns same number of contacts as before restart (> 0 if demo data exists)
  Evidence: .sisyphus/evidence/task-0-1-data-persistence.txt
  ```

  **QA Scenario: Seed command still works manually**
  ```
  Tool: Bash
  Preconditions: Server container running
  Steps:
    1. docker-compose exec server npm run seed
    2. Verify: Seed completes without errors
  Expected Result: Manual seed command works
  Evidence: .sisyphus/evidence/task-0-1-manual-seed.txt
  ```

  **Evidence to Capture**:
  - [ ] Docker compose logs showing startup without seed
  - [ ] Data count before and after restart

  **Commit**: YES
  - Message: `fix(docker): remove seed from startup command to prevent data loss`
  - Files: `docker-compose.yml`
  - Pre-commit: N/A

---

### Wave 1: Backend Foundation (1 day)

- [ ] **Task 1.1: Add Error Logging Middleware**

  **What to do**: Create centralized error handling middleware that logs all errors with request IDs for debugging.
  
  - Create `server/src/middleware/errorHandler.ts` - Express error handling middleware
  - Logs errors with `requestId`, timestamp, path, method, error message, stack trace
  - Returns appropriate JSON responses (400 for validation, 500 for unexpected)
  - Replace repetitive try-catch blocks in controllers with this middleware
  - Update `server/src/index.ts` to use the middleware

  **Must NOT do**:
  - Do NOT remove existing ZodError handling - extend it
  - Do NOT add external logging services (just console.error)
  - Do NOT change API response format for clients

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Reason**: Express middleware patterns and error handling
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Wave 2)
  - **Parallel Group**: Wave 1
  - **Blocks**: None (backend improvement only)
  - **Blocked By**: Wave 0

  **References**:
  - `server/src/controllers/*.ts` - Current repetitive try-catch patterns
  - Express error handling docs: https://expressjs.com/en/guide/error-handling.html

  **Acceptance Criteria**:

  **QA Scenario: Errors are logged with request ID**
  ```
  Tool: Bash (curl)
  Preconditions: Server running
  Steps:
    1. curl -s http://localhost:3001/api/v1/contacts/invalid-uuid -H "Authorization: Bearer $TOKEN"
    2. Check server logs: docker-compose logs server | grep "ERROR"
    3. Verify: Log entry contains requestId, timestamp, path, error message
  Expected Result: Error logged with structured format
  Evidence: .sisyphus/evidence/task-1-1-error-logging.txt
  ```

  **QA Scenario: Validation errors return 400**
  ```
  Tool: Bash (curl)
  Preconditions: Server running
  Steps:
    1. curl -s -X POST http://localhost:3001/api/v1/contacts -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"firstName": ""}'
    2. Verify: Status 400 returned
    3. Verify: Response contains error message
  Expected Result: 400 with validation error
  Evidence: .sisyphus/evidence/task-1-1-validation-error.json
  ```

  **Evidence to Capture**:
  - [ ] Error log output with requestId
  - [ ] Validation error response

  **Commit**: YES
  - Message: `feat(server): add centralized error logging middleware`
  - Files: `server/src/middleware/errorHandler.ts`, `server/src/index.ts`
  - Pre-commit: `cd server && npm run build`

---

- [ ] **Task 1.2: Add Request Logging Middleware**

  **What to do**: Add request logging middleware to log all incoming requests for debugging and monitoring.
  
  - Create `server/src/middleware/requestLogger.ts` - Logs method, path, status, duration
  - Logs: `GET /api/v1/contacts 200 45ms`
  - Include requestId for correlation with errors
  - Add to `server/src/index.ts` before routes

  **Must NOT do**:
  - Do NOT log request bodies (privacy)
  - Do NOT log Authorization headers (security)
  - Do NOT use external services

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Simple middleware pattern
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Wave 2)
  - **Parallel Group**: Wave 1
  - **Blocks**: None
  - **Blocked By**: Wave 0

  **Acceptance Criteria**:

  **QA Scenario: Requests are logged**
  ```
  Tool: Bash (curl)
  Preconditions: Server running
  Steps:
    1. curl -s http://localhost:3001/api/v1/contacts -H "Authorization: Bearer $TOKEN"
    2. Check logs: docker-compose logs server --tail=10
    3. Verify: Log contains "GET /api/v1/contacts 200 XXms"
  Expected Result: Request logged with method, path, status, duration
  Evidence: .sisyphus/evidence/task-1-2-request-log.txt
  ```

  **Evidence to Capture**:
  - [ ] Request log output

  **Commit**: YES
  - Message: `feat(server): add request logging middleware`
  - Files: `server/src/middleware/requestLogger.ts`, `server/src/index.ts`
  - Pre-commit: `cd server && npm run build`

---


### Wave 2: CSS Foundation (2 days) — CAN PARALLEL WITH WAVE 3

- [ ] **Task 2.1: Create Layout Component CSS Files**

  **What to do**: Create CSS files for layout components (Sidebar, AppLayout) with all referenced classes styled.
  
  - Create `client/src/components/Sidebar.css` - Styles for sidebar navigation
    - `.sidebar`, `.sidebar-header`, `.sidebar-title`
    - `.sidebar-nav`, `.sidebar-link` (active, hover states)
    - `.sidebar-footer`, `.sidebar-user`, `.sidebar-user-name`
  - Create `client/src/components/AppLayout.css` - App shell styles
    - `.app-layout`, `.app-main` (with proper flex/grid)
  - Import fonts in `client/src/index.css` - Google Fonts Inter
  - Ensure responsive design (mobile sidebar behavior)

  **Must NOT do**:
  - Do NOT change component structure (keep JSX as-is)
  - Do NOT use CSS-in-JS
  - Do NOT add animations beyond transitions

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: CSS architecture, component styling
  - **Skills**: `frontend-ui-ux`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Wave 1, Wave 3 start)
  - **Parallel Group**: Wave 2
  - **Blocks**: Wave 3, 4, 5, 6 (can't verify UI without styles)
  - **Blocked By**: Wave 0

  **References**:
  - `client/src/components/Sidebar.tsx` - Current class references
  - `client/src/components/AppLayout.tsx` - Current class references
  - `client/src/index.css` - Existing variables

  **Acceptance Criteria**:

  **QA Scenario: Sidebar renders with styles**
  ```
  Tool: playwright (screenshot)
  Preconditions: Dev server running, user logged in
  Steps:
    1. Navigate to http://localhost:5173/
    2. Take screenshot
    3. Verify: Sidebar visible with proper styling
    4. Verify: Navigation links styled
    5. Verify: User section at bottom
  Expected Result: Sidebar has proper layout, colors, spacing
  Evidence: .sisyphus/evidence/task-2-1-sidebar.png
  ```

  **QA Scenario: Main content area has layout**
  ```
  Tool: playwright (screenshot)
  Preconditions: Dev server running
  Steps:
    1. Navigate to http://localhost:5173/contacts
    2. Take screenshot
    3. Verify: Content area beside sidebar
    4. Verify: Proper padding/spacing
  Expected Result: Two-column layout (sidebar + main)
  Evidence: .sisyphus/evidence/task-2-1-layout.png
  ```

  **Evidence to Capture**:
  - [ ] Sidebar screenshot
  - [ ] Layout screenshot

  **Commit**: YES
  - Message: `feat(css): add Sidebar and AppLayout styles`
  - Files: `client/src/components/Sidebar.css`, `client/src/components/AppLayout.css`, `client/src/index.css`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 2.2: Create Page-Specific CSS Files**

  **What to do**: Create CSS files for all page components with proper styling.
  
  - Create `client/src/pages/DashboardPage.css`:
    - `.dashboard-page`, `.dashboard-header`, `.dashboard-stats`
    - `.stat-card`, `.dashboard-grid`, `.reminder-card`, `.activity-item`
  - Create `client/src/pages/ContactListPage.css`:
    - `.page`, `.page-header`, `.contact-grid`, `.contact-card`
    - `.contact-avatar`, `.filters`, `.pagination`, `.empty-state`
  - Create `client/src/pages/ContactDetailPage.css`:
    - `.tabs`, `.tab`, `.tab-content`, `.contact-details-grid`
    - `.detail-item`, `.notes-list`, `.note-card`, `.relationship-list`
  - Create `client/src/pages/SettingsPage.css`:
    - `.settings-page`, `.settings-nav`, `.settings-content`, `.tag-item`, `.field-item`

  **Must NOT do**:
  - Do NOT change page structure
  - Do NOT add new components
  - Do NOT use inline styles

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: Page-level CSS, responsive design
  - **Skills**: `frontend-ui-ux`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Wave 3)
  - **Parallel Group**: Wave 2
  - **Blocks**: Wave 3, 4, 5, 6
  - **Blocked By**: Wave 0

  **References**:
  - `client/src/pages/*.tsx` - All page components
  - Existing `client/src/index.css` - Base styles

  **Acceptance Criteria**:

  **QA Scenario: Dashboard has styled widgets**
  ```
  Tool: playwright (screenshot)
  Preconditions: Dev server running, logged in
  Steps:
    1. Navigate to http://localhost:5173/
    2. Take screenshot
    3. Verify: Page header styled
    4. Verify: Grid layout for widgets
    5. Verify: Cards have proper borders/shadows
  Expected Result: Dashboard visually complete
  Evidence: .sisyphus/evidence/task-2-2-dashboard.png
  ```

  **QA Scenario: Contact list displays cards**
  ```
  Tool: playwright (screenshot)
  Preconditions: Dev server running, contacts exist
  Steps:
    1. Navigate to http://localhost:5173/contacts
    2. Take screenshot
    3. Verify: Contact cards in grid
    4. Verify: Card styling (avatar, name, details)
  Expected Result: Contact list visually complete
  Evidence: .sisyphus/evidence/task-2-2-contact-list.png
  ```

  **QA Scenario: Contact detail has styled tabs**
  ```
  Tool: playwright (screenshot)
  Preconditions: Dev server running, contact exists
  Steps:
    1. Navigate to http://localhost:5173/contacts/:id
    2. Take screenshot
    3. Verify: Tabs styled (Overview, Notes, Relationships)
    4. Verify: Tab content properly spaced
  Expected Result: Contact detail visually complete
  Evidence: .sisyphus/evidence/task-2-2-contact-detail.png
  ```

  **Evidence to Capture**:
  - [ ] Dashboard screenshot
  - [ ] Contact list screenshot
  - [ ] Contact detail screenshot
  - [ ] Settings page screenshot

  **Commit**: YES
  - Message: `feat(css): add page-specific styles for Dashboard, ContactList, ContactDetail, Settings`
  - Files: `client/src/pages/*.css`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 2.3: Create Component CSS and Fix Design System**

  **What to do**: Create CSS for shared components and align design system with plan.
  
  - Create `client/src/components/RelationshipGraph.css`:
    - Graph container sizing, D3 SVG styling
    - Node circles, edges (lines), labels
  - Update `client/src/index.css`:
    - Import Google Fonts: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')`
    - Add missing CSS variables: `--sidebar-width`, `--topbar-height`
    - Add gradient backgrounds for auth pages
    - Add glassmorphism: `backdrop-filter: blur(20px)`
    - Add transition variables: `--transition-fast`, `--transition-base`
    - Fix variable naming to match plan
  - Create utility classes for common patterns

  **Must NOT do**:
  - Do NOT remove existing variables (add missing ones)
  - Do NOT change component logic
  - Do NOT add new dependencies

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: Design system, global styles
  - **Skills**: `frontend-ui-ux`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Wave 3)
  - **Parallel Group**: Wave 2
  - **Blocks**: Wave 5 (graph needs styles)
  - **Blocked By**: Wave 0

  **References**:
  - Original plan design system specifications
  - `client/src/components/RelationshipGraph.tsx` - Graph structure
  - `client/src/index.css` - Current variables

  **Acceptance Criteria**:

  **QA Scenario: Fonts load correctly**
  ```
  Tool: playwright
  Preconditions: Dev server running
  Steps:
    1. Navigate to http://localhost:5173/login
    2. Check computed styles for font-family
    3. Verify: Inter font loaded
  Expected Result: Inter font applied
  Evidence: .sisyphus/evidence/task-2-3-fonts.txt
  ```

  **QA Scenario: Graph has basic styling**
  ```
  Tool: playwright (screenshot)
  Preconditions: Dev server running, contact with relationships
  Steps:
    1. Navigate to contact detail → Relationships tab
    2. Take screenshot
    3. Verify: Graph container sized properly
    4. Verify: Nodes visible
  Expected Result: Graph visually contained
  Evidence: .sisyphus/evidence/task-2-3-graph.png
  ```

  **Evidence to Capture**:
  - [ ] Font verification
  - [ ] Graph screenshot

  **Commit**: YES
  - Message: `feat(css): add graph styles and update design system`
  - Files: `client/src/components/RelationshipGraph.css`, `client/src/index.css`
  - Pre-commit: `cd client && npx tsc --noEmit`

---


### Wave 3: Essential Modals (2 days)

- [ ] **Task 3.1: Create CreateContact Modal Component**

  **What to do**: Implement a modal dialog for creating new contacts with form validation.
  
  - Create `client/src/components/CreateContactModal.tsx`:
    - Modal overlay with backdrop blur
    - Form fields: firstName, lastName, email, phone (all from plan spec)
    - Validation: Required firstName, email format
    - Submit button with loading state
    - Cancel button (closes modal)
    - Success: Closes modal, refreshes contact list
    - Error: Shows error message in modal
  - Add CSS: `client/src/components/CreateContactModal.css`
  - Integrate into ContactListPage: replace `alert('Add contact - TODO')` with modal

  **Must NOT do**:
  - Do NOT add all contact fields (keep minimal: name, email, phone)
  - Do NOT implement edit mode in same modal
  - Do NOT add image upload

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: Complex UI with form validation
  - **Skills**: `frontend-ui-ux`, `dev-browser`

  **Parallelization**:
  - **Can Run In Parallel**: NO (needs Wave 2 CSS)
  - **Parallel Group**: Wave 3
  - **Blocks**: Wave 4 (needs working create flow)
  - **Blocked By**: Wave 0, Wave 2

  **References**:
  - `client/src/pages/ContactListPage.tsx:52` - Current TODO alert
  - `client/src/api/contacts.ts` - API functions
  - `server/src/types/contact.ts` - Validation schema

  **Acceptance Criteria**:

  **QA Scenario: Modal opens from button**
  ```
  Tool: playwright (screenshot)
  Preconditions: Dev server running, logged in, on contacts page
  Steps:
    1. Navigate to http://localhost:5173/contacts
    2. Click "Add Contact" button
    3. Take screenshot
    4. Verify: Modal appears with form
    5. Verify: Backdrop visible
  Expected Result: Modal opens with form fields
  Evidence: .sisyphus/evidence/task-3-1-modal-open.png
  ```

  **QA Scenario: Form validation works**
  ```
  Tool: playwright
  Preconditions: Modal open
  Steps:
    1. Leave firstName empty
    2. Click Submit
    3. Verify: Validation error shown
    4. Enter invalid email
    5. Verify: Email validation error
  Expected Result: Validation prevents submission
  Evidence: .sisyphus/evidence/task-3-1-validation.png
  ```

  **QA Scenario: Create contact succeeds**
  ```
  Tool: playwright (screenshot)
  Preconditions: Modal open
  Steps:
    1. Fill firstName: "Test", lastName: "User", email: "test@example.com"
    2. Click Submit
    3. Wait for API response
    4. Verify: Modal closes
    5. Verify: New contact appears in list
    6. Take screenshot
  Expected Result: Contact created and added to list
  Evidence: .sisyphus/evidence/task-3-1-create-success.png
  ```

  **QA Scenario: Cancel closes modal**
  ```
  Tool: playwright
  Preconditions: Modal open with form filled
  Steps:
    1. Click Cancel button
    2. Verify: Modal closes
    3. Verify: Contact list unchanged
  Expected Result: Modal closes without creating contact
  Evidence: .sisyphus/evidence/task-3-1-cancel.txt
  ```

  **Evidence to Capture**:
  - [ ] Modal open screenshot
  - [ ] Validation screenshot
  - [ ] Create success screenshot

  **Commit**: YES
  - Message: `feat(client): add CreateContact modal with validation`
  - Files: `client/src/components/CreateContactModal.tsx`, `client/src/components/CreateContactModal.css`, `client/src/pages/ContactListPage.tsx`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 3.2: Create DeleteConfirmation Modal Component**

  **What to do**: Implement a reusable confirmation modal for destructive actions.
  
  - Create `client/src/components/DeleteConfirmationModal.tsx`:
    - Reusable modal for delete confirmations
    - Props: `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `itemName`
    - Danger styling (red confirm button)
    - Cancel button (secondary)
    - Keyboard: ESC closes, Enter confirms
  - Create CSS: `client/src/components/DeleteConfirmationModal.css`
  - Integrate into ContactListPage for contact deletion
  - Integrate into ContactDetailPage for contact deletion

  **Must NOT do**:
  - Do NOT implement actual delete API call in this task (just modal)
  - Do NOT add animations

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: Modal UI, accessibility
  - **Skills**: `frontend-ui-ux`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 3.1)
  - **Parallel Group**: Wave 3
  - **Blocks**: Wave 4 (needs delete flow)
  - **Blocked By**: Wave 0, Wave 2

  **References**:
  - `client/src/pages/ContactListPage.tsx` - Where to integrate
  - `client/src/pages/ContactDetailPage.tsx` - Where to integrate

  **Acceptance Criteria**:

  **QA Scenario: Delete confirmation appears**
  ```
  Tool: playwright (screenshot)
  Preconditions: On contacts page
  Steps:
    1. Click delete button on contact
    2. Take screenshot
    3. Verify: Modal shows with contact name
    4. Verify: Danger styling on confirm button
  Expected Result: Confirmation modal displayed
  Evidence: .sisyphus/evidence/task-3-2-delete-modal.png
  ```

  **QA Scenario: Cancel prevents deletion**
  ```
  Tool: playwright
  Preconditions: Delete modal open
  Steps:
    1. Click Cancel
    2. Verify: Modal closes
    3. Verify: Contact still in list
  Expected Result: No deletion on cancel
  Evidence: .sisyphus/evidence/task-3-2-cancel.txt
  ```

  **QA Scenario: Confirm deletes item**
  ```
  Tool: playwright (screenshot)
  Preconditions: Delete modal open
  Steps:
    1. Click Confirm Delete
    2. Verify: Modal closes
    3. Verify: Contact removed from list
    4. Take screenshot
  Expected Result: Contact deleted
  Evidence: .sisyphus/evidence/task-3-2-confirm.png
  ```

  **Evidence to Capture**:
  - [ ] Delete modal screenshot
  - [ ] After confirm screenshot

  **Commit**: YES
  - Message: `feat(client): add DeleteConfirmation modal`
  - Files: `client/src/components/DeleteConfirmationModal.tsx`, `client/src/components/DeleteConfirmationModal.css`, `client/src/pages/ContactListPage.tsx`, `client/src/pages/ContactDetailPage.tsx`
  - Pre-commit: `cd client && npx tsc --noEmit`

---


### Wave 4: Frontend Polish (2 days)

- [ ] **Task 4.1: Replace all `any` Types with Proper Interfaces**

  **What to do**: Add TypeScript interfaces for all API responses and replace `any` types.
  
  - Update `client/src/types/index.ts` or create `client/src/types/models.ts`:
    - `Contact` interface with all fields
    - `Tag` interface
    - `Note` interface
    - `Reminder` interface
    - `Relationship` interface
    - `User` interface
  - Update all page components to use types:
    - `ContactListPage.tsx`: `const [contacts, setContacts] = useState<Contact[]>([])`
    - `ContactDetailPage.tsx`: `const [contact, setContact] = useState<Contact | null>(null)`
    - `DashboardPage.tsx`: Replace all `any[]`
    - `SettingsPage.tsx`: Replace all `any[]`
  - Update API functions to return typed responses

  **Must NOT do**:
  - Do NOT change runtime behavior
  - Do NOT remove existing working code
  - Do NOT add new dependencies

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Reason**: TypeScript refactoring, interface design
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4
  - **Blocks**: None (type-only change)
  - **Blocked By**: Wave 0, Wave 2, Wave 3

  **References**:
  - `server/src/types/*.ts` - Backend types to mirror
  - `client/src/api/*.ts` - API response types
  - `client/src/pages/*.tsx` - Pages using `any`

  **Acceptance Criteria**:

  **QA Scenario: No `any` types remain**
  ```
  Tool: Bash
  Preconditions: None
  Steps:
    1. grep -r ": any" client/src --include="*.ts" --include="*.tsx" | wc -l
    2. Verify: Result is 0 (or only in unavoidable cases)
  Expected Result: Zero `any` types in source
  Evidence: .sisyphus/evidence/task-4-1-no-any.txt
  ```

  **QA Scenario: TypeScript compiles without errors**
  ```
  Tool: Bash
  Preconditions: Dependencies installed
  Steps:
    1. cd client && npx tsc --noEmit
    2. Verify: Exit code 0
  Expected Result: Compilation succeeds
  Evidence: .sisyphus/evidence/task-4-1-tsc.txt
  ```

  **Evidence to Capture**:
  - [ ] grep output showing no `any` types
  - [ ] TypeScript compilation output

  **Commit**: YES
  - Message: `refactor(client): replace all any types with proper interfaces`
  - Files: `client/src/types/models.ts`, `client/src/pages/*.tsx`, `client/src/api/*.ts`
  - Pre-commit: `cd client && npx tsc --noEmit` (must pass)

---

- [ ] **Task 4.2: Add Dashboard Features (Birthdays, Activity, Debounced Search)**

  **What to do**: Implement missing dashboard widgets and features.
  
  - Add **Upcoming Birthdays** widget:
    - Query contacts with birthdays in next 30 days
    - Sort by birthday (soonest first)
    - Show name and age turning
  - Add **Recent Activity** feed:
    - Show recent notes, new contacts, relationship changes
    - Sorted by date (newest first)
    - Limit to 10 items
  - Add **Debounced Search**:
    - Replace manual search button with automatic search
    - 300ms debounce on input change
    - Show loading state while searching
    - Update `client/src/pages/DashboardPage.tsx`
  - Add error states for API failures
  - Add loading states

  **Must NOT do**:
  - Do NOT add real-time updates (just poll on load)
  - Do NOT add charts/analytics
  - Do NOT add export features

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Reason**: Complex UI with multiple async operations, debouncing
  - **Skills**: `dev-browser`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Wave 0, Wave 2, Wave 3

  **References**:
  - `client/src/pages/DashboardPage.tsx` - Current implementation
  - `client/src/api/contacts.ts` - API for birthdays
  - `client/src/api/search.ts` - Search API

  **Acceptance Criteria**:

  **QA Scenario: Birthdays widget shows upcoming**
  ```
  Tool: playwright (screenshot)
  Preconditions: Contacts with birthdays exist
  Steps:
    1. Navigate to http://localhost:5173/
    2. Take screenshot
    3. Verify: "Upcoming Birthdays" section visible
    4. Verify: Contacts with upcoming birthdays listed
  Expected Result: Birthdays widget populated
  Evidence: .sisyphus/evidence/task-4-2-birthdays.png
  ```

  **QA Scenario: Activity feed shows recent items**
  ```
  Tool: playwright (screenshot)
  Preconditions: Notes and contacts exist
  Steps:
    1. Navigate to http://localhost:5173/
    2. Take screenshot
    3. Verify: "Recent Activity" section visible
    4. Verify: Recent notes/contacts shown
  Expected Result: Activity feed populated
  Evidence: .sisyphus/evidence/task-4-2-activity.png
  ```

  **QA Scenario: Search is debounced**
  ```
  Tool: playwright
  Preconditions: On dashboard
  Steps:
    1. Type "alice" in search box
    2. Wait 300ms
    3. Verify: Search API called automatically
    4. Verify: Results update without clicking button
  Expected Result: Auto-search after debounce
  Evidence: .sisyphus/evidence/task-4-2-debounce.txt
  ```

  **QA Scenario: Error state displays**
  ```
  Tool: playwright (screenshot)
  Preconditions: API failing
  Steps:
    1. Navigate to dashboard
    2. Wait for API calls
    3. Verify: Error message displayed for failed loads
  Expected Result: Error state UI shown
  Evidence: .sisyphus/evidence/task-4-2-error.png
  ```

  **Evidence to Capture**:
  - [ ] Birthdays widget screenshot
  - [ ] Activity feed screenshot
  - [ ] Debounce verification
  - [ ] Error state screenshot

  **Commit**: YES
  - Message: `feat(client): add dashboard birthdays, activity feed, and debounced search`
  - Files: `client/src/pages/DashboardPage.tsx`, `client/src/pages/DashboardPage.css`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 4.3: Add Error Boundaries and Error States**

  **What to do**: Add React error boundaries to catch crashes and error states for async operations.
  
  - Create `client/src/components/ErrorBoundary.tsx`:
    - Catches errors in child component tree
    - Shows fallback UI with error message
    - Option to retry/reset
  - Wrap main routes with ErrorBoundary in `App.tsx`
  - Add error states to pages:
    - Loading states (skeletons/spinners)
    - Error states (error messages, retry buttons)
    - Empty states (already exist but verify)
  - Update all API calls to handle errors gracefully

  **Must NOT do**:
  - Do NOT use external error tracking services
  - Do NOT add logging to external services

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Reason**: Error handling, React patterns
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 4.2)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Wave 0, Wave 2, Wave 3

  **References**:
  - React Error Boundaries docs: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
  - `client/src/App.tsx` - Where to add boundary

  **Acceptance Criteria**:

  **QA Scenario: Error boundary catches crashes**
  ```
  Tool: playwright (screenshot)
  Preconditions: Inject error in component
  Steps:
    1. Temporarily add error in component
    2. Navigate to page
    3. Verify: Error boundary displays
    4. Verify: Error message shown
    5. Verify: App doesn't crash completely
  Expected Result: Error boundary catches and displays
  Evidence: .sisyphus/evidence/task-4-3-error-boundary.png
  ```

  **QA Scenario: API errors show error state**
  ```
  Tool: playwright (screenshot)
  Preconditions: Server returning errors
  Steps:
    1. Navigate to contacts page
    2. Wait for API call
    3. Verify: Error message displayed
    4. Verify: Retry button available
  Expected Result: Error state UI shown
  Evidence: .sisyphus/evidence/task-4-3-api-error.png
  ```

  **Evidence to Capture**:
  - [ ] Error boundary screenshot
  - [ ] API error state screenshot

  **Commit**: YES
  - Message: `feat(client): add error boundaries and error states`
  - Files: `client/src/components/ErrorBoundary.tsx`, `client/src/App.tsx`, `client/src/pages/*.tsx`
  - Pre-commit: `cd client && npx tsc --noEmit`

---


### Wave 5: Graph Improvements (1 day)

- [ ] **Task 5.1: Add Click Navigation and Colors to Relationship Graph**

  **What to do**: Enhance the D3.js graph with click navigation and color coding.
  
  - Add **click navigation**:
    - Click on node → navigate to that contact's detail page
    - Use `onNodeClick` callback prop
    - Update `RelationshipGraph.tsx` to accept callback
    - Update `ContactDetailPage.tsx` to pass navigation handler
  - Add **color coding by relationship type**:
    - Map relationship types to colors (family=blue, friend=green, etc.)
    - Color edges based on relationship type
    - Color nodes by their primary relationship type to center
  - Add **edge labels**:
    - Show relationship type on edges
    - Position labels along edge path
    - Use D3 textPath for curved labels
  - Update `client/src/components/RelationshipGraph.css` for styling

  **Must NOT do**:
  - Do NOT add graph editing (drag to create edges)
  - Do NOT add graph export
  - Do NOT add multiple hops

  **Recommended Agent Profile**:
  - **Category**: `artistry` or `deep`
  - **Reason**: D3.js requires creative problem-solving
  - **Skills**: `dev-browser`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5
  - **Blocks**: Wave 6
  - **Blocked By**: Wave 0, Wave 2, Wave 3, Wave 4

  **References**:
  - `client/src/components/RelationshipGraph.tsx` - Current implementation
  - `client/src/components/RelationshipGraph.css` - Styles
  - D3.js force simulation docs
  - `client/src/pages/ContactDetailPage.tsx` - Where graph is used

  **Acceptance Criteria**:

  **QA Scenario: Click node navigates**
  ```
  Tool: playwright
  Preconditions: Contact with relationships
  Steps:
    1. Navigate to contact detail → Relationships tab
    2. Click on related contact node
    3. Verify: Browser navigates to that contact's page
    4. Verify: URL changes to /contacts/{related-id}
  Expected Result: Click navigates to contact
  Evidence: .sisyphus/evidence/task-5-1-click-nav.txt
  ```

  **QA Scenario: Edges have labels**
  ```
  Tool: playwright (screenshot)
  Preconditions: Contact with relationships
  Steps:
    1. Navigate to contact detail → Relationships tab
    2. Take screenshot
    3. Verify: Relationship labels visible on edges
    4. Verify: Labels readable (family, friend, etc.)
  Expected Result: Edge labels displayed
  Evidence: .sisyphus/evidence/task-5-1-edge-labels.png
  ```

  **QA Scenario: Colors differentiate types**
  ```
  Tool: playwright (screenshot)
  Preconditions: Contact with multiple relationship types
  Steps:
    1. Navigate to contact detail → Relationships tab
    2. Take screenshot
    3. Verify: Different relationship types have different colors
    4. Verify: Legend or consistent coloring
  Expected Result: Visual color coding
  Evidence: .sisyphus/evidence/task-5-1-colors.png
  ```

  **Evidence to Capture**:
  - [ ] Click navigation verification
  - [ ] Edge labels screenshot
  - [ ] Color coding screenshot

  **Commit**: YES
  - Message: `feat(client): add graph click navigation, colors, and edge labels`
  - Files: `client/src/components/RelationshipGraph.tsx`, `client/src/components/RelationshipGraph.css`, `client/src/pages/ContactDetailPage.tsx`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 5.2: Make Graph Responsive**

  **What to do**: Make the relationship graph responsive to container size.
  
  - Replace hardcoded 800x600 dimensions
  - Use ResizeObserver to detect container size changes
  - Update D3 simulation on resize
  - Maintain aspect ratio or fill container
  - Ensure minimum dimensions for usability
  - Update `client/src/components/RelationshipGraph.tsx`

  **Must NOT do**:
  - Do NOT change graph data structure
  - Do NOT change force simulation parameters

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Reason**: Responsive design, ResizeObserver API
  - **Skills**: `dev-browser`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 5.1)
  - **Parallel Group**: Wave 5
  - **Blocks**: Wave 6
  - **Blocked By**: Wave 0, Wave 2

  **References**:
  - ResizeObserver API: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
  - `client/src/components/RelationshipGraph.tsx` - Current hardcoded size

  **Acceptance Criteria**:

  **QA Scenario: Graph resizes with window**
  ```
  Tool: playwright (screenshot)
  Preconditions: Contact with relationships
  Steps:
    1. Navigate to contact detail → Relationships tab
    2. Resize browser window
    3. Take screenshot at different sizes
    4. Verify: Graph resizes to fit container
    5. Verify: No overflow or clipping
  Expected Result: Responsive sizing works
  Evidence: .sisyphus/evidence/task-5-2-responsive.png
  ```

  **Evidence to Capture**:
  - [ ] Responsive screenshots at multiple sizes

  **Commit**: YES
  - Message: `feat(client): make relationship graph responsive`
  - Files: `client/src/components/RelationshipGraph.tsx`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

### Wave 6: Final Polish (1 day)

- [ ] **Task 6.1: Add Inline Editing for Contacts**

  **What to do**: Implement inline editing for contact details (instead of separate edit modal).
  
  - Add edit mode toggle on ContactDetailPage
  - Make fields editable inline:
    - Click "Edit" → fields become inputs
    - Save/Cancel buttons appear
    - Validate on save
  - Add inline editing for:
    - Basic info (name, email, phone)
    - Addresses
    - Social links
    - Custom fields
  - Show loading state during save
  - Show success/error feedback

  **Must NOT do**:
  - Do NOT create separate edit modal
  - Do NOT add bulk edit

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Reason**: Complex UI interactions
  - **Skills**: `frontend-ui-ux`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 6
  - **Blocks**: None
  - **Blocked By**: Wave 0, Wave 2, Wave 3, Wave 4, Wave 5

  **References**:
  - `client/src/pages/ContactDetailPage.tsx` - Where to implement
  - `client/src/api/contacts.ts` - Update API function

  **Acceptance Criteria**:

  **QA Scenario: Inline editing works**
  ```
  Tool: playwright (screenshot)
  Preconditions: Contact exists
  Steps:
    1. Navigate to contact detail
    2. Click "Edit" button
    3. Verify: Fields become editable inputs
    4. Change name
    5. Click Save
    6. Verify: Name updated
  Expected Result: Inline editing functional
  Evidence: .sisyphus/evidence/task-6-1-inline-edit.png
  ```

  **Evidence to Capture**:
  - [ ] Inline editing screenshot

  **Commit**: YES
  - Message: `feat(client): add inline editing for contacts`
  - Files: `client/src/pages/ContactDetailPage.tsx`
  - Pre-commit: `cd client && npx tsc --noEmit`

---

- [ ] **Task 6.2: Final Integration Testing and Cleanup**

  **What to do**: Perform end-to-end integration testing and cleanup.
  
  - Run full user flow:
    1. Register new user
    2. Create contact (via modal)
    3. Add relationship
    4. View graph (click to navigate)
    5. Search contacts
    6. Delete contact (with confirmation)
    7. Verify data persists after docker restart
  - Fix any integration issues found
  - Remove TODO comments
  - Clean up console.log statements
  - Verify TypeScript compiles with no errors
  - Verify build succeeds: `cd client && npm run build`
  - Update README if needed
  - Final commit

  **Must NOT do**:
  - Do NOT add new features
  - Do NOT refactor working code

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Reason**: Integration testing, cleanup
  - **Skills**: `dev-browser`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 6
  - **Blocks**: FINAL verification
  - **Blocked By**: ALL previous waves

  **Acceptance Criteria**:

  **QA Scenario: Full user flow works**
  ```
  Tool: playwright + Bash
  Preconditions: Clean docker environment
  Steps:
    1. docker-compose up -d
    2. Register new user
    3. Create contact via modal
    4. View contact
    5. Delete contact with confirmation
    6. docker-compose down && docker-compose up -d
    7. Login with same user
    8. Verify: No contacts (clean state persisted)
  Expected Result: Complete flow works
  Evidence: .sisyphus/evidence/task-6-2-full-flow.txt
  ```

  **QA Scenario: Build succeeds**
  ```
  Tool: Bash
  Preconditions: All code complete
  Steps:
    1. cd client && npm run build
    2. Verify: Build completes without errors
    3. cd ../server && npm run build
    4. Verify: Build completes
  Expected Result: Both builds succeed
  Evidence: .sisyphus/evidence/task-6-2-build.txt
  ```

  **Evidence to Capture**:
  - [ ] Full flow test results
  - [ ] Build output

  **Commit**: YES
  - Message: `chore: final integration testing and cleanup`
  - Files: Any fixes found
  - Pre-commit: `cd client && npm run build && cd ../server && npm run build`

---


## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] **F1. Plan Compliance Audit** — `oracle`
  
  Read the plan end-to-end. For each "Must Have":
  - Verify Docker seed fix: `docker-compose.yml` doesn't run seed on startup
  - Verify CSS files exist: Sidebar.css, AppLayout.css, all page CSS files
  - Verify Create Contact modal: Replace alert('TODO') with working modal
  - Verify Delete confirmation modal: Confirmation before delete
  - Verify no `any` types: `grep -r ": any" client/src | wc -l` = 0
  - Verify error logging: Check server logs show errors with requestId
  - Verify dashboard features: Birthdays, activity, debounced search visible
  - Verify graph improvements: Click navigation, colors, labels working
  - Verify error boundaries: App doesn't crash on errors
  - Verify data persistence: Data survives `docker-compose down && up`
  
  For each "Must NOT Have":
  - Search codebase for forbidden patterns
  - Reject with file:line if found
  
  Check evidence files exist in `.sisyphus/evidence/`.
  
  Output: `Must Have [14/14] | Must NOT Have [14/14] | Tasks [15/15] | VERDICT: APPROVE/REJECT`

- [ ] **F2. Code Quality Review** — `unspecified-high`
  
  Run quality checks:
  - `cd server && npm run build` → Must pass
  - `cd client && npm run build` → Must pass
  - `cd client && npx tsc --noEmit` → Zero errors
  - Check for `as any` or `@ts-ignore` → Should be minimal
  - Check for empty catch blocks → None allowed
  - Check for console.log in production code → Remove or justify
  - Check for unused imports → Clean up
  - Check CSS for unused classes → Clean up
  - Check for AI slop: excessive comments, over-abstraction
  
  Output: `Build [PASS/FAIL] | TypeCheck [PASS/FAIL] | Quality [N clean/N issues] | VERDICT`

- [ ] **F3. Real Manual QA** — `unspecified-high` + `playwright`
  
  Execute EVERY QA scenario from EVERY task:
  - Wave 0: Data persistence verification
  - Wave 1: Error logging verification
  - Wave 2: All CSS screenshots
  - Wave 3: Modal flows
  - Wave 4: Dashboard features, types, error boundaries
  - Wave 5: Graph click, colors, labels
  - Wave 6: Full integration flow
  
  Test cross-task integration:
  - Create contact → appears in list → appears in dashboard → searchable → deletable
  - Add relationship → visible in graph → clickable → navigates to contact
  - Error states → error boundaries catch → graceful recovery
  
  Save evidence to `.sisyphus/evidence/final-qa/`.
  
  Output: `Scenarios [35/35 pass] | Integration [10/10] | VERDICT`

- [ ] **F4. Scope Fidelity Check** — `deep`
  
  For each task: 
  - Read "What to do" from plan
  - Read actual implementation (git diff)
  - Verify 1:1 match - everything in spec was built
  - Verify nothing beyond spec was built
  - Check "Must NOT do" compliance
  - Detect cross-task contamination
  - Flag unaccounted changes
  
  Output: `Tasks [15/15 compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

**When to commit**: After each task completes successfully (after QA scenarios pass)

**Commit format**: `type(scope): description`

Examples:
- `fix(docker): remove seed from startup command to prevent data loss`
- `feat(server): add centralized error logging middleware`
- `feat(css): add Sidebar and AppLayout styles`
- `feat(client): add CreateContact modal with validation`
- `refactor(client): replace all any types with proper interfaces`
- `feat(client): add dashboard birthdays, activity feed, and debounced search`
- `feat(client): add graph click navigation, colors, and edge labels`

**Pre-commit verification**: 
- Backend: `cd server && npm run build`
- Frontend: `cd client && npx tsc --noEmit`

---

## Success Criteria

### Verification Commands
```bash
# 1. Docker builds and runs
docker-compose up --build -d

# 2. Data persists
docker-compose down && docker-compose up -d
# Wait, then verify contacts still exist

# 3. Backend builds
cd server && npm run build  # Expected: Success

# 4. Frontend builds
cd client && npm run build  # Expected: Success

# 5. No TypeScript errors
cd client && npx tsc --noEmit  # Expected: No errors

# 6. Full user flow works
# Register → Create contact → Add relationship → View graph → Search → Delete
# All steps complete without errors

# 7. All evidence files exist
ls .sisyphus/evidence/ | wc -l  # Expected: 35+ files

# 8. Final verification passes
# All 4 agents return APPROVE
```

### Final Checklist
- [ ] Wave 0: Docker seed fix prevents data loss
- [ ] Wave 1: Error logging middleware working
- [ ] Wave 2: All CSS files created with proper styling
- [ ] Wave 3: Create Contact modal functional
- [ ] Wave 3: Delete confirmation modal functional
- [ ] Wave 4: Zero `any` types in frontend
- [ ] Wave 4: Dashboard has birthdays, activity, debounced search
- [ ] Wave 4: Error boundaries catch crashes
- [ ] Wave 5: Graph clickable with colors and labels
- [ ] Wave 5: Graph responsive
- [ ] Wave 6: Inline editing works
- [ ] Wave 6: Full integration flow passes
- [ ] Final: All 4 verification agents APPROVE
- [ ] Final: Both builds succeed
- [ ] Final: Data persists across restarts

---

## Summary

This plan takes the partially-built Personal CRM from ~60% complete to production-ready by:

1. **Fixing critical data loss** (Wave 0) — Docker no longer wipes data on restart
2. **Adding complete styling** (Wave 2) — ~10 CSS files for all components
3. **Enabling CRUD operations** (Wave 3) — Users can finally create contacts
4. **Adding type safety** (Wave 4) — No more `any` types
5. **Completing dashboard** (Wave 4) — Birthdays, activity, debounced search
6. **Enhancing graph** (Wave 5) — Click navigation, colors, labels
7. **Adding resilience** (Wave 4, 6) — Error boundaries, error states

**Total: 15 tasks across 6 waves (7-10 days)**

**Key Success Factors**:
- Wave 0 MUST complete first (data loss is blocking)
- Wave 2 MUST complete before Wave 3-6 (can't test UI without styles)
- Each task has concrete QA scenarios
- Evidence captured for every task
- Final verification ensures quality
