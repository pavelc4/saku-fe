<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Product } from '../types';
	import { formatRupiah } from '$lib/utils/currency';

	let { products = [], onAddToCart } = $props<{
		products?: Product[];
		onAddToCart?: (product: Product, quantity: number) => void;
	}>();

	let manualName = $state('');
	let manualPrice = $state('');
	let showManualForm = $state(false);

	function handleAddManual() {
		if (!manualName.trim() || !manualPrice || parseInt(manualPrice) <= 0) return;

		const price = parseInt(manualPrice);
		const product: Product = {
			id: `manual-${Date.now()}`,
			user_id: '',
			name: manualName.trim(),
			price,
			stock: null,
			sku: null,
			photo_url: null,
			product_category_id: null,
			created_at: Date.now(),
			updated_at: Date.now(),
			deleted_at: null
		};

		onAddToCart?.(product, 1);
		manualName = '';
		manualPrice = '';
		showManualForm = false;
	}

	function handleProductClick(product: Product) {
		onAddToCart?.(product, 1);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleAddManual();
		}
	}
</script>

<div class="space-y-4">
	<button
		type="button"
		onclick={() => (showManualForm = !showManualForm)}
		class="w-full p-4 border-2 border-dashed border-border rounded-[var(--radius)] text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
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
			stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg
		>
		Tambah Manual
	</button>

	{#if showManualForm}
		<div class="p-4 bg-card rounded-[var(--radius)] border border-border space-y-3">
			<input
				type="text"
				bind:value={manualName}
				placeholder="Nama produk"
				class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
			/>
			<input
				type="number"
				bind:value={manualPrice}
				placeholder="Harga"
				onkeydown={handleKeyDown}
				class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
			/>
			<button
				type="button"
				onclick={handleAddManual}
				disabled={!manualName.trim() || !manualPrice || parseInt(manualPrice) <= 0}
				class="w-full inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
			>
				Tambah ke Keranjang
			</button>
		</div>
	{/if}

	{#if products.length > 0}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
			{#each products as product (product.id)}
				<button
					type="button"
					onclick={() => handleProductClick(product)}
					class="p-3 bg-card rounded-[var(--radius)] border border-border hover:bg-muted/50 transition-colors text-left min-h-[80px] flex flex-col justify-between"
				>
					<span class="font-medium text-foreground line-clamp-2 text-sm">{product.name}</span>
					<span class="text-primary font-semibold text-sm">{formatRupiah(product.price)}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
