# Review: Existing Personal CRM Plans

## Summary of Existing Plans

The existing plans describe building a **Personal CRM** - a self-hostable relationship manager inspired by Monica, Clay, and Dex. The plans span 11 sequential steps covering:

1. **Step 1**: Project initialization (Node.js backend, React+Vite frontend)
2. **Step 2**: Database schema & migrations (PostgreSQL with Knex)
3. **Step 3**: Backend authentication (JWT)
4. **Step 4**: Contacts API (CRUD + search)
5. **Step 5**: Relationships API (graph edges)
6. **Step 6**: Notes, Tags, Reminders, Custom Fields APIs
7. **Step 7**: Search & OpenAPI spec
8. **Step 8**: Frontend foundation (design system, auth pages)
9. **Step 9**: Frontend pages (dashboard, contacts)
10. **Step 10**: Graph visualization & settings
11. **Step 11**: Docker & DevOps

---

## What's Good ✅

### 1. **Tech Stack Selection**
- **Backend**: Node.js + TypeScript + Express - mainstream, well-supported
- **Database**: PostgreSQL 16 with JSONB - excellent for flexible data
- **ORM**: Knex.js - lightweight, SQL-first approach
- **Frontend**: React 18 + Vite - fast dev experience
- **Graph Viz**: D3.js - industry standard
- **Containerization**: Docker multi-stage builds - production-ready

### 2. **Database Design**
- Well-normalized schema with proper relationships
- Custom fields via EAV pattern (field_definitions + field_values)
- PostgreSQL full-text search with tsvector
- Proper indexes on foreign keys and search columns
- CASCADE deletes appropriately configured

### 3. **API Design**
- RESTful conventions
- Proper HTTP status codes
- Consistent response patterns
- JWT authentication with refresh tokens

### 4. **Feature Coverage**
- Contacts with rich details (emails, phones, addresses, social)
- Relationship graph (directed edges with types)
- Notes with markdown support
- Tags (many-to-many)
- Custom fields (user-defined)
- Reminders (keep-in-touch scheduling)
- Full-text search
- D3.js force-directed graph visualization

### 5. **Documentation Detail**
- Code examples provided for most files
- SQL DDL included
- OpenAPI spec outlined
- Verification commands provided

---

## Critical Issues 🔴

### 1. **No Parallel Execution Strategy**
**Problem**: All 11 steps are strictly sequential. This is inefficient.

**Example**: Step 1 (project init) and Step 2 (database schema) could run in parallel - they don't depend on each other. Similarly, Step 4-7 (APIs) could be built in parallel by different agents.

**Impact**: Estimated 70% longer execution time than necessary.

### 2. **No Agent Categorization**
**Problem**: No indication of task complexity or which agent type should handle each task.

**Example**: Step 2 (database migrations) is straightforward and could be `quick`, while Step 10 (D3.js graph) requires `visual-engineering` skills.

### 3. **No QA Scenarios - Manual Verification Only**
**Problem**: Verification sections use manual curl commands, not agent-executable scenarios.

**Current**: "Register: `curl -X POST ...` → 201 with tokens"

**What's Missing**: Automated verification with specific selectors, expected values, and evidence capture.

### 4. **No "Must NOT Do" Guardrails**
**Problem**: No explicit exclusions or boundaries to prevent scope creep.

**What's Missing**:
- "Do NOT add email notifications"
- "Do NOT add real-time chat"
- "Do NOT add bulk import"
- "Do NOT optimize for >10k contacts"

### 5. **No Final Verification Wave**
**Problem**: No comprehensive end-to-end testing after all tasks complete.

**What's Missing**: 
- Plan compliance audit (oracle)
- Code quality review
- Integration testing
- Scope fidelity check

### 6. **No Evidence Capture Strategy**
**Problem**: No mention of capturing screenshots, logs, or response data for verification.

**Impact**: No audit trail of what was actually built.

### 7. **No Commit Strategy**
**Problem**: No guidance on git commits - when to commit, what messages to use.

### 8. **Test Infrastructure Not Assessed**
**Problem**: No evaluation of whether tests should be included.

**Question Not Asked**: "Should this include automated tests?"

---

## Moderate Issues 🟡

### 9. **Heavy Coupling Between Steps**
**Example**: Step 4 "Prerequisites: Steps 1-3" - actually only needs auth middleware from Step 3.

**Better**: Break into smaller, more granular tasks with explicit dependencies.

### 10. **No Error Handling Strategy**
**Problem**: While AppError class is mentioned, there's no comprehensive error handling pattern.

**What's Missing**:
- Global error middleware
- Consistent error response format
- Client-side error boundary
- Retry logic for failed requests

### 11. **No State Management Strategy**
**Problem**: React Context for auth only - no mention of server state management.

**Consider**: React Query (TanStack Query) for server state caching, invalidation, optimistic updates.

### 12. **File Organization Inconsistent**
**Problem**: Mixed patterns in the plans directory - files have line number prefixes in content.

### 13. **No Performance Considerations**
**What's Missing**:
- Pagination strategy (cursor vs offset)
- Query optimization for graph traversal
- Frontend bundle size limits
- Image optimization for avatars

### 14. **Security Gaps**
**What's Missing**:
- Rate limiting on auth endpoints
- CORS configuration details
- Input sanitization beyond Zod
- SQL injection prevention ( parameterized queries are used, but not explicitly called out)
- XSS protection headers

### 15. **No Accessibility (a11y) Requirements**
**What's Missing**:
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast requirements

---

## Minor Issues 🟢

### 16. **No Migration Rollback Strategy**
Only `down()` functions exist - no mention of rollback procedures for failed deployments.

### 17. **No Data Seeding Strategy**
Demo data is created, but no production seeding strategy mentioned.

### 18. **No Backup/Restore Documentation**
For a self-hosted app, backup procedures are important.

### 19. **No Logging Strategy**
No mention of structured logging, log levels, or log aggregation.

### 20. **No Health Check Endpoints**
Only basic `/api/health` - no deep health checks for DB connectivity.

---

## Recommendations for New Plan

### 1. **Restructure for Parallel Execution**
Group tasks into waves:
- **Wave 1**: Foundation (project scaffolding, DB schema, types)
- **Wave 2**: Backend APIs (parallel by resource: auth, contacts, relationships, notes, tags, etc.)
- **Wave 3**: Frontend foundation (design system, API client, auth pages)
- **Wave 4**: Frontend features (dashboard, contacts, settings)
- **Wave 5**: Integration (graph viz, Docker, final QA)

### 2. **Add Agent Categorization**
Mark each task with:
- Category: `quick`, `unspecified-high`, `visual-engineering`, `deep`
- Skills needed: `playwright`, `docker`, etc.

### 3. **Replace Manual Verification with QA Scenarios**
For each task, include:
- Tool to use (Playwright for UI, curl for API, bash for CLI)
- Exact steps with selectors/data
- Expected results
- Evidence capture path

### 4. **Add Guardrails Section**
Explicitly state what's NOT included:
- Email notifications
- Real-time features (WebSockets)
- Bulk import/export
- Multi-tenancy
- Advanced analytics

### 5. **Add Final Verification Wave**
Four parallel review tasks:
- Plan compliance audit (oracle)
- Code quality review
- Real QA (agent-executed)
- Scope fidelity check

### 6. **Add Commit Strategy**
When to commit, commit message format, files to include.

### 7. **Assess Test Infrastructure**
Ask: Include automated tests? If yes, which framework? TDD or tests-after?

### 8. **Add Evidence Requirements**
Specify `.sisyphus/evidence/` structure and naming.

---

## Overall Assessment

**Strengths**: Solid technical foundation, comprehensive feature set, good tech choices

**Weaknesses**: Sequential structure wastes time, lacks agent-executable QA, missing guardrails

**Verdict**: The existing plans are a good reference for WHAT to build, but need significant restructuring for HOW to build it efficiently with parallel agents.

**Estimated Improvement**: 60-70% faster execution with parallel waves + 90% better verification with agent-executable QA scenarios.
