<template>
  <nav class="hidden md:flex flex-col h-screen w-72 shrink-0 border-none bg-surface-container-low py-8 px-6 z-20">
    <div class="mb-12 px-4">
      <h1 class="font-headline text-3xl font-medium text-primary">Saku</h1>
    </div>
    
    <ul class="flex-1 space-y-2">
      <li v-for="item in navItems" :key="item.name">
        <router-link :to="item.path" :class="[
            'flex items-center gap-3 px-4 py-3 rounded-full transition-all',
            route.path === item.path 
              ? 'bg-surface-container-highest text-primary font-bold' 
              : 'text-secondary font-medium hover:bg-surface-container-highest/50 transition-colors'
          ]">
          <span class="material-symbols-outlined" :class="{ 'fill': route.path === item.path }">{{ item.icon }}</span>
          <span class="font-body">{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
    
    <div class="mt-auto space-y-4">
      <ul class="space-y-1">
        <li v-for="item in footerItems" :key="item.name">
          <router-link :to="item.path" :class="[
              'flex items-center gap-3 px-4 py-2 rounded-full transition-colors text-sm',
              route.path === item.path
                ? 'bg-surface-container-highest text-primary font-bold'
                : 'text-secondary font-medium hover:bg-surface-container-highest/50'
            ]">
            <span class="material-symbols-outlined text-[20px]" :class="{ 'fill': route.path === item.path }">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const navItems = ref([
  { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { name: 'Sales', icon: 'shopping_cart', path: '/sales' },
  { name: 'Inventory', icon: 'inventory_2', path: '/inventory' },
  { name: 'AI Insights', icon: 'auto_awesome', path: '/ai-insights' },
  { name: 'Staff', icon: 'groups', path: '/staff' },
]);

const footerItems = ref([
  { name: 'Settings', icon: 'settings', path: '/settings' },
]);
</script>