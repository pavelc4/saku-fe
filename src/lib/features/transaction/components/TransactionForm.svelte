<script lang="ts">
  import { useQueryClient, createQuery } from '@tanstack/svelte-query';
  import { transactionService } from '../services/transaction.service';
  import { categoryService } from '$lib/features/category/services/category.service';
  import { queryKeys } from '$lib/utils/query-keys';
  import type { TransactionType, CreateTransactionItemPayload } from '$lib/features/transaction/types';
  
  let { onClose } = $props<{ onClose: () => void }>();
  const queryClient = useQueryClient();

  // Fetched data
  const categoriesQuery = createQuery(() => ({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const [res, err] = await categoryService.list();
      if (err) throw err;
      return res;
    }
  }));

  // Form State
  let type = $state<TransactionType>('expense');
  let category_id = $state('');
  let amount = $state('');
  let note = $state('');
  let date = $state(new Date().toISOString().split('T')[0]);
  let items = $state<CreateTransactionItemPayload[]>([]);
  let receiptFile = $state<File | null>(null);
  
  // UI State
  let loading = $state(false);
  let errorMsg = $state('');
  let step = $state<'form' | 'upload'>('form');
  let createdTxId = $state<string | null>(null);

  // Computed
  let availableCategories = $derived(
    categoriesQuery.data?.filter(c => c.type === 'both' || c.type === type) || []
  );

  function addItem() {
    items = [...items, { name: '', quantity: 1, price: 0 }];
  }

  function removeItem(index: number) {
    items = items.filter((_, i) => i !== index);
  }

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        errorMsg = 'Ukuran file maksimal 5MB';
        return;
      }
      receiptFile = file;
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!amount || !category_id) {
      errorMsg = 'Jumlah dan Kategori wajib diisi';
      return;
    }
    
    loading = true;
    errorMsg = '';
    
    const parsedAmount = parseInt(String(amount).replace(/[^0-9]/g, ''), 10) || 0;
    if (parsedAmount <= 0) {
      errorMsg = 'Jumlah harus lebih dari 0';
      loading = false;
      return;
    }
    
    // Ensure all items are valid
    const cleanItems = items.filter(i => i.name.trim() !== '' && i.price > 0 && i.quantity > 0);

    const [tx, err] = await transactionService.create({
      type,
      category_id,
      amount: parsedAmount,
      note: note.trim() || undefined,
      date: new Date(date).getTime(),
      source: 'manual',
      items: cleanItems.length > 0 ? cleanItems : undefined
    });
    
    if (err || !tx) {
      errorMsg = err?.message || 'Gagal menyimpan transaksi';
      loading = false;
      return;
    }
    
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    
    if (receiptFile) {
      createdTxId = tx.id;
      step = 'upload';
      await handleUpload();
    } else {
      loading = false;
      onClose();
    }
  }

  async function handleUpload() {
    if (!createdTxId || !receiptFile) return;
    loading = true;
    errorMsg = '';

    const [res, err] = await transactionService.uploadReceipt(createdTxId, receiptFile);
    if (err) {
      errorMsg = err.message || 'Gagal upload struk';
      loading = false;
      return;
    }

    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    loading = false;
    onClose();
  }
</script>

{#if step === 'form'}
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
        onclick={() => { type = 'expense'; category_id = ''; }}
      >
        Pengeluaran
      </button>
      <button 
        type="button" 
        class="py-2 text-sm font-medium rounded-md transition-colors {type === 'income' ? 'bg-background text-success shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
        onclick={() => { type = 'income'; category_id = ''; }}
      >
        Pemasukan
      </button>
    </div>

    <div class="space-y-2">
      <label for="category" class="text-sm font-medium text-foreground">Kategori <span class="text-destructive">*</span></label>
      <select 
        id="category" 
        bind:value={category_id} 
        disabled={loading || categoriesQuery.isPending}
        required
        class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
      >
        <option value="" disabled selected>Pilih kategori...</option>
        {#each availableCategories as cat}
          <option value={cat.id}>{cat.name}</option>
        {/each}
      </select>
    </div>

    <div class="space-y-2">
      <label for="amount" class="text-sm font-medium text-foreground">Total Keseluruhan (Rp) <span class="text-destructive">*</span></label>
      <input 
        id="amount" 
        type="number" 
        bind:value={amount} 
        required
        disabled={loading}
        class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        placeholder="0"
        min="1"
      />
    </div>

    <div class="space-y-2">
      <label for="date" class="text-sm font-medium text-foreground">Tanggal <span class="text-destructive">*</span></label>
      <input 
        id="date" 
        type="date" 
        bind:value={date} 
        required
        disabled={loading}
        class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
      />
    </div>

    <div class="space-y-2">
      <label for="note" class="text-sm font-medium text-foreground">Catatan Tambahan (Opsional)</label>
      <input 
        id="note" 
        type="text" 
        bind:value={note} 
        disabled={loading}
        class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        placeholder="Makan siang..."
      />
    </div>

    <!-- Items Section -->
    <div class="space-y-3 pt-2 border-t border-border">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-foreground">Rincian Item (Opsional)</span>
        <button 
          type="button" 
          onclick={addItem}
          class="text-xs text-primary hover:underline font-medium"
        >
          + Tambah Item
        </button>
      </div>

      {#if items.length === 0}
        <p class="text-xs text-muted-foreground">Tidak ada rincian item. Anda bisa menambahkannya untuk pencatatan lebih spesifik.</p>
      {/if}

      {#each items as item, i}
        <div class="flex gap-2 items-start">
          <div class="flex-1 space-y-2">
            <input type="text" bind:value={item.name} placeholder="Nama item" class="w-full px-3 py-1.5 text-sm bg-input border border-border rounded-[var(--radius)] focus:ring-1 focus:ring-primary" required />
            <div class="flex gap-2">
              <input type="number" bind:value={item.price} placeholder="Harga satuan" class="w-2/3 px-3 py-1.5 text-sm bg-input border border-border rounded-[var(--radius)] focus:ring-1 focus:ring-primary" min="0" required />
              <input type="number" bind:value={item.quantity} placeholder="Qty" class="w-1/3 px-3 py-1.5 text-sm bg-input border border-border rounded-[var(--radius)] focus:ring-1 focus:ring-primary" min="1" required />
            </div>
          </div>
          <button type="button" onclick={() => removeItem(i)} class="p-1.5 text-destructive hover:bg-destructive/10 rounded-md mt-1" title="Hapus item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      {/each}
    </div>

    <!-- Receipt Upload Section -->
    <div class="space-y-2 pt-2 border-t border-border">
      <label for="receipt" class="text-sm font-medium text-foreground">Upload Struk (Opsional)</label>
      <input 
        id="receipt"
        type="file" 
        accept="image/png, image/jpeg, image/webp" 
        onchange={handleFileChange}
        disabled={loading}
        class="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
      />
      <p class="text-xs text-muted-foreground">Maksimal 5MB. Format: JPG, PNG, WEBP.</p>
    </div>

    <div class="flex gap-2 pt-4">
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
        disabled={loading || !amount || !category_id}
        class="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-[var(--radius)] font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {loading ? "Menyimpan..." : "Simpan Transaksi"}
      </button>
    </div>
  </form>
{:else}
  <div class="py-8 flex flex-col items-center justify-center text-center space-y-4">
    <div class="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <div>
      <h3 class="font-medium text-lg">Mengunggah Struk...</h3>
      <p class="text-sm text-muted-foreground mt-1">Transaksi berhasil disimpan, sedang memproses foto struk Anda.</p>
    </div>
  </div>
{/if}
