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
      setAuth(res.token, { id: '', email: '', name: 'Loading', role: 'user', created_at: Date.now(), is_verified: true, avatar_url: '' });
      
      const [user, userErr] = await authService.getMe();
      if (userErr || !user) {
        errorMsg = 'Gagal memuat profil pengguna';
        loading = false;
        return;
      }

      setAuth(res.token, user);
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
      Google
    </button>
    <button 
      type="button" 
      onclick={handleGithubLogin}
      disabled={loading}
      class="w-full py-2 px-4 bg-card border border-border text-foreground rounded-[var(--radius)] font-medium hover:bg-muted disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
      GitHub
    </button>
  </div>

  <div class="mt-6 text-center text-sm text-muted-foreground">
    Belum punya akun? <a href="/register" class="text-primary hover:underline">Daftar sekarang</a>
  </div>
</div>
