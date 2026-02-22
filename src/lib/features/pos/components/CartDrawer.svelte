<script lang="ts">
	import { formatRupiah } from '$lib/utils/currency';
	import { formatRupiah as formatRupiahUtil } from '$lib/utils/currency';
	import type { CartItem } from '$lib/features/pos/types';

	let {
		items = [],
		totalAmount = 0,
		onUpdateQuantity,
		onRemoveItem,
		onClearCart,
		onCheckout
	}: {
		items?: CartItem[];
		totalAmount?: number;
		onUpdateQuantity?: (index: number, quantity: number) => void;
		onRemoveItem?: (index: number) => void;
		onClearCart?: () => void;
		onCheckout?: () => void;
	} = $props();

	let isOpen = $state(false);
</script>

<!-- Mobile toggle button -->
<button
	type="button"
	onclick={() => (isOpen = !isOpen)}
	class="lg:hidden fixed bottom-4 right-4 z-40 inline-flex items-center justify-center rounded-full shadow-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 w-14 h-14"
>
	{#if items.length > 0}
		<span
			class="absolute -top-1 -right-1 bg-expense text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
		>
			{items.reduce((sum, item) => sum + item.quantity, 0)}
		</span>
	{/if}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path
			d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
		/></svg
	>
</button>

<!-- Desktop sidebar / Mobile drawer -->
<div
	class="fixed lg:static inset-0 z-50 lg:z-auto lg:block {isOpen
		? 'block'
		: 'hidden'} bg-background/95 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none"
>
	<div
		class="absolute lg:relative right-0 top-0 h-full w-80 lg:w-full lg:h-auto bg-card lg:bg-transparent border-l border-border lg:border-0 shadow-xl lg:shadow-none flex flex-col"
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-border lg:border-b-0">
			<div>
				<h2 class="font-semibold text-lg">Keranjang</h2>
				<p class="text-sm text-muted-foreground">
					{items.length} item{items.length !== 1 ? 's' : ''}
				</p>
			</div>
			{#if items.length > 0}
				<button
					type="button"
					onclick={onClearCart}
					class="text-sm text-destructive hover:underline"
				>
					Hapus semua
				</button>
			{/if}
			<button
				type="button"
				onclick={() => (isOpen = false)}
				class="lg:hidden p-2 text-muted-foreground hover:bg-muted rounded-full"
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
					><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg
				>
			</button>
		</div>

		<!-- Cart items -->
		<div class="flex-1 overflow-y-auto p-4 space-y-3">
			{#if items.length === 0}
				<div class="text-center py-8 text-muted-foreground">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mx-auto mb-3 opacity-50"
						><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path
							d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
						/></svg
					>
					<p class="text-sm">Keranjang kosong</p>
				</div>
			{:else}
				{#each items as item, index (index)}
					<div class="flex items-center gap-3 p-3 bg-muted/30 rounded-[var(--radius)]">
						<div class="flex-1 min-w-0">
							<p class="font-medium text-sm truncate">{item.product.name}</p>
							<p class="text-primary text-sm">{formatRupiah(item.product.price)}</p>
						</div>
						<div class="flex items-center gap-2">
							<button
								type="button"
								onclick={() => onUpdateQuantity?.(index, item.quantity - 1)}
								class="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12" /></svg
								>
							</button>
							<span class="w-8 text-center font-medium">{item.quantity}</span>
							<button
								type="button"
								onclick={() => onUpdateQuantity?.(index, item.quantity + 1)}
								class="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><line x1="12" x2="12" y1="5" y2="19" /><line
										x1="5"
										x2="19"
										y1="12"
										y2="12"
									/></svg
								>
							</button>
						</div>
						<button
							type="button"
							onclick={() => onRemoveItem?.(index)}
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
								><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path
									d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
								/></svg
							>
						</button>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Footer -->
		{#if items.length > 0}
			<div class="p-4 border-t border-border space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-muted-foreground">Total</span>
					<span class="text-2xl font-brand font-bold text-primary"
						>{formatRupiahUtil(totalAmount)}</span
					>
				</div>
				<button
					type="button"
					onclick={onCheckout}
					class="w-full inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-4 py-2"
				>
					Catat Transaksi
				</button>
			</div>
		{/if}
	</div>
</div>

<!-- Backdrop for mobile -->
{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="lg:hidden fixed inset-0 bg-background/50 z-40" onclick={() => (isOpen = false)}></div>
{/if}
