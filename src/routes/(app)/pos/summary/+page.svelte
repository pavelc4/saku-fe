<script lang="ts">
	import { onMount } from 'svelte';
	import { posService } from '$lib/features/pos/services/pos.service';
	import { formatRupiah } from '$lib/utils/currency';
	import type { PosSummaryToday } from '$lib/features/pos/types';

	let summary = $state<PosSummaryToday | null>(null);
	let isLoading = $state(true);
	let error = $state('');

	onMount(async () => {
		await loadSummary();
	});

	async function loadSummary() {
		isLoading = true;
		error = '';
		const [data, err] = await posService.getSummaryToday();
		if (err) {
			error = err.message;
		} else {
			summary = data;
		}
		isLoading = false;
	}

	const paymentMethods = [
		{ key: 'cash', label: 'Tunai' },
		{ key: 'qris', label: 'QRIS' },
		{ key: 'transfer', label: 'Transfer' }
	] as const;
</script>

<svelte:head>
	<title>Ringkasan Hari Ini | SAKU</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-brand font-bold text-foreground">Ringkasan Hari Ini</h1>
			<p class="text-muted-foreground mt-1 text-sm">Laporan penjualan kasir hari ini</p>
		</div>
		<button
			type="button"
			onclick={loadSummary}
			disabled={isLoading}
			class="inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-muted h-9 px-4 py-2 disabled:opacity-50"
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
				class="mr-2 {isLoading ? 'animate-spin' : ''}"
			>
				<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
				<path d="M21 3v5h-5" />
			</svg>
			Refresh
		</button>
	</div>

	{#if isLoading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each Array(4) as _}
				<div class="p-6 bg-card rounded-[var(--radius)] border border-border animate-pulse">
					<div class="h-4 bg-muted rounded w-1/2 mb-3"></div>
					<div class="h-8 bg-muted rounded w-3/4"></div>
				</div>
			{/each}
		</div>
	{:else if error}
		<div class="text-center py-12">
			<p class="text-destructive mb-4">{error}</p>
			<button
				type="button"
				onclick={loadSummary}
				class="inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
			>
				Coba Lagi
			</button>
		</div>
	{:else if summary}
		<div class="space-y-6">
			<!-- Main stats -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div class="p-6 bg-card rounded-[var(--radius)] border border-border">
					<p class="text-sm text-muted-foreground mb-1">Total Penjualan</p>
					<p class="text-2xl font-brand font-bold text-income">
						{formatRupiah(summary.total_omzet)}
					</p>
				</div>

				<div class="p-6 bg-card rounded-[var(--radius)] border border-border">
					<p class="text-sm text-muted-foreground mb-1">Jumlah Transaksi</p>
					<p class="text-2xl font-brand font-bold text-foreground">
						{summary.total_transaksi}
					</p>
				</div>

				<div class="p-6 bg-card rounded-[var(--radius)] border border-border">
					<p class="text-sm text-muted-foreground mb-1">Terkonfirmasi</p>
					<p class="text-2xl font-brand font-bold text-primary">
						{summary.confirmed_count}
					</p>
				</div>

				<div class="p-6 bg-card rounded-[var(--radius)] border border-border">
					<p class="text-sm text-muted-foreground mb-1">Pending</p>
					<p class="text-2xl font-brand font-bold text-warning">
						{summary.pending_count}
					</p>
				</div>
			</div>

			<!-- Payment methods breakdown -->
			<div class="bg-card rounded-[var(--radius)] border border-border p-6">
				<h2 class="font-semibold text-lg mb-4">Metode Pembayaran</h2>
				<div class="space-y-3">
					{#if summary.breakdown_payment}
						{#each paymentMethods as method}
							{@const amount = summary.breakdown_payment[method.key]}
							{#if amount > 0}
								<div class="flex items-center justify-between">
									<span class="text-muted-foreground">{method.label}</span>
									<span class="font-semibold text-foreground">{formatRupiah(amount)}</span>
								</div>
							{/if}
						{/each}
					{:else}
						<p class="text-sm text-muted-foreground">Tidak ada data metode pembayaran</p>
					{/if}
				</div>
			</div>

			<!-- Session info -->
			<div class="text-center text-sm text-muted-foreground space-y-1">
				<p>Status Kasir: <span class="font-medium {summary.kasir_status === 'open' ? 'text-success' : 'text-foreground'}">{summary.kasir_status === 'open' ? 'Buka' : 'Tutup'}</span></p>
				{#if summary.opened_at}
					<p>Dibuka: {new Date(summary.opened_at).toLocaleString('id-ID')}</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
