<script lang="ts">
  import Navbar from '$lib/components/common/Navbar.svelte';
  import Sidebar from '$lib/components/common/Sidebar.svelte';

  let { children } = $props();
</script>

<div class="flex min-h-screen w-full flex-col bg-background">
  <Navbar />
  <div class="flex flex-1">
    <Sidebar />
    <main class="flex-1 p-4 md:p-6 lg:p-8">
      {@render children()}
    </main>
  </div>
</div>
