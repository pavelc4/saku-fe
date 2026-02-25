<script lang="ts">
  import { formatRupiah } from '$lib/utils/currency';
  import type { Budget } from '../types';
  import type { Category } from '$lib/features/category/types';
  
  let { budget, category, onEdit, onDelete } = $props<{
    budget: Budget;
    category?: Category;
    onEdit?: (b: Budget) => void;
    onDelete?: (b: Budget) => void;
  }>();

  const percentage = $derived(Math.min(100, Math.max(0, (budget.spent / budget.amount) * 100)));
  const isOverBudget = $derived(budget.spent >= budget.amount);
  const isWarning = $derived(percentage >= 80 && !isOverBudget);
  
  const barColor = $derived(
    isOverBudget ? 'bg-destructive' : (isWarning ? 'bg-warning' : 'bg-primary')
  );
</script>

<div class="flex flex-col p-4 bg-card rounded-[var(--radius)] border border-border hover:bg-muted/50 transition-colors space-y-4">
  <div class="flex justify-between items-start">
    <div class="flex items-center gap-3">
      <div 
        class="flex h-10 w-10 items-center justify-center rounded-full"
        style={category?.color ? `background-color: ${category.color}20; color: ${category.color}` : 'background-color: var(--color-destructive-bg); color: var(--color-destructive)'}
      >
        {#if category?.icon}
          <span class="text-xl leading-none">{category.icon}</span>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        {/if}
      </div>
      <div>
        <p class="font-medium text-foreground">{category?.name || 'Kategori Tidak Dikenal'}</p>
        <p class="text-sm text-muted-foreground">{formatRupiah(budget.spent)} dari {formatRupiah(budget.amount)}</p>
      </div>
    </div>

    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
      {#if onEdit}
        <button 
          onclick={() => onEdit(budget)}
          class="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </button>
      {/if}
      {#if onDelete}
        <button 
          onclick={() => onDelete(budget)}
          class="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
          title="Hapus"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      {/if}
    </div>
  </div>

  <div>
    <div class="flex justify-between text-xs font-medium mb-1">
      <span class={isOverBudget ? 'text-destructive' : 'text-muted-foreground'}>
        {percentage.toFixed(0)}% Terpakai
      </span>
      <span class="text-muted-foreground text-right">
        Sisa: {formatRupiah(Math.max(0, budget.amount - budget.spent))}
      </span>
    </div>
    <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div 
        class="h-full rounded-full transition-all duration-500 {barColor}" 
        style="width: {percentage}%"
      ></div>
    </div>
    {#if isOverBudget}
      <p class="text-xs text-destructive mt-1 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        Melebihi batas anggaran
      </p>
    {/if}
  </div>
</div>
