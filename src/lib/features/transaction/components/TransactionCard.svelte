<script lang="ts">
  import { formatRupiah } from '$lib/utils/currency';
  import { formatRelative } from '$lib/utils/date';
  import type { Transaction } from '../types';
  
  let { transaction } = $props<{ transaction: Transaction }>();
  
  const isIncome = $derived(transaction.type === 'income');
</script>

<div class="flex items-center justify-between p-4 bg-card rounded-[var(--radius)] border border-border hover:bg-muted/50 transition-colors">
  <div class="flex items-center gap-4">
    <div class={`flex h-10 w-10 items-center justify-center rounded-full ${isIncome ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
      {#if isIncome}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="19" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
      {/if}
    </div>
    
    <div>
      <p class="font-medium text-foreground">{transaction.description || 'Transaksi Tanpa Nama'}</p>
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{formatRelative(transaction.date)}</span>
      </div>
    </div>
  </div>
  
  <div class="text-right">
    <p class={`font-semibold ${isIncome ? 'text-success' : 'text-foreground'}`}>
      {isIncome ? '+' : '-'} {formatRupiah(transaction.amount)}
    </p>
  </div>
</div>
