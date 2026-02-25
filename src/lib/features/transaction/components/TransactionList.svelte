<script lang="ts">
  import { useQueryClient, createInfiniteQuery } from '@tanstack/svelte-query';
  import { queryKeys } from '$lib/utils/query-keys';
  import { transactionService } from '../services/transaction.service';
  import TransactionCard from './TransactionCard.svelte';
  import { onMount } from 'svelte';

  const queryClient = useQueryClient();

  let observerRef = $state<HTMLElement | null>(null);

  const query = createInfiniteQuery(() => ({
    queryKey: queryKeys.transactions.all,
    queryFn: async ({ pageParam }) => {
      const [res, err] = await transactionService.list(pageParam as string | undefined, 20);
      if (err) throw err;
      return res;
    },
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_cursor : undefined,
    initialPageParam: undefined as string | undefined,
  }));

  // Simple intersection observer array for infinite scroll
  onMount(() => {
    if (!observerRef) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    }, { rootMargin: '100px' });

    observer.observe(observerRef);
    return () => observer.disconnect();
  });
</script>

<div class="space-y-4">
  {#if query.isPending}
    {#each Array(5) as _}
      <div class="h-20 w-full animate-pulse rounded-[var(--radius)] bg-muted"></div>
    {/each}
  {:else if query.isError}
    <div class="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-[var(--radius)] text-center">
      Gagal memuat transaksi.
    </div>
  {:else}
    {#each query.data.pages as page}
      {#each page.transactions as transaction (transaction.id)}
        <TransactionCard {transaction} />
      {/each}
    {/each}

    {#if query.data.pages[0].transactions.length === 0}
      <div class="py-12 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground flex flex-col items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
        <p>Belum ada transaksi.</p>
      </div>
    {/if}
  {/if}

  <!-- Intersection Observer Target -->
  <div bind:this={observerRef} class="h-4 w-full flex justify-center py-4">
    {#if query.isFetchingNextPage}
      <div class="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    {/if}
  </div>
</div>
