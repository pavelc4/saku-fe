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
                <button @click="showAddModal = true" class="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-label text-sm font-semibold hover:bg-primary-container transition-all shadow-sm active:scale-95 cursor-pointer">
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
                    <button @click.stop="openEditModal(category)" class="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-highest text-on-surface rounded-full font-label text-sm font-semibold hover:bg-surface-variant transition-colors cursor-pointer">
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

  <!-- MODAL OVERLAY -->
  <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/30 backdrop-blur-[4px] transition-opacity">
    <!-- MODAL DIALOG -->
    <div class="bg-surface-container-lowest rounded-xl p-10 max-w-[520px] w-full mx-4 shadow-[0_48px_100px_-24px_rgba(27,28,24,0.15)] flex flex-col gap-10 transform transition-transform scale-100 relative overflow-hidden">
      <!-- Subtle decorative gradient orb in background -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <!-- Header -->
      <div>
        <h2 class="font-headline text-4xl text-on-surface tracking-tight mb-2">Tambah Kategori Baru</h2>
        <p class="font-body text-on-surface-variant text-base">Atur katalog produk Anda dengan kategori yang spesifik.</p>
      </div>
      
      <!-- Form Content -->
      <div class="flex flex-col gap-8">
        <!-- Input: Nama Kategori -->
        <div class="flex flex-col gap-3">
          <label class="font-label text-sm font-semibold text-on-surface-variant uppercase tracking-wider" for="categoryName">Nama Kategori</label>
          <input class="w-full bg-surface-container-low hover:bg-surface-container transition-colors border-0 rounded-lg px-5 py-4 font-body text-on-surface text-lg placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-surface-container-highest" id="categoryName" placeholder="Misal: Dessert atau Coffee" type="text" />
        </div>
        
        <!-- Input: Ikon Kategori -->
        <div class="flex flex-col gap-3">
          <label class="font-label text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Ikon Kategori</label>
          <div class="grid grid-cols-6 gap-3">
            <button class="aspect-square rounded-full bg-primary-container text-on-primary-container flex items-center justify-center transition-colors cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="local_cafe" data-weight="fill" style="font-variation-settings: 'FILL' 1;">local_cafe</span>
            </button>
            <button class="aspect-square rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="restaurant">restaurant</span>
            </button>
            <button class="aspect-square rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="local_pizza">local_pizza</span>
            </button>
            <button class="aspect-square rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="cake">cake</span>
            </button>
            <button class="aspect-square rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="icecream">icecream</span>
            </button>
            <button class="aspect-square rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="local_bar">local_bar</span>
            </button>
            <button class="aspect-square rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="bakery_dining">bakery_dining</span>
            </button>
            <button class="aspect-square rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="fastfood">fastfood</span>
            </button>
            <button class="aspect-square rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="ramen_dining">ramen_dining</span>
            </button>
            <button class="aspect-square rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="kebab_dining">kebab_dining</span>
            </button>
            <button class="aspect-square rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="tapas">tapas</span>
            </button>
            <button class="aspect-square rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer" type="button">
              <span class="material-symbols-outlined" data-icon="liquor">liquor</span>
            </button>
          </div>
        </div>
        
        <!-- Input: Warna Aksen (Color Picker) -->
        <div class="flex flex-col gap-3">
          <label class="font-label text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Warna Aksen</label>
          <div class="flex gap-4 items-center">
            <button aria-label="Select primary color" class="w-10 h-10 rounded-full bg-primary relative flex items-center justify-center cursor-pointer" type="button">
              <span class="absolute inset-[-6px] rounded-full border-2 border-primary/30"></span>
              <span class="material-symbols-outlined text-white text-sm" data-icon="check">check</span>
            </button>
            <button aria-label="Select tertiary color" class="w-10 h-10 rounded-full bg-tertiary hover:scale-110 transition-transform cursor-pointer" type="button"></button>
            <button aria-label="Select secondary color" class="w-10 h-10 rounded-full bg-secondary hover:scale-110 transition-transform cursor-pointer" type="button"></button>
            <button aria-label="Select earth brown color" class="w-10 h-10 rounded-full bg-[#8b5a2b] hover:scale-110 transition-transform cursor-pointer" type="button"></button>
            <button aria-label="Select olive green color" class="w-10 h-10 rounded-full bg-[#556b2f] hover:scale-110 transition-transform cursor-pointer" type="button"></button>
            <button aria-label="Select warm red color" class="w-10 h-10 rounded-full bg-[#cd5c5c] hover:scale-110 transition-transform cursor-pointer" type="button"></button>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center justify-end gap-4 mt-4 pt-6 border-t-0">
        <button @click="showAddModal = false" class="px-8 py-3 rounded-full font-label font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer" type="button">
          Batal
        </button>
        <button @click="showAddModal = false" class="px-8 py-3 rounded-full font-label font-semibold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-[0_8px_16px_-4px_rgba(154,64,33,0.2)] transition-all cursor-pointer" type="button">
          Tambah Kategori
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL OVERLAY (Edit Category) -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-on-surface/20 backdrop-blur-[4px]">
    <!-- Modal Container -->
    <div class="bg-surface w-full max-w-md rounded-xl shadow-[0_32px_64px_-16px_rgba(27,28,24,0.1)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <!-- Header -->
      <div class="px-8 py-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
        <h2 class="font-headline text-2xl text-on-surface font-medium">Edit Category</h2>
        <button @click="closeEditModal" class="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors cursor-pointer">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <!-- Body -->
      <div class="p-8 flex flex-col gap-8 bg-surface-container-lowest overflow-y-auto">
        <!-- Category Name -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Category Name</label>
          <input v-model="selectedCategoryToEdit.name" class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all" type="text" />
        </div>
        <!-- Icon Selection -->
        <div class="flex flex-col gap-3">
          <label class="text-sm font-bold text-on-surface-variant uppercase tracking-wider flex justify-between">
            Category Icon
            <span class="text-primary normal-case font-medium cursor-pointer hover:underline">View all</span>
          </label>
          <div class="grid grid-cols-5 gap-3">
            <button aria-label="restaurant" class="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">restaurant</span>
            </button>
            <button aria-label="local_cafe" class="w-14 h-14 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest flex items-center justify-center transition-colors cursor-pointer">
              <span class="material-symbols-outlined">local_cafe</span>
            </button>
            <button aria-label="icecream" class="w-14 h-14 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest flex items-center justify-center transition-colors cursor-pointer">
              <span class="material-symbols-outlined">icecream</span>
            </button>
            <button aria-label="lunch_dining" class="w-14 h-14 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest flex items-center justify-center transition-colors cursor-pointer">
              <span class="material-symbols-outlined">lunch_dining</span>
            </button>
            <button aria-label="local_bar" class="w-14 h-14 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest flex items-center justify-center transition-colors cursor-pointer">
              <span class="material-symbols-outlined">local_bar</span>
            </button>
          </div>
        </div>
        <!-- Accent Color Selection -->
        <div class="flex flex-col gap-3">
          <label class="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Accent Color</label>
          <div class="flex gap-4">
            <button class="w-10 h-10 rounded-full bg-primary relative flex items-center justify-center outline outline-2 outline-offset-2 outline-primary transition-all cursor-pointer">
              <span class="material-symbols-outlined text-white text-sm font-bold">check</span>
            </button>
            <button class="w-10 h-10 rounded-full bg-tertiary-container hover:scale-110 transition-transform cursor-pointer border border-black/10"></button>
            <button class="w-10 h-10 rounded-full bg-secondary-container hover:scale-110 transition-transform cursor-pointer border border-black/10"></button>
            <button class="w-10 h-10 rounded-full bg-error-container hover:scale-110 transition-transform cursor-pointer border border-black/10"></button>
          </div>
        </div>
      </div>
      <!-- Footer Actions -->
      <div class="px-8 py-6 bg-surface-container flex justify-end gap-4 rounded-b-xl border-t border-outline-variant/10">
        <button @click="closeEditModal" class="px-6 py-3 rounded-full text-on-surface font-bold hover:bg-surface-container-highest transition-colors cursor-pointer">
          Cancel
        </button>
        <button @click="closeEditModal" class="px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-container transition-colors shadow-sm shadow-primary/20 cursor-pointer">
          Save Changes
        </button>
      </div>
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
const showAddModal = ref(false);

const showEditModal = ref(false);
const selectedCategoryToEdit = ref<any>(null);

const openEditModal = (cat: any) => {
  selectedCategoryToEdit.value = { ...cat };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedCategoryToEdit.value = null;
};

const toggleExpand = (id: number) => {
  // Toggle: jika yang diklik sudah terbuka, tutup. Jika belum, buka.
  expandedCategory.value = expandedCategory.value === id ? null : id;
};
</script>