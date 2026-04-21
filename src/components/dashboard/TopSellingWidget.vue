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
            <div class="h-full bg-primary rounded-full" :style="{ width: `${(product.sold / maxSold) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const topProducts = ref([
  { 
    id: 1, 
    name: 'Artisan Latte', 
    sold: 142, 
    revenue: 6390000, 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj-qrcBjRL4IY6UdC58jqBPzw50I3aklK_P9Ecnv3aXDiK4JVu0MgNj0nDHIO5bPMpc11rBryDCXYrk78huoLLf2sEVK1rerdvbE782ADkDG2x7RVjhZjhLK2DpSOPzWtmfu411zctDioQI0REH5WRqVQPDD78rilDiXr8MXcWWmgYjgNUFTICv8C0-jQ_KEOvU7sgmuU1CrHoBs92ofVXVkEhb_5MVp9oJPbaV0wW04GvSSlCfL9rPnMh5CmgWUM6H_ollHLfbyc',
    icon: ''
  },
  { 
    id: 2, 
    name: 'Butter Croissant', 
    sold: 98, 
    revenue: 3136000, 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgFTK5B_a1Kpoz0LtR53F3fj7x36li0UQWjB54YsCc_XHmsf3-ehjvWLAqPz4LIxlGkQ3gi9Pzatx3-VGofaVsBIklV12pCTfQ1rVL9vN1yyuD30miLnB9wC9gnBV6gv7NDRMmxCFuMUT-DGTPT_aJRBoM16fSYMkHLDwAf3hkrqXp_wj6UEbTO9kZ5roX6D6Hl0-wAp68_LuhRPhnD2gxnHbR8OeCjBlbN1Pzyy8yjJOnx7QF99WKZLOkXxhleDNGhoNsHxc3NH8',
    icon: ''
  },
  { 
    id: 3, 
    name: 'Matcha Powder', 
    sold: 45, 
    revenue: 2160000, 
    image: '',
    icon: 'local_drink'
  }
]);

const maxSold = computed(() => {
  return Math.max(...topProducts.value.map(p => p.sold));
});

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `Rp ${(value / 1000).toFixed(1)}K`;
  }
  return `Rp ${value}`;
};
</script>
