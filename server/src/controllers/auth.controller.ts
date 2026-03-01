import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema, refreshSchema } from '../types/auth';

export async function register(req: Request, res: Response) {
  const input = registerSchema.parse(req.body);
  const result = await authService.register(input);
  res.status(201).json({
    user: {
      id: result.user.id,
      email: result.user.email,
      displayName: result.user.display_name,
    },
    tokens: result.tokens,
  });
}

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);
  res.json({
    user: {
      id: result.user.id,
      email: result.user.email,
      displayName: result.user.display_name,
    },
    tokens: result.tokens,
  });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = refreshSchema.parse(req.body);
  const tokens = await authService.refreshToken(refreshToken);
  res.json({ tokens });
}
