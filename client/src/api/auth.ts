import { apiClient } from './client';
import type { AuthTokens, User } from '../types';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authApi = {
  login: (input: LoginInput) => apiClient.post<AuthResponse>('/auth/login', input),
  register: (input: RegisterInput) => apiClient.post<AuthResponse>('/auth/register', input),
  refresh: (refreshToken: string) => apiClient.post<{ tokens: AuthTokens }>('/auth/refresh', { refreshToken }),
};
