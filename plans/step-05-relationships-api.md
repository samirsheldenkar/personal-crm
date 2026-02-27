# Step 5: Relationships API

## Goal
Implement the relationships CRUD API and the graph query endpoint that returns a contact's 1-hop relationship neighborhood.

**Prerequisites:** Steps 1–4 completed (contacts API working).

---

## 5.1 TypeScript Types

### `server/src/types/relationship.ts`

```typescript
import { z } from 'zod';

// Must match the relationship_type Postgres ENUM exactly
export const RELATIONSHIP_TYPES = [
  'friend', 'colleague', 'parent', 'child', 'sibling', 'cousin',
  'partner', 'spouse', 'mentor', 'mentee', 'manager', 'report',
  'introduced_by', 'met_at_event', 'acquaintance', 'neighbor', 'other',
] as const;

export type RelationshipType = typeof RELATIONSHIP_TYPES[number];

export const createRelationshipSchema = z.object({
  fromContactId: z.string().uuid(),
  toContactId: z.string().uuid(),
  type: z.enum(RELATIONSHIP_TYPES),
  metadata: z.record(z.any()).optional(),
});

export const listRelationshipsQuery = z.object({
  contactId: z.string().uuid().optional(),
});

export type CreateRelationshipInput = z.infer<typeof createRelationshipSchema>;

export interface RelationshipRow {
  id: string;
  user_id: string;
  from_contact_id: string;
  to_contact_id: string;
  type: RelationshipType;
  metadata: Record<string, any>;
  created_at: string;
}

// Graph structures for the /contacts/:id/graph endpoint
export interface GraphNode {
  id: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  company: string | null;
  jobTitle: string | null;
  tags: { id: string; name: string; color: string }[];
}

export interface GraphEdge {
  id: string;
  source: string; // contact id
  target: string; // contact id
  type: RelationshipType;
}

export interface ContactGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  centerId: string;
}
```

---

## 5.2 Relationship Service

### `server/src/services/relationship.service.ts`

### `create(userId, input)`
1. Validate both `fromContactId` and `toContactId` exist and belong to `userId`
2. Validate they are different (the DB constraint will also catch this)
3. Insert into `relationships` with `user_id = userId`
4. Return the new row

### `list(userId, contactId?)`
1. Base query: `SELECT r.*, fc.first_name as from_first_name, fc.last_name as from_last_name, tc.first_name as to_first_name, tc.last_name as to_last_name FROM relationships r JOIN contacts fc ON fc.id = r.from_contact_id JOIN contacts tc ON tc.id = r.to_contact_id WHERE r.user_id = ?`
2. If `contactId` provided, add: `AND (r.from_contact_id = ? OR r.to_contact_id = ?)`
3. Order by `created_at DESC`
4. Return the rows with joined contact names

### `delete(userId, relationshipId)`
1. Find relationship by id where `user_id = userId`
2. If not found, throw `AppError(404)`
3. Delete the row
4. Return `{ deleted: true }`

### `getGraph(userId, contactId)`
This powers `GET /contacts/:id/graph` — returns the 1-hop neighborhood of a contact.

1. Verify contact exists and belongs to user
2. Query all relationships where the contact is either `from` or `to`:
   ```sql
   SELECT r.id, r.from_contact_id, r.to_contact_id, r.type
   FROM relationships r
   WHERE r.user_id = ?
     AND (r.from_contact_id = ? OR r.to_contact_id = ?)
   ```
3. Collect all unique contact IDs from the edges (include the center contact)
4. Query those contacts:
   ```sql
   SELECT c.id, c.first_name, c.last_name, c.avatar_url, c.company, c.job_title
   FROM contacts c
   WHERE c.id = ANY(?)
   ```
5. For each node, fetch its tags:
   ```sql
   SELECT ct.contact_id, t.id, t.name, t.color
   FROM contact_tags ct
   JOIN tags t ON t.id = ct.tag_id
   WHERE ct.contact_id = ANY(?)
   ```
6. Build and return `ContactGraph` with `nodes`, `edges`, and `centerId`

---

## 5.3 Relationship Controller

### `server/src/controllers/relationship.controller.ts`

| Handler | HTTP | Input | Service Call | Status |
|---------|------|-------|--------------|--------|
| `createRelationship` | POST | `createRelationshipSchema.parse(req.body)` | `service.create(userId, body)` | 201 |
| `listRelationships` | GET | `listRelationshipsQuery.parse(req.query)` | `service.list(userId, contactId)` | 200 |
| `deleteRelationship` | DELETE | `req.params.id` | `service.delete(userId, id)` | 200 |
| `getContactGraph` | GET | `req.params.id` (contact ID) | `service.getGraph(userId, id)` | 200 |

---

## 5.4 Relationship Routes

### `server/src/routes/relationship.routes.ts`

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as ctrl from '../controllers/relationship.controller';

const router = Router();
router.use(authenticate);

router.get('/', ctrl.listRelationships);
router.post('/', ctrl.createRelationship);
router.delete('/:id', ctrl.deleteRelationship);

export default router;
```

### Graph endpoint — add to contact routes

In `server/src/routes/contact.routes.ts`, add:
```typescript
import { getContactGraph } from '../controllers/relationship.controller';

router.get('/:id/graph', getContactGraph);
```

---

## 5.5 Mount in `index.ts`

```typescript
import relationshipRoutes from './routes/relationship.routes';
app.use('/api/v1/relationships', relationshipRoutes);
```

---

## Verification
1. Create a relationship: `POST /api/v1/relationships` with `{"fromContactId":"...","toContactId":"...","type":"friend"}` → 201
2. List for a contact: `GET /api/v1/relationships?contactId=...` → array of edges with contact names
3. Get graph: `GET /api/v1/contacts/:id/graph` → `{ nodes: [...], edges: [...], centerId: "..." }`
4. Delete: `DELETE /api/v1/relationships/:id` → 200
5. Self-reference attempt → 400 or DB constraint error
6. Invalid type (not in enum) → 400 Zod validation error
