<script lang="ts">
  import { createQuery, useQueryClient } from '@tanstack/svelte-query';
  import { budgetService } from '../services/budget.service';
  import { categoryService } from '$lib/features/category/services/category.service';
  import { queryKeys } from '$lib/utils/query-keys';
  import BudgetCard from './BudgetCard.svelte';
  import type { Budget } from '../types';
  import type { Category } from '$lib/features/category/types';
  
  let { onEdit, onDelete } = $props<{
    onEdit: (b: Budget) => void;
    onDelete: (b: Budget) => void;
  }>();
  
  const budgetsQuery = createQuery(() => ({
    queryKey: queryKeys.budgets.all,
    queryFn: async () => {
      const [res, err] = await budgetService.list();
      if (err) throw err;
      return res;
    },
  }));

  const categoriesQuery = createQuery(() => ({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const [res, err] = await categoryService.list();
      if (err) throw err;
      return res;
    },
  }));

  const categoriesMap = $derived(
    (categoriesQuery.data || []).reduce((acc: Record<string, Category>, cat: Category) => {
      acc[cat.id] = cat;
      return acc;
    }, {})
  );
</script>

<div class="space-y-4">
  {#if budgetsQuery.isPending || categoriesQuery.isPending}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each Array(4) as _}
        <div class="h-32 w-full animate-pulse rounded-[var(--radius)] bg-muted"></div>
      {/each}
    </div>
  {:else if budgetsQuery.isError}
    <div class="rounded-[var(--radius)] bg-destructive/10 p-4 text-destructive border border-destructive/20 text-center">
      <p>Gagal memuat anggaran. Silakan coba lagi.</p>
    </div>
  {:else if !budgetsQuery.data || budgetsQuery.data.length === 0}
    <div class="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-[var(--radius)] bg-card/50">
      <div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <h3 class="font-medium text-foreground">Belum ada anggaran</h3>
      <p class="text-sm text-muted-foreground mt-1">Buat anggaran untuk mengontrol pengeluaran Anda agar tidak boros.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each budgetsQuery.data as budget (budget.id)}
        <BudgetCard 
          {budget} 
          category={categoriesMap[budget.category_id]}
          onEdit={() => onEdit(budget)}
          onDelete={() => onDelete(budget)}
        />
      {/each}
    </div>
  {/if}
</div>
