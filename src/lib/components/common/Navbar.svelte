<script lang="ts">
  import { theme } from '$lib/stores/theme.store';
  import { authService } from '$lib/features/auth/services/auth.service';
  import { clearAuth } from '$lib/stores/auth.store';
  import { goto } from '$app/navigation';
  
  let isMenuOpen = $state(false);

  async function handleLogout() {
    await authService.logout();
    clearAuth();
    goto('/login');
  }
</script>

<nav class="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
  <div class="flex h-14 items-center px-4 md:px-6">
    <!-- Mobile Hamburger -->
    <button 
      class="mr-2 md:hidden p-2 text-muted-foreground hover:bg-muted rounded-[var(--radius)]"
      onclick={() => isMenuOpen = !isMenuOpen}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      <span class="sr-only">Toggle menu</span>
    </button>
    
    <!-- Desktop Logo (hidden on mobile when sidebar is separate) -->
    <div class="mr-4 hidden md:flex">
      <a href="/dashboard" class="flex items-center space-x-2">
        <span class="font-brand font-bold text-primary text-xl">SAKU</span>
      </a>
    </div>

    <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
      <!-- Title for Mobile -->
      <div class="w-full flex-1 md:w-auto md:flex-none">
        <a href="/dashboard" class="md:hidden font-brand font-bold text-primary text-lg">SAKU</a>
      </div>
      
      <!-- Actions -->
      <nav class="flex items-center space-x-2">
        <button 
          onclick={theme.toggleTheme}
          class="inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors hover:bg-muted hover:text-foreground h-9 w-9 text-muted-foreground"
        >
          {#if $theme === 'dark'}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          {/if}
          <span class="sr-only">Toggle theme</span>
        </button>

        <button 
          onclick={handleLogout}
          class="inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors hover:bg-muted hover:text-destructive h-9 w-9 text-muted-foreground"
          title="Keluar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          <span class="sr-only">Keluar</span>
        </button>
      </nav>
    </div>
  </div>
</nav>

<!-- Mobile sidebar backdrop (simulated functionality for now) -->
{#if isMenuOpen}
  <div class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
    <div class="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-background p-6 shadow-lg border-r border-border flex flex-col">
      <div class="flex items-center justify-between mb-8">
        <span class="font-brand font-bold text-primary text-2xl">SAKU</span>
        <button onclick={() => isMenuOpen = false} class="p-2 text-muted-foreground hover:bg-muted rounded-[var(--radius)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
        </button>
      </div>
      <nav class="grid gap-2 text-lg font-medium">
        <a href="/dashboard" class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted" onclick={() => isMenuOpen = false}>Dashboard</a>
        <a href="/transactions" class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted" onclick={() => isMenuOpen = false}>Transaksi</a>
        <a href="/categories" class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted" onclick={() => isMenuOpen = false}>Kategori</a>
        <a href="/pos" class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted" onclick={() => isMenuOpen = false}>Point of Sale</a>
        <a href="/budget" class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted" onclick={() => isMenuOpen = false}>Anggaran</a>
      </nav>
    </div>
  </div>
{/if}
