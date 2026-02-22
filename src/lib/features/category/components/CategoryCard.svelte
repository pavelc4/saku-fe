<script lang="ts">
  import type { Category } from '../types';
  
  let { category, onEdit, onDelete } = $props<{
    category: Category;
    onEdit?: (c: Category) => void;
    onDelete?: (c: Category) => void;
  }>();

  const isIncome = $derived(category.type === 'income');
</script>

<div class="flex items-center justify-between p-4 bg-card rounded-[var(--radius)] border border-border hover:bg-muted/50 transition-colors">
  <div class="flex items-center gap-4">
    <div 
      class="flex h-10 w-10 items-center justify-center rounded-full"
      style={category.color ? `background-color: ${category.color}20; color: ${category.color}` : (isIncome ? 'background-color: var(--color-success-bg); color: var(--color-success)' : 'background-color: var(--color-destructive-bg); color: var(--color-destructive)')}
    >
      {#if category.icon}
        <span class="text-xl leading-none">{category.icon}</span>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
      {/if}
    </div>
    
    <div>
      <p class="font-medium text-foreground">{category.name}</p>
      <div class="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold {isIncome ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}">
          {category.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
        </span>
      </div>
    </div>
  </div>
  
  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
    {#if onEdit}
      <button 
        onclick={() => onEdit(category)}
        class="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
        title="Edit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
      </button>
    {/if}
    {#if onDelete}
      <button 
        onclick={() => onDelete(category)}
        class="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
        title="Hapus"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
      </button>
    {/if}
  </div>
</div>
