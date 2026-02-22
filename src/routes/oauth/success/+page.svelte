<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { setAuth } from '$lib/stores/auth.store';
  import type { User } from '$lib/features/auth/types';

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setAuth(token, user);
        
        // Remove token from URL immediately for security
        window.history.replaceState({}, document.title, window.location.pathname);
        
        goto('/dashboard');
      } catch (e) {
        console.error('Failed to parse user data from OAuth redirect', e);
        goto('/login');
      }
    } else {
      goto('/login');
    }
  });
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
