<script lang="ts">
  import CategoryList from '$lib/features/category/components/CategoryList.svelte';
  import CategoryForm from '$lib/features/category/components/CategoryForm.svelte';
  import Modal from '$lib/components/common/Modal.svelte';
  import { useQueryClient } from '@tanstack/svelte-query';
  import { categoryService } from '$lib/features/category/services/category.service';
  import { queryKeys } from '$lib/utils/query-keys';
  import type { Category } from '$lib/features/category/types';

  let isModalOpen = $state(false);
  let editCategory = $state<Category | null>(null);
  
  const queryClient = useQueryClient();

  function handleAdd() {
    editCategory = null;
    isModalOpen = true;
  }

  function handleEdit(category: Category) {
    editCategory = category;
    isModalOpen = true;
  }

  async function handleDelete(category: Category) {
    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${category.name}"?`)) {
      const [_, err] = await categoryService.remove(category.id);
      if (!err) {
        queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      } else {
        alert(err.message);
      }
    }
  }
</script>

<svelte:head>
  <title>Kategori | SAKU</title>
</svelte:head>

<div class="space-y-6 max-w-5xl mx-auto">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-3xl font-brand font-bold text-foreground">Kategori</h1>
      <p class="text-muted-foreground mt-1 text-sm">Kelola kategori untuk transaksi Anda</p>
    </div>
    <button 
      onclick={handleAdd}
      class="inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 shrink-0 gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      Tambah Kategori
    </button>
  </div>

  <CategoryList onEdit={handleEdit} onDelete={handleDelete} />
</div>

<Modal 
  isOpen={isModalOpen} 
  onClose={() => isModalOpen = false} 
  title={editCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
>
  {#if isModalOpen}
    <CategoryForm 
      onClose={() => isModalOpen = false} 
      initialData={editCategory ? { id: editCategory.id, name: editCategory.name, type: editCategory.type, icon: editCategory.icon || undefined, color: editCategory.color || undefined } : undefined}
    />
  {/if}
</Modal>
