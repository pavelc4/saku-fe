<script lang="ts">
	import { onMount } from 'svelte';
	import { productService } from '$lib/features/pos/services/product.service';
	import { posService } from '$lib/features/pos/services/pos.service';
	import { posSessionService } from '$lib/features/pos/services/pos-session.service';
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
	import type { Product, CheckoutPayload, PosSession } from '$lib/features/pos/types';

	let products = $state<Product[]>([]);
	let session = $state<PosSession | null>(null);
	let isLoading = $state(true);
	let isError = $state(false);
	let isSessionLoading = $state(false);

	let isCheckoutOpen = $state(false);
	let checkoutForm: CheckoutForm;

	// Modal for open/close session
	let showSessionModal = $state(false);
	let sessionAction = $state<'open' | 'close'>('open');
	let initialCash = $state('');
	let finalCash = $state('');
	let isSubmittingSession = $state(false);

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		const [productsData, productsError] = await productService.list();
		const [sessionData, sessionError] = await posSessionService.getActive();
		
		products = productsData || [];
		session = sessionData;
		isLoading = false;
		
		if (productsError || sessionError) {
			isError = true;
		}
	}

	function handleAddToCart(product: Product, quantity: number) {
		addItem(product.id, product, quantity);
	}

	function handleCheckout() {
		if (!session) {
			alert('Silakan buka kasir terlebih dahulu!');
			return;
		}
		isCheckoutOpen = true;
	}

	async function handleCheckoutSubmit(data: {
		payment_method: 'cash' | 'qris' | 'transfer' | 'debit' | 'credit';
		note?: string;
	}) {
		let currentItems: any[] = [];
		items.subscribe((v) => (currentItems = v))();

		const checkoutPayload: CheckoutPayload = {
			items: currentItems.map((item) => ({
				product_id: item.product.id,
				quantity: item.quantity,
				price: item.product.price
			})),
			payment_method: data.payment_method,
			note: data.note
		};

		const [result, error] = await posService.checkout(checkoutPayload);

		if (error) {
			checkoutForm?.setError(error.message);
			checkoutForm?.setSubmitting(false);
			return;
		}

		clearCart();
		isCheckoutOpen = false;
		alert('Transaksi berhasil dicatat!');
	}

	function openSessionModal() {
		sessionAction = 'open';
		initialCash = '';
		showSessionModal = true;
	}

	function closeSessionModal() {
		sessionAction = 'close';
		finalCash = '';
		showSessionModal = true;
	}

	async function handleSessionSubmit(e: Event) {
		e.preventDefault();
		if (isSubmittingSession) return;

		isSubmittingSession = true;

		if (sessionAction === 'open') {
			const cash = parseInt(initialCash);
			if (isNaN(cash) || cash < 0) {
				alert('Jumlah uang awal tidak valid');
				isSubmittingSession = false;
				return;
			}

			const [result, error] = await posSessionService.open({ initial_cash: cash });
			if (error) {
				alert(error.message);
			} else {
				session = result;
				showSessionModal = false;
			}
		} else {
			const cash = parseInt(finalCash);
			if (isNaN(cash) || cash < 0) {
				alert('Jumlah uang akhir tidak valid');
				isSubmittingSession = false;
				return;
			}

			const [result, error] = await posSessionService.close({ final_cash: cash });
			if (error) {
				alert(error.message);
			} else {
				session = result;
				showSessionModal = false;
				clearCart();
			}
		}

		isSubmittingSession = false;
	}
</script>

<svelte:head>
	<title>POS | SAKU</title>
</svelte:head>

<div class="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
	<!-- Products panel -->
	<div class="flex-1 overflow-y-auto pb-24 lg:pb-0">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-brand font-bold text-foreground">Kasir</h1>
					<p class="text-muted-foreground mt-1 text-sm">Catat transaksi dengan cepat</p>
				</div>
				
				<!-- Session Status & Actions -->
				<div class="flex items-center gap-2">
					{#if session}
						<div class="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-full text-sm font-medium">
							<div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
							Kasir Buka
						</div>
						<button
							type="button"
							onclick={closeSessionModal}
							class="px-4 py-2 text-sm font-medium rounded-[var(--radius)] border border-border bg-card hover:bg-muted transition-colors"
						>
							Tutup Kasir
						</button>
					{:else}
						<div class="flex items-center gap-2 px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm font-medium">
							<div class="w-2 h-2 bg-muted-foreground rounded-full"></div>
							Kasir Tutup
						</div>
						<button
							type="button"
							onclick={openSessionModal}
							class="px-4 py-2 text-sm font-medium rounded-[var(--radius)] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
						>
							Buka Kasir
						</button>
					{/if}
				</div>
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
	onSubmit={handleCheckoutSubmit}
/>

<!-- Session Modal -->
{#if showSessionModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
		onclick={(e) => {
			if (e.target === e.currentTarget && !isSubmittingSession) showSessionModal = false;
		}}
	>
		<div class="bg-card w-full max-w-md rounded-xl shadow-lg border border-border">
			<div class="flex items-center justify-between p-4 border-b border-border">
				<h2 class="font-semibold text-lg">
					{sessionAction === 'open' ? 'Buka Kasir' : 'Tutup Kasir'}
				</h2>
				<button
					type="button"
					onclick={() => (showSessionModal = false)}
					disabled={isSubmittingSession}
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

			<form onsubmit={handleSessionSubmit} class="p-4 space-y-4">
				{#if sessionAction === 'open'}
					<div class="space-y-2">
						<label for="initial-cash" class="text-sm font-medium">
							Uang Awal <span class="text-destructive">*</span>
						</label>
						<input
							type="number"
							id="initial-cash"
							bind:value={initialCash}
							required
							min="0"
							disabled={isSubmittingSession}
							placeholder="0"
							class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						/>
						<p class="text-xs text-muted-foreground">
							Masukkan jumlah uang awal di laci kasir
						</p>
					</div>
				{:else}
					<div class="space-y-2">
						<label for="final-cash" class="text-sm font-medium">
							Uang Akhir <span class="text-destructive">*</span>
						</label>
						<input
							type="number"
							id="final-cash"
							bind:value={finalCash}
							required
							min="0"
							disabled={isSubmittingSession}
							placeholder="0"
							class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						/>
						<p class="text-xs text-muted-foreground">
							Hitung total uang di laci kasir sebelum ditutup
						</p>
					</div>
				{/if}

				<button
					type="submit"
					disabled={isSubmittingSession}
					class="w-full inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-4 py-2 disabled:opacity-50 disabled:pointer-events-none"
				>
					{#if isSubmittingSession}
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
						Memproses...
					{:else}
						{sessionAction === 'open' ? 'Buka Kasir' : 'Tutup Kasir'}
					{/if}
				</button>
			</form>
		</div>
	</div>
{/if}
