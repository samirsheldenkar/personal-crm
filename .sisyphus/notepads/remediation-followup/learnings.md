## 2026-03-01

- Removing controller-level `try/catch` blocks while keeping Zod `.parse(...)` calls intact allows validation errors to preserve existing response shape via centralized `errorHandler` (`{ error: 'Validation error', details: ... }`).
- Eliminating duplicated `AppError`/generic 500 branches in controllers significantly reduces boilerplate and keeps response formatting unified in middleware.

- Added requestId to request logging middleware for error correlation. Used same UUID generation pattern as errorHandler (randomUUID with fallback). Attached requestId to req object for potential reuse. Log format: `METHOD PATH STATUS DURATION [requestId]`.
