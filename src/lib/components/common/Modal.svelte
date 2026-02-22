<script lang="ts">
  import { fade } from 'svelte/transition';
  
  let { isOpen, onClose, title, children } = $props<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: import('svelte').Snippet;
  }>();

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div 
    class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    onclick={handleBackdropClick}
    transition:fade={{ duration: 150 }}
  >
    <div class="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border flex flex-col max-h-[90vh]">
      <div class="flex items-center justify-between p-4 border-b border-border">
        <h2 class="font-semibold text-lg">{title}</h2>
        <button 
          onclick={onClose}
          class="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
        </button>
      </div>
      
      <div class="p-4 overflow-y-auto">
        {@render children()}
      </div>
    </div>
  </div>
{/if}
