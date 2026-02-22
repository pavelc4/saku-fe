import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { token, hydrateAuthFromSession } from '$lib/stores/auth.store';

export const load = () => {
  if (typeof window === 'undefined') return;
  hydrateAuthFromSession();
  if (get(token)) {
    throw redirect(302, '/dashboard');
  }
};
