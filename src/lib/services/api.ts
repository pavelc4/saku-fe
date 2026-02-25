import { env } from '$env/dynamic/public';
import { goto } from '$app/navigation';
import { clearAuth } from '$lib/stores/auth.store';
import { toAppError } from '$lib/utils/error';
import type { AppError } from '$lib/utils/error';

const BASE_URL = env.PUBLIC_API_URL;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem('saku_token');
  } catch {
    return null;
  }
}

function buildHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers({ 'Content-Type': 'application/json', ...extra });
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      clearAuth();
      goto('/login');
    }
    throw { message: 'Sesi habis. Silakan login kembali.', status: 401 } satisfies AppError;
  }

  const text = await res.text();
  let json: any;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch (e) {
      if (!res.ok) {
        throw { message: text || 'Terjadi kesalahan server.', status: res.status } satisfies AppError;
      }
      return text as unknown as T;
    }
  } else {
    json = {};
  }

  if (!res.ok || json?.success === false) {
    throw {
      message: json?.message ?? (typeof json === 'string' ? json : 'Terjadi kesalahan server.'),
      code: json?.error,
      status: res.status,
    } satisfies AppError;
  }

  // If the backend wraps the response in a "data" property, unwrap it
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }

  // Otherwise return the JSON directly (for cases where it's an array or a flat object)
  return json as unknown as T;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  return handleResponse<T>(res);
}

async function uploadFile<T>(path: string, formData: FormData, signal?: AbortSignal): Promise<T> {
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
    signal,
  });

  return handleResponse<T>(res);
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>('GET', path, undefined, signal),
  post: <T>(path: string, body: unknown, signal?: AbortSignal) => request<T>('POST', path, body, signal),
  put: <T>(path: string, body: unknown, signal?: AbortSignal) => request<T>('PUT', path, body, signal),
  patch: <T>(path: string, body: unknown, signal?: AbortSignal) => request<T>('PATCH', path, body, signal),
  delete: <T>(path: string, signal?: AbortSignal) => request<T>('DELETE', path, undefined, signal),
  upload: <T>(path: string, formData: FormData, signal?: AbortSignal) => uploadFile<T>(path, formData, signal),
  baseUrl: BASE_URL,
};
