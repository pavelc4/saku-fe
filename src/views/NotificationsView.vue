<template>
  <div>
        <div class="max-w-5xl mx-auto space-y-12">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 class="font-headline text-2xl sm:text-3xl md:text-4xl text-on-surface tracking-tight">Notifications</h1>
            
            <div class="flex items-center gap-6">
              <!-- Utilities -->
              <div class="flex gap-4">
                <button class="p-3 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant group relative cursor-pointer">
                  <span class="material-symbols-outlined group-hover:text-primary transition-colors">filter_list</span>
                  <div class="absolute inset-0 rounded-full group-hover:shadow-[0_0_24px_rgba(154,64,33,0.1)] transition-shadow"></div>
                </button>
                <button class="p-3 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant group relative cursor-pointer">
                  <span class="material-symbols-outlined group-hover:text-error transition-colors">delete_sweep</span>
                  <div class="absolute inset-0 rounded-full group-hover:shadow-[0_0_24px_rgba(186,26,26,0.1)] transition-shadow"></div>
                </button>
              </div>
            </div>
          </div>

          <!-- Filter & Action Row -->
          <div class="flex flex-col sm:flex-row gap-4 justify-between items-end mb-8">
            <div class="flex flex-wrap gap-2 sm:gap-3">
              <button class="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface font-medium text-sm transition-colors hover:bg-surface-variant cursor-pointer">All</button>
            </div>
            <button @click="handleMarkAllRead" class="text-primary font-medium text-sm hover:opacity-80 transition-opacity flex items-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">done_all</span>
              Mark all as read
            </button>
          </div>

          <!-- Notifications List -->
          <div class="space-y-4">
            <!-- Empty State -->
            <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
              <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-3">notifications_none</span>
              <p class="text-on-surface-variant text-sm">Belum ada notifikasi</p>
            </div>

            <!-- Dynamic Items -->
            <div v-for="notif in notifications" :key="notif.id" 
                 :class="['group flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg bg-surface-container-lowest transition-all hover:bg-surface-container-low relative overflow-hidden border border-outline-variant/10 cursor-pointer', !notif.is_read ? 'bg-primary-container/10' : '']"
                 @click="handleMarkAsRead(notif.id)">
              <div :class="['absolute left-0 top-0 bottom-0 w-1.5', notif.type === 'warning' || notif.type === 'alert' ? 'bg-error' : notif.type === 'success' ? 'bg-tertiary' : 'bg-primary']"></div>
              
              <div :class="['flex-shrink-0 mt-1 w-12 h-12 rounded-full flex items-center justify-center', notif.type === 'warning' || notif.type === 'alert' ? 'bg-error-container/30 text-error' : notif.type === 'success' ? 'bg-tertiary-container/30 text-tertiary' : 'bg-primary-container/20 text-primary']">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">{{ getIcon(notif.type) }}</span>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 sm:gap-0 mb-1">
                  <h3 class="text-lg font-headline font-semibold text-on-surface truncate">{{ notif.title }}</h3>
                  <span class="text-xs text-on-surface-variant font-label whitespace-nowrap sm:ml-4">{{ formatTime(notif.created_at) }}</span>
                </div>
                <p class="text-on-surface-variant text-sm font-body leading-relaxed">{{ notif.message }}</p>
              </div>
              
              <button @click.stop="handleDelete(notif.id)" class="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-error transition-all rounded-full hover:bg-surface-variant self-center cursor-pointer">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>
          
        </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useNotificationsStore } from '../stores/notifications'

const notifStore = useNotificationsStore()

const notifications = computed(() => notifStore.notifications)

function formatTime(timestamp: number) {
  const now = Date.now()
  const diff = now - timestamp * 1000
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} mnt yang lalu`
  if (hours < 24) return `${hours} jam yang lalu`
  if (days === 1) return 'Kemarin'
  return `${days} hr yang lalu`
}

function getIcon(type: string) {
  switch (type) {
    case 'warning': case 'alert': return 'warning'
    case 'success': return 'payments'
    case 'error': return 'error'
    default: return 'notifications'
  }
}

const handleMarkAllRead = async () => {
  await notifStore.markAllAsRead()
}

const handleDelete = async (id: string) => {
  await notifStore.deleteNotification(id)
}

const handleMarkAsRead = async (id: string) => {
  await notifStore.markAsRead(id)
}

onMounted(async () => {
  await notifStore.fetchNotifications()
})
</script>

