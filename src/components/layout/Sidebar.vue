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
      <!-- User Info -->
      <div class="flex items-center gap-3 px-4 py-3 rounded-full bg-surface-container-highest">
        <img v-if="user && user.avatar" :src="getR2Url(user.avatar)" alt="User" class="w-10 h-10 rounded-full object-cover" />
        <div v-else class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
          <span class="material-symbols-outlined text-on-surface-variant">account_circle</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-on-surface text-sm truncate">{{ user?.name || 'User' }}</p>
          <p class="text-xs text-on-surface-variant truncate">{{ user?.email || '' }}</p>
        </div>
      </div>
      
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
      <button @click="authStore.logout()" class="w-full flex items-center gap-3 px-4 py-2 rounded-full transition-colors text-sm text-error font-medium hover:bg-error/10">
        <span class="material-symbols-outlined text-[20px]">logout</span>
        <span>Keluar</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore, getR2Url } from '../../stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const navItems = ref([
  { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { name: 'Transactions', icon: 'receipt_long', path: '/transactions' },
  { name: 'Sales', icon: 'shopping_cart', path: '/sales' },
  { name: 'Inventory', icon: 'inventory_2', path: '/inventory' },
  { name: 'Categories', icon: 'category', path: '/categories' },
  { name: 'Notifications', icon: 'notifications', path: '/notifications' },
  { name: 'AI', icon: 'auto_awesome', path: '/ai-insights' },
]);

const footerItems = ref([
  { name: 'Settings', icon: 'settings', path: '/settings' },
]);
</script>