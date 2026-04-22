<template>
  <div class="min-h-screen flex items-center justify-center p-4 md:p-8 bg-background font-body text-on-surface antialiased relative overflow-hidden">
    <div class="fixed top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 -z-10"></div>
    <div class="fixed bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 -z-10"></div>

    <main class="w-full max-w-7xl h-auto md:h-[850px] grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(27,28,24,0.06)] relative z-10">
      
      <section class="relative hidden md:flex flex-col justify-between p-16 bg-surface-container-low overflow-hidden">
        <div class="z-10">
          <div class="flex items-center gap-2 mb-12">
            <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">spa</span>
            <span class="font-headline font-bold text-primary text-2xl tracking-tight">Saku.</span>
          </div>
          <h1 class="font-headline text-5xl lg:text-6xl text-on-surface leading-[1.1] mb-8">
            Kelola usaha dengan sentuhan intelektual.
          </h1>
          <p class="text-on-surface-variant text-lg max-w-md font-body leading-relaxed">
            Saku menghadirkan presisi editorial dalam setiap transaksi. Sebuah simfoni manajemen inventaris dan pelayanan pelanggan yang dikurasi khusus untuk gerai butik Anda.
          </p>
        </div>

        <div class="z-10 mt-auto">
          <div class="bg-surface/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-outline-variant/20 max-w-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-primary-fixed rounded-full">
                <span class="material-symbols-outlined text-on-primary-fixed text-sm">auto_awesome</span>
              </div>
              <span class="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Update Sistem v2.4</span>
            </div>
            <p class="text-sm text-on-surface mb-4 font-medium">Integrasi Laporan Penjualan Real-time kini lebih cerdas dengan Analisis Prediktif.</p>
            <div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div class="bg-primary h-full w-3/4 rounded-full"></div>
            </div>
            <div class="flex justify-between mt-2">
              <span class="text-[10px] text-on-surface-variant font-medium"></span>
              <span class="text-[10px] text-primary font-bold"></span>
            </div>
          </div>
        </div>
      </section>

      <section class="flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-surface-container-lowest">
        <div class="w-full max-w-md">
          <div class="flex md:hidden items-center justify-center gap-2 mb-12">
            <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">spa</span>
            <span class="font-headline font-bold text-primary text-2xl tracking-tight">Saku.</span>
          </div>

          <div class="mb-10 text-center md:text-left">
            <h2 class="font-headline text-3xl text-on-surface font-medium mb-2">Selamat Datang di Saku</h2>
            <p class="text-on-surface-variant font-body">Masuk untuk mengelola gerai Anda hari ini.</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-2">
              <label class="text-xs uppercase tracking-wider font-bold text-on-surface-variant ml-1" for="email">Alamat Surel</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-on-surface-variant text-xl group-focus-within:text-primary transition-colors">mail</span>
                </div>
                <input v-model="email" class="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-4 focus:ring-primary/10 focus:bg-surface transition-all outline-none" id="email" placeholder="nama@geraianda.com" type="email" required />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center px-1">
                <label class="text-xs uppercase tracking-wider font-bold text-on-surface-variant" for="password">Kata Sandi</label>
                <a class="text-xs text-primary font-bold hover:underline" href="#">Lupa Sandi?</a>
              </div>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-on-surface-variant text-xl group-focus-within:text-primary transition-colors">lock</span>
                </div>
                <input v-model="password" :type="showPassword ? 'text' : 'password'" class="block w-full pl-12 pr-12 py-4 bg-surface-container-low border-none rounded-xl focus:ring-4 focus:ring-primary/10 focus:bg-surface transition-all outline-none" id="password" placeholder="••••••••" required />
                <button @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-primary" type="button">
                  <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-3 px-1">
              <input v-model="rememberMe" class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/30 bg-surface-container-low transition-all" id="remember" type="checkbox"/>
              <label class="text-sm text-on-surface-variant font-medium select-none cursor-pointer" for="remember">Ingat sesi saya</label>
            </div>

            <!-- Error Message -->
            <div v-if="authStore.error" class="p-4 bg-error/10 text-error rounded-xl text-sm font-medium">
              {{ authStore.error }}
            </div>

            <button :disabled="authStore.loading" class="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-surface-tint active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" type="submit">
              <span v-if="authStore.loading">Memproses...</span>
              <span v-else>Masuk Sekarang</span>
              <span class="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </form>

          <div class="relative my-10">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-surface-container-high"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-surface-container-lowest text-on-surface-variant uppercase tracking-widest text-[10px] font-bold">Atau Masuk Melalui</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button class="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors font-medium text-sm text-on-surface">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
              Google
            </button>
            <button class="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors font-medium text-sm text-on-surface">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current opacity-80" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
              GitHub
            </button>
          </div>

          <footer class="mt-12 text-center">
            <p class="text-on-surface-variant text-sm">
              Belum memiliki akun? 
              <router-link to="/register" class="text-primary font-bold ml-1 hover:underline">Daftar Sekarang</router-link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

async function handleLogin() {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push({ name: 'dashboard' })
  }
}
</script>
