# Step 6: Notes, Tags, Reminders & Custom Fields APIs

## Goal
Implement the remaining four backend resource APIs: notes, tags (+ contact_tags), reminders, and custom field definitions.

**Prerequisites:** Steps 1–5 completed.

---

## 6.1 Notes

### Types — `server/src/types/note.ts`
```typescript
import { z } from 'zod';

export const createNoteSchema = z.object({
  body: z.string().min(1),
  format: z.enum(['markdown', 'plaintext']).default('markdown'),
  tags: z.array(z.string()).optional(), // free-form text tags on the note
});

export const updateNoteSchema = createNoteSchema.partial();
```

### Service — `server/src/services/note.service.ts`

| Method | Logic |
|--------|-------|
| `listByContact(userId, contactId)` | Verify contact ownership. `SELECT * FROM notes WHERE contact_id = ? AND user_id = ? ORDER BY created_at DESC`. Return array. |
| `create(userId, contactId, input)` | Verify contact ownership. Insert into `notes` with `contact_id`, `user_id`, `body`, `format`, `tags` (JSONB). Return new row. |
| `update(userId, noteId, input)` | Find note by `id` where `user_id = userId`. If not found → 404. Update fields + `updated_at = now()`. Return updated row. |
| `delete(userId, noteId)` | Find note by `id` where `user_id = userId`. If not found → 404. Delete. Return `{ deleted: true }`. |

### Controller — `server/src/controllers/note.controller.ts`
Standard pattern: extract userId, parse input, call service, return response.

### Routes — `server/src/routes/note.routes.ts`
```
GET    /contacts/:id/notes      → listNotesByContact
POST   /contacts/:id/notes      → createNote
PUT    /notes/:id               → updateNote
DELETE /notes/:id               → deleteNote
```

Mount note routes in `index.ts`:
- Contact-scoped: `app.use('/api/v1/contacts', noteRoutes)` (for `GET/POST /contacts/:id/notes`)
- Top-level: `app.use('/api/v1/notes', noteRoutes)` (for `PUT/DELETE /notes/:id`)

Alternatively, define two routers or use a single router with both path patterns.

---

## 6.2 Tags

### Types — `server/src/types/tag.ts`
```typescript
import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#6366f1'),
});

export const updateTagSchema = createTagSchema.partial();

export const assignTagsSchema = z.object({
  tagIds: z.array(z.string().uuid()).min(1),
});
```

### Service — `server/src/services/tag.service.ts`

| Method | Logic |
|--------|-------|
| `list(userId)` | `SELECT * FROM tags WHERE user_id = ? ORDER BY name ASC`. |
| `create(userId, input)` | Insert into `tags`. On unique constraint violation (same name for user) → 409. Return new tag. |
| `update(userId, tagId, input)` | Find by `id` + `user_id`. Update `name`/`color`. Return updated. |
| `delete(userId, tagId)` | Find by `id` + `user_id`. Delete (cascades `contact_tags`). Return `{ deleted: true }`. |
| `assignToContact(userId, contactId, tagIds)` | Verify contact ownership. Verify all tags belong to user. Insert into `contact_tags` (ignore duplicates with `ON CONFLICT DO NOTHING`). Return updated tag list for contact. |
| `removeFromContact(userId, contactId, tagId)` | Verify contact ownership. Delete from `contact_tags` where `contact_id = ? AND tag_id = ?`. Return `{ deleted: true }`. |

### Controller — `server/src/controllers/tag.controller.ts`
Standard pattern.

### Routes — `server/src/routes/tag.routes.ts`
```
GET    /tags              → listTags
POST   /tags              → createTag
PUT    /tags/:id          → updateTag
DELETE /tags/:id          → deleteTag
POST   /contacts/:id/tags      → assignTagsToContact
DELETE /contacts/:id/tags/:tagId → removeTagFromContact
```

Mount: `app.use('/api/v1', tagRoutes)` (since routes span both `/tags` and `/contacts` paths).

---

## 6.3 Custom Fields

### Types — `server/src/types/customField.ts`
```typescript
import { z } from 'zod';

export const fieldTypes = ['text', 'number', 'date', 'select', 'multi_select', 'url', 'boolean'] as const;

export const createCustomFieldSchema = z.object({
  name: z.string().min(1).max(255),
  fieldType: z.enum(fieldTypes),
  options: z.array(z.string()).optional(),       // for select/multi_select
  defaultValue: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateCustomFieldSchema = createCustomFieldSchema.partial();
```

### Service — `server/src/services/customField.service.ts`

| Method | Logic |
|--------|-------|
| `list(userId)` | `SELECT * FROM custom_field_definitions WHERE user_id = ? ORDER BY sort_order ASC, name ASC`. |
| `create(userId, input)` | Map camelCase to snake_case. Insert with `user_id`. On unique constraint (same name) → 409. Return new definition. |
| `update(userId, fieldId, input)` | Find by `id` + `user_id`. Update fields. Return updated. |
| `delete(userId, fieldId)` | Find by `id` + `user_id`. Delete (cascades `custom_field_values`). Return `{ deleted: true }`. |

### Controller — `server/src/controllers/customField.controller.ts`
Standard pattern.

### Routes — `server/src/routes/customField.routes.ts`
```
GET    /custom-fields        → listCustomFields
POST   /custom-fields        → createCustomField
PUT    /custom-fields/:id    → updateCustomField
DELETE /custom-fields/:id    → deleteCustomField
```

Mount: `app.use('/api/v1/custom-fields', customFieldRoutes)`

---

## 6.4 Reminders

### Types — `server/src/types/reminder.ts`
```typescript
import { z } from 'zod';

export const createReminderSchema = z.object({
  contactId: z.string().uuid(),
  type: z.enum(['keep_in_touch', 'one_time']).default('keep_in_touch'),
  intervalDays: z.number().int().positive().optional(),  // required for keep_in_touch
  dueDate: z.string().optional(),                         // ISO date
  note: z.string().optional(),
}).refine(
  (data) => {
    if (data.type === 'keep_in_touch') return !!data.intervalDays;
    if (data.type === 'one_time') return !!data.dueDate;
    return true;
  },
  { message: 'keep_in_touch requires intervalDays; one_time requires dueDate' }
);

export const updateReminderSchema = z.object({
  intervalDays: z.number().int().positive().optional(),
  dueDate: z.string().optional(),
  note: z.string().optional(),
  isCompleted: z.boolean().optional(),
});
```

### Service — `server/src/services/reminder.service.ts`

| Method | Logic |
|--------|-------|
| `list(userId)` | `SELECT r.*, c.first_name, c.last_name FROM reminders r JOIN contacts c ON c.id = r.contact_id WHERE r.user_id = ? AND r.is_completed = false ORDER BY r.due_date ASC NULLS LAST`. |
| `create(userId, input)` | Verify contact ownership. For `keep_in_touch`, calculate `due_date = NOW() + interval_days days`. Insert. Return new row. |
| `update(userId, reminderId, input)` | Find by `id` + `user_id`. Update fields. Return updated. |
| `delete(userId, reminderId)` | Find by `id` + `user_id`. Delete. Return `{ deleted: true }`. |

### Controller — `server/src/controllers/reminder.controller.ts`
Standard pattern.

### Routes — `server/src/routes/reminder.routes.ts`
```
GET    /reminders        → listReminders
POST   /reminders        → createReminder
PUT    /reminders/:id    → updateReminder
DELETE /reminders/:id    → deleteReminder
```

Mount: `app.use('/api/v1/reminders', reminderRoutes)`

---

## Verification
1. **Notes**: Create, list, update, delete a note on a contact → correct responses
2. **Tags**: Create tag, assign to contact, list tags on contact, remove tag → correct
3. **Custom Fields**: Create definition, see it on contact creation (via step 4), delete → correct
4. **Reminders**: Create keep_in_touch reminder → due_date automatically set; create one_time → due_date from input; list shows upcoming reminders sorted
