<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { setAuth } from '$lib/stores/auth.store';
	import { authService } from '$lib/features/auth/services/auth.service';
	import type { User } from '$lib/features/auth/types';

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const token = params.get('token');
		const userStr = params.get('user');

		if (token) {
			handleOAuthSuccess(token);
		} else {
			console.error('Missing token in URL', { token: !!token });
			goto('/login');
		}
	});

	async function handleOAuthSuccess(token: string) {
		try {
			// Set the token first so getMe can use it via API headers
			setAuth(token, { id: '', email: '', name: 'Loading', avatar_url: '', role: 'user', created_at: Date.now(), is_verified: true });
      
      // Add slight delay for KV propagation if needed
      await new Promise(r => setTimeout(r, 500));

			const [user, err] = await authService.getMe();
			if (err || !user) {
				throw new Error('Could not fetch user profile details');
			}

			setAuth(token, user);

			window.history.replaceState({}, document.title, window.location.pathname);

			goto('/dashboard');
		} catch (e) {
			console.error('Failed to complete OAuth login', e);
			goto('/login');
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-background px-4">
	<div class="w-full max-w-sm mx-auto text-center space-y-4">
		<div class="animate-pulse space-y-4">
			<div class="h-12 w-12 bg-muted rounded-full mx-auto"></div>
			<div class="h-4 w-32 bg-muted rounded mx-auto"></div>
			<div class="h-4 w-48 bg-muted rounded mx-auto"></div>
		</div>
		<p class="text-muted-foreground font-medium">Sedang masuk...</p>
	</div>
</div>
