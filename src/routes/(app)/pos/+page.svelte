<script lang="ts">
	import { onMount } from 'svelte';
	import { productService } from '$lib/features/pos/services/product.service';
	import { categoryService } from '$lib/features/category/services/category.service';
	import { saleService } from '$lib/features/pos/services/sale.service';
	import {
		items,
		totalAmount,
		addItem,
		removeItem,
		updateQuantity,
		clearCart
	} from '$lib/features/pos/stores/cart.store';
	import ProductGrid from '$lib/features/pos/components/ProductGrid.svelte';
	import CartDrawer from '$lib/features/pos/components/CartDrawer.svelte';
	import CheckoutForm from '$lib/features/pos/components/CheckoutForm.svelte';
	import type { Category } from '$lib/features/category/types';
	import type { Product } from '$lib/features/pos/types';

	let products = $state<Product[]>([]);
	let categories = $state<Category[]>([]);
	let isLoading = $state(true);
	let isError = $state(false);

	let isCheckoutOpen = $state(false);
	let checkoutForm: CheckoutForm;

	const expenseCategories = $derived(
		categories.filter((c) => c.type === 'expense' || c.type === 'both')
	);

	onMount(async () => {
		const [productsData] = await productService.list();
		const [categoriesData] = await categoryService.list();
		products = productsData || [];
		categories = categoriesData || [];
		isLoading = false;
		if (!productsData || !categoriesData) {
			isError = true;
		}
	});

	function handleAddToCart(product: Product, quantity: number) {
		addItem(product.id, product, quantity);
	}

	function handleCheckout() {
		isCheckoutOpen = true;
	}

	async function handleCheckoutSubmit(data: {
		categoryId: string;
		paymentAmount: number;
		note?: string;
	}) {
		let currentItems: any[] = [];
		items.subscribe((v) => (currentItems = v))();

		const salePayload = {
			items: currentItems.map((item) => ({
				product_id: item.product.id.startsWith('manual-') ? '' : item.product.id,
				quantity: item.quantity,
				unit_price: item.product.price
			})),
			payment_amount: data.paymentAmount,
			note: data.note
		};

		const [result, error] = await saleService.create(salePayload);

		if (error) {
			checkoutForm?.setError(error.message);
			checkoutForm?.setSubmitting(false);
			return;
		}

		clearCart();
		isCheckoutOpen = false;
		alert('Transaksi berhasil dicatat!');
	}
</script>

<svelte:head>
	<title>POS | SAKU</title>
</svelte:head>

<div class="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
	<!-- Products panel -->
	<div class="flex-1 overflow-y-auto pb-24 lg:pb-0">
		<div class="space-y-4">
			<div>
				<h1 class="text-3xl font-brand font-bold text-foreground">Kasir</h1>
				<p class="text-muted-foreground mt-1 text-sm">Catat transaksi dengan cepat</p>
			</div>

			{#if isLoading}
				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
					{#each Array(8) as _}
						<div class="p-3 bg-card rounded-[var(--radius)] border border-border animate-pulse">
							<div class="h-4 bg-muted rounded w-3/4 mb-2"></div>
							<div class="h-4 bg-muted rounded w-1/2"></div>
						</div>
					{/each}
				</div>
			{:else if isError}
				<div class="text-center py-8 text-destructive">
					<p>Gagal memuat produk</p>
				</div>
			{:else}
				<ProductGrid {products} onAddToCart={handleAddToCart} />
			{/if}
		</div>
	</div>

	<!-- Cart panel (desktop) -->
	<div class="hidden lg:block w-80 shrink-0">
		<div class="sticky top-0 h-full">
			{#key $items}
				<CartDrawer
					items={$items}
					totalAmount={$totalAmount}
					onUpdateQuantity={updateQuantity}
					onRemoveItem={removeItem}
					onClearCart={clearCart}
					onCheckout={handleCheckout}
				/>
			{/key}
		</div>
	</div>

	<!-- Cart drawer (mobile) -->
	<div class="lg:hidden">
		{#key $items}
			<CartDrawer
				items={$items}
				totalAmount={$totalAmount}
				onUpdateQuantity={updateQuantity}
				onRemoveItem={removeItem}
				onClearCart={clearCart}
				onCheckout={handleCheckout}
			/>
		{/key}
	</div>
</div>

<CheckoutForm
	bind:this={checkoutForm}
	isOpen={isCheckoutOpen}
	onClose={() => (isCheckoutOpen = false)}
	items={$items}
	totalAmount={$totalAmount}
	categories={expenseCategories}
	onSubmit={handleCheckoutSubmit}
/>
