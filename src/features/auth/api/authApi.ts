import type { AuthResponse, LoginPayload, RegisterPayload } from '../model/types';

export class AuthApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
  }
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || 'Login failed';
    throw new AuthApiError(message, res.status);
  }

  return data as AuthResponse;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || 'Registration failed';
    throw new AuthApiError(message, res.status);
  }

  return data as AuthResponse;
}

export async function refreshTokenApi(refreshToken: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || 'Failed to refresh token';
    throw new AuthApiError(message, res.status);
  }

  return data as AuthResponse;
}

export async function revokeTokenApi(refreshToken: string): Promise<{ message: string; revoked: boolean }> {
  const res = await fetch('/api/auth/revoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || 'Failed to revoke token';
    throw new AuthApiError(message, res.status);
  }

  return data as { message: string; revoked: boolean };
}

export async function logoutApi(refreshToken: string): Promise<{ message: string; revoked: boolean }> {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || 'Failed to log out';
    throw new AuthApiError(message, res.status);
  }

  return data as { message: string; revoked: boolean };
}

export async function fetchCurrentUserApi(accessToken: string): Promise<AuthResponse['user']> {
  const res = await fetch('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || 'Failed to fetch current user';
    throw new AuthApiError(message, res.status);
  }

  return data;
}
