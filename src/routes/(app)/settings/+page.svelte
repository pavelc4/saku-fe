<script lang="ts">
	import { user, clearAuth } from '$lib/stores/auth.store';
	import { theme, type Theme } from '$lib/stores/theme.store';
	import { goto } from '$app/navigation';
	import { authService } from '$lib/features/auth/services/auth.service';

	let editingName = $state(false);
	let editingAvatar = $state(false);
	let nameInput = $state('');
	let avatarInput = $state('');
	let isSavingName = $state(false);
	let isSavingAvatar = $state(false);
	let selectedTheme = $state<Theme>('system');
	let selectedLang = $state('id');
	let isLoggingOut = $state(false);

	$effect(() => {
		const unsub = user.subscribe((u) => {
			if (u) {
				nameInput = u.name;
				avatarInput = u.avatar_url || '';
			}
		});
		return unsub;
	});

	$effect(() => {
		const unsub = theme.subscribe((t) => {
			selectedTheme = t;
		});
		return unsub;
	});

	function handleThemeChange(newTheme: Theme) {
		theme.setTheme(newTheme);
	}

	async function handleSaveName() {
		if (!nameInput.trim()) return;
		isSavingName = true;
		// Mock save - in real app would call API
		setTimeout(() => {
			user.update((u) => (u ? { ...u, name: nameInput.trim() } : null));
			sessionStorage.setItem('saku_user', JSON.stringify({ ...$user, name: nameInput.trim() }));
			isSavingName = false;
			editingName = false;
		}, 500);
	}

	async function handleSaveAvatar() {
		const url = avatarInput.trim();
		if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
			alert('URL harus dimulai dengan http:// atau https://');
			return;
		}
		isSavingAvatar = true;
		setTimeout(() => {
			user.update((u) => (u ? { ...u, avatar_url: url || null } : null));
			sessionStorage.setItem('saku_user', JSON.stringify({ ...$user, avatar_url: url || null }));
			isSavingAvatar = false;
			editingAvatar = false;
		}, 500);
	}

	function handleLogout() {
		isLoggingOut = true;
		authService.logout();
		clearAuth();
		goto('/login');
	}

	function handleLangChange(e: Event) {
		const select = e.target as HTMLSelectElement;
		selectedLang = select.value;
		localStorage.setItem('saku_lang', selectedLang);
	}
</script>

<svelte:head>
	<title>Pengaturan | SAKU</title>
</svelte:head>

<div class="space-y-6 max-w-2xl mx-auto">
	<div>
		<h1 class="text-3xl font-brand font-bold text-foreground">Pengaturan</h1>
		<p class="text-muted-foreground mt-1 text-sm">Kelola akun dan preferensi Anda</p>
	</div>

	<!-- Profile Section -->
	<div class="bg-card rounded-[var(--radius)] border border-border p-6 space-y-4">
		<h2 class="font-semibold text-lg">Profil</h2>

		<div class="flex items-center gap-4">
			{#if $user?.avatar_url}
				<img
					src={$user.avatar_url}
					alt="Avatar"
					class="w-16 h-16 rounded-full object-cover border border-border"
				/>
			{:else}
				<div
					class="w-16 h-16 rounded-full bg-muted flex items-center justify-center border border-border"
				>
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
						class="text-muted-foreground"
						><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle
							cx="12"
							cy="7"
							r="4"
						/></svg
					>
				</div>
			{/if}

			{#if editingAvatar}
				<div class="flex-1 space-y-2">
					<input
						type="text"
						bind:value={avatarInput}
						placeholder="https://example.com/avatar.jpg"
						class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					/>
					<div class="flex gap-2">
						<button
							type="button"
							onclick={handleSaveAvatar}
							disabled={isSavingAvatar}
							class="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-[var(--radius)] hover:bg-primary/90 disabled:opacity-50"
						>
							{isSavingAvatar ? 'Menyimpan...' : 'Simpan'}
						</button>
						<button
							type="button"
							onclick={() => (editingAvatar = false)}
							class="text-sm text-muted-foreground px-3 py-1 hover:text-foreground"
						>
							Batal
						</button>
					</div>
				</div>
			{:else}
				<button
					type="button"
					onclick={() => (editingAvatar = true)}
					class="text-sm text-primary hover:underline"
				>
					Ubah URL Avatar
				</button>
			{/if}
		</div>

		<div class="space-y-2">
			<label class="text-sm font-medium text-muted-foreground">Nama</label>
			{#if editingName}
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={nameInput}
						class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					/>
					<button
						type="button"
						onclick={handleSaveName}
						disabled={isSavingName}
						class="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-[var(--radius)] hover:bg-primary/90 disabled:opacity-50"
					>
						{isSavingName ? 'Menyimpan...' : 'Simpan'}
					</button>
					<button
						type="button"
						onclick={() => (editingName = false)}
						class="text-sm text-muted-foreground px-3 py-1 hover:text-foreground"
					>
						Batal
					</button>
				</div>
			{:else}
				<div class="flex items-center gap-2">
					<span class="text-foreground">{$user?.name || '-'}</span>
					<button
						type="button"
						onclick={() => (editingName = true)}
						class="p-1 text-muted-foreground hover:text-foreground"
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
							><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path
								d="m15 5 4 4"
							/></svg
						>
					</button>
				</div>
			{/if}
		</div>

		<div class="space-y-2">
			<label class="text-sm font-medium text-muted-foreground">Email</label>
			<p class="text-foreground">{$user?.email || '-'}</p>
		</div>
	</div>

	<!-- Appearance Section -->
	<div class="bg-card rounded-[var(--radius)] border border-border p-6 space-y-4">
		<h2 class="font-semibold text-lg">Tampilan</h2>

		<div class="flex gap-2">
			{#each ['light', 'dark', 'system'] as themeOption}
				<button
					type="button"
					onclick={() => handleThemeChange(themeOption as Theme)}
					class="flex-1 py-2 px-4 rounded-[var(--radius)] text-sm font-medium transition-colors {selectedTheme ===
					themeOption
						? 'bg-primary text-primary-foreground'
						: 'bg-muted text-muted-foreground hover:text-foreground'}"
				>
					{#if themeOption === 'light'}
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
							class="inline-block mr-1"
							><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path
								d="m4.93 4.93 1.41 1.41"
							/><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path
								d="m6.34 17.66-1.41 1.41"
							/><path d="m19.07 4.93-1.41 1.41" /></svg
						>
					{:else if themeOption === 'dark'}
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
							class="inline-block mr-1"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg
						>
					{:else}
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
							class="inline-block mr-1"
							><rect width="20" height="14" x="2" y="3" rx="2" /><line
								x1="8"
								x2="16"
								y1="21"
								y2="21"
							/><line x1="12" x2="12" y1="17" y2="21" /></svg
						>
					{/if}
					<span class="capitalize">{themeOption === 'system' ? 'Sistem' : themeOption}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Language Section -->
	<div class="bg-card rounded-[var(--radius)] border border-border p-6 space-y-4">
		<h2 class="font-semibold text-lg">Bahasa</h2>

		<div class="space-y-2">
			<select
				value={selectedLang}
				onchange={handleLangChange}
				class="flex h-9 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			>
				<option value="id">Bahasa Indonesia</option>
				<option value="en">English</option>
			</select>
			<p class="text-xs text-muted-foreground">Pengaturan bahasa aktif setelah reload</p>
		</div>
	</div>

	<!-- Account Section -->
	<div class="bg-card rounded-[var(--radius)] border border-border p-6 space-y-4">
		<h2 class="font-semibold text-lg">Akun</h2>

		<button
			type="button"
			onclick={handleLogout}
			disabled={isLoggingOut}
			class="w-full inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 h-10 px-4 py-2"
		>
			{#if isLoggingOut}
				<svg
					class="animate-spin -ml-1 mr-2 h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			{/if}
			Keluar
		</button>
	</div>

	<!-- Danger Zone -->
	<div class="bg-card rounded-[var(--radius)] border border-destructive/20 p-6 space-y-4">
		<h2 class="font-semibold text-lg text-destructive">Zona Berbahaya</h2>

		<button
			type="button"
			disabled
			class="w-full inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors bg-muted text-muted-foreground h-10 px-4 py-2 cursor-not-allowed opacity-50"
			title="Segera hadir"
		>
			Hapus Akun
		</button>
	</div>
</div>
