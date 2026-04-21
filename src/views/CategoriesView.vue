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
                <!-- Category Item 1 -->
                <div class="bg-surface-container-low rounded-lg p-6 flex items-center justify-between group hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-5">
                    <div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <span class="material-symbols-outlined">restaurant</span>
                    </div>
                    <div>
                      <h4 class="font-headline text-xl text-on-surface">Makanan Utama</h4>
                      <p class="font-body text-sm text-on-surface-variant mt-1">42 active items</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-6">
                    <button class="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                      <span class="material-symbols-outlined">edit</span>
                    </button>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input checked type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <!-- Category Item 2 -->
                <div class="bg-surface-container-low rounded-lg p-6 flex items-center justify-between group hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-5">
                    <div class="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                      <span class="material-symbols-outlined">local_cafe</span>
                    </div>
                    <div>
                      <h4 class="font-headline text-xl text-on-surface">Minuman Dingin</h4>
                      <p class="font-body text-sm text-on-surface-variant mt-1">28 active items</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-6">
                    <button class="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                      <span class="material-symbols-outlined">edit</span>
                    </button>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input checked type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <!-- Category Item 3 -->
                <div class="bg-surface-container-low rounded-lg p-6 flex items-center justify-between group hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-5">
                    <div class="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                      <span class="material-symbols-outlined">tapas</span>
                    </div>
                    <div>
                      <h4 class="font-headline text-xl text-on-surface">Cemilan Ringan</h4>
                      <p class="font-body text-sm text-on-surface-variant mt-1">15 active items</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-6">
                    <button class="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                      <span class="material-symbols-outlined">edit</span>
                    </button>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <!-- Category Item 4 -->
                <div class="bg-surface-container-low rounded-lg p-6 flex items-center justify-between group hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-5">
                    <div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <span class="material-symbols-outlined">cake</span>
                    </div>
                    <div>
                      <h4 class="font-headline text-xl text-on-surface">Dessert</h4>
                      <p class="font-body text-sm text-on-surface-variant mt-1">8 active items</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-6">
                    <button class="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                      <span class="material-symbols-outlined">edit</span>
                    </button>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input checked type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
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
</script>
