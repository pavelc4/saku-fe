<template>
  <aside class="bg-surface-container-low rounded-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-headline text-xl font-medium text-on-surface">Low Stock</h3>
      <span class="material-symbols-outlined text-error">warning</span>
    </div>
    <ul class="space-y-4">
      <li v-for="item in items" :key="item.name" class="flex items-center gap-4 p-3 bg-surface-container-lowest rounded-lg hover:bg-surface-bright transition-colors cursor-pointer">
        <div class="w-12 h-12 rounded-lg overflow-hidden shrink-0" :class="{ 'bg-surface-variant flex items-center justify-center text-on-surface-variant font-headline': !item.image }">
          <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
          <span v-else>{{ item.initials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-body font-medium text-on-surface truncate">{{ item.name }}</h4>
          <p class="font-body text-sm" :class="item.statusColor">{{ item.remaining }} Remaining</p>
        </div>
        <button @click.stop="$emit('restock', item.id)" class="h-8 w-8 rounded-full flex items-center justify-center hover:bg-surface-container-highest text-secondary cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">add</span>
        </button>
      </li>
    </ul>
    <router-link to="/inventory" class="block w-full mt-6 py-2 text-primary font-body text-sm font-medium hover:underline text-center cursor-pointer">View All Inventory</router-link>
  </aside>
</template>

<script setup lang="ts">
export interface StockItem {
  id?: string;
  name: string;
  remaining: number;
  image: string;
  initials: string;
  statusColor: string;
}

defineProps<{
  items: StockItem[];
}>();

defineEmits<{
  restock: [id: string];
}>();
</script>
