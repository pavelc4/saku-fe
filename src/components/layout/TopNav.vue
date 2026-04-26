<template>
  <header class="h-20 w-full flex justify-between items-center px-12 bg-surface-container-low z-30 shrink-0 relative">
    <div class="relative w-64">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
      <input class="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-highest border-none focus:ring-0 focus:bg-surface-container-lowest transition-colors font-body text-sm text-on-surface placeholder:text-on-surface-variant" placeholder="Search..." type="text"/>
    </div>
    <div class="flex items-center gap-4 relative" ref="navContainer">
      <button @click="showNotifications = !showNotifications" class="h-10 w-10 rounded-full hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors relative cursor-pointer">
        <span class="material-symbols-outlined">notifications</span>
        <span v-if="unreadCount > 0" class="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
      </button>
      <button v-if="showCloseShift" @click="$emit('close-shift')" class="font-body font-semibold text-primary hover:bg-surface-container-highest transition-colors px-4 py-2 bg-surface-container rounded-full cursor-pointer hidden md:block">
        Tutup Shift
      </button>

      <!-- Notification Center Card -->
      <div v-if="showNotifications" class="absolute top-14 right-0 w-[420px] bg-surface rounded-xl shadow-[0_24px_48px_rgba(27,28,24,0.06)] overflow-hidden flex flex-col border border-outline-variant/20 origin-top-right animate-in fade-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="px-8 py-6 flex justify-between items-baseline bg-surface-container-low rounded-t-xl shrink-0 border-b border-outline-variant/10">
          <h2 class="text-2xl font-headline font-medium text-on-surface">Notifications</h2>
          <button v-if="unreadCount > 0" @click="handleMarkAllRead" class="text-sm font-label font-medium text-primary hover:text-primary-container transition-colors focus:outline-none cursor-pointer">
            Mark All Read
          </button>
        </div>
        <!-- Notification List -->
        <div class="flex-1 overflow-y-auto max-h-[400px] bg-surface">
          <!-- Empty State -->
          <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-3">notifications_none</span>
            <p class="text-on-surface-variant text-sm">No notifications yet</p>
          </div>
          <!-- Notifications -->
          <div v-for="notif in notifications" :key="notif.id" 
               :class="['group flex gap-4 p-6 hover:bg-surface-container-highest transition-colors duration-300 relative cursor-pointer', getBorderColor(notif.type), !notif.is_read ? 'bg-primary-container/10' : '']"
               @click="handleMarkAsRead(notif.id)">
            <div :class="['w-10 h-10 rounded-full flex items-center justify-center shrink-0', notif.type === 'warning' || notif.type === 'alert' ? 'bg-error-container' : notif.type === 'success' ? 'bg-tertiary-container/30' : 'bg-surface-variant']">
              <span :class="['material-symbols-outlined', notif.type === 'warning' || notif.type === 'alert' ? 'text-on-error-container' : notif.type === 'success' ? 'text-tertiary' : 'text-on-surface-variant']" style="font-variation-settings: 'FILL' 1;">{{ getIcon(notif.type) }}</span>
            </div>
            <div class="flex-1 pt-1">
              <h3 class="text-base font-body font-semibold text-on-surface mb-1">{{ notif.title }}</h3>
              <p class="text-sm font-body text-on-surface-variant line-clamp-2">{{ notif.message }}</p>
              <span class="text-xs font-label text-secondary mt-2 block">{{ formatTime(notif.created_at) }}</span>
            </div>
            <button @click.stop="handleDelete(notif.id)" class="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-on-surface-variant hover:text-on-surface focus:outline-none absolute top-4 right-4 cursor-pointer">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>
        <!-- Footer / Action Area -->
        <div class="p-4 bg-surface-container-low rounded-b-xl shrink-0 flex justify-center border-t border-outline-variant/10">
          <router-link to="/notifications" @click="showNotifications = false" class="text-sm font-label font-medium text-secondary hover:text-on-surface transition-colors focus:outline-none cursor-pointer">
            View All Notifications
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useNotificationsStore } from '../../stores/notifications';
import { getR2Url } from '../../stores/auth';

defineProps<{
  user: { name: string; avatar: string },
  showCloseShift?: boolean
}>();

defineEmits(['close-shift']);

const notifStore = useNotificationsStore();
const showNotifications = ref(false);
const navContainer = ref<HTMLElement | null>(null);

const unreadCount = computed(() => notifStore.unreadCount);
const notifications = computed(() => notifStore.notifications);

function formatTime(timestamp: number) {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function getIcon(type: string) {
  switch (type) {
    case 'warning': case 'alert': return 'warning';
    case 'success': return 'payments';
    case 'error': return 'error';
    default: return 'notifications';
  }
}

function getBorderColor(type: string) {
  switch (type) {
    case 'warning': case 'alert': return 'border-l-4 border-error';
    case 'success': return 'border-l-4 border-tertiary';
    case 'error': return 'border-l-4 border-error';
    default: return 'border-l-4 border-transparent';
  }
}

const closeNotifications = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (navContainer.value && !navContainer.value.contains(target)) {
    showNotifications.value = false;
  }
};

const handleMarkAllRead = async () => {
  await notifStore.markAllAsRead();
};

const handleDelete = async (id: string) => {
  await notifStore.deleteNotification(id);
};

const handleMarkAsRead = async (id: string) => {
  await notifStore.markAsRead(id);
};

onMounted(async () => {
  document.addEventListener('click', closeNotifications);
  await notifStore.fetchNotifications();
});

onUnmounted(() => {
  document.removeEventListener('click', closeNotifications);
});
</script>
