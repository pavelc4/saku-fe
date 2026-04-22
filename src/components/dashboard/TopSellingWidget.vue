<template>
  <div class="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_16px_rgba(27,28,24,0.02)] border border-outline-variant/10">
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-headline text-xl text-on-surface font-medium">Produk Terlaris</h3>
      <span class="text-xs font-medium bg-surface-container-highest px-2 py-1 rounded text-on-surface-variant">Minggu Ini</span>
    </div>

    <div class="space-y-5">
      <div v-for="(product, index) in topProducts" :key="product.id" class="flex items-center gap-4">
        <div class="font-headline text-lg font-bold w-4 text-center" :class="index === 0 ? 'text-primary' : 'text-on-surface-variant'">
          {{ index + 1 }}
        </div>
        <div class="w-12 h-12 rounded-lg overflow-hidden shrink-0">
          <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
            <span class="material-symbols-outlined text-xl">{{ product.icon }}</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-on-surface text-sm truncate">{{ product.name }}</p>
          <div class="flex items-center justify-between mt-1">
            <p class="text-xs text-on-surface-variant">{{ product.sold }} terjual</p>
            <p class="text-xs font-bold text-primary">{{ formatCurrency(product.revenue) }}</p>
          </div>
          <!-- Progress Bar -->
          <div class="h-1.5 w-full bg-surface-container-highest rounded-full mt-2 overflow-hidden">
            <div class="h-full bg-primary rounded-full" :style="{ width: `${(product.sold / product.maxSold) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'

const dashboardStore = useDashboardStore()

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)

const topProducts = computed(() => {
  const items = dashboardStore.topSelling
  const maxSold = Math.max(...items.map((p: any) => p.sold || 0), 1)
  return items.map((p: any) => ({
    id: p.id,
    name: p.name,
    sold: p.sold || 0,
    revenue: p.revenue || 0,
    image: p.image_url || '',
    initials: p.name?.slice(0, 2).toUpperCase() || 'PR',
    maxSold,
  }))
})
</script>
