<template>
  <div class="min-h-screen flex items-center justify-center p-4 md:p-8 bg-background font-body text-on-surface antialiased">
    
    <main class="w-full max-w-6xl flex flex-col md:flex-row bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(27,28,24,0.06)] min-h-[800px]">
      
      <section class="w-full md:w-5/12 bg-surface-container-low p-12 flex flex-col justify-between rounded-t-[2rem] md:rounded-tr-none md:rounded-l-[2rem] relative overflow-hidden">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-secondary-container rounded-full opacity-50 blur-3xl mix-blend-multiply"></div>
        <div class="absolute -bottom-24 -right-24 w-80 h-80 bg-primary-fixed rounded-full opacity-40 blur-3xl mix-blend-multiply"></div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-2 mb-16">
            <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">spa</span>
            <span class="font-headline text-2xl font-medium text-primary tracking-tight">Saku.</span>
          </div>
          <h1 class="font-headline text-5xl md:text-6xl text-primary leading-tight mb-6">
            Mulai Perjalanan Bisnis Anda
          </h1>
          <p class="text-on-surface-variant text-lg md:text-xl max-w-sm leading-relaxed">
            Bergabunglah dengan ekosistem ritel yang cerdas dan berestetika tinggi.
          </p>
        </div>
        
        <div class="relative z-10 mt-16 md:mt-0">
          <div class="aspect-square w-full max-w-xs mx-auto md:mx-0 rounded-full bg-surface-container-highest overflow-hidden relative shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80" 
              alt="Organic aesthetic interior" 
              class="w-full h-full object-cover mix-blend-luminosity opacity-80" 
            />
            <div class="absolute inset-0 bg-primary/10 mix-blend-color"></div>
          </div>
        </div>
      </section>

      <section class="w-full md:w-7/12 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-surface-container-lowest relative z-10">
        <div class="max-w-md mx-auto w-full">
          <RouterLink to="/" class="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors mb-6">
            <span class="material-symbols-outlined">arrow_back</span>
            <span class="font-medium">Kembali</span>
          </RouterLink>
          
          <div class="mb-10 text-center md:text-left">
            <h2 class="font-headline text-4xl text-on-surface mb-2">Buat Akun</h2>
            <p class="text-on-surface-variant">Lengkapi data diri Anda untuk memulai.</p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-on-surface mb-2" for="fullName">Nama Lengkap</label>
              <input v-model="form.fullName" class="w-full px-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:border-primary/30 focus:ring-4 focus:ring-primary/10 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline outline-none" id="fullName" name="fullName" placeholder="Cth: Jane Doe" required type="text"/>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-on-surface mb-2" for="email">Email Bisnis</label>
              <input v-model="form.email" class="w-full px-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:border-primary/30 focus:ring-4 focus:ring-primary/10 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline outline-none" id="email" name="email" placeholder="jane@perusahaan.com" required type="email"/>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-on-surface mb-2" for="password">Kata Sandi</label>
              <div class="relative">
                <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="w-full px-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:border-primary/30 focus:ring-4 focus:ring-primary/10 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline pr-12 outline-none" id="password" name="password" placeholder="Minimal 8 karakter" required />
                <button @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" type="button">
                  <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility' : 'visibility_off' }}</span>
                </button>
              </div>
            </div>
            
            <button class="w-full py-4 px-6 mt-4 bg-primary text-on-primary rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-surface-tint transition-all active:scale-[0.98] shadow-sm" type="submit">
              Buat Akun
              <span class="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </form>

          <div class="my-10 flex items-center text-outline">
            <div class="flex-grow border-t border-surface-variant"></div>
            <span class="mx-4 text-xs font-semibold tracking-wider text-on-surface-variant">ATAU DAFTAR DENGAN</span>
            <div class="flex-grow border-t border-surface-variant"></div>
          </div>

          <div class="space-y-4">
            <button class="w-full py-3 px-6 bg-surface-container-highest text-on-surface rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-surface-dim transition-colors" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
              Google
            </button>
            
            <button class="w-full py-3 px-6 bg-surface-container-highest text-on-surface rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-surface-dim transition-colors" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current opacity-80" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
              GitHub
            </button>
          </div>

          <div class="mt-12 text-center">
            <p class="text-on-surface-variant">
              Sudah memiliki akun? 
              <a class="text-primary font-medium hover:underline hover:text-surface-tint transition-colors" href="#">Login</a>
            </p>
          </div>
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

const form = ref({
  fullName: '',
  email: '',
  password: ''
})

const showPassword = ref(false)
const successMessage = ref('')

async function handleRegister() {
  const success = await authStore.register(form.value.fullName, form.value.email, form.value.password)
  if (success) {
    successMessage.value = 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.'
  }
}
</script>