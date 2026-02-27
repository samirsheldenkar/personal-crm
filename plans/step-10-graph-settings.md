# Step 10: Relationship Graph Visualization & Settings Pages

## Goal
Build the interactive D3.js force-directed relationship graph component and the Settings screens for managing tags and custom field definitions.

**Prerequisites:** Steps 8–9 completed (frontend pages and API client working).

---

## 10.1 Relationship Graph Component — `client/src/components/RelationshipGraph.tsx`

### Props
```typescript
interface RelationshipGraphProps {
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
    centerId: string;
  };
  onNodeClick: (contactId: string) => void;
  width?: number;
  height?: number;
}
```

### Implementation Details

Use D3.js `forceSimulation` with:
- `forceLink` — edges as links, distance based on relationship type
- `forceManyBody` — charge repulsion (strength: -300)
- `forceCenter` — center the simulation in the SVG
- `forceCollide` — prevent node overlap (radius 40)

**Node rendering (SVG):**
- Circle with radius 24px for center node, 18px for others
- Fill color determined by the contact's first tag color; if no tags, use the primary color `#6366f1`
- Center node has a thicker border (3px solid white) and a subtle glow (filter: drop-shadow)
- Contact initials text inside the circle (font-size 11px, white, bold)
- Name label below the circle (font-size 12px, truncated to 15 chars)
- On hover: circle scales to 1.15x, cursor pointer, tooltip with full name + company

**Edge rendering (SVG):**
- Line connecting nodes, color `var(--color-gray-300)`, stroke-width 1.5px
- Relationship type label at midpoint of the line (font-size 10px, muted color, background pill)
- For directed relationships, add a small arrowhead marker

**Interactions:**
- **Click node** → call `onNodeClick(contactId)` (navigates to that contact's detail page)
- **Zoom + pan** → use `d3.zoom()` with scale extent [0.3, 3]
- **Drag nodes** → use `d3.drag()` to reposition nodes, simulation re-heats on drag

**Responsive:**
- Component accepts `width` and `height` props, or defaults to container size
- Use `ResizeObserver` to track container size changes and update SVG dimensions
- On mobile (width < 480), increase node sizes slightly for easier tapping (radius +4px)

### CSS — `client/src/components/RelationshipGraph.css`
```css
.graph-container {
  width: 100%;
  height: 400px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-secondary);
}

.graph-container svg {
  width: 100%;
  height: 100%;
}

.graph-node-label {
  font-family: var(--font-family);
  font-size: 11px;
  fill: var(--color-text-secondary);
  text-anchor: middle;
  pointer-events: none;
}

.graph-edge-label {
  font-family: var(--font-family);
  font-size: 9px;
  fill: var(--color-text-tertiary);
  text-anchor: middle;
}

.graph-tooltip {
  position: absolute;
  padding: 8px 12px;
  background: var(--color-gray-800);
  color: white;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-fast);
  z-index: 10;
}
```

### Integration in Contact Detail Page

In the **Graph Tab** of `ContactDetailPage`:
1. Fetch graph data: `const { data } = useQuery(() => getContactGraph(contactId))`
2. Render: `<RelationshipGraph graph={data} onNodeClick={(id) => navigate(`/contacts/${id}`)} />`
3. Below the graph, show a text list of relationships for accessibility and quick scanning

---

## 10.2 Settings Page — `client/src/pages/SettingsPage.tsx`

### Layout
- Nested routing within `/settings/*`:
  - `/settings` → redirects to `/settings/tags`
  - `/settings/tags` → TagsManager
  - `/settings/fields` → FieldsManager
- Left sidebar (or top tabs on mobile) for navigation between settings sections
- Main content area for the active section

### Settings Shell
```typescript
import { Outlet, NavLink } from 'react-router-dom';

export default function SettingsPage() {
  return (
    <div className="settings-layout">
      <nav className="settings-nav">
        <NavLink to="/settings/tags">Tags</NavLink>
        <NavLink to="/settings/fields">Custom Fields</NavLink>
      </nav>
      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  );
}
```

---

## 10.3 Tags Manager — `client/src/pages/settings/TagsManager.tsx`

### Layout
- Title: "Tags"
- "Create Tag" button at top right
- List of existing tags as cards/rows:
  - Color swatch (circle) + tag name + count of contacts with this tag
  - Edit button (pencil icon) → inline edit or modal
  - Delete button (trash icon) → confirmation dialog

### Create / Edit Tag Modal
- Fields:
  - Name (text input, required, max 100 chars)
  - Color (color picker — a grid of 12 preset colors + custom hex input)
- "Save" button → calls `createTag()` or `updateTag()`
- On success: close modal, refetch tag list

### Delete Confirmation
- "Are you sure? This will remove the tag from all contacts."
- "Delete" (danger button) / "Cancel"
- On confirm: `deleteTag(id)`, refetch

---

## 10.4 Custom Fields Manager — `client/src/pages/settings/FieldsManager.tsx`

### Layout
- Title: "Custom Fields"
- Subtitle: "Define custom fields that appear on all contact profiles"
- "Add Field" button at top right
- Sortable list of existing fields:
  - Field name + type badge (e.g. "Text", "Select", "Date") + sort handle
  - Edit button → modal
  - Delete button → confirmation

### Create / Edit Field Modal
- Fields:
  - Name (text input, required)
  - Type (dropdown: Text, Number, Date, Select, Multi-select, URL, Boolean)
  - Options (visible only when type = Select or Multi-select):
    - List of option values with "Add option" button
    - Each option has a text input + remove button
  - Default value (optional, type-appropriate input)
- "Save" → `createCustomField()` or `updateCustomField()`

### Delete Confirmation
- "Deleting this field will remove all stored values for it across all contacts."
- Danger confirmation

---

## 10.5 CSS for Settings

`client/src/pages/SettingsPage.css`

```css
.settings-layout {
  display: flex;
  gap: 32px;
}

.settings-nav {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-nav a {
  padding: 10px 16px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.settings-nav a:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text);
}

.settings-nav a.active {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
  font-weight: 600;
}

.settings-content {
  flex: 1;
  min-width: 0;
}

/* Mobile: tabs on top */
@media (max-width: 768px) {
  .settings-layout {
    flex-direction: column;
    gap: 16px;
  }
  .settings-nav {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }
}
```

---

## Verification
1. **Graph**: Navigate to a contact with relationships → graph renders with center node highlighted
2. Zoom in/out with scroll wheel, pan by dragging background
3. Click a neighbor node → navigates to that contact's detail page
4. **Tags Manager**: Create a new tag with a custom color → appears in list
5. Edit a tag name → updates across contacts
6. Delete a tag → confirmation shown, tag removed
7. **Fields Manager**: Create a "Met at" text field → appears in the contact detail overview tab
8. Create a "Dietary preferences" select field with options → options render in a dropdown on the contact
9. Delete a field → all associated values removed
10. Mobile: settings nav collapses to horizontal tabs
