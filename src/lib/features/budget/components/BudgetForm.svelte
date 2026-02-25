<script lang="ts">
  import { useQueryClient } from '@tanstack/svelte-query';
  import { budgetService } from '../services/budget.service';
  import { queryKeys } from '$lib/utils/query-keys';
  import type { Category } from '$lib/features/category/types';
  
  let { onClose, categories, initialData } = $props<{ 
    onClose: () => void;
    categories: Category[];
    initialData?: { id: string, category_id: string, amount: number };
  }>();
  
  const queryClient = useQueryClient();
  
  let category_id = $state(initialData?.category_id || (categories?.length > 0 ? categories[0].id : ''));
  let amount = $state(initialData?.amount?.toString() || '');
  
  let loading = $state(false);
  let errorMsg = $state('');
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!category_id || !amount) return;
    
    loading = true;
    errorMsg = '';
    
    const parsedAmount = parseInt(String(amount).replace(/[^0-9]/g, ''), 10) || 0;
    
    if (parsedAmount <= 0) {
      errorMsg = 'Anggaran harus lebih dari 0';
      loading = false;
      return;
    }
    
    let err = null;
    
    if (initialData?.id) {
      [, err] = await budgetService.update(initialData.id, {
        amount: parsedAmount
      });
    } else {
      [, err] = await budgetService.create({
        category_id,
        period: 'month',
        amount: parsedAmount
      });
    }
    
    if (err) {
      errorMsg = err.message;
      loading = false;
      return;
    }
    
    queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
    
    loading = false;
    onClose();
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  {#if errorMsg}
    <div class="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-[var(--radius)]" role="alert">
      {errorMsg}
    </div>
  {/if}

  <div class="space-y-2">
    <label for="category_id" class="text-sm font-medium text-foreground">Kategori</label>
    <select 
      id="category_id" 
      bind:value={category_id} 
      required
      disabled={loading || !!initialData}
      class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground disabled:opacity-50"
    >
      <option value="" disabled>Pilih kategori pengeluaran</option>
      {#each categories as cat}
        <option value={cat.id}>{cat.name}</option>
      {/each}
    </select>
  </div>

  <div class="space-y-2">
    <label for="amount" class="text-sm font-medium text-foreground">Batas Anggaran Bulanan (Rp)</label>
    <input 
      id="amount" 
      type="number" 
      bind:value={amount} 
      required
      disabled={loading}
      class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
      placeholder="0"
      min="0"
    />
  </div>

  <div class="flex gap-2 pt-2">
    <button 
      type="button" 
      onclick={onClose}
      disabled={loading}
      class="flex-1 py-2 px-4 bg-transparent border border-border text-foreground rounded-[var(--radius)] font-medium hover:bg-muted disabled:opacity-50 transition-colors"
    >
      Batal
    </button>
    <button 
      type="submit" 
      disabled={loading || !category_id || !amount}
      class="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-[var(--radius)] font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
    >
      {loading ? "Menyimpan..." : (initialData ? "Simpan Perubahan" : "Simpan Anggaran")}
    </button>
  </div>
</form>
