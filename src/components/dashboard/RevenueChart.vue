<template>
  <section class="bg-surface-container-lowest rounded-lg p-8">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h3 class="font-headline text-2xl font-medium text-on-surface">Weekly Revenue</h3>
        <p class="font-body text-sm text-on-surface-variant mt-1">Past 7 Days</p>
      </div>
      <div class="font-headline text-2xl text-primary">{{ total }}</div>
    </div>
    <div class="h-48 flex items-end justify-between gap-2 md:gap-4 pt-4 border-b border-surface-container-highest pb-2">
      <div v-for="(bar, index) in data" :key="index"
           :class="[
             'w-full rounded-t-sm relative group transition-colors',
             bar.isToday ? 'bg-primary' : 'bg-surface-container-highest hover:bg-primary-container'
           ]"
           :style="{ height: bar.height }">
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded font-body transition-opacity"
             :class="bar.isToday ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">
          {{ bar.label }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface ChartBar {
  label: string;
  height: string;
  isToday: boolean;
}

defineProps<{
  total: string;
  data: ChartBar[];
}>();
</script>
