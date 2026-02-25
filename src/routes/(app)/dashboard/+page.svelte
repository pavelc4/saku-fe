<script lang="ts">
  import { onMount } from 'svelte';
  import { createQuery } from '@tanstack/svelte-query';
  import { queryKeys } from '$lib/utils/query-keys';
  import { transactionService } from '$lib/features/transaction/services/transaction.service';
  import { insightService } from '$lib/features/insights/services/insight.service';
  import { formatRupiah } from '$lib/utils/currency';
  import type { TransactionSummary, Transaction } from '$lib/features/transaction/types';
  import type { InsightResponse } from '$lib/features/insights/types';
  import TransactionCard from '$lib/features/transaction/components/TransactionCard.svelte';

  // Fetch summary
  const summaryQuery = createQuery<TransactionSummary>(() => ({
    queryKey: queryKeys.transactions.summary('month'),
    queryFn: async () => {
      const [res, err] = await transactionService.getSummary('month');
      if (err) throw err;
      return res;
    }
  }));

  // Fetch recent transactions
  const recentTransactionsQuery = createQuery<Transaction[]>(() => ({
    queryKey: [...queryKeys.transactions.all, 'recent', 5],
    queryFn: async () => {
      const [res, err] = await transactionService.list(undefined, 5);
      if (err) throw err;
      return res.transactions;
    },
  }));

  // Fetch AI Insight
  const insightQuery = createQuery<InsightResponse>(() => ({
    queryKey: queryKeys.insights.period('summary', 'month', 'id'),
    queryFn: async () => {
      const [res, err] = await insightService.getMonthlyInsight();
      if (err) throw err;
      return res;
    },
    staleTime: 60 * 60 * 1000 // Cache for 1 hour
  }));
</script>

<svelte:head>
  <title>Dashboard | SAKU</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-brand font-bold text-foreground">Dashboard</h1>
    <p class="text-muted-foreground mt-1 text-sm">Ringkasan keuangan Anda bulan ini</p>
  </div>

  {#if summaryQuery.isPending}
    <div class="grid gap-4 md:grid-cols-3">
      {#each Array(3) as _}
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm animate-pulse">
          <div class="h-4 w-24 bg-muted mb-4 rounded"></div>
          <div class="h-8 w-32 bg-muted rounded"></div>
        </div>
      {/each}
    </div>
  {:else if summaryQuery.isError || !summaryQuery.data}
    <div class="rounded-[var(--radius)] bg-destructive/10 p-4 text-destructive border border-destructive/20 text-center">
      <p>Gagal memuat ringkasan. Silakan coba lagi.</p>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium text-muted-foreground">Saldo Saat Ini</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
        </div>
        <div class="text-2xl font-bold">{formatRupiah(summaryQuery.data.net)}</div>
      </div>
      <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium text-muted-foreground">Pemasukan</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><line x1="12" x2="12" y1="19" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
        </div>
        <div class="text-2xl font-bold text-success">+{formatRupiah(summaryQuery.data.total_income)}</div>
      </div>
      <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium text-muted-foreground">Pengeluaran</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-destructive"><line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
        </div>
        <div class="text-2xl font-bold text-destructive">-{formatRupiah(summaryQuery.data.total_expense)}</div>
      </div>
    </div>
  {/if}

  <div class="grid gap-6 md:grid-cols-2">
    <!-- Transaksi Terbaru -->
    <div class="rounded-xl border border-border bg-card shadow-sm flex flex-col">
      <div class="p-6 pb-4 border-b border-border flex items-center justify-between">
        <h3 class="font-semibold text-lg">Transaksi Terbaru</h3>
        <a href="/transactions" class="text-sm text-primary hover:underline font-medium">Lihat Semua</a>
      </div>
      <div class="p-6 flex-1 flex flex-col gap-3">
        {#if recentTransactionsQuery.isPending}
          <div class="space-y-3">
            {#each Array(5) as _}
              <div class="h-16 w-full animate-pulse rounded-[var(--radius)] bg-muted"></div>
            {/each}
          </div>
        {:else if recentTransactionsQuery.isError}
          <p class="text-sm text-destructive">Gagal memuat transaksi terbaru.</p>
        {:else if recentTransactionsQuery.data && recentTransactionsQuery.data.length > 0}
          <div class="space-y-3">
            {#each recentTransactionsQuery.data as transaction (transaction.id)}
              <TransactionCard {transaction} />
            {/each}
          </div>
        {:else}
          <div class="flex-1 flex flex-col items-center justify-center text-center py-6 border border-dashed border-border rounded-[var(--radius)]">
            <p class="text-sm text-muted-foreground">Belum ada transaksi</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Insight Card -->
    <div class="rounded-xl border border-primary/20 bg-primary/5 shadow-sm h-fit">
      <div class="p-6 pb-4 border-b border-primary/10 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
        <h3 class="font-semibold text-lg text-primary">Saran Finansial SAKU AI</h3>
      </div>
      <div class="p-6">
        {#if insightQuery.isPending}
          <div class="space-y-3">
            <div class="h-4 w-full animate-pulse rounded bg-muted"></div>
            <div class="h-4 w-5/6 animate-pulse rounded bg-muted"></div>
            <div class="h-4 w-4/6 animate-pulse rounded bg-muted"></div>
            <div class="h-4 w-full animate-pulse rounded bg-muted"></div>
            <div class="h-4 w-2/3 animate-pulse rounded bg-muted"></div>
          </div>
        {:else if insightQuery.isError}
          <p class="text-sm text-destructive">Gagal memuat insight AI.</p>
        {:else if insightQuery.data}
          <p class="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{insightQuery.data.insight}</p>
        {/if}
      </div>
    </div>
  </div>
</div>
