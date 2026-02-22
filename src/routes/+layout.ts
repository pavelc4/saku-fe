import { hydrateAuthFromSession } from '$lib/stores/auth.store';

export const load = () => {
    if (typeof window === 'undefined') return;
    hydrateAuthFromSession();
};
