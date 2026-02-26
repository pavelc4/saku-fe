<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let status = $state<'loading' | 'success' | 'error'>('loading');
	let message = $state('');

	onMount(() => {
		const urlStatus = $page.url.searchParams.get('status');
		const urlMessage = $page.url.searchParams.get('message');

		if (urlStatus === 'success') {
			status = 'success';
		} else if (urlStatus === 'error') {
			status = 'error';
			message = urlMessage || 'Terjadi kesalahan saat verifikasi email';
		}
	});

	function handleContinue() {
		if (status === 'success') {
			goto('/login');
		} else {
			goto('/register');
		}
	}
</script>

<svelte:head>
	<title>Verifikasi Email | SAKU</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-background p-4">
	<div class="w-full max-w-md">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-brand font-bold text-foreground">SAKU</h1>
			<p class="text-muted-foreground mt-2">Verifikasi Email</p>
		</div>

		<div class="bg-card rounded-xl shadow-lg border border-border p-8">
			{#if status === 'loading'}
				<div class="text-center py-8">
					<div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
					<p class="mt-4 text-muted-foreground">Memverifikasi email Anda...</p>
				</div>
			{:else if status === 'success'}
				<div class="text-center py-4">
					<div class="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8 text-success"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-foreground mb-2">Email Terverifikasi!</h2>
					<p class="text-muted-foreground mb-6">
						Email Anda berhasil diverifikasi. Sekarang Anda dapat login ke akun SAKU Anda.
					</p>
					<button
						type="button"
						onclick={handleContinue}
						class="w-full inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8"
					>
						Lanjut ke Login
					</button>
				</div>
			{:else}
				<div class="text-center py-4">
					<div class="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8 text-destructive"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-foreground mb-2">Verifikasi Gagal</h2>
					<p class="text-muted-foreground mb-6">
						{message}
					</p>
					<button
						type="button"
						onclick={handleContinue}
						class="w-full inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors border border-border bg-card hover:bg-muted h-11 px-8"
					>
						Kembali ke Register
					</button>
				</div>
			{/if}
		</div>

		<p class="text-center text-sm text-muted-foreground mt-6">
			Butuh bantuan? <a href="/support" class="text-primary hover:underline">Hubungi Support</a>
		</p>
	</div>
</div>
