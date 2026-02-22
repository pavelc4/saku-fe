import type { Result } from '$lib/utils/result';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types';
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
    return [null, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function logout(): Promise<Result<void>> {
  try {
    await api.post<void>('/auth/logout', {});
    return [null, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function getMe(): Promise<Result<User>> {
  try {
    const data = await api.get<User>('/auth/me');
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const authService = { login, register, logout, getMe };
