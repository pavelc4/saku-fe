<script lang="ts">
  import { theme } from '$lib/stores/theme.store';
</script>

<svelte:head>
  <title>SAKU | Aplikasi Keuangan Cerdas</title>
</svelte:head>

<div class="min-h-screen bg-background flex flex-col">
  <!-- Header -->
  <header class="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
    <div class="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="font-brand font-bold text-primary text-2xl tracking-tight">SAKU</span>
      </div>
      <nav class="hidden md:flex items-center space-x-6">
        <a href="#fitur" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Fitur</a>
        <a href="#solusi" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solusi</a>
        <a href="#harga" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Harga</a>
      </nav>
      <div class="flex items-center space-x-4">
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
        <a href="/login" class="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Masuk</a>
        <a href="/register" class="inline-flex h-9 items-center justify-center rounded-[var(--radius)] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">Daftar</a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="flex-1">
    <section class="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex flex-col items-center space-y-4 text-center">
          <div class="space-y-4 max-w-3xl">
            <h1 class="text-4xl font-brand font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Catat Keuangan <span class="text-primary">Makin Mudah</span>
            </h1>
            <p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
              Solusi all-in-one untuk manajemen keuangan pribadi dan UMKM. Pantau transaksi, kelola anggaran, dan nikmati fitur Point of Sale (POS) dalam satu platform yang terintegrasi.
            </p>
          </div>
          <div class="space-x-4 pt-4">
            <a href="/register" class="inline-flex h-12 items-center justify-center rounded-[var(--radius)] bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              Mulai Gratis
            </a>
            <a href="#fitur" class="inline-flex h-12 items-center justify-center rounded-[var(--radius)] border border-input bg-background stroke-foreground px-8 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="fitur" class="w-full py-12 md:py-24 bg-muted/50 border-y border-border">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div class="space-y-2">
            <h2 class="text-3xl font-brand font-bold tracking-tighter sm:text-4xl">Semua yang Anda butuhkan</h2>
            <p class="max-w-[900px] text-muted-foreground md:text-lg">
              Fitur lengkap yang didesain khusus agar laporan keuangan lebih rapi dan keputusan bisnis lebih akurat.
            </p>
          </div>
        </div>
        <div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <div class="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 class="font-bold text-lg mb-2">Pencatatan Intuitif</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Catat setiap pemasukan dan pengeluaran dengan cepat. Dukungan lampiran dokumen membuat laporan lebih transparan.
            </p>
          </div>

          <div class="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
            </div>
            <h3 class="font-bold text-lg mb-2">Sistem Kasir (POS)</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Kelola daftar produk dan terima pesanan kasir secara offline maupun online dengan satu klik.
            </p>
          </div>

          <div class="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            </div>
            <h3 class="font-bold text-lg mb-2">Insight berbasis AI</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Dapatkan rekomendasi keuangan dan analisis tren yang dihasilkan oleh AI untuk membantu Anda berhemat.
            </p>
          </div>

        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="w-full border-t border-border bg-background py-6 md:py-0">
    <div class="container mx-auto px-4 md:px-6 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
      <p class="text-sm text-muted-foreground">
        &copy; 2026 SAKU. Hak cipta dilindungi undang-undang.
      </p>
      <div class="flex items-center space-x-4">
        <a href="#" class="text-sm font-medium text-muted-foreground hover:underline underline-offset-4">Kebijakan Privasi</a>
        <a href="#" class="text-sm font-medium text-muted-foreground hover:underline underline-offset-4">Ketentuan Layanan</a>
      </div>
    </div>
  </footer>
</div>
