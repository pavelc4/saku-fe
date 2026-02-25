<script lang="ts">
  import { useQueryClient, createQuery } from '@tanstack/svelte-query';
  import { insightService } from '$lib/features/insights/services/insight.service';
  import { queryKeys } from '$lib/utils/query-keys';
  import { formatRupiah } from '$lib/utils/currency';
  import type { InsightPeriod } from '$lib/features/insights/types';

  let currentPeriod = $state<InsightPeriod>('month');

  const query = createQuery({
    queryKey: queryKeys.insights.period('summary', currentPeriod, 'id'),
    queryFn: async () => {
      const [res, err] = await insightService.getInsights(currentPeriod);
      if (err) throw err;
      return res;
    },
  });

</script>

<svelte:head>
  <title>Insights | SAKU</title>
</svelte:head>

<div class="space-y-6 max-w-5xl mx-auto">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-3xl font-brand font-bold text-foreground">Insights</h1>
      <p class="text-muted-foreground mt-1 text-sm">Analisis dan rekomendasi keuangan cerdas</p>
    </div>
    
    <div class="bg-muted p-1 rounded-lg inline-flex">
      <button 
        class="px-4 py-1.5 text-sm font-medium rounded-md transition-colors {currentPeriod === 'week' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}"
        onclick={() => currentPeriod = 'week'}
      >Minggu</button>
      <button 
        class="px-4 py-1.5 text-sm font-medium rounded-md transition-colors {currentPeriod === 'month' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}"
        onclick={() => currentPeriod = 'month'}
      >Bulan</button>
      <button 
        class="px-4 py-1.5 text-sm font-medium rounded-md transition-colors {currentPeriod === 'year' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}"
        onclick={() => currentPeriod = 'year'}
      >Tahun</button>
    </div>
  </div>

  {#if $query.isPending}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {#each Array(4) as _}
        <div class="h-24 w-full animate-pulse rounded-[var(--radius)] bg-muted"></div>
      {/each}
    </div>
    <div class="h-64 w-full animate-pulse rounded-[var(--radius)] bg-muted mt-6"></div>
  {:else if $query.isError}
    <div class="rounded-[var(--radius)] bg-destructive/10 p-4 text-destructive border border-destructive/20 text-center">
      <p>Gagal memuat data insight. Pastikan backend sudah merespon endpoint ini.</p>
    </div>
  {:else if $query.data}
    <!-- Key Metrics -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 class="text-sm font-medium text-muted-foreground pb-2">Total Pemasukan</h3>
        <div class="text-2xl font-bold text-success">{formatRupiah($query.data.total_income)}</div>
      </div>
      <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 class="text-sm font-medium text-muted-foreground pb-2">Total Pengeluaran</h3>
        <div class="text-2xl font-bold text-destructive">{formatRupiah($query.data.total_expense)}</div>
      </div>
      <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 class="text-sm font-medium text-muted-foreground pb-2">Tabungan Bersih</h3>
        <div class="text-2xl font-bold text-foreground">{formatRupiah($query.data.net_savings)}</div>
      </div>
      <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 class="text-sm font-medium text-muted-foreground pb-2">Tingkat Tabungan</h3>
        <div class="text-2xl font-bold text-primary">{$query.data.savings_rate}%</div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      <!-- AI Recommendation -->
      {#if $query.data.ai_recommendation}
        <div class="md:col-span-3 rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
          <div class="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            <h3 class="font-semibold text-lg text-primary">Rekomendasi AI</h3>
          </div>
          <p class="text-sm text-foreground leading-relaxed">{$query.data.ai_recommendation}</p>
        </div>
      {/if}

      <!-- Top Expenses Breakdown -->
      <div class="md:col-span-1 rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
        <h3 class="font-semibold text-lg mb-4">Pengeluaran Terbesar</h3>
        {#if $query.data.top_expenses.length === 0}
          <div class="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Belum ada data pengeluaran
          </div>
        {:else}
          <div class="space-y-4 flex-1">
            {#each $query.data.top_expenses as expense}
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium">{expense.category_name}</span>
                  <span class="text-muted-foreground">{formatRupiah(expense.amount)}</span>
                </div>
                <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div class="h-full rounded-full" style="width: {expense.percentage}%; background-color: {expense.color}"></div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Trend Chart Placeholder -->
      <div class="md:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col min-h-[300px]">
        <h3 class="font-semibold text-lg mb-4">Tren Transaksi</h3>
        {#if $query.data.trend.length === 0}
          <div class="flex-1 flex border-2 border-dashed border-border rounded-lg items-center justify-center text-muted-foreground text-sm">
            Belum ada data tren
          </div>
        {:else}
          <div class="flex-1 flex border-2 border-dashed border-border rounded-lg items-center justify-center text-muted-foreground text-sm flex-col gap-2 p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            <p>Visualisasi grafik akan ditampilkan di sini.</p>
            <p class="text-xs">Frontend menerima { $query.data.trend.length } titik data tren.</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
