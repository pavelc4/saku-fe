<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="flex justify-between items-center w-full px-8 md:px-12 py-6 max-w-screen-2xl mx-auto top-0 bg-[#fbf9f2]/90 backdrop-blur-md shadow-sm z-50 sticky border-b border-outline-variant/10 relative">
    <RouterLink to="/" class="font-headline text-3xl font-medium tracking-tight text-primary">Saku.</RouterLink>
    
    <div class="flex items-center gap-6">
      <RouterLink to="/" class="font-headline text-lg text-near-black hover:text-primary transition-colors duration-200 hidden sm:block">Login</RouterLink>
      <RouterLink to="/register" class="bg-near-black text-surface px-6 py-2.5 rounded-full font-body font-medium shadow-md hover:shadow-lg transition-all duration-200">Register</RouterLink>
    </div>

  </header>
</template>