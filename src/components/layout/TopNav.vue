<template>
  <header class="h-20 w-full flex justify-between items-center px-12 bg-surface-container-low z-30 shrink-0 relative">
    <div class="relative w-64">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
      <input class="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-highest border-none focus:ring-0 focus:bg-surface-container-lowest transition-colors font-body text-sm text-on-surface placeholder:text-on-surface-variant" placeholder="Search..." type="text"/>
    </div>
    <div class="flex items-center gap-4 relative" ref="navContainer">
      <button @click="showNotifications = !showNotifications" class="h-10 w-10 rounded-full hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors relative cursor-pointer">
        <span class="material-symbols-outlined">notifications</span>
        <span class="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"></span>
      </button>
      <button v-if="showCloseShift" @click="$emit('close-shift')" class="font-body font-semibold text-primary hover:bg-surface-container-highest transition-colors px-4 py-2 bg-surface-container rounded-full cursor-pointer hidden md:block">
        Tutup Shift
      </button>
      <button class="h-10 w-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-headline font-medium hover:opacity-80 transition-opacity overflow-hidden">
        <img v-if="user.avatar" :src="user.avatar" alt="User Profile" class="w-full h-full object-cover" />
      </button>

      <!-- Notification Center Card -->
      <div v-if="showNotifications" class="absolute top-14 right-0 w-[420px] bg-surface rounded-xl shadow-[0_24px_48px_rgba(27,28,24,0.06)] overflow-hidden flex flex-col border border-outline-variant/20 origin-top-right animate-in fade-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="px-8 py-6 flex justify-between items-baseline bg-surface-container-low rounded-t-xl shrink-0 border-b border-outline-variant/10">
          <h2 class="text-2xl font-headline font-medium text-on-surface">Notifications</h2>
          <button class="text-sm font-label font-medium text-primary hover:text-primary-container transition-colors focus:outline-none cursor-pointer">
            Clear All
          </button>
        </div>
        <!-- Notification List -->
        <div class="flex-1 overflow-y-auto max-h-[400px] bg-surface">
          <!-- Item 1: Alert/Warning -->
          <div class="group flex gap-4 p-6 hover:bg-surface-container-highest transition-colors duration-300 relative border-l-4 border-error">
            <div class="w-10 h-10 rounded-full bg-error-container flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-on-error-container" style="font-variation-settings: 'FILL' 1;">warning</span>
            </div>
            <div class="flex-1 pt-1">
              <h3 class="text-base font-body font-semibold text-on-surface mb-1">Low stock: Artisan Clay Mugs</h3>
              <p class="text-sm font-body text-on-surface-variant line-clamp-2">Only 4 units remaining in inventory. Reorder recommended.</p>
              <span class="text-xs font-label text-secondary mt-2 block">10 mins ago</span>
            </div>
            <button class="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-on-surface-variant hover:text-on-surface focus:outline-none absolute top-4 right-4 cursor-pointer">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <!-- Item 2: Success/Transaction -->
          <div class="group flex gap-4 p-6 hover:bg-surface-container-highest transition-colors duration-300 relative border-l-4 border-transparent">
            <div class="w-10 h-10 rounded-full bg-tertiary-container/30 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">payments</span>
            </div>
            <div class="flex-1 pt-1">
              <h3 class="text-base font-body font-semibold text-on-surface mb-1">New sale: Rp 450.000</h3>
              <p class="text-sm font-body text-on-surface-variant line-clamp-2">Order #4029 completed successfully via Credit Card.</p>
              <span class="text-xs font-label text-secondary mt-2 block">45 mins ago</span>
            </div>
            <button class="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-on-surface-variant hover:text-on-surface focus:outline-none absolute top-4 right-4 cursor-pointer">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <!-- Item 3: AI Insight -->
          <div class="group flex gap-4 p-6 hover:bg-surface-container-highest transition-colors duration-300 relative border-l-4 border-transparent">
            <div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
            </div>
            <div class="flex-1 pt-1">
              <h3 class="text-base font-body font-semibold text-on-surface mb-1">AI Insight ready</h3>
              <p class="text-sm font-body text-on-surface-variant line-clamp-2">Weekly sales trend analysis is complete. View to see predicted peak hours for next week.</p>
              <span class="text-xs font-label text-secondary mt-2 block">2 hours ago</span>
            </div>
            <button class="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-on-surface-variant hover:text-on-surface focus:outline-none absolute top-4 right-4 cursor-pointer">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <!-- Item 4: General Update -->
          <div class="group flex gap-4 p-6 hover:bg-surface-container-highest transition-colors duration-300 relative border-l-4 border-transparent">
            <div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-on-surface-variant" style="font-variation-settings: 'FILL' 1;">inventory_2</span>
            </div>
            <div class="flex-1 pt-1">
              <h3 class="text-base font-body font-semibold text-on-surface mb-1">Shipment Arrived</h3>
              <p class="text-sm font-body text-on-surface-variant line-clamp-2">Supplier delivery from 'Editorial Goods Co.' has been checked into the warehouse.</p>
              <span class="text-xs font-label text-secondary mt-2 block">Yesterday</span>
            </div>
            <button class="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-on-surface-variant hover:text-on-surface focus:outline-none absolute top-4 right-4 cursor-pointer">
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
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{
  user: { name: string; avatar: string },
  showCloseShift?: boolean
}>();

defineEmits(['close-shift']);

const showNotifications = ref(false);
const navContainer = ref<HTMLElement | null>(null);

const closeNotifications = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (navContainer.value && !navContainer.value.contains(target)) {
    showNotifications.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeNotifications);
});

onUnmounted(() => {
  document.removeEventListener('click', closeNotifications);
});
</script>
