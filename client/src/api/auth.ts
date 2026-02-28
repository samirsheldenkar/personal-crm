import { apiClient } from './client';

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
  user: {
    id: string;
    email: string;
    displayName: string | null;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = {
  login: (input: LoginInput) => apiClient.post<AuthResponse>('/auth/login', input),
  register: (input: RegisterInput) => apiClient.post<AuthResponse>('/auth/register', input),
  refresh: (refreshToken: string) => apiClient.post<{ tokens: { accessToken: string; refreshToken: string } }>('/auth/refresh', { refreshToken }),
};
