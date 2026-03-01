## 2026-03-01

- Refactored all 8 controllers to remove inline `try/catch` and rely on middleware-level error formatting in `server/src/middleware/errorHandler.ts`.
- Kept each controller’s request parsing and service invocation logic unchanged; only local error handling branches and now-unused `AppError` imports were removed.
