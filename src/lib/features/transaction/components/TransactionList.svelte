<script lang="ts">
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import { transactionService } from '../services/transaction.service';
  import { queryKeys } from '$lib/utils/query-keys';
  import TransactionCard from './TransactionCard.svelte';
  
  const query = createInfiniteQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: async ({ pageParam }) => {
      const [res, err] = await transactionService.list(pageParam as string | undefined);
      if (err) throw err;
      return res;
    },
    getNextPageParam: (lastPage) => lastPage?.next_cursor,
    initialPageParam: undefined,
  });
</script>

<div class="space-y-4">
  {#if $query.isPending}
    <div class="space-y-3">
      {#each Array(5) as _}
        <div class="h-20 w-full animate-pulse rounded-[var(--radius)] bg-muted"></div>
      {/each}
    </div>
  {:else if $query.isError}
    <div class="rounded-[var(--radius)] bg-destructive/10 p-4 text-destructive border border-destructive/20 text-center">
      <p>Gagal memuat transaksi. Silakan coba lagi.</p>
    </div>
  {:else if $query.data?.pages[0]?.transactions.length === 0}
    <div class="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-[var(--radius)] bg-card/50">
      <div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
      </div>
      <h3 class="font-medium text-foreground">Belum ada transaksi</h3>
      <p class="text-sm text-muted-foreground mt-1">Transaksi yang Anda buat akan muncul di sini.</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each $query.data?.pages ?? [] as page}
        {#each page.transactions as transaction (transaction.id)}
          <TransactionCard {transaction} />
        {/each}
      {/each}
      
      {#if $query.hasNextPage}
        <button 
          class="w-full py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-[var(--radius)] transition-colors border border-transparent hover:border-border"
          onclick={() => $query.fetchNextPage()}
          disabled={$query.isFetchingNextPage}
        >
          {#if $query.isFetchingNextPage}
            Memuat...
          {:else}
            Muat lebih banyak
          {/if}
        </button>
      {/if}
    </div>
  {/if}
</div>
