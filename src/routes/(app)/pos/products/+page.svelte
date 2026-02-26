<script lang="ts">
	import { onMount } from 'svelte';
	import { productService } from '$lib/features/pos/services/product.service';
	import { productCategoryService } from '$lib/features/pos/services/product-category.service';
	import { formatRupiah } from '$lib/utils/currency';
	import type { Product, ProductCategory } from '$lib/features/pos/types';

	let products = $state<Product[]>([]);
	let categories = $state<ProductCategory[]>([]);
	let isLoading = $state(true);
	let showForm = $state(false);
	let editingProduct = $state<Product | null>(null);

	// Form state
	let formName = $state('');
	let formPrice = $state('');
	let formStock = $state('');
	let formSku = $state('');
	let formCategoryId = $state('');
	let formPhoto = $state<File | null>(null);
	let isSubmitting = $state(false);
	let error = $state('');

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		const [productsData] = await productService.list();
		const [categoriesData] = await productCategoryService.list();
		products = productsData || [];
		categories = categoriesData || [];
		isLoading = false;
	}

	function openCreateForm() {
		editingProduct = null;
		formName = '';
		formPrice = '';
		formStock = '';
		formSku = '';
		formCategoryId = '';
		formPhoto = null;
		error = '';
		showForm = true;
	}

	function openEditForm(product: Product) {
		editingProduct = product;
		formName = product.name;
		formPrice = product.price.toString();
		formStock = product.stock?.toString() || '';
		formSku = product.sku || '';
		formCategoryId = product.product_category_id || '';
		formPhoto = null;
		error = '';
		showForm = true;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (isSubmitting) return;

		isSubmitting = true;
		error = '';

		const payload = {
			name: formName.trim(),
			price: parseInt(formPrice),
			stock: formStock ? parseInt(formStock) : undefined,
			sku: formSku.trim() || undefined,
			product_category_id: formCategoryId || undefined
		};

		if (editingProduct) {
			const [result, err] = await productService.update(editingProduct.id, payload);
			if (err) {
				error = err.message;
				isSubmitting = false;
				return;
			}

			if (formPhoto) {
				await productService.uploadPhoto(editingProduct.id, formPhoto);
			}
		} else {
			const [result, err] = await productService.create(payload);
			if (err) {
				error = err.message;
				isSubmitting = false;
				return;
			}

			if (formPhoto && result) {
				await productService.uploadPhoto(result.id, formPhoto);
			}
		}

		isSubmitting = false;
		showForm = false;
		await loadData();
	}

	async function handleDelete(id: string) {
		if (!confirm('Yakin ingin menghapus produk ini?')) return;

		const [, err] = await productService.remove(id);
		if (err) {
			alert(err.message);
			return;
		}

		await loadData();
	}

	function handlePhotoChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			formPhoto = target.files[0];
		}
	}
</script>

<svelte:head>
	<title>Kelola Produk | SAKU</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-brand font-bold text-foreground">Kelola Produk</h1>
			<p class="text-muted-foreground mt-1 text-sm">Atur produk untuk kasir</p>
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
			Tambah Produk
		</button>
	</div>

	{#if isLoading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each Array(6) as _}
				<div class="p-4 bg-card rounded-[var(--radius)] border border-border animate-pulse">
					<div class="h-4 bg-muted rounded w-3/4 mb-2"></div>
					<div class="h-4 bg-muted rounded w-1/2"></div>
				</div>
			{/each}
		</div>
	{:else if products.length === 0}
		<div class="text-center py-12 text-muted-foreground">
			<p>Belum ada produk</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each products as product (product.id)}
				<div class="p-4 bg-card rounded-[var(--radius)] border border-border">
					<div class="flex items-start justify-between mb-2">
						<div class="flex-1 min-w-0">
							<h3 class="font-medium text-foreground truncate">{product.name}</h3>
							{#if product.sku}
								<p class="text-xs text-muted-foreground">SKU: {product.sku}</p>
							{/if}
						</div>
						<div class="flex gap-1 ml-2">
							<button
								type="button"
								onclick={() => openEditForm(product)}
								class="p-1 text-muted-foreground hover:text-primary transition-colors"
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
								onclick={() => handleDelete(product.id)}
								class="p-1 text-muted-foreground hover:text-destructive transition-colors"
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
					</div>
					<p class="text-primary font-semibold text-lg">{formatRupiah(product.price)}</p>
					{#if product.stock !== null}
						<p class="text-sm text-muted-foreground">Stok: {product.stock}</p>
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
		<div
			class="bg-card w-full max-w-md rounded-xl shadow-lg border border-border flex flex-col max-h-[90vh]"
		>
			<div class="flex items-center justify-between p-4 border-b border-border">
				<h2 class="font-semibold text-lg">
					{editingProduct ? 'Edit Produk' : 'Tambah Produk'}
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

			<form onsubmit={handleSubmit} class="p-4 space-y-4 overflow-y-auto">
				<div class="space-y-2">
					<label for="name" class="text-sm font-medium">
						Nama Produk <span class="text-destructive">*</span>
					</label>
					<input
						type="text"
						id="name"
						bind:value={formName}
						required
						disabled={isSubmitting}
						class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				<div class="space-y-2">
					<label for="price" class="text-sm font-medium">
						Harga <span class="text-destructive">*</span>
					</label>
					<input
						type="number"
						id="price"
						bind:value={formPrice}
						required
						min="0"
						disabled={isSubmitting}
						class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<label for="stock" class="text-sm font-medium">Stok</label>
						<input
							type="number"
							id="stock"
							bind:value={formStock}
							min="0"
							disabled={isSubmitting}
							class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>

					<div class="space-y-2">
						<label for="sku" class="text-sm font-medium">SKU</label>
						<input
							type="text"
							id="sku"
							bind:value={formSku}
							disabled={isSubmitting}
							class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label for="category" class="text-sm font-medium">Kategori</label>
					<select
						id="category"
						bind:value={formCategoryId}
						disabled={isSubmitting}
						class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="">Tanpa kategori</option>
						{#each categories as category}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</div>

				<div class="space-y-2">
					<label for="photo" class="text-sm font-medium">Foto Produk</label>
					<input
						type="file"
						id="photo"
						accept="image/jpeg,image/png,image/webp"
						onchange={handlePhotoChange}
						disabled={isSubmitting}
						class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					/>
					<p class="text-xs text-muted-foreground">Max 5MB (JPEG, PNG, WebP)</p>
				</div>

				{#if error}
					<p class="text-sm text-destructive bg-destructive/10 p-3 rounded-[var(--radius)]">
						{error}
					</p>
				{/if}

				<button
					type="submit"
					disabled={isSubmitting || !formName.trim() || !formPrice}
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
