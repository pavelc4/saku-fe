<script lang="ts">
  import { authService } from '$lib/features/auth/services/auth.service';
  
  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  
  let loading = $state(false);
  let errorMsg = $state('');
  let successMsg = $state('');
  let showPassword = $state(false);
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;
    
    if (password.length < 8) {
      errorMsg = 'Password minimal 8 karakter.';
      return;
    }
    
    if (password !== confirmPassword) {
      errorMsg = 'Password tidak cocok.';
      return;
    }
    
    loading = true;
    errorMsg = '';
    successMsg = '';
    
    const [, err] = await authService.register({ name, email, password });
    
    if (err) {
      errorMsg = err.message;
      loading = false;
      return;
    }
    
    successMsg = 'Cek email kamu untuk verifikasi akun';
    loading = false;
    
    // Clear form
    name = '';
    email = '';
    password = '';
    confirmPassword = '';
  }
</script>

<div class="w-full max-w-sm mx-auto p-6 bg-card rounded-[var(--radius)] shadow-sm border border-border">
  <div class="text-center mb-8">
    <h1 class="font-brand text-3xl text-primary font-bold">SAKU</h1>
    <p class="text-muted-foreground mt-2">Daftar akun baru</p>
  </div>

  <form onsubmit={handleSubmit} class="space-y-4">
    {#if errorMsg}
      <div class="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-[var(--radius)]" role="alert">
        {errorMsg}
      </div>
    {/if}

    {#if successMsg}
      <div class="p-3 text-sm text-success bg-success/10 border border-success/20 rounded-[var(--radius)]" role="alert">
        {successMsg}
      </div>
    {/if}

    <div class="space-y-2">
      <label for="name" class="text-sm font-medium text-foreground">Nama Lengkap</label>
      <input 
        id="name" 
        type="text" 
        bind:value={name} 
        required
        disabled={loading || !!successMsg}
        class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        placeholder="Nama Lengkap"
      />
    </div>

    <div class="space-y-2">
      <label for="email" class="text-sm font-medium text-foreground">Email</label>
      <input 
        id="email" 
        type="email" 
        bind:value={email} 
        required
        disabled={loading || !!successMsg}
        class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        placeholder="nama@email.com"
      />
    </div>

    <div class="space-y-2">
      <label for="password" class="text-sm font-medium text-foreground">Password</label>
      <div class="relative">
        <input 
          id="password" 
          type={showPassword ? "text" : "password"} 
          bind:value={password} 
          required
          disabled={loading || !!successMsg}
          class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          placeholder="••••••••"
        />
        <button 
          type="button" 
          class="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground flex items-center"
          onclick={() => showPassword = !showPassword}
          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
        >
          {showPassword ? "Sembunyikan" : "Tampilkan"}
        </button>
      </div>
      <p class="text-xs text-muted-foreground">Minimal 8 karakter.</p>
    </div>

    <div class="space-y-2">
      <label for="confirmPassword" class="text-sm font-medium text-foreground">Konfirmasi Password</label>
      <input 
        id="confirmPassword" 
        type={showPassword ? "text" : "password"} 
        bind:value={confirmPassword} 
        required
        disabled={loading || !!successMsg}
        class="w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        placeholder="••••••••"
      />
    </div>

    <button 
      type="submit" 
      disabled={loading || !name || !email || !password || !confirmPassword || !!successMsg}
      class="w-full py-2 px-4 bg-primary text-primary-foreground rounded-[var(--radius)] font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? "Memproses..." : "Daftar"}
    </button>
  </form>

  <div class="mt-6 text-center text-sm text-muted-foreground">
    Sudah punya akun? <a href="/login" class="text-primary hover:underline">Masuk di sini</a>
  </div>
</div>
