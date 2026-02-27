import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/connection';
import { config } from '../config';
import { RegisterInput, LoginInput, JwtPayload, AuthTokens } from '../types/auth';
import { AppError } from '../utils/errors';

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: any; tokens: AuthTokens }> {
    const existingUser = await db('users').where('email', input.email).first();
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const [user] = await db('users')
      .insert({
        email: input.email,
        password_hash: passwordHash,
        display_name: input.displayName || null,
      })
      .returning(['id', 'email', 'display_name']);

    const tokens = this.generateTokens({ userId: user.id, email: user.email });
    return { user, tokens };
  }

  async login(input: LoginInput): Promise<{ user: any; tokens: AuthTokens }> {
    const user = await db('users').where('email', input.email).first();
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isValid = await bcrypt.compare(input.password, user.password_hash);
    if (!isValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const tokens = this.generateTokens({ userId: user.id, email: user.email });
    return {
      user: { id: user.id, email: user.email, display_name: user.display_name },
      tokens,
    };
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(token, config.jwt.secret) as JwtPayload & { type: string };
      if (payload.type !== 'refresh') {
        throw new AppError(401, 'Invalid token type');
      }
      return this.generateTokens({ userId: payload.userId, email: payload.email });
    } catch {
      throw new AppError(401, 'Invalid or expired token');
    }
  }

  generateTokens(payload: JwtPayload): AuthTokens {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });
    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' },
      config.jwt.secret,
      { expiresIn: config.jwt.refreshExpiresIn as any }
    );
    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
