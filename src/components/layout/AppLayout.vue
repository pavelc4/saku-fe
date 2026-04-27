<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <!-- Mobile Overlay -->
    <div 
      v-if="sidebarOpen && !isDesktop" 
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar (drawer on mobile, fixed on desktop) -->
    <nav :class="[
      'fixed lg:relative h-screen shrink-0 border-none bg-surface-container-low py-6 px-4 md:px-6 z-50 transition-transform duration-300',
      isDesktop ? 'lg:flex lg:flex-col lg:w-72 lg:py-8 lg:px-6' : 'flex flex-col w-72 -translate-x-full',
      !isDesktop && sidebarOpen ? 'translate-x-0' : ''
    ]">
      <div class="mb-8 md:mb-12 px-4 flex items-center justify-between">
        <h1 class="font-headline text-3xl font-medium text-primary">Saku</h1>
        <button 
          v-if="!isDesktop" 
          @click="sidebarOpen = false"
          class="lg:hidden p-2 -mr-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <ul class="flex-1 space-y-2 overflow-y-auto">
        <li v-for="item in navItems" :key="item.name">
          <router-link 
            :to="item.path" 
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-full transition-all',
              route.path === item.path 
                ? 'bg-surface-container-highest text-primary font-bold' 
                : 'text-secondary font-medium hover:bg-surface-container-highest/50 transition-colors'
            ]"
            @click="!isDesktop && (sidebarOpen = false)"
          >
            <span class="material-symbols-outlined" :class="{ 'fill': route.path === item.path }">{{ item.icon }}</span>
            <span class="font-body">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
      
      <div class="mt-auto pt-4 space-y-4">
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
            <router-link 
              :to="item.path" 
              :class="[
                'flex items-center gap-3 px-4 py-2 rounded-full transition-colors text-sm',
                route.path === item.path
                  ? 'bg-surface-container-highest text-primary font-bold'
                  : 'text-secondary font-medium hover:bg-surface-container-highest/50'
              ]"
              @click="!isDesktop && (sidebarOpen = false)"
            >
              <span class="material-symbols-outlined text-[20px]" :class="{ 'fill': route.path === item.path }">{{ item.icon }}</span>
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2 rounded-full transition-colors text-sm text-error font-medium hover:bg-error/10">
          <span class="material-symbols-outlined text-[20px]">logout</span>
          <span>Keluar</span>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
      <!-- TopNav with hamburger button -->
      <header class="h-16 md:h-20 w-full flex justify-between items-center px-4 md:px-8 lg:px-12 bg-surface-container-low z-30 shrink-0 relative">
        <div class="flex items-center gap-3">
          <button 
            @click="sidebarOpen = !sidebarOpen"
            class="lg:hidden p-2 -ml-2 hover:bg-surface-container-highest rounded-full text-on-surface-variant transition-colors"
          >
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>

        <div class="hidden md:flex relative w-48 lg:w-64">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input class="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-highest border-none focus:ring-0 focus:bg-surface-container-lowest transition-colors font-body text-sm text-on-surface placeholder:text-on-surface-variant" placeholder="Search..." type="text"/>
        </div>

        <div class="flex items-center gap-2 md:gap-4 relative">
          <button @click="showNotifications = !showNotifications" class="h-10 w-10 rounded-full hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors relative cursor-pointer">
            <span class="material-symbols-outlined">notifications</span>
            <span v-if="unreadCount > 0" class="absolute top-1 right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
          </button>
        </div>

        <!-- Notification Dropdown (simplified for mobile) -->
        <div v-if="showNotifications" class="absolute top-16 md:top-20 right-4 w-[300px] md:w-[420px] bg-surface rounded-xl shadow-lg overflow-hidden origin-top-right">
          <div class="p-4 bg-surface-container-low rounded-t-xl border-b border-outline-variant/10 flex justify-between items-center">
            <h3 class="font-headline font-medium text-on-surface">Notifications</h3>
            <button @click="showNotifications = false" class="p-1">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          <div class="max-h-[300px] overflow-y-auto">
            <div v-if="notifications.length === 0" class="p-8 text-center text-on-surface-variant">
              No notifications
            </div>
            <div v-else v-for="notif in notifications" :key="notif.id" class="p-4 border-b border-outline-variant/10 hover:bg-surface-container-highest">
              <p class="font-medium text-sm text-on-surface">{{ notif.title }}</p>
              <p class="text-xs text-on-surface-variant mt-1">{{ notif.message }}</p>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto bg-surface rounded-tl-[24px] md:rounded-tl-[32px] p-4 md:p-6 lg:p-12 shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)]">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore, getR2Url } from '../../stores/auth';
import { useNotificationsStore } from '../../stores/notifications';

defineProps<{
  user?: { name: string; avatar: string };
}>();

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const notifStore = useNotificationsStore();

const user = computed(() => authStore.user);
const notifications = computed(() => notifStore.notifications);
const unreadCount = computed(() => notifStore.unreadCount);

const sidebarOpen = ref(false);
const isDesktop = ref(true);
const showNotifications = ref(false);

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

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const checkDesktop = () => {
  isDesktop.value = window.innerWidth >= 1024;
  if (isDesktop.value) sidebarOpen.value = false;
};

onMounted(() => {
  checkDesktop();
  window.addEventListener('resize', checkDesktop);
  notifStore.fetchNotifications();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkDesktop);
});
</script>