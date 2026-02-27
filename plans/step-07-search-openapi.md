# Step 7: Global Search & OpenAPI Specification

## Goal
Implement the global search endpoint (full-text search across contacts and notes) and produce a complete OpenAPI 3.0 YAML specification documenting the entire API.

**Prerequisites:** Steps 1–6 completed (all resource APIs working).

---

## 7.1 Search API

### Types — `server/src/types/search.ts`
```typescript
import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(500),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export interface SearchResult {
  type: 'contact' | 'note';
  id: string;
  title: string;       // contact: "First Last", note: first 100 chars of body
  subtitle: string;    // contact: company/job, note: contact name
  contactId: string;   // for navigation
  rank: number;        // ts_rank score
}
```

### Service — `server/src/services/search.service.ts`

### `search(userId, query, limit)`

Execute two parallel queries against the full-text `search_vector` columns added in migration 008:

**Contact search:**
```sql
SELECT
  'contact' AS type,
  c.id,
  c.first_name || ' ' || coalesce(c.last_name, '') AS title,
  coalesce(c.job_title, '') || ' at ' || coalesce(c.company, '') AS subtitle,
  c.id AS contact_id,
  ts_rank(c.search_vector, plainto_tsquery('english', $1)) AS rank
FROM contacts c
WHERE c.user_id = $2
  AND c.search_vector @@ plainto_tsquery('english', $1)
ORDER BY rank DESC
LIMIT $3
```

**Note search:**
```sql
SELECT
  'note' AS type,
  n.id,
  left(n.body, 100) AS title,
  c.first_name || ' ' || coalesce(c.last_name, '') AS subtitle,
  n.contact_id,
  ts_rank(n.search_vector, plainto_tsquery('english', $1)) AS rank
FROM notes n
JOIN contacts c ON c.id = n.contact_id
WHERE n.user_id = $2
  AND n.search_vector @@ plainto_tsquery('english', $1)
ORDER BY rank DESC
LIMIT $3
```

Merge both result sets, sort by `rank` DESC, return top `limit` results.

### Controller — `server/src/controllers/search.controller.ts`
```typescript
export async function globalSearch(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { q, limit } = searchQuerySchema.parse(req.query);
  const results = await searchService.search(userId, q, limit);
  res.json({ results });
}
```

### Routes — `server/src/routes/search.routes.ts`
```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { globalSearch } from '../controllers/search.controller';

const router = Router();
router.use(authenticate);
router.get('/', globalSearch);

export default router;
```

Mount: `app.use('/api/v1/search', searchRoutes)`

---

## 7.2 OpenAPI Specification

### `server/docs/openapi.yaml`

Write a complete OpenAPI 3.0.3 specification covering every endpoint from Steps 3–7. The spec must include:

**Info section:**
- title: `Personal CRM API`
- version: `0.1.0`
- description: Self-hostable personal relationship manager API

**Servers:**
- `http://localhost:3001/api/v1`

**Security:**
- `bearerAuth` scheme (JWT)
- Applied globally except for `/auth/register` and `/auth/login`

**Paths (all matching the route table from the implementation plan):**

For each endpoint, define:
- `operationId` (e.g. `createContact`)
- `summary` and `description`
- `parameters` (path params, query params with schema)
- `requestBody` with JSON schema (matching Zod schemas exactly)
- `responses` (200/201 success with example, 400 validation error, 401 unauthorized, 404 not found, 409 conflict where applicable)

**Components/Schemas to define:**
- `User` — id, email, displayName, createdAt
- `AuthTokens` — accessToken, refreshToken
- `Contact` — all fields, with nested email/phone/address arrays
- `ContactList` — contacts array + pagination (total, page, limit)
- `Relationship` — id, fromContactId, toContactId, type (enum of 17 values), metadata
- `ContactGraph` — nodes array, edges array, centerId
- `GraphNode` — id, firstName, lastName, avatarUrl, company, jobTitle, tags
- `GraphEdge` — id, source, target, type
- `Note` — id, contactId, body, format, tags, createdAt, updatedAt
- `Tag` — id, name, color
- `CustomFieldDefinition` — id, name, fieldType (enum), options, defaultValue, sortOrder
- `CustomFieldValue` — id, contactId, fieldId, value, fieldName, fieldType
- `Reminder` — id, contactId, type, intervalDays, dueDate, note, isCompleted
- `SearchResult` — type, id, title, subtitle, contactId, rank
- `Error` — error (string), details (optional array)

**Relationship type enum values must exactly match:**
```yaml
enum:
  - friend
  - colleague
  - parent
  - child
  - sibling
  - cousin
  - partner
  - spouse
  - mentor
  - mentee
  - manager
  - report
  - introduced_by
  - met_at_event
  - acquaintance
  - neighbor
  - other
```

**Custom field type enum:**
```yaml
enum:
  - text
  - number
  - date
  - select
  - multi_select
  - url
  - boolean
```

---

## 7.3 Final Route Mounting (complete `index.ts`)

After all steps, the route mounting section in `server/src/index.ts` should read:

```typescript
import authRoutes from './routes/auth.routes';
import contactRoutes from './routes/contact.routes';
import relationshipRoutes from './routes/relationship.routes';
import noteRoutes from './routes/note.routes';
import tagRoutes from './routes/tag.routes';
import customFieldRoutes from './routes/customField.routes';
import reminderRoutes from './routes/reminder.routes';
import searchRoutes from './routes/search.routes';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/v1/relationships', relationshipRoutes);
app.use('/api/v1', noteRoutes);          // handles /contacts/:id/notes AND /notes/:id
app.use('/api/v1', tagRoutes);           // handles /tags AND /contacts/:id/tags
app.use('/api/v1/custom-fields', customFieldRoutes);
app.use('/api/v1/reminders', reminderRoutes);
app.use('/api/v1/search', searchRoutes);
```

---

## Verification
1. Seed data includes contacts with names "Alice Chen" and "Bob Martinez" and notes
2. `GET /api/v1/search?q=alice` → returns contact result with rank > 0
3. `GET /api/v1/search?q=kubernetes` → returns note result (from Alice's note about K8s)
4. `GET /api/v1/search?q=nonexistent` → empty results array
5. Validate `openapi.yaml` with an online validator (e.g. https://editor.swagger.io) → no errors
