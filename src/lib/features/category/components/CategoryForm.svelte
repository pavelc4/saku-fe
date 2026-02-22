<script lang="ts">
  import { useQueryClient } from '@tanstack/svelte-query';
  import { categoryService } from '../services/category.service';
  import { queryKeys } from '$lib/utils/query-keys';
  import type { CategoryType } from '$lib/types/common';
  
  let { onClose, initialData } = $props<{ 
    onClose: () => void;
    initialData?: { id: string, name: string, type: CategoryType, icon?: string, color?: string };
  }>();
  
  const queryClient = useQueryClient();
  
  let name = $state(initialData?.name || '');
  let type = $state<CategoryType>(initialData?.type || 'expense');
  let icon = $state(initialData?.icon || '🛒');
  let color = $state(initialData?.color || '#ef4444');
  
  let loading = $state(false);
  let errorMsg = $state('');
  
  const emojis = ['🛒', '🍽️', '🚗', '🏠', '🎮', '💡', '📱', '💊', '✈️', '💰', '💼', '🎁'];
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'];

  // Sync default colors when type changes if user hasn't selected a specific one
  $effect(() => {
    if (!initialData) {
      if (type === 'income' && color === '#ef4444') color = '#22c55e';
      if (type === 'expense' && color === '#22c55e') color = '#ef4444';
    }
  });
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!name.trim()) return;
    
    loading = true;
    errorMsg = '';
    
    let err = null;
    
    if (initialData?.id) {
      [_, err] = await categoryService.update(initialData.id, {
        name,
        type,
        icon,
        color
      });
    } else {
      [_, err] = await categoryService.create({
        name,
        type,
        icon,
        color
      });
    }
    
    if (err) {
      errorMsg = err.message;
      loading = false;
      return;
    }
    
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    
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

  <div class="grid grid-cols-2 gap-2 p-1 bg-muted rounded-[var(--radius)]">
    <button 
      type="button" 
      class="py-2 text-sm font-medium rounded-md transition-colors {type === 'expense' ? 'bg-background text-destructive shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
      onclick={() => type = 'expense'}
    >
      Pengeluaran
    </button>
    <button 
      type="button" 
      class="py-2 text-sm font-medium rounded-md transition-colors {type === 'income' ? 'bg-background text-success shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
      onclick={() => type = 'income'}
    >
      Pemasukan
    </button>
  </div>

  <div class="space-y-2">
    <label for="name" class="text-sm font-medium text-foreground">Nama Kategori</label>
    <input 
      id="name" 
      type="text" 
      bind:value={name} 
      required
      disabled={loading}
      class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
      placeholder="Makan Siang..."
    />
  </div>

  <div class="space-y-2">
    <label class="text-sm font-medium text-foreground">Ikon (Emoji)</label>
    <div class="grid grid-cols-6 sm:grid-cols-8 gap-2">
      {#each emojis as e}
        <button
          type="button"
          class="aspect-square flex items-center justify-center text-xl rounded-md transition-all {icon === e ? 'bg-primary/20 border-2 border-primary bg-muted' : 'bg-muted border border-transparent hover:bg-muted/80'}"
          onclick={() => icon = e}
        >
          {e}
        </button>
      {/each}
    </div>
  </div>

  <div class="space-y-2">
    <label class="text-sm font-medium text-foreground">Warna</label>
    <div class="flex flex-wrap gap-3">
      {#each colors as c}
        <button
          type="button"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-transform {color === c ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:scale-105'}"
          style="background-color: {c}"
          onclick={() => color = c}
        >
          {#if color === c}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {/if}
        </button>
      {/each}
    </div>
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
      disabled={loading || !name.trim()}
      class="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-[var(--radius)] font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
    >
      {loading ? "Menyimpan..." : (initialData ? "Simpan Perubahan" : "Simpan Kategori")}
    </button>
  </div>
</form>
