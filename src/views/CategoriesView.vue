<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <Sidebar />

    <div class="flex-1 flex flex-col h-screen min-w-0 z-10 relative">
      <TopNav :user="user" />

      <main class="flex-1 overflow-y-auto bg-surface rounded-tl-[32px] p-8 md:p-12 shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)]">
        <div class="max-w-5xl mx-auto space-y-12">
          <div>
            <h1 class="font-headline text-4xl text-on-surface mb-2 tracking-tight">Inventory Categorization</h1>
            <p class="font-body text-on-surface-variant max-w-2xl text-lg">Manage your primary taxonomy for Makanan and Minuman. Toggle active status to instantly update POS availability.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-headline text-2xl text-on-surface">Categories</h3>
                <button class="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-label text-sm font-semibold hover:bg-primary-container transition-all shadow-sm active:scale-95 cursor-pointer">
                  <span class="material-symbols-outlined text-sm">add</span> Add Category
                </button>
              </div>

              <div class="space-y-4">
                <div v-for="category in categories" :key="category.id" 
                     @click="toggleExpand(category.id)"
                     :class="['rounded-2xl p-6 transition-all duration-300 cursor-pointer border',
                              expandedCategory === category.id 
                                ? 'bg-surface-container border-primary/20 shadow-md' 
                                : 'bg-surface-container-low hover:bg-surface-container-high border-transparent']">
                     
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-5">
                      <div :class="['w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-inner', category.iconBg, category.iconText]">
                        <span class="material-symbols-outlined">{{ category.icon }}</span>
                      </div>
                      <div>
                        <h4 class="font-headline text-xl text-on-surface font-medium">{{ category.name }}</h4>
                        <p class="font-body text-sm text-on-surface-variant">{{ category.items }} active items</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center" @click.stop>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" v-model="category.active" />
                        <div class="w-11 h-6 bg-outline-variant/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div v-if="expandedCategory === category.id" 
                       class="flex items-center gap-3 w-full pt-6 mt-6 border-t border-outline-variant/20 animate-in fade-in slide-in-from-top-2" 
                       @click.stop>
                    <button class="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-highest text-on-surface rounded-full font-label text-sm font-semibold hover:bg-surface-variant transition-colors">
                      <span class="material-symbols-outlined text-[18px]">edit</span> Edit Details
                    </button>
                    <button class="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-error/10 text-error rounded-full font-label text-sm font-semibold hover:bg-error/20 transition-colors">
                      <span class="material-symbols-outlined text-[18px]">delete</span> Delete Category
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-1">
              <div class="bg-surface-container-low rounded-[2rem] p-8 sticky top-24 border border-outline-variant/10 shadow-sm">
                <h3 class="font-headline text-2xl text-on-surface mb-6 font-medium">Global Defaults</h3>
                <div class="space-y-6">
                  <div>
                    <label class="block font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-3">Base Tax Rate (%)</label>
                    <div class="relative group">
                      <input class="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 font-body text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" type="number" value="11.00" />
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-xl">percent</span>
                    </div>
                    <p class="font-body text-[11px] text-on-surface-variant mt-2 px-1">Applied globally unless overridden per item.</p>
                  </div>

                  <div>
                    <label class="block font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-3">Default Currency</label>
                    <div class="relative">
                      <select class="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 font-body text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all appearance-none outline-none">
                        <option value="IDR">IDR - Indonesian Rupiah</option>
                        <option value="USD">USD - US Dollar</option>
                      </select>
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined pointer-events-none">expand_more</span>
                    </div>
                  </div>

                  <div class="pt-4">
                    <label class="flex items-center justify-between cursor-pointer group p-1">
                      <span class="font-label text-sm font-semibold text-on-surface">Auto-sync Inventory</span>
                      <div class="relative inline-flex items-center">
                        <input checked type="checkbox" class="sr-only peer" />
                        <div class="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                  </div>

                  <div class="pt-8">
                    <button class="w-full bg-near-black text-white hover:bg-on-surface-variant py-4 rounded-full font-label font-bold text-sm transition-all active:scale-[0.98] shadow-md">
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';

const user = ref({
  name: 'Dimas Dwi',
  email: 'dimas@saku.id',
  avatar: 'https://github.com/pavelc4.png'
});

const categories = ref([
  { id: 1, name: 'Makanan Utama', icon: 'restaurant', iconBg: 'bg-secondary-container', iconText: 'text-on-secondary-container', items: 42, active: true },
  { id: 2, name: 'Minuman Dingin', icon: 'local_cafe', iconBg: 'bg-tertiary-container', iconText: 'text-on-tertiary-container', items: 28, active: true },
  { id: 3, name: 'Cemilan Ringan', icon: 'tapas', iconBg: 'bg-surface-variant', iconText: 'text-on-surface-variant', items: 15, active: false },
  { id: 4, name: 'Dessert', icon: 'cake', iconBg: 'bg-secondary-container', iconText: 'text-on-secondary-container', items: 8, active: true },
]);

const expandedCategory = ref<number | null>(null);

const toggleExpand = (id: number) => {
  // Toggle: jika yang diklik sudah terbuka, tutup. Jika belum, buka.
  expandedCategory.value = expandedCategory.value === id ? null : id;
};
</script>