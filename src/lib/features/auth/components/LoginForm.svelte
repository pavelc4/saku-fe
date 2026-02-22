<script lang="ts">
  import { authService } from '$lib/features/auth/services/auth.service';
  import { setAuth } from '$lib/stores/auth.store';
  import { goto } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  
  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let errorMsg = $state('');
  let showPassword = $state(false);
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!email || !password) return;
    
    loading = true;
    errorMsg = '';
    
    const [res, err] = await authService.login({ email, password });
    
    if (err) {
      errorMsg = err.message;
      loading = false;
      return;
    }
    
    if (res) {
      setAuth(res.token, res.user);
      goto('/dashboard');
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${env.PUBLIC_API_URL}/auth/google`;
  }

  function handleGithubLogin() {
    window.location.href = `${env.PUBLIC_API_URL}/auth/github`;
  }
</script>

<div class="w-full max-w-sm mx-auto p-6 bg-card rounded-[var(--radius)] shadow-sm border border-border">
  <div class="text-center mb-8">
    <h1 class="font-brand text-3xl text-primary font-bold">SAKU</h1>
    <p class="text-muted-foreground mt-2">Masuk ke akun Anda</p>
  </div>

  <form onsubmit={handleSubmit} class="space-y-4">
    {#if errorMsg}
      <div class="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-[var(--radius)]" role="alert">
        {errorMsg}
      </div>
    {/if}

    <div class="space-y-2">
      <label for="email" class="text-sm font-medium text-foreground">Email</label>
      <input 
        id="email" 
        type="email" 
        bind:value={email} 
        required
        disabled={loading}
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
          disabled={loading}
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
    </div>

    <button 
      type="submit" 
      disabled={loading || !email || !password}
      class="w-full py-2 px-4 bg-primary text-primary-foreground rounded-[var(--radius)] font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? "Memproses..." : "Masuk"}
    </button>
  </form>

  <div class="mt-6 flex items-center justify-between">
    <hr class="w-full border-border">
    <span class="p-2 text-xs text-muted-foreground whitespace-nowrap">Atau masuk dengan</span>
    <hr class="w-full border-border">
  </div>

  <div class="mt-6 space-y-3">
    <button 
      type="button" 
      onclick={handleGoogleLogin}
      disabled={loading}
      class="w-full py-2 px-4 bg-card border border-border text-foreground rounded-[var(--radius)] font-medium hover:bg-muted disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
    >
      Google
    </button>
    <button 
      type="button" 
      onclick={handleGithubLogin}
      disabled={loading}
      class="w-full py-2 px-4 bg-card border border-border text-foreground rounded-[var(--radius)] font-medium hover:bg-muted disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
    >
      GitHub
    </button>
  </div>

  <div class="mt-6 text-center text-sm text-muted-foreground">
    Belum punya akun? <a href="/register" class="text-primary hover:underline">Daftar sekarang</a>
  </div>
</div>
