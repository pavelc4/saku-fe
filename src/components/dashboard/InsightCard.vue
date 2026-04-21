<template>
  <section class="bg-surface-container-lowest rounded-xl p-8 relative overflow-hidden group">
    <div class="absolute -right-20 -top-20 w-64 h-64 bg-[radial-gradient(circle,rgba(185,88,55,0.1)_0%,transparent_70%)] rounded-full blur-2xl"></div>
    <div class="flex items-start gap-4 relative z-10">
      <div class="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined fill text-primary">auto_awesome</span>
      </div>
      <div>
        <h3 class="font-headline text-2xl font-medium text-on-surface mb-2">{{ title }}</h3>
        <p class="font-body text-on-surface-variant leading-relaxed mb-6">{{ message }}</p>
        <div class="flex gap-4">
          <button class="px-6 py-2 bg-primary-container text-on-primary-container rounded-full font-body font-medium text-sm hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">Review Inventory</button>
          <button class="px-6 py-2 bg-surface-container-highest text-on-surface rounded-full font-body font-medium text-sm hover:bg-surface-container-high transition-colors cursor-pointer">Dismiss</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
}>();
</script>
