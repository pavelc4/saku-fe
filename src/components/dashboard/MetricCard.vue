<template>
  <div class="bg-surface-container-low rounded-lg p-6 hover:bg-surface-container transition-colors">
    <div class="flex justify-between items-start mb-4">
      <h4 class="font-body text-sm font-medium text-on-surface-variant uppercase tracking-wider">{{ title }}</h4>
      <span class="material-symbols-outlined" :class="iconColorClass">{{ icon }}</span>
    </div>
    <div class="font-headline text-4xl text-on-surface mb-2">{{ value }}</div>
    <div class="font-body text-sm flex items-center gap-1" :class="trendTextColorClass">
      <span v-if="trendIcon" class="material-symbols-outlined text-[16px]">{{ trendIcon }}</span>
      {{ trendText }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  icon: string;
  iconColorClass: string;
  trendText: string;
  trendIcon?: string;
  trendTextColorClass: string;
}>();
</script>
