<script lang="ts">
  import { createQuery, useQueryClient } from '@tanstack/svelte-query';
  import { categoryService } from '../services/category.service';
  import { queryKeys } from '$lib/utils/query-keys';
  import CategoryCard from './CategoryCard.svelte';
  import type { Category } from '../types';
  
  let { onEdit, onDelete } = $props<{
    onEdit: (c: Category) => void;
    onDelete: (c: Category) => void;
  }>();
  
  const query = createQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const [res, err] = await categoryService.list();
      if (err) throw err;
      return res;
    },
  });
</script>

<div class="space-y-4">
  {#if $query.isPending}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each Array(6) as _}
        <div class="h-24 w-full animate-pulse rounded-[var(--radius)] bg-muted"></div>
      {/each}
    </div>
  {:else if $query.isError}
    <div class="rounded-[var(--radius)] bg-destructive/10 p-4 text-destructive border border-destructive/20 text-center">
      <p>Gagal memuat kategori. Silakan coba lagi.</p>
    </div>
  {:else if !$query.data || $query.data.length === 0}
    <div class="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-[var(--radius)] bg-card/50">
      <div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
      </div>
      <h3 class="font-medium text-foreground">Belum ada kategori</h3>
      <p class="text-sm text-muted-foreground mt-1">Buat kategori pertama Anda untuk mulai mencatat transaksi.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each $query.data as category (category.id)}
        <CategoryCard 
          {category} 
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category)}
        />
      {/each}
    </div>
  {/if}
</div>
