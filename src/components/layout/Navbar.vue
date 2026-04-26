<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}
</script>

<template>
  <header class="flex justify-between items-center w-full px-4 sm:px-6 md:px-12 py-4 md:py-6 max-w-screen-2xl mx-auto top-0 bg-[#fbf9f2]/90 backdrop-blur-md shadow-sm z-50 sticky border-b border-outline-variant/10 relative">
    <RouterLink to="/" class="font-headline text-2xl sm:text-3xl font-medium tracking-tight text-primary" @click="closeMenu">Saku.</RouterLink>
    
    <button @click="toggleMenu" class="md:hidden p-2 -mr-2" aria-label="Toggle menu">
      <span v-if="!isOpen" class="material-symbols-outlined text-2xl">menu</span>
      <span v-else class="material-symbols-outlined text-2xl">close</span>
    </button>
    
    <div class="hidden md:flex items-center gap-6">
      <RouterLink to="/login" class="font-headline text-lg text-near-black hover:text-primary transition-colors duration-200">Login</RouterLink>
      <RouterLink to="/register" class="bg-near-black text-surface px-6 py-2.5 rounded-full font-body font-medium shadow-md hover:shadow-lg transition-all duration-200">Register</RouterLink>
    </div>
    
    <div v-if="isOpen" class="absolute top-full left-0 right-0 bg-[#fbf9f2]/95 backdrop-blur-md border-b border-outline-variant/10 md:hidden flex flex-col gap-4 p-6">
      <RouterLink to="/login" class="font-headline text-lg text-near-black hover:text-primary transition-colors duration-200" @click="closeMenu">Login</RouterLink>
      <RouterLink to="/register" class="bg-near-black text-surface px-6 py-3 rounded-full font-body font-medium shadow-md hover:shadow-lg transition-all duration-200 text-center" @click="closeMenu">Register</RouterLink>
    </div>
  </header>
</template>