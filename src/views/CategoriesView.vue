<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <!-- SideNavBar -->
    <Sidebar />

    <!-- Main Content Area wrapper -->
    <div class="flex-1 flex flex-col h-screen min-w-0 z-10 relative">
      <!-- TopNavBar -->
      <TopNav :user="user" />

      <!-- Canvas -->
      <main class="flex-1 overflow-y-auto bg-surface rounded-tl-[32px] p-8 md:p-12 shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)]">
        <div class="max-w-5xl mx-auto space-y-12">
          <!-- Page Header -->
          <div>
            <h1 class="font-headline text-4xl text-on-surface mb-2">Inventory Categorization</h1>
            <p class="font-body text-on-surface-variant max-w-2xl">Manage your primary taxonomy for Makanan and Minuman. Toggle active status to instantly update POS availability.</p>
          </div>

          <!-- Bento Grid Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Categories Section (Takes up 2 columns) -->
            <div class="lg:col-span-2 space-y-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-headline text-2xl text-on-surface">Categories</h3>
                <button class="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full font-label text-sm font-semibold hover:bg-primary-container transition-colors cursor-pointer">
                  <span class="material-symbols-outlined text-sm">add</span> Add Category
                </button>
              </div>

              <!-- Category Cards -->
              <div class="space-y-4">
                <!-- Category Item -->
                <div v-for="category in categories" :key="category.id" 
                     :class="['rounded-lg p-6 group transition-colors cursor-pointer',
                              expandedCategory === category.id 
                                ? 'flex flex-col items-start gap-6 border border-primary/20 bg-surface-container' 
                                : 'flex items-center justify-between bg-surface-container-low hover:bg-surface-container']"
                     @click="toggleExpand(category.id)">
                     
                  <div :class="['flex items-center justify-between', expandedCategory === category.id ? 'w-full' : '']">
                    <div class="flex items-center gap-5">
                      <div :class="['w-12 h-12 rounded-full flex items-center justify-center', category.iconBg, category.iconText]">
                        <span class="material-symbols-outlined">{{ category.icon }}</span>
                      </div>
                      <div>
                        <h4 class="font-headline text-xl text-on-surface">{{ category.name }}</h4>
                        <p class="font-body text-sm text-on-surface-variant mt-1">{{ category.items }} active items</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-6" @click.stop>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" v-model="category.active" />
                        <div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div v-if="expandedCategory === category.id" class="flex items-center gap-3 w-full pt-4 border-t border-outline-variant/30" @click.stop>
                    <button class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-surface-container-highest text-on-surface rounded-full font-label text-sm font-semibold hover:bg-surface-variant transition-colors cursor-pointer">
                      <span class="material-symbols-outlined text-[18px]">edit</span> Edit Details
                    </button>
                    <button class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-error/10 text-error rounded-full font-label text-sm font-semibold hover:bg-error/20 transition-colors cursor-pointer">
                      <span class="material-symbols-outlined text-[18px]">delete</span> Delete Category
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Global Settings Sidebar -->
            <div class="lg:col-span-1">
              <div class="bg-surface-container-low rounded-[2rem] p-8 sticky top-24">
                <h3 class="font-headline text-2xl text-on-surface mb-6">Global Defaults</h3>
                <div class="space-y-6">
                  <!-- Setting Group -->
                  <div>
                    <label class="block font-label text-sm font-semibold text-on-surface mb-2">Base Tax Rate (%)</label>
                    <div class="relative">
                      <input class="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 font-body text-on-surface focus:ring-0 focus:bg-surface-container-lowest transition-colors outline-none" type="number" value="11.00" />
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-sm">percent</span>
                    </div>
                    <p class="font-body text-xs text-on-surface-variant mt-2">Applied globally unless overridden per item.</p>
                  </div>

                  <!-- Setting Group -->
                  <div>
                    <label class="block font-label text-sm font-semibold text-on-surface mb-2">Default Currency</label>
                    <select class="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 font-body text-on-surface focus:ring-0 focus:bg-surface-container-lowest transition-colors appearance-none outline-none">
                      <option value="IDR">IDR - Indonesian Rupiah</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>

                  <!-- Setting Group -->
                  <div class="pt-4">
                    <label class="flex items-center justify-between cursor-pointer group">
                      <span class="font-label text-sm font-semibold text-on-surface">Auto-sync Inventory</span>
                      <div class="relative inline-flex items-center">
                        <input checked type="checkbox" class="sr-only peer" />
                        <div class="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                  </div>

                  <div class="pt-8">
                    <button class="w-full bg-surface-container-highest hover:bg-surface-variant text-on-surface py-3 rounded-full font-label font-semibold transition-colors cursor-pointer">
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
  name: 'Alex R.',
  email: 'alex.r@saku.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ2rNzAZRHA7G3Zrxdz0OBPJDQIlsXNluygqsZj_8Q8AoxgNcKgak88YwAZviKRpduq7UZxDTaL6O5XHkxOBXZnhRmfLBAeKlFuoimfrBNZ_u7eB4ZKYVi0xEMUfhUT3Ja7dai2ptCOjXjymWISfUb1xKHGVDTj9VJ7RonBdEZWd_P3bQ3sfMLa74LqcbRpmMurDurqwXvf6NSBpEqxxJAl3Asbq41nrhYk4SldlPDxJ_UFvBJuYyk50EPUNvRst5V-DO_hDtf2lE'
});

const categories = ref([
  { id: 1, name: 'Makanan Utama', icon: 'restaurant', iconBg: 'bg-secondary-container', iconText: 'text-on-secondary-container', items: 42, active: true },
  { id: 2, name: 'Minuman Dingin', icon: 'local_cafe', iconBg: 'bg-tertiary-container', iconText: 'text-on-tertiary-container', items: 28, active: true },
  { id: 3, name: 'Cemilan Ringan', icon: 'tapas', iconBg: 'bg-surface-variant', iconText: 'text-on-surface-variant', items: 15, active: false },
  { id: 4, name: 'Dessert', icon: 'cake', iconBg: 'bg-secondary-container', iconText: 'text-on-secondary-container', items: 8, active: true },
]);

const expandedCategory = ref<number | null>(null);

const toggleExpand = (id: number) => {
  if (expandedCategory.value === id) {
    expandedCategory.value = null;
  } else {
    expandedCategory.value = id;
  }
};
</script>
