<script lang="ts">
  import { page } from '$app/state';
  
  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { label: 'Transaksi', href: '/transactions', icon: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' },
    { label: 'Kategori', href: '/categories', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
    { label: 'Anggaran', href: '/budget', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  ];

  const posItems = [
    { label: 'Kasir', href: '/pos' },
    { label: 'Produk', href: '/pos/products' },
    { label: 'Kategori Produk', href: '/pos/categories' },
    { label: 'Ringkasan', href: '/pos/summary' },
  ];

  let isPosExpanded = $state(false);

  $effect(() => {
    // Auto-expand POS menu if on POS page
    if (page.url.pathname.startsWith('/pos')) {
      isPosExpanded = true;
    }
  });
</script>

<aside class="hidden border-r border-border bg-card md:block w-64 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14">
  <div class="flex h-full flex-col gap-2 p-4">
    <nav class="grid items-start gap-1 font-medium">
      {#each navItems as item}
        {@const isActive = page.url.pathname.startsWith(item.href)}
        <a 
          href={item.href} 
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all {isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d={item.icon}/>
          </svg>
          {item.label}
        </a>
      {/each}

      <!-- POS Menu with submenu -->
      <div class="space-y-1">
        <button
          type="button"
          onclick={() => (isPosExpanded = !isPosExpanded)}
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all {page.url.pathname.startsWith('/pos') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          </svg>
          <span class="flex-1 text-left">Point of Sale</span>
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
            class="transition-transform {isPosExpanded ? 'rotate-180' : ''}"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        {#if isPosExpanded}
          <div class="ml-6 space-y-1 border-l border-border pl-3">
            {#each posItems as item}
              {@const isActive = page.url.pathname === item.href}
              <a 
                href={item.href} 
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all {isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
              >
                {item.label}
              </a>
            {/each}
          </div>
        {/if}
      </div>
    </nav>
    <div class="mt-auto">
      <a 
        href="/settings" 
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all {page.url.pathname.startsWith('/settings') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        Pengaturan
      </a>
    </div>
  </div>
</aside>
