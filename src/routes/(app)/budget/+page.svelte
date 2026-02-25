<script lang="ts">
  import BudgetList from '$lib/features/budget/components/BudgetList.svelte';
  import BudgetForm from '$lib/features/budget/components/BudgetForm.svelte';
  import Modal from '$lib/components/common/Modal.svelte';
  import { useQueryClient, createQuery } from '@tanstack/svelte-query';
  import { budgetService } from '$lib/features/budget/services/budget.service';
  import { categoryService } from '$lib/features/category/services/category.service';
  import { queryKeys } from '$lib/utils/query-keys';
  import type { Budget } from '$lib/features/budget/types';

  let isModalOpen = $state(false);
  let editBudget = $state<Budget | null>(null);
  
  const queryClient = useQueryClient();

  const categoriesQuery = createQuery(() => ({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const [res, err] = await categoryService.list();
      if (err) throw err;
      return (res || []).filter(c => c.type === 'expense' || c.type === 'both');
    },
  }));

  function handleAdd() {
    editBudget = null;
    isModalOpen = true;
  }

  function handleEdit(budget: Budget) {
    editBudget = budget;
    isModalOpen = true;
  }

  async function handleDelete(budget: Budget) {
    if (confirm(`Apakah Anda yakin ingin menghapus anggaran ini?`)) {
      const [_, err] = await budgetService.remove(budget.id);
      if (!err) {
        queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      } else {
        alert(err.message);
      }
    }
  }
</script>

<svelte:head>
  <title>Anggaran | SAKU</title>
</svelte:head>

<div class="space-y-6 max-w-4xl mx-auto">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-3xl font-brand font-bold text-foreground">Anggaran</h1>
      <p class="text-muted-foreground mt-1 text-sm">Kontrol pengeluaran Anda dengan menetapkan batas</p>
    </div>
    <button 
      onclick={handleAdd}
      class="inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 shrink-0 gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      Buat Anggaran
    </button>
  </div>

  <BudgetList onEdit={handleEdit} onDelete={handleDelete} />
</div>

<Modal 
  isOpen={isModalOpen} 
  onClose={() => isModalOpen = false} 
  title={editBudget ? "Edit Anggaran" : "Buat Anggaran Baru"}
>
  {#if isModalOpen}
    <BudgetForm 
      onClose={() => isModalOpen = false} 
      categories={categoriesQuery.data || []}
      initialData={editBudget ? { id: editBudget.id, category_id: editBudget.category_id, amount: editBudget.amount } : undefined}
    />
  {/if}
</Modal>
