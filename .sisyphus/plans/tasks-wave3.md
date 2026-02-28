

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
