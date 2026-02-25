import type { Result } from '$lib/utils/result';
import type { AuthResponse, LoginPayload, RegisterPayload, User, SessionData } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function login(payload: LoginPayload): Promise<Result<AuthResponse>> {
  try {
    const data = await api.post<AuthResponse>('/auth/login', payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function register(payload: RegisterPayload): Promise<Result<void>> {
  try {
    await api.post<void>('/auth/register', payload);
    return [undefined, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function logout(): Promise<Result<void>> {
  try {
    await api.post<void>('/auth/logout', {});
    return [undefined, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function getMe(): Promise<Result<User>> {
  try {
    const data = await api.get<SessionData>('/auth/me');
    const user: User = {
      id: data.user_id,
      email: data.email,
      name: data.email.split('@')[0], // Fallback since session doesn't contain name
      avatar_url: null,
      role: data.role,
      is_verified: true,
      created_at: data.created_at
    };
    return [user, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const authService = { login, register, logout, getMe };
