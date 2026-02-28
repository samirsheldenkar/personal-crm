import { ErrorRequestHandler } from 'express';
import { randomUUID } from 'crypto';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';

function generateRequestId(): string {
  try {
    return randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();

  console.error('Request error', {
    requestId,
    timestamp,
    path: req.path,
    method: req.method,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Validation error', details: error.errors });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
};
