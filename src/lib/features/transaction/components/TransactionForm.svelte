<script lang="ts">
  import { useQueryClient } from '@tanstack/svelte-query';
  import { transactionService } from '../services/transaction.service';
  import { queryKeys } from '$lib/utils/query-keys';
  import type { TransactionType } from '$lib/types/common';
  
  let { onClose } = $props<{ onClose: () => void }>();
  
  const queryClient = useQueryClient();
  
  let type = $state<TransactionType>('expense');
  let amount = $state('');
  let description = $state('');
  let date = $state(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  
  let loading = $state(false);
  let errorMsg = $state('');
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!amount || !description) return;
    
    loading = true;
    errorMsg = '';
    
    // Parse amount avoiding strings/NaN
    const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;
    
    if (parsedAmount <= 0) {
      errorMsg = 'Jumlah harus lebih dari 0';
      loading = false;
      return;
    }
    
    const [_, err] = await transactionService.create({
      type,
      amount: parsedAmount,
      description,
      date: new Date(date).getTime()
    });
    
    if (err) {
      errorMsg = err.message;
      loading = false;
      return;
    }
    
    // Invalidate queries to refresh list
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    
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
    <label for="amount" class="text-sm font-medium text-foreground">Jumlah (Rp)</label>
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

  <div class="space-y-2">
    <label for="description" class="text-sm font-medium text-foreground">Keterangan</label>
    <input 
      id="description" 
      type="text" 
      bind:value={description} 
      required
      disabled={loading}
      class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
      placeholder="Beli token listrik..."
    />
  </div>

  <div class="space-y-2">
    <label for="date" class="text-sm font-medium text-foreground">Tanggal</label>
    <input 
      id="date" 
      type="date" 
      bind:value={date} 
      required
      disabled={loading}
      class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
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
      disabled={loading || !amount}
      class="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-[var(--radius)] font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
    >
      {loading ? "Menyimpan..." : "Simpan"}
    </button>
  </div>
</form>
