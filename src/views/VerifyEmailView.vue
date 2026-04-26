<template>
  <div class="min-h-screen flex flex-col font-body text-on-surface antialiased bg-background">
    <!-- TopAppBar -->
    <header class="bg-surface-container-low docked full-width top-0 tonal transition via bg-surface-container-low flat no shadows flex justify-between items-center w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 sticky z-50">
      <div class="flex items-center gap-3 sm:gap-4">
        <span class="text-2xl sm:text-3xl font-serif text-primary-tint dark:text-surface-tint font-headline">Saku</span>
      </div>
      <div class="flex items-center gap-2 sm:gap-4">
        <button class="text-on-surface-variant hover:bg-surface-container-highest transition-colors active:scale-[0.98] transition-transform duration-200 px-3 sm:px-4 py-2 rounded-full font-label text-sm flex items-center gap-2 cursor-pointer">
          Help
        </button>
      </div>
    </header>

    <!-- Main Content Canvas -->
    <main class="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-12 relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-surface-container-low opacity-50 blur-3xl -z-10"></div>
      <div class="absolute bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-surface-container-low opacity-50 blur-3xl -z-10"></div>

      <!-- Verification Card -->
      <div class="w-full max-w-lg glass-panel rounded-xl p-6 sm:p-8 md:p-10 shadow-ambient flex flex-col items-center text-center outline outline-1 outline-outline-variant/20">
        <!-- Icon -->
        <div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-surface-container flex items-center justify-center mb-6 sm:mb-8">
          <span v-if="status === 'success'" class="material-symbols-outlined text-2xl sm:text-3xl text-tertiary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          <span v-else class="material-symbols-outlined text-2xl sm:text-3xl text-error" style="font-variation-settings: 'FILL' 1;">error</span>
        </div>

        <h1 class="font-headline text-2xl sm:text-3xl md:text-4xl text-on-surface mb-3 sm:mb-4">
          {{ status === 'success' ? 'Email Terverifikasi!' : 'Verifikasi Gagal' }}
        </h1>

        <p class="font-body text-on-surface-variant text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed max-w-md">
          <template v-if="status === 'success'">
            Selamat! Akun Saku Anda telah berhasil diverifikasi. Sekarang Anda dapat login dan mulai menggunakan semua fitur.
          </template>
          <template v-else-if="status === 'loading'">
            Sedang memverifikasi email Anda...
          </template>
          <template v-else>
            {{ errorMessage || 'Terjadi kesalahan saat verifikasi. Token mungkin tidak valid atau sudah kadaluarsa.' }}
          </template>
        </p>

        <!-- Action Buttons -->
        <div class="w-full flex flex-col items-center gap-3 sm:gap-4">
          <template v-if="status === 'success'">
            <router-link to="/login" class="w-full premium-btn premium-glow text-white font-headline font-bold text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 shadow-ambient hover:opacity-95 active:scale-[0.98] transition-all text-center">
              Masuk ke Saku
            </router-link>
          </template>
          <template v-else-if="status === 'loading'">
            <div class="w-full py-3 sm:py-4 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl sm:text-3xl text-primary animate-spin">progress_activity</span>
            </div>
          </template>
          <template v-else>
            <router-link to="/register" class="w-full premium-btn premium-glow text-white font-headline font-bold text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 shadow-ambient hover:opacity-95 active:scale-[0.98] transition-all text-center">
              Daftar Ulang
            </router-link>
          </template>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-transparent full-width bottom-0 none flat no shadows flex flex-col items-center justify-center w-full py-8 sm:py-12 gap-3 sm:gap-4 mt-auto">
      <div class="flex flex-wrap justify-center gap-3 sm:gap-6 px-4">
        <a class="text-xs font-sans uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
        <a class="text-xs font-sans uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
        <a class="text-xs font-sans uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Support</a>
      </div>
      <p class="text-xs font-sans uppercase tracking-widest text-on-surface-variant">© 2024 Saku. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const status = ref<'loading' | 'success' | 'error'>('loading');
const errorMessage = ref('');

onMounted(async () => {
  const token = route.query.token as string;
  
  if (!token) {
    status.value = 'error';
    errorMessage.value = 'Token verifikasi tidak ditemukan.';
    return;
  }

  try {
    // Backend already verified, just show success
    // The backend redirected here with status query param
    const statusParam = route.query.status as string;
    if (statusParam === 'success') {
      status.value = 'success';
    } else {
      status.value = 'error';
      errorMessage.value = (route.query.message as string) || 'Verifikasi gagal';
    }
  } catch (e) {
    status.value = 'error';
    errorMessage.value = 'Terjadi kesalahan koneksi.';
  }
});
</script>

<style scoped>
.glass-panel {
  background: rgba(251, 249, 242, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.premium-btn {
  background-color: #c96442 !important;
  border-radius: 32px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-glow:hover {
  box-shadow: 0 0 20px rgba(201, 100, 66, 0.4);
}
</style>