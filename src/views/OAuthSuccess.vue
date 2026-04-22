<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center">
      <span class="material-symbols-outlined text-primary text-5xl animate-spin" style="font-variation-settings: 'FILL' 1;">sync</span>
      <h2 class="font-headline text-2xl text-on-surface mt-4">Mengautentikasi...</h2>
      <p class="text-on-surface-variant font-body">Mohon tunggu sebentar, Anda sedang dialihkan.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const token = route.query.token as string;
  if (token) {
    localStorage.setItem('saku_token', token);
    // Use window.location.href to force a full reload so stores initialize correctly
    window.location.href = '/dashboard';
  } else {
    router.push('/login');
  }
});
</script>
