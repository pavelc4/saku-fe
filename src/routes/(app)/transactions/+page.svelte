<script lang="ts">
  import TransactionList from '$lib/features/transaction/components/TransactionList.svelte';
  import TransactionForm from '$lib/features/transaction/components/TransactionForm.svelte';
  import Modal from '$lib/components/common/Modal.svelte';

  let isModalOpen = $state(false);
</script>

<svelte:head>
  <title>Transaksi | SAKU</title>
</svelte:head>

<div class="space-y-6 max-w-3xl mx-auto">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-3xl font-brand font-bold text-foreground">Transaksi</h1>
      <p class="text-muted-foreground mt-1 text-sm">Kelola semua pemasukan dan pengeluaran</p>
    </div>
    <button 
      onclick={() => isModalOpen = true}
      class="inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 shrink-0 gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      Tambah Transaksi
    </button>
  </div>

  <TransactionList />
</div>

<Modal 
  isOpen={isModalOpen} 
  onClose={() => isModalOpen = false} 
  title="Tambah Transaksi Baru"
>
  <TransactionForm onClose={() => isModalOpen = false} />
</Modal>
