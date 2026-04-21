<template>
  <header class="h-20 w-full flex justify-between items-center px-12 bg-surface-container-low z-10 shrink-0">
    <div class="relative w-64">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
      <input class="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-highest border-none focus:ring-0 focus:bg-surface-container-lowest transition-colors font-body text-sm text-on-surface placeholder:text-on-surface-variant" placeholder="Search..." type="text"/>
    </div>
    <div class="flex items-center gap-4">
      <button class="h-10 w-10 rounded-full hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors relative">
        <span class="material-symbols-outlined">notifications</span>
        <span class="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"></span>
      </button>
      <button class="h-10 w-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-headline font-medium hover:opacity-80 transition-opacity overflow-hidden">
        <img v-if="user.avatar" :src="user.avatar" alt="User Profile" class="w-full h-full object-cover" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  user: { name: string; avatar: string }
}>();
</script>
