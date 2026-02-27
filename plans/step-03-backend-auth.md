# Step 3: Backend Authentication

## Goal
Implement JWT-based authentication: register, login, token refresh, and an auth middleware that protects all subsequent API routes.

**Prerequisites:** Steps 1–2 completed (server initialized, database schema migrated).

---

## 3.1 TypeScript Types

### `server/src/types/auth.ts`
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  displayName: z.string().max(255).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const refreshSchema = z.object({
  refreshToken: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
```

---

## 3.2 Auth Service

### `server/src/services/auth.service.ts`

Responsibilities:
- `register(input)`: Check if email exists → hash password with `bcryptjs` (rounds=10) → insert into `users` → generate tokens → return `{ user, tokens }`
- `login(input)`: Find user by email → compare password with `bcryptjs` → generate tokens → return `{ user, tokens }`
- `refreshToken(token)`: Verify the refresh token JWT → generate new access + refresh tokens → return `{ tokens }`
- `generateTokens(payload: JwtPayload)`: Create access token (expires in `config.jwt.expiresIn`) and refresh token (expires in `config.jwt.refreshExpiresIn`) using `jsonwebtoken.sign()`

Implementation details:
- Use `db` from `../db/connection` to query the `users` table
- Access token payload: `{ userId, email }`
- Refresh token payload: `{ userId, email, type: 'refresh' }`
- On register, if email already exists, throw an error with status 409
- On login, if credentials invalid, throw an error with status 401 (generic message: "Invalid email or password")
- Passwords must be hashed with `bcrypt.hash(password, 10)` and compared with `bcrypt.compare()`

---

## 3.3 Auth Middleware

### `server/src/middleware/auth.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JwtPayload } from '../types/auth';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

---

## 3.4 Auth Controller

### `server/src/controllers/auth.controller.ts`

Three handler functions:

**`register`**: Parse body with `registerSchema.parse(req.body)` → call `authService.register()` → return 201 with `{ user: { id, email, displayName }, tokens: { accessToken, refreshToken } }`

**`login`**: Parse body with `loginSchema.parse(req.body)` → call `authService.login()` → return 200 with same shape

**`refresh`**: Parse body with `refreshSchema.parse(req.body)` → call `authService.refreshToken()` → return 200 with `{ tokens }`

All handlers wrap errors:
- Zod validation errors → 400 with `{ error: 'Validation error', details: zodError.errors }`
- Known app errors (409, 401) → forward status code and message
- Unknown errors → 500 with `{ error: 'Internal server error' }`

---

## 3.5 Auth Routes

### `server/src/routes/auth.routes.ts`

```typescript
import { Router } from 'express';
import { register, login, refresh } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

export default router;
```

---

## 3.6 Mount in `index.ts`

Update `server/src/index.ts` to import and mount:
```typescript
import authRoutes from './routes/auth.routes';

// After middleware setup, before listen:
app.use('/api/v1/auth', authRoutes);
```

---

## 3.7 Error Helper (shared utility)

### `server/src/utils/errors.ts`

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

Use `AppError` in the auth service to throw typed errors:
- `throw new AppError(409, 'Email already registered')`
- `throw new AppError(401, 'Invalid email or password')`

---

## Verification
1. Start server: `cd server && npm run dev`
2. Register: `curl -X POST http://localhost:3001/api/v1/auth/register -H 'Content-Type: application/json' -d '{"email":"test@test.com","password":"password123"}'` → 201 with tokens
3. Login: `curl -X POST http://localhost:3001/api/v1/auth/login -H 'Content-Type: application/json' -d '{"email":"test@test.com","password":"password123"}'` → 200 with tokens
4. Refresh: `curl -X POST http://localhost:3001/api/v1/auth/refresh -H 'Content-Type: application/json' -d '{"refreshToken":"<token>"}'` → 200 with new tokens
5. Duplicate register: same email → 409
6. Wrong password: → 401
