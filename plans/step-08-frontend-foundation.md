# Step 8: Frontend Foundation — Design System, Layout, Auth Pages

## Goal
Set up the React/Vite project with a premium design system, app shell (sidebar + top bar), routing, auth context, API client, and login/register pages.

**Prerequisites:** Backend Steps 1–7 completed (API running on port 3001).

---

## 8.1 Vite Project Init

If not already done in Step 1:
```bash
cd /Users/samir/personal-crm
npx -y create-vite@latest client -- --template react-ts
cd client
npm install react-router-dom d3 @types/d3
```

---

## 8.2 Design System — `client/src/index.css`

Create the global CSS design system. This is the most important file for visual quality.

```css
/* ── Google Font Import ── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* ── CSS Custom Properties ── */
:root {
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;

  /* Color Palette — Light Mode */
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-400: #818cf8;
  --color-primary-500: #6366f1;   /* main primary */
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;

  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  --color-bg: #ffffff;
  --color-bg-secondary: var(--color-gray-50);
  --color-bg-tertiary: var(--color-gray-100);
  --color-text: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-500);
  --color-text-tertiary: var(--color-gray-400);
  --color-border: var(--color-gray-200);
  --color-border-light: var(--color-gray-100);

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05);

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Spacing */
  --sidebar-width: 260px;
  --topbar-height: 64px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}

/* ── Dark Mode ── */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f1117;
    --color-bg-secondary: #1a1d2e;
    --color-bg-tertiary: #252840;
    --color-text: #f1f5f9;
    --color-text-secondary: #94a3b8;
    --color-text-tertiary: #64748b;
    --color-border: #2d3148;
    --color-border-light: #1e2235;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.3);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.3);
  }
}

/* ── Global Reset & Base ── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-family);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

a { color: var(--color-primary-500); text-decoration: none; }
a:hover { color: var(--color-primary-600); }

/* ── Utility Classes ── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  box-shadow: 0 2px 8px rgba(99,102,241,0.3);
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  box-shadow: 0 4px 12px rgba(99,102,241,0.4);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn-secondary:hover {
  background: var(--color-bg-tertiary);
}

.btn-danger {
  background: var(--color-danger);
  color: white;
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
}
.btn-ghost:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text);
}

.input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  background: var(--color-bg);
  color: var(--color-text);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* ── Animations ── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.animate-fade-in { animation: fadeIn var(--transition-slow) ease forwards; }
.animate-slide-in { animation: slideInLeft var(--transition-slow) ease forwards; }
```

---

## 8.3 API Client — `client/src/api/client.ts`

A thin fetch wrapper that handles auth tokens:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (!skipAuth) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401 && !skipAuth) {
    // Try to refresh token
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
      const retryResponse = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
      if (!retryResponse.ok) throw new ApiError(retryResponse.status, await retryResponse.json());
      return retryResponse.json();
    }
    // Refresh failed — clear tokens and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body);
  }

  return response.json();
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export class ApiError extends Error {
  constructor(public status: number, public body: any) {
    super(body?.error || 'API Error');
  }
}
```

### Domain-specific API modules

Create one file per resource inside `client/src/api/`:
- `auth.ts` — `registerUser(input)`, `loginUser(input)`, `refreshToken(token)`
- `contacts.ts` — `listContacts(params)`, `getContact(id)`, `createContact(data)`, `updateContact(id, data)`, `deleteContact(id)`, `archiveContact(id, archived)`, `getContactTimeline(id)`, `getContactGraph(id)`
- `relationships.ts` — `listRelationships(contactId)`, `createRelationship(data)`, `deleteRelationship(id)`
- `notes.ts` — `listNotes(contactId)`, `createNote(contactId, data)`, `updateNote(id, data)`, `deleteNote(id)`
- `tags.ts` — `listTags()`, `createTag(data)`, `updateTag(id, data)`, `deleteTag(id)`, `assignTags(contactId, tagIds)`, `removeTag(contactId, tagId)`
- `customFields.ts` — `listCustomFields()`, `createCustomField(data)`, `updateCustomField(id, data)`, `deleteCustomField(id)`
- `reminders.ts` — `listReminders()`, `createReminder(data)`, `updateReminder(id, data)`, `deleteReminder(id)`
- `search.ts` — `globalSearch(query)`

Each function simply calls `apiFetch` with the appropriate path and method.

---

## 8.4 Auth Context — `client/src/context/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../api/client';

interface User {
  id: string;
  email: string;
  displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a valid token on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Decode JWT payload to get user info (no verification needed client-side)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.userId, email: payload.email, displayName: null });
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    setUser(data.user);
  };

  const register = async (email: string, password: string, displayName?: string) => {
    const data = await apiFetch<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
      skipAuth: true,
    });
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
```

---

## 8.5 App Shell & Routing — `client/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ContactListPage from './pages/ContactListPage';
import ContactDetailPage from './pages/ContactDetailPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="contacts" element={<ContactListPage />} />
            <Route path="contacts/:id" element={<ContactDetailPage />} />
            <Route path="settings/*" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## 8.6 AppLayout Component — `client/src/components/AppLayout.tsx`

Layout structure:
- **Sidebar** (left, 260px wide, fixed on desktop, overlay on mobile)
  - Logo "Peoplebox" (or app name) at top
  - Global search input
  - Nav links: Dashboard, Contacts, Settings — styled with active indicators
  - User menu at bottom (display name, logout button)
- **Mobile top bar** (visible only below 768px): hamburger menu button + app name + search icon
- **Main content area**: `<Outlet />` from react-router

CSS for the layout (in a separate `AppLayout.css`):
- Sidebar: `position: fixed; left: 0; top: 0; width: var(--sidebar-width); height: 100vh; background: var(--color-bg-secondary); border-right: 1px solid var(--color-border-light);`
- Content: `margin-left: var(--sidebar-width); padding: 32px;`
- Mobile (`@media (max-width: 768px)`): Sidebar hidden by default, toggle via hamburger button with slide-in animation. Content: `margin-left: 0;`

---

## 8.7 Login & Register Pages

### `client/src/pages/LoginPage.tsx`

Full-page centered form with:
- App logo/name at top
- Email input, password input, "Sign in" button
- Link to Register page
- Gradient background: `linear-gradient(135deg, var(--color-primary-50), var(--color-bg))`
- Card container with glassmorphism effect: `backdrop-filter: blur(20px); background: rgba(255,255,255,0.8);`
- Form validation: email format, password min 8 chars (client-side before submit)
- On submit: call `auth.login()`, on success navigate to `/`, on error show inline error message
- Loading state on button while request in flight

### `client/src/pages/RegisterPage.tsx`

Same layout as Login with additional "Display name" field and "Create account" button.
Link to Login page.
On submit: call `auth.register()`, on success navigate to `/`.

CSS for both pages in `client/src/pages/AuthPages.css`.

---

## 8.8 Placeholder Pages

Create minimal placeholder components for pages implemented in later steps:
- `DashboardPage.tsx` — renders `<h1>Dashboard</h1>` with a "Coming in Step 9" note
- `ContactListPage.tsx` — renders `<h1>Contacts</h1>`
- `ContactDetailPage.tsx` — renders `<h1>Contact Detail</h1>`
- `SettingsPage.tsx` — renders `<h1>Settings</h1>`

These will be fully implemented in Steps 9 and 10.

---

## 8.9 Entry Point — `client/src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `client/index.html`

Update the Vite-generated HTML:
- Set `<title>Personal CRM</title>`
- Add meta description: `<meta name="description" content="Self-hostable personal CRM for managing your relationships">`
- Add favicon link
- Viewport meta already included by Vite

---

## Verification
1. `cd client && npm run dev` — Vite dev server starts on port 5173
2. Open `http://localhost:5173` — redirected to `/login` (no token)
3. Click "Create account" → register page renders
4. Register a new user → redirected to Dashboard
5. Refresh page → still logged in (token in localStorage)
6. Sidebar visible with nav links, responsive on mobile
7. CSS variables and design system render correctly (Inter font, indigo primary, smooth shadows)
