<template>
  <aside class="relative overflow-hidden rounded-lg p-6 bg-secondary-container/30 backdrop-blur-xl border border-secondary-container/50">
    <div class="relative z-10 text-center">
      <span class="material-symbols-outlined text-4xl text-on-secondary-container mb-4">edit_document</span>
      <h3 class="font-headline text-lg font-medium text-on-surface mb-2">Daily Report</h3>
      <p class="font-body text-sm text-on-surface-variant mb-4">Request AI to generate daily summary.</p>
      <button @click="$emit('generate')" :disabled="loading" class="px-6 py-2 bg-on-surface text-surface rounded-full font-body font-medium text-sm w-full hover:bg-on-surface-variant transition-colors cursor-pointer disabled:opacity-50">
        {{ loading ? 'Generating...' : 'Generate Report' }}
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
}>();

defineEmits<{
  generate: [];
}>();
</script>
