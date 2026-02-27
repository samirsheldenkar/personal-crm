# Step 4: Contacts API

## Goal
Implement the full contacts CRUD API: list (paginated, filterable, searchable), create, get (with custom fields and tags), update, delete, archive/unarchive, and timeline.

**Prerequisites:** Steps 1–3 completed (auth working).

---

## 4.1 TypeScript Types

### `server/src/types/contact.ts`

```typescript
import { z } from 'zod';

const emailEntry = z.object({
  value: z.string().email(),
  label: z.string().optional(), // "work", "personal", etc.
  primary: z.boolean().optional(),
});

const phoneEntry = z.object({
  value: z.string(),
  label: z.string().optional(),
  primary: z.boolean().optional(),
});

const addressEntry = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  label: z.string().optional(),
});

const socialLinks = z.object({
  linkedin: z.string().url().optional(),
  twitter: z.string().optional(),
  website: z.string().url().optional(),
}).passthrough(); // allow additional keys

export const createContactSchema = z.object({
  firstName: z.string().min(1).max(255),
  lastName: z.string().max(255).optional(),
  avatarUrl: z.string().url().optional(),
  company: z.string().max(255).optional(),
  jobTitle: z.string().max(255).optional(),
  birthday: z.string().optional(), // ISO date string
  emails: z.array(emailEntry).optional(),
  phones: z.array(phoneEntry).optional(),
  addresses: z.array(addressEntry).optional(),
  socialLinks: socialLinks.optional(),
  customFields: z.record(z.string(), z.any()).optional(), // fieldId → value
  tagIds: z.array(z.string().uuid()).optional(),
});

export const updateContactSchema = createContactSchema.partial();

export const listContactsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  tags: z.string().optional(),           // comma-separated tag IDs
  sort: z.enum(['name', 'created_at', 'last_contacted_at']).default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
  archived: z.coerce.boolean().default(false),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;

export interface ContactRow {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string | null;
  avatar_url: string | null;
  company: string | null;
  job_title: string | null;
  birthday: string | null;
  emails: any[];
  phones: any[];
  addresses: any[];
  social_links: Record<string, string>;
  is_archived: boolean;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}
```

---

## 4.2 Contact Service

### `server/src/services/contact.service.ts`

Responsibilities and implementation:

### `list(userId, query)`
1. Parse `query` with `listContactsQuery`
2. Build Knex query on `contacts` table, filter by `user_id = userId` and `is_archived = query.archived`
3. If `query.search` is provided, use Postgres full-text: `.whereRaw("search_vector @@ plainto_tsquery('english', ?)", [query.search])`
4. If `query.tags` provided (comma-separated UUIDs), join `contact_tags` and filter: `.whereIn('contact_tags.tag_id', tagIds)`
5. Sort by `query.sort` field (map `name` → `first_name`, otherwise use column name directly), direction `query.order`
6. Paginate: `.limit(query.limit).offset((query.page - 1) * query.limit)`
7. Run a parallel count query (same filters, no limit/offset) for `total`
8. Return `{ contacts, total, page: query.page, limit: query.limit }`

### `getById(userId, contactId)`
1. Query `contacts` where `id = contactId` and `user_id = userId`
2. If not found, throw `AppError(404, 'Contact not found')`
3. Fetch associated tags via join: `SELECT t.* FROM tags t JOIN contact_tags ct ON ct.tag_id = t.id WHERE ct.contact_id = ?`
4. Fetch custom field values: `SELECT cfv.*, cfd.name, cfd.field_type FROM custom_field_values cfv JOIN custom_field_definitions cfd ON cfd.id = cfv.field_id WHERE cfv.contact_id = ?`
5. Return the contact with `tags` and `customFields` arrays attached

### `create(userId, input)`
1. Map camelCase input to snake_case DB columns
2. Insert into `contacts` with `user_id = userId`, return the new row
3. If `input.tagIds` provided, insert rows into `contact_tags`
4. If `input.customFields` provided, insert rows into `custom_field_values` (validate that field_id belongs to this user)
5. Return the full contact (call `getById`)

### `update(userId, contactId, input)`
1. Verify contact exists and belongs to user
2. Map camelCase to snake_case, set `updated_at = now()`
3. Update `contacts` row
4. If `input.tagIds` provided, delete existing `contact_tags` for this contact, re-insert
5. If `input.customFields` provided, upsert into `custom_field_values` (use `ON CONFLICT (contact_id, field_id) DO UPDATE SET value = ?`)
6. Return the full contact (call `getById`)

### `delete(userId, contactId)`
1. Verify contact exists and belongs to user
2. Delete from `contacts` (cascades to notes, relationships, tags, custom fields)
3. Return `{ deleted: true }`

### `archive(userId, contactId, archive: boolean)`
1. Verify contact exists and belongs to user
2. Update `is_archived = archive`, `updated_at = now()`
3. Return updated contact

### `getTimeline(userId, contactId)`
1. Verify contact exists and belongs to user
2. Fetch notes: `SELECT * FROM notes WHERE contact_id = ? ORDER BY created_at DESC`
3. Fetch reminders: `SELECT * FROM reminders WHERE contact_id = ? ORDER BY due_date ASC`
4. Merge into single array, sorted by date descending, each item tagged with `type: 'note'` or `type: 'reminder'`
5. Return the timeline array

---

## 4.3 Contact Controller

### `server/src/controllers/contact.controller.ts`

Each handler follows the pattern:
1. Extract `userId` from `req.user!.userId`
2. Parse/validate input with Zod schema
3. Call the appropriate service method
4. Send JSON response with appropriate status code

| Handler | HTTP | Zod Schema | Service Call | Response Status |
|---------|------|------------|--------------|-----------------|
| `listContacts` | GET | `listContactsQuery.parse(req.query)` | `service.list(userId, query)` | 200 |
| `getContact` | GET | `req.params.id` (UUID) | `service.getById(userId, id)` | 200 |
| `createContact` | POST | `createContactSchema.parse(req.body)` | `service.create(userId, body)` | 201 |
| `updateContact` | PUT | `updateContactSchema.parse(req.body)` | `service.update(userId, id, body)` | 200 |
| `deleteContact` | DELETE | `req.params.id` | `service.delete(userId, id)` | 200 |
| `archiveContact` | PATCH | `req.params.id`, `req.body.archived` (boolean) | `service.archive(userId, id, archived)` | 200 |
| `getTimeline` | GET | `req.params.id` | `service.getTimeline(userId, id)` | 200 |

Wrap all handlers in a try/catch that converts `AppError` to the correct status and Zod errors to 400.

---

## 4.4 Contact Routes

### `server/src/routes/contact.routes.ts`

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as ctrl from '../controllers/contact.controller';

const router = Router();

router.use(authenticate); // All contact routes require auth

router.get('/', ctrl.listContacts);
router.post('/', ctrl.createContact);
router.get('/:id', ctrl.getContact);
router.put('/:id', ctrl.updateContact);
router.delete('/:id', ctrl.deleteContact);
router.patch('/:id/archive', ctrl.archiveContact);
router.get('/:id/timeline', ctrl.getTimeline);

export default router;
```

---

## 4.5 Mount in `index.ts`

```typescript
import contactRoutes from './routes/contact.routes';
app.use('/api/v1/contacts', contactRoutes);
```

---

## Verification
1. Create a contact: `POST /api/v1/contacts` with auth header → 201
2. List contacts: `GET /api/v1/contacts` → 200 with pagination envelope
3. Search: `GET /api/v1/contacts?search=Alice` → returns matching contacts
4. Get by ID: `GET /api/v1/contacts/:id` → includes tags and customFields
5. Update: `PUT /api/v1/contacts/:id` → 200 with updated contact
6. Archive: `PATCH /api/v1/contacts/:id/archive` with `{"archived": true}` → 200
7. Delete: `DELETE /api/v1/contacts/:id` → 200
8. Timeline: `GET /api/v1/contacts/:id/timeline` → array of notes + reminders
9. Unauthorized (no token): → 401
