<script lang="ts">
	import { formatRupiah } from '$lib/utils/currency';
	import { sanitizeText } from '$lib/utils/sanitize';
	import type { CartItem } from '$lib/features/pos/types';
	import type { Category } from '$lib/features/category/types';

	export type CheckoutData = {
		payment_method: 'cash' | 'qris' | 'transfer' | 'debit' | 'credit';
		note?: string;
	};

	let {
		isOpen,
		onClose,
		items,
		totalAmount,
		onSubmit
	}: {
		isOpen: boolean;
		onClose: () => void;
		items: CartItem[];
		totalAmount: number;
		onSubmit?: (data: CheckoutData) => void;
	} = $props();

	let paymentMethod = $state<'cash' | 'qris' | 'transfer' | 'debit' | 'credit'>('cash');
	let note = $state('');
	let isSubmitting = $state(false);
	let error = $state('');

	$effect(() => {
		if (isOpen) {
			paymentMethod = 'cash';
			note = '';
			error = '';
		}
	});

	let isValid = $derived(!!paymentMethod);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!isValid || isSubmitting) return;

		isSubmitting = true;
		error = '';

		onSubmit?.({
			payment_method: paymentMethod,
			note: note.trim() || undefined
		});
	}

	export function setSubmitting(value: boolean) {
		isSubmitting = value;
	}

	export function setError(message: string) {
		error = message;
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
		onclick={(e) => {
			if (e.target === e.currentTarget && !isSubmitting) onClose();
		}}
	>
		<div
			class="bg-card w-full max-w-md rounded-xl shadow-lg border border-border flex flex-col max-h-[90vh]"
		>
			<div class="flex items-center justify-between p-4 border-b border-border">
				<h2 class="font-semibold text-lg">Catat Transaksi</h2>
				<button
					type="button"
					onclick={onClose}
					disabled={isSubmitting}
					class="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors disabled:opacity-50"
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

			<form onsubmit={handleSubmit} class="p-4 space-y-4 overflow-y-auto">
				<!-- Items summary -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-muted-foreground">Ringkasan Item</label>
					<div class="bg-muted/30 rounded-[var(--radius)] p-3 space-y-1 max-h-32 overflow-y-auto">
						{#each items as item}
							<div class="flex justify-between text-sm">
								<span class="truncate">{sanitizeText(item.product.name)} x{item.quantity}</span>
								<span class="text-primary">{formatRupiah(item.product.price * item.quantity)}</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Total -->
				<div class="flex items-center justify-between p-3 bg-primary/5 rounded-[var(--radius)]">
					<span class="font-medium">Total</span>
					<span class="text-xl font-brand font-bold text-primary">{formatRupiah(totalAmount)}</span>
				</div>

				<!-- Payment method selector -->
				<div class="space-y-2">
					<label for="payment-method" class="text-sm font-medium">
						Metode Pembayaran <span class="text-destructive">*</span>
					</label>
					<select
						id="payment-method"
						bind:value={paymentMethod}
						disabled={isSubmitting}
						class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="cash">Tunai</option>
						<option value="qris">QRIS</option>
						<option value="transfer">Transfer Bank</option>
						<option value="debit">Kartu Debit</option>
						<option value="credit">Kartu Kredit</option>
					</select>
				</div>

				<!-- Note -->
				<div class="space-y-2">
					<label for="note" class="text-sm font-medium">Catatan</label>
					<textarea
						id="note"
						bind:value={note}
						disabled={isSubmitting}
						maxlength={255}
						rows={2}
						placeholder="Opsional..."
						class="flex w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
					></textarea>
					<p class="text-xs text-muted-foreground text-right">{note.length}/255</p>
				</div>

				<!-- Error message -->
				{#if error}
					<p class="text-sm text-destructive bg-destructive/10 p-3 rounded-[var(--radius)]">
						{error}
					</p>
				{/if}

				<!-- Submit button -->
				<button
					type="submit"
					disabled={!isValid || isSubmitting}
					class="w-full inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-4 py-2"
				>
					{#if isSubmitting}
						<svg
							class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
						Catat Transaksi
					{/if}
				</button>
			</form>
		</div>
	</div>
{/if}
