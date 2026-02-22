<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { createQueryClient } from '$lib/services/query-client';
  import '../app.css';

  let { children } = $props();
  
  // Create a client for the entire app
  const queryClient = createQueryClient();
</script>

<QueryClientProvider client={queryClient}>
  {@render children()}
</QueryClientProvider>
