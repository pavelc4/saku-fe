<script lang="ts">
  import { onMount } from 'svelte';
  import { transactionService } from '$lib/features/transaction/services/transaction.service';
  import { formatRupiah } from '$lib/utils/currency';
  import type { TransactionSummary } from '$lib/features/transaction/types';

  let summary = $state<TransactionSummary | null>(null);
  let isLoading = $state(true);
  let isError = $state(false);

  onMount(async () => {
    const [data, error] = await transactionService.getSummary('month');
    if (error) {
      isError = true;
    } else {
      summary = data;
    }
    isLoading = false;
  });
</script>

<svelte:head>
  <title>Dashboard | SAKU</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-brand font-bold text-foreground">Dashboard</h1>
    <p class="text-muted-foreground mt-1 text-sm">Ringkasan keuangan Anda bulan ini</p>
  </div>

  {#if isLoading}
    <div class="grid gap-4 md:grid-cols-3">
      {#each Array(3) as _}
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm animate-pulse">
          <div class="h-4 w-24 bg-muted mb-4 rounded"></div>
          <div class="h-8 w-32 bg-muted rounded"></div>
        </div>
      {/each}
    </div>
  {:else if isError || !summary}
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
        <div class="text-2xl font-bold">{formatRupiah(summary.balance)}</div>
      </div>
      <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium text-muted-foreground">Pemasukan</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><line x1="12" x2="12" y1="19" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
        </div>
        <div class="text-2xl font-bold text-success">+{formatRupiah(summary.total_income)}</div>
      </div>
      <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium text-muted-foreground">Pengeluaran</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-destructive"><line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
        </div>
        <div class="text-2xl font-bold text-destructive">-{formatRupiah(summary.total_expense)}</div>
      </div>
    </div>
  {/if}

  <!-- Transaksi Terbaru (Placeholders for now, you can plug TransactionList here if needed) -->
  <div class="rounded-xl border border-border bg-card shadow-sm">
    <div class="p-6 pb-4 border-b border-border flex items-center justify-between">
      <h3 class="font-semibold text-lg">Insight Bulan Ini</h3>
      <a href="/insights" class="text-sm text-primary hover:underline font-medium">Lihat Detail</a>
    </div>
    <div class="p-6">
      <p class="text-muted-foreground text-sm">Lebih banyak laporan visual dan wawasan cerdas yang didukung AI dapat dilihat di halaman Insight.</p>
    </div>
  </div>
</div>
