# Step 9: Frontend — Dashboard & Contact Pages

## Goal
Implement the Dashboard, Contact List, and Contact Detail pages with full CRUD flows, responsive design, and polished UI.

**Prerequisites:** Step 8 completed (app shell, auth, API client working).

---

## 9.1 Hooks

### `client/src/hooks/useDebounce.ts`
```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}
```

### `client/src/hooks/useContacts.ts`
Custom hook wrapping the contacts API:
- `contacts`, `total`, `isLoading`, `error` state
- `fetchContacts(params)` — calls `listContacts()` from api, updates state
- `refetch()` — re-calls with current params
- Auto-fetches on mount and when params change
- Returns `{ contacts, total, isLoading, error, refetch }`

### `client/src/hooks/useContact.ts`
Single-contact hook:
- `contact`, `isLoading`, `error` state
- Fetches on mount with `getContact(id)`, includes tags and custom fields
- Returns `{ contact, isLoading, error, refetch }`

---

## 9.2 Shared Components

Build these reusable components in `client/src/components/`:

### `Avatar.tsx`
- Props: `name: string`, `url?: string`, `size?: 'sm' | 'md' | 'lg'`
- If `url` provided, render `<img>` with `border-radius: 50%`
- If no URL, render initials (first letter of first + last name) in a colored circle
- Color derived from name hash (deterministic) — pick from a palette of 8 pleasant colors
- Sizes: sm=32px, md=40px, lg=64px

### `Badge.tsx`
- Props: `label: string`, `color: string`
- Renders a pill-shaped badge with the given background color and white or dark text (auto-contrast)

### `EmptyState.tsx`
- Props: `icon?: ReactNode`, `title: string`, `description: string`, `action?: ReactNode`
- Centered layout with muted icon, title, description, and optional action button

### `Modal.tsx`
- Props: `isOpen: boolean`, `onClose: () => void`, `title: string`, `children: ReactNode`
- Overlay with centered card, close button (X), click-outside to close
- Entrance animation: fade in + scale up
- Body scroll lock when open

### `SearchInput.tsx`
- Props: `value: string`, `onChange: (value: string) => void`, `placeholder?: string`
- Styled input with magnifying glass icon on the left
- Clear button (X) when value is non-empty

---

## 9.3 Dashboard Page — `client/src/pages/DashboardPage.tsx`

Layout: responsive grid with 2 columns on desktop, single column on mobile.

### Sections

**Welcome header:**
- "Good morning, {displayName}" (based on time of day)
- Subtitle: "{N} contacts in your network"

**Global search card:**
- Full-width search input at top
- On typing (debounced 300ms), call `globalSearch(q)`
- Show results dropdown with contact/note items, click navigates to contact detail

**Recent contacts card:**
- Title: "Recently Added"
- Show last 5 contacts (by `created_at DESC`)
- Each row: Avatar + name + company, clickable → `/contacts/:id`

**Upcoming birthdays card:**
- Title: "Upcoming Birthdays 🎂"
- Query contacts where `birthday` is within next 30 days (calculate from current month/day, ignore year)
- Show name + birthday date + days until
- If no upcoming birthdays, show "No upcoming birthdays" empty state

**Upcoming reminders card:**
- Title: "Reminders"
- Call `listReminders()` — show top 5 upcoming
- Each: contact name + reminder note + due date
- If none, show "All caught up! 🎉"

**Recent activity feed card:**
- Title: "Recent Activity"
- Show last 10 notes across all contacts (query `GET /contacts` then their notes, or add a backend endpoint)
- Each: avatar + "You added a note about {contact}" + time ago

CSS: Cards use the `.card` class from the design system. Grid gap 24px. Each card has a header with title and optional "View all" link.

---

## 9.4 Contact List Page — `client/src/pages/ContactListPage.tsx`

### Header
- Page title: "Contacts"
- "Add Contact" button (primary, opens modal)
- Shows total count: "(127 contacts)"

### Filter Bar
- Search input (debounced, calls API with `search` param)
- Tag filter: dropdown multi-select of user's tags (loads from `listTags()`)
- Sort dropdown: Name (A–Z), Name (Z–A), Recently Added, Last Contacted
- Archive toggle: "Show archived" checkbox

### Contact Grid
- **Card layout** by default (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each `ContactCard`:
  - Avatar (top left)
  - Name (bold), company/title below
  - Tag badges
  - Last contacted date
  - Click → navigate to `/contacts/:id`
  - Hover: subtle lift + shadow increase

### Pagination
- Bottom of list: page numbers or "Load more" button
- Show "Showing 1–20 of 127"

### Create Contact Modal
- Triggered by "Add Contact" button
- Form fields:
  - First name (required), Last name
  - Email (with + button to add multiple), Phone (with + button)
  - Company, Job title
  - Birthday (date picker)
  - Tags (multi-select from existing tags)
- "Save" button → calls `createContact()`, on success: close modal, refetch list
- Client-side validation: first name required, email format if provided

---

## 9.5 Contact Detail Page — `client/src/pages/ContactDetailPage.tsx`

Uses `useParams()` to get contact ID, fetches with `useContact(id)`.

### Contact Header
- Full-width header section with gradient background (subtle primary tint)
- Large avatar (64px), full name, job title @ company
- Primary email + primary phone (clickable: mailto, tel)
- Action buttons: "Edit", "Add Note", "Add Relationship", "Archive" / "Delete"
- Edit opens a modal with the same form as Create (pre-filled)

### Tab Navigation
Three tabs below the header:

#### Overview Tab
- **Details section**: two-column grid of contact fields
  - Birthday, all emails (with labels), all phones, addresses
  - Social links as clickable icons/links
- **Tags section**: list of tag badges, "+" button to add more
- **Custom Fields section**: shows all custom field values for this contact
  - Each field: label (from definition) + value
  - If no value set, show field name with "Not set" in muted text
  - Edit button per field opens inline edit

#### Notes & Timeline Tab
- Chronological list (newest first)
- Each note: timestamp, markdown body (rendered), optional tags
- Each reminder entry (interleaved): due date, note, status
- "Add Note" floating button at bottom
- Add Note form: textarea with markdown support (simple textarea, no WYSIWYG needed for v1), optional tags input
- On submit: `createNote(contactId, data)`, prepend to list

#### Relationships / Graph Tab
- Embedded relationship graph (D3 force-directed — built in Step 10)
- Below graph: list view of relationships:
  - Each: contact name + relationship type badge + arrow direction
  - Click contact name → navigate to their detail page
  - Delete button per relationship
- "Add Relationship" button:
  - Modal with:
    - Contact search input (typeahead search, picks from existing contacts)
    - Relationship type dropdown (all 17 enum values with human-readable labels)
    - Direction toggle: "Alice → Bob" / "Bob → Alice"
  - On submit: `createRelationship(data)`

### Quick Actions (mobile)
- Floating action button (FAB) in bottom-right on mobile
- Expands to: Add Note, Add Relationship, Set Reminder

---

## 9.6 CSS Files

Create per-page CSS files:
- `client/src/pages/DashboardPage.css`
- `client/src/pages/ContactListPage.css`
- `client/src/pages/ContactDetailPage.css`

Each imports from the design system variables. Use CSS Grid and Flexbox for layouts. All responsive breakpoints at `768px` (tablet) and `480px` (mobile).

---

## Verification
1. Dashboard: loads recent contacts, shows birthday section, search works
2. Contact list: displays cards, search filters results, tag filter works, sort works
3. Create contact: modal opens, fill form, save → contact appears in list
4. Contact detail: header shows contact info, tabs switch correctly
5. Overview tab: all fields display, custom fields show
6. Notes tab: can add a note, it appears in list with timestamp
7. Relationships tab: shows list of related contacts, can add new relationship
8. Mobile: stacked layout, FAB visible, sidebar collapses
