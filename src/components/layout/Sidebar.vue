<template>
  <nav class="hidden md:flex flex-col h-screen w-72 shrink-0 border-none bg-surface-container-low py-8 px-6 z-20">
    <div class="mb-12 px-4">
      <h1 class="font-headline text-3xl font-medium text-primary">Saku</h1>
    </div>
    <ul class="flex-1 space-y-2">
      <li v-for="item in navItems" :key="item.name">
        <a href="#" :class="[
            'flex items-center gap-3 px-4 py-3 rounded-full transition-all',
            item.active 
              ? 'bg-surface-container-highest text-primary font-bold' 
              : 'text-secondary font-medium hover:bg-surface-container-highest/50 transition-colors'
          ]">
          <span class="material-symbols-outlined" :class="{ 'fill': item.active }">{{ item.icon }}</span>
          <span class="font-body">{{ item.name }}</span>
        </a>
      </li>
    </ul>
    <div class="mt-auto space-y-4">
      <button class="w-full py-4 bg-primary text-on-primary rounded-full font-body font-medium hover:bg-primary-container transition-colors shadow-[0_4px_32px_rgba(27,28,24,0.06)]">
        New Sale
      </button>
      <ul class="space-y-1">
        <li v-for="item in footerItems" :key="item.name">
          <a href="#" class="flex items-center gap-3 px-4 py-2 text-secondary font-medium hover:bg-surface-container-highest/50 rounded-full transition-colors text-sm">
            <span class="material-symbols-outlined text-[20px]">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const navItems = ref([
  { name: 'Dashboard', icon: 'dashboard', active: true },
  { name: 'Sales', icon: 'shopping_cart', active: false },
  { name: 'Inventory', icon: 'inventory_2', active: false },
  { name: 'AI Insights', icon: 'auto_awesome', active: false },
  { name: 'Staff', icon: 'groups', active: false },
]);

const footerItems = ref([
  { name: 'Settings', icon: 'settings' },
  { name: 'Support', icon: 'help' },
]);
</script>