<script lang="ts">
	import { onMount } from 'svelte';
	import { productCategoryService } from '$lib/features/pos/services/product-category.service';
	import type { ProductCategory } from '$lib/features/pos/types';

	let categories = $state<ProductCategory[]>([]);
	let isLoading = $state(true);
	let showForm = $state(false);
	let editingCategory = $state<ProductCategory | null>(null);

	let formName = $state('');
	let formColor = $state('#3B82F6');
	let isSubmitting = $state(false);
	let error = $state('');

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		const [data] = await productCategoryService.list();
		categories = data || [];
		isLoading = false;
	}

	function openCreateForm() {
		editingCategory = null;
		formName = '';
		formColor = '#3B82F6';
		error = '';
		showForm = true;
	}

	function openEditForm(category: ProductCategory) {
		editingCategory = category;
		formName = category.name;
		formColor = category.color;
		error = '';
		showForm = true;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (isSubmitting) return;

		isSubmitting = true;
		error = '';

		const payload = { name: formName.trim(), color: formColor };

		if (editingCategory) {
			const [, err] = await productCategoryService.update(editingCategory.id, payload);
			if (err) {
				error = err.message;
				isSubmitting = false;
				return;
			}
		} else {
			const [, err] = await productCategoryService.create(payload);
			if (err) {
				error = err.message;
				isSubmitting = false;
				return;
			}
		}

		isSubmitting = false;
		showForm = false;
		await loadData();
	}

	async function handleDelete(id: string) {
		if (!confirm('Yakin ingin menghapus kategori ini?')) return;

		const [, err] = await productCategoryService.remove(id);
		if (err) {
			alert(err.message);
			return;
		}

		await loadData();
	}
</script>

<svelte:head>
	<title>Kategori Produk | SAKU</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-brand font-bold text-foreground">Kategori Produk</h1>
			<p class="text-muted-foreground mt-1 text-sm">Kelompokkan produk berdasarkan kategori</p>
		</div>
		<button
			type="button"
			onclick={openCreateForm}
			class="inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mr-2"
			>
				<path d="M5 12h14" />
				<path d="M12 5v14" />
			</svg>
			Tambah Kategori
		</button>
	</div>

	{#if isLoading}
		<div class="space-y-2">
			{#each Array(5) as _}
				<div class="p-4 bg-card rounded-[var(--radius)] border border-border animate-pulse">
					<div class="h-4 bg-muted rounded w-1/3"></div>
				</div>
			{/each}
		</div>
	{:else if categories.length === 0}
		<div class="text-center py-12 text-muted-foreground">
			<p>Belum ada kategori produk</p>
		</div>
	{:else}
		<div class="space-y-2">
			{#each categories as category (category.id)}
				<div
					class="flex items-center justify-between p-4 bg-card rounded-[var(--radius)] border border-border"
				>
					<div class="flex items-center gap-3">
						<span class="font-medium text-foreground">{category.name}</span>
						{#if category.user_id === null}
							<span
								class="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
							>
								Sistem
							</span>
						{/if}
					</div>
					{#if category.user_id !== null}
						<div class="flex gap-2">
							<button
								type="button"
								onclick={() => openEditForm(category)}
								class="p-2 text-muted-foreground hover:text-primary transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
								</svg>
							</button>
							<button
								type="button"
								onclick={() => handleDelete(category.id)}
								class="p-2 text-muted-foreground hover:text-destructive transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M3 6h18" />
									<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
									<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
								</svg>
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if showForm}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
		onclick={(e) => {
			if (e.target === e.currentTarget && !isSubmitting) showForm = false;
		}}
	>
		<div class="bg-card w-full max-w-md rounded-xl shadow-lg border border-border">
			<div class="flex items-center justify-between p-4 border-b border-border">
				<h2 class="font-semibold text-lg">
					{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
				</h2>
				<button
					type="button"
					onclick={() => (showForm = false)}
					disabled={isSubmitting}
					class="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" x2="6" y1="6" y2="18" />
						<line x1="6" x2="18" y1="6" y2="18" />
					</svg>
				</button>
			</div>

			<form onsubmit={handleSubmit} class="p-4 space-y-4">
				<div class="space-y-2">
					<label for="name" class="text-sm font-medium">
						Nama Kategori <span class="text-destructive">*</span>
					</label>
					<input
						type="text"
						id="name"
						bind:value={formName}
						required
						disabled={isSubmitting}
						placeholder="Contoh: Makanan, Minuman, Elektronik"
						class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				<div class="space-y-2">
					<label for="color" class="text-sm font-medium">
						Warna <span class="text-destructive">*</span>
					</label>
					<div class="flex gap-2">
						<input
							type="color"
							id="color"
							bind:value={formColor}
							disabled={isSubmitting}
							class="h-9 w-16 rounded-[var(--radius)] border border-input bg-background cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
						/>
						<input
							type="text"
							bind:value={formColor}
							disabled={isSubmitting}
							placeholder="#3B82F6"
							class="flex h-9 flex-1 rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
				</div>

				{#if error}
					<p class="text-sm text-destructive bg-destructive/10 p-3 rounded-[var(--radius)]">
						{error}
					</p>
				{/if}

				<button
					type="submit"
					disabled={isSubmitting || !formName.trim()}
					class="w-full inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-4 py-2 disabled:opacity-50 disabled:pointer-events-none"
				>
					{#if isSubmitting}
						<svg
							class="animate-spin -ml-1 mr-2 h-4 w-4"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Menyimpan...
					{:else}
						Simpan
					{/if}
				</button>
			</form>
		</div>
	</div>
{/if}
