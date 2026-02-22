import { writable, derived } from 'svelte/store';
import type { User } from '$lib/features/auth/types';

const _token = writable<string | null>(null);
const _user = writable<User | null>(null);

export const token = { subscribe: _token.subscribe };
export const user = { subscribe: _user.subscribe };
export const isAuthenticated = derived(_token, ($t) => $t !== null);

export function setAuth(newToken: string, newUser: User): void {
  _token.set(newToken);
  _user.set(newUser);
  try {
    sessionStorage.setItem('saku_token', newToken);
    sessionStorage.setItem('saku_user', JSON.stringify(newUser));
  } catch (_) {}
}

export function clearAuth(): void {
  _token.set(null);
  _user.set(null);
  try {
    sessionStorage.removeItem('saku_token');
    sessionStorage.removeItem('saku_user');
  } catch (_) {}
}

export function hydrateAuthFromSession(): void {
  try {
    const t = sessionStorage.getItem('saku_token');
    const u = sessionStorage.getItem('saku_user');
    if (t && u) {
      _token.set(t);
      _user.set(JSON.parse(u) as User);
    }
  } catch (_) {}
}
