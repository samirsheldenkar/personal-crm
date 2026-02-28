

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
