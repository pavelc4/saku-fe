<script lang="ts">
  import { useQueryClient, createQuery } from '@tanstack/svelte-query';
  import { insightService } from '$lib/features/insights/services/insight.service';
  import { queryKeys } from '$lib/utils/query-keys';
  import { formatRupiah } from '$lib/utils/currency';
  import type { InsightPeriod } from '$lib/features/insights/types';

  let currentPeriod = $state<InsightPeriod>('month');

  const query = createQuery(() => ({
    queryKey: queryKeys.insights.period('summary', currentPeriod, 'id'),
    queryFn: async () => {
      const [res, err] = await insightService.getMonthlyInsight(); // TODO: adjust method to use currentPeriod when available in service
      if (err) throw err;
      return res;
    },
  }));

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

  {#if query.isPending}
    <div class="h-64 w-full animate-pulse rounded-[var(--radius)] bg-muted mt-6"></div>
  {:else if query.isError}
    <div class="rounded-[var(--radius)] bg-destructive/10 p-4 text-destructive border border-destructive/20 text-center">
      <p>Gagal memuat data insight. Pastikan backend sudah merespon endpoint ini.</p>
    </div>
  {:else if query.data}
    <!-- AI Recommendation -->
    {#if query.data.insight}
      <div class="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
          <h3 class="font-semibold text-lg text-primary">Rekomendasi AI</h3>
        </div>
        <p class="text-foreground leading-relaxed whitespace-pre-wrap">{query.data.insight}</p>
      </div>
    {:else}
      <div class="rounded-xl border border-border bg-card p-6 shadow-sm text-center text-muted-foreground">
        Belum ada insight AI bulan ini.
      </div>
    {/if}
  {/if}
</div>
