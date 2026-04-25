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
                <div v-for="category in categoriesStore.items" :key="category.id" 
                     @click="toggleExpand(category.id)"
                     :class="['rounded-2xl p-6 transition-all duration-300 cursor-pointer border',
                              expandedCategory === category.id 
                                ? 'bg-surface-container border-primary/20 shadow-md' 
                                : 'bg-surface-container-low hover:bg-surface-container-high border-transparent']">
                     
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-5">
                      <div 
                        :style="{ backgroundColor: (category.color || '#c96442') + '15', color: category.color || '#c96442' }"
                        class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-inner"
                      >
                        <span class="material-symbols-outlined">{{ category.icon || 'category' }}</span>
                      </div>
                      <div>
                        <h4 class="font-headline text-xl text-on-surface font-medium">{{ category.name }}</h4>
                        <p class="font-body text-sm text-on-surface-variant">{{ category.items }} active items</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center" @click.stop>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" :checked="category.is_active !== false" @change="toggleActive(category.id, !category.is_active)" />
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
                    <button @click.stop="openDeleteModal(category)" class="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-error/10 text-error rounded-full font-label text-sm font-semibold hover:bg-error/20 transition-colors cursor-pointer">
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
                      <input v-model.number="settings.tax_rate" class="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 font-body text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" type="number" step="0.1" />
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
                        <input v-model="settings.auto_sync_inventory" type="checkbox" class="sr-only peer" />
                        <div class="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                  </div>

                  <div class="pt-8">
                    <button @click="saveSettings" :disabled="settingsLoading" class="w-full bg-near-black text-white hover:bg-on-surface-variant py-4 rounded-full font-label font-bold text-sm transition-all active:scale-[0.98] shadow-md disabled:opacity-50">
                      {{ settingsLoading ? 'Menyimpan...' : 'Save Configuration' }}
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
          <input v-model="newCategoryName" class="w-full bg-surface-container-low hover:bg-surface-container transition-colors border-0 rounded-lg px-5 py-4 font-body text-on-surface text-lg placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-surface-container-highest" id="categoryName" placeholder="Misal: Dessert atau Coffee" type="text" />
        </div>
        
        <!-- Input: Ikon Kategori -->
        <div class="flex flex-col gap-3">
          <label class="font-label text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Ikon Kategori</label>
          <div class="grid grid-cols-8 gap-2">
            <button v-for="icon in categoryIcons" :key="icon"
              @click="newCategoryIcon = icon"
              :class="['aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer',
                newCategoryIcon === icon ? 'bg-primary text-on-primary shadow-md scale-105' : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface']"
              type="button">
              <span class="material-symbols-outlined text-xl">{{ icon }}</span>
            </button>
          </div>
        </div>
        
        <!-- Input: Warna Aksen (Color Picker) -->
        <div class="flex flex-col gap-3">
          <label class="font-label text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Warna Aksen</label>
          <div class="flex gap-3 flex-wrap">
            <button v-for="color in categoryColors" :key="color.value"
              @click="newCategoryColor = color.value"
              :class="['w-10 h-10 rounded-full transition-all cursor-pointer',
                newCategoryColor === color.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110']"
              :style="{ backgroundColor: color.value }">
            </button>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center justify-end gap-4 mt-4 pt-6 border-t-0">
        <button @click="showAddModal = false" class="px-8 py-3 rounded-full font-label font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer" type="button">
          Batal
        </button>
        <button @click="addCategory" :disabled="addLoading" class="px-8 py-3 rounded-full font-label font-semibold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-[0_8px_16px_-4px_rgba(154,64,33,0.2)] transition-all cursor-pointer disabled:opacity-50" type="button">
          {{ addLoading ? 'Menyimpan...' : 'Tambah Kategori' }}
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
          <div class="grid grid-cols-8 gap-2">
            <button v-for="icon in categoryIcons" :key="icon"
              @click="selectedCategoryToEdit.icon = icon"
              :class="['aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer',
                selectedCategoryToEdit.icon === icon ? 'bg-primary text-on-primary shadow-md scale-105' : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface']"
              type="button">
              <span class="material-symbols-outlined text-xl">{{ icon }}</span>
            </button>
          </div>
        </div>
        <!-- Accent Color Selection -->
        <div class="flex flex-col gap-3">
          <label class="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Accent Color</label>
          <div class="flex gap-3 flex-wrap">
            <button v-for="color in categoryColors" :key="color.value"
              @click="selectedCategoryToEdit.color = color.value"
              :class="['w-10 h-10 rounded-full transition-all cursor-pointer',
                selectedCategoryToEdit.color === color.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110']"
              :style="{ backgroundColor: color.value }">
            </button>
          </div>
        </div>
      </div>
      <!-- Footer Actions -->
      <div class="px-8 py-6 bg-surface-container flex justify-end gap-4 rounded-b-xl border-t border-outline-variant/10">
        <button @click="closeEditModal" class="px-6 py-3 rounded-full text-on-surface font-bold hover:bg-surface-container-highest transition-colors cursor-pointer">
          Cancel
        </button>
        <button @click="saveEditCategory" :disabled="editLoading" class="px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-container transition-colors shadow-sm shadow-primary/20 cursor-pointer disabled:opacity-50">
          {{ editLoading ? 'Menyimpan...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL OVERLAY (Delete Category) -->
  <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-[2px]">
    <!-- Confirmation Modal -->
    <div class="bg-[#f5f4ed] dark:bg-surface-container-low w-full max-w-[480px] rounded-[32px] p-10 shadow-[0_32px_64px_rgba(27,28,24,0.12)] border border-outline-variant/30 flex flex-col transform transition-all">
      <!-- Icon/Header -->
      <div class="w-16 h-16 rounded-full bg-error-container/50 flex items-center justify-center mb-6 self-start">
        <span class="material-symbols-outlined text-error text-3xl" style="font-variation-settings: 'FILL' 1;">warning</span>
      </div>
      <!-- Content -->
      <h2 class="font-headline text-3xl font-medium text-on-surface mb-4 leading-tight text-balance">
        Hapus Kategori?
      </h2>
      <p class="text-on-surface-variant text-[15px] leading-relaxed mb-10 font-body">
        Apakah Anda yakin ingin menghapus kategori "{{ selectedCategoryToDelete?.name }}"? Semua produk di kategori ini akan dipindahkan ke kategori "Tanpa Kategori".
      </p>
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row justify-end items-center gap-4 mt-auto">
        <button @click="closeDeleteModal" class="w-full sm:w-auto px-8 py-4 rounded-full bg-surface-container-highest text-on-surface font-medium hover:bg-surface-variant transition-colors duration-200 cursor-pointer">
          Batal
        </button>
        <button @click="confirmDeleteCategory" :disabled="deleteLoading" class="w-full sm:w-auto px-8 py-4 rounded-full bg-[#b53333] text-white font-medium hover:bg-[#9a2b2b] transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-50">
          {{ deleteLoading ? 'Menghapus...' : 'Hapus Kategori' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';
import { useAuthStore } from '../stores/auth';
import { useCategoriesStore } from '../stores/categories';
import { settingsApi } from '../api/settings';

const authStore = useAuthStore();
const categoriesStore = useCategoriesStore();

const user = computed(() => ({ name: authStore.user?.name || 'Admin', email: authStore.user?.email || '' }));

const categoryIcons = [
  'local_cafe', 'restaurant', 'local_pizza', 'cake', 'icecream', 'local_bar',
  'bakery_dining', 'fastfood', 'ramen_dining', 'kebab_dining', 'tapas', 'liquor',
  'breakfast_dining', 'lunch_dining', 'dinner_dining', 'dining', 'set_meal', 'egg_alt',
  'brunch_dining', 'spa', 'storefront', 'shopping_bag', 'local_mall', 'redeem',
  'local_grocery_store', 'local_florist', 'local_florist', 'cleaning_services', 'wash', 'dry_cleaning'
];

const categoryColors = [
  { name: 'Orange', value: '#c96442' },
  { name: 'Coral', value: '#e07b67' },
  { name: 'Teal', value: '#2d8a8a' },
  { name: 'Green', value: '#556b2f' },
  { name: 'Brown', value: '#8b5a2b' },
  { name: 'Purple', value: '#6b4c8a' },
  { name: 'Pink', value: '#b85c7a' },
  { name: 'Blue', value: '#4a7eb5' },
  { name: 'Red', value: '#cd5c5c' },
  { name: 'Gold', value: '#d4a84b' },
  { name: 'Mint', value: '#5cb3a3' },
  { name: 'Lavender', value: '#9b8bb4' },
];

// Global Settings
const settingsLoading = ref(false);
const settings = ref({
  tax_rate: 11,
  currency: 'IDR',
  auto_sync_inventory: true,
});

const loadSettings = async () => {
  try {
    const res = await settingsApi.get();
    if (res.data?.data) {
      settings.value = res.data.data;
    }
  } catch (e) { console.error(e); }
};

const saveSettings = async () => {
  settingsLoading.value = true;
  try {
    await settingsApi.update({
      tax_rate: settings.value.tax_rate,
      currency: settings.value.currency,
      auto_sync_inventory: settings.value.auto_sync_inventory,
    });
  } catch (e) { console.error(e); }
  settingsLoading.value = false;
};

const expandedCategory = ref<string | null>(null);
const toggleExpand = (id: string) => {
  expandedCategory.value = expandedCategory.value === id ? null : id;
};

// Add Modal
const showAddModal = ref(false);
const newCategoryName = ref('');
const newCategoryIcon = ref('local_cafe');
const newCategoryColor = ref('#c96442');
const addLoading = ref(false);
const addCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  addLoading.value = true;
  const ok = await categoriesStore.createCategory({ name: newCategoryName.value, icon: newCategoryIcon.value, color: newCategoryColor.value });
  addLoading.value = false;
  if (ok) {
    showAddModal.value = false;
    newCategoryName.value = '';
    newCategoryIcon.value = 'local_cafe';
    newCategoryColor.value = '#c96442';
  }
};

// Edit Modal
const showEditModal = ref(false);
const editLoading = ref(false);
const selectedCategoryToEdit = ref<any>(null);
const openEditModal = (cat: any) => { 
  selectedCategoryToEdit.value = { 
    id: cat.id,
    name: cat.name || '',
    icon: cat.icon || 'category',
    color: cat.color || '#c96442',
    is_active: cat.is_active !== false
  }; 
  showEditModal.value = true; 
};
const closeEditModal = () => { 
  showEditModal.value = false; 
  selectedCategoryToEdit.value = null; 
};
const saveEditCategory = async () => {
  if (!selectedCategoryToEdit.value) return;
  editLoading.value = true;
  const ok = await categoriesStore.updateCategory(selectedCategoryToEdit.value.id, { 
    name: selectedCategoryToEdit.value.name,
    icon: selectedCategoryToEdit.value.icon,
    color: selectedCategoryToEdit.value.color
  });
  if (ok) {
    closeEditModal();
  }
  editLoading.value = false;
};

// Delete Modal
const showDeleteModal = ref(false);
const deleteLoading = ref(false);
const selectedCategoryToDelete = ref<any>(null);
const openDeleteModal = (cat: any) => { selectedCategoryToDelete.value = { ...cat }; showDeleteModal.value = true; };
const closeDeleteModal = () => { showDeleteModal.value = false; selectedCategoryToDelete.value = null; };
const confirmDeleteCategory = async () => {
  if (!selectedCategoryToDelete.value) return;
  deleteLoading.value = true;
  await categoriesStore.deleteCategory(selectedCategoryToDelete.value.id);
  deleteLoading.value = false;
  closeDeleteModal();
  await categoriesStore.fetchCategories();
};

const toggleActive = async (id: string, isActive: boolean) => {
  await categoriesStore.toggleActive(id, isActive);
};

onMounted(() => {
  categoriesStore.fetchCategories();
  loadSettings();
});
</script>