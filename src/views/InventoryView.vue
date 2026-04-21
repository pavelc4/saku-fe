<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <!-- SideNavBar -->
    <Sidebar />

    <div class="flex-1 flex flex-col h-screen min-w-0 z-10">
      <!-- TopNavBar -->
      <TopNav :user="user" />

      <!-- Main Content Canvas -->
      <main class="flex-1 overflow-y-auto bg-surface rounded-tl-[32px] p-8 lg:p-12 shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)]">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h2 class="font-headline text-4xl font-semibold text-on-surface tracking-tight mb-2">Manajemen Inventaris</h2>
            <p class="text-on-surface-variant font-medium">Kelola dan pantau stok produk Anda.</p>
          </div>
          <button class="bg-primary text-white font-medium px-6 py-3 rounded-full hover:bg-primary-container transition-colors flex items-center justify-center gap-2 shadow-[0_4px_24px_-4px_rgba(154,64,33,0.3)] cursor-pointer">
            <span class="material-symbols-outlined">add</span>
            Tambah Produk
          </button>
        </div>
        
        <!-- Summary Cards Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <!-- Total Products -->
          <div class="bg-surface-container-low rounded-lg p-6 flex flex-col justify-between h-40">
            <div class="flex items-center justify-between text-on-surface-variant">
              <span class="font-medium text-sm">Total Products</span>
              <span class="material-symbols-outlined">category</span>
            </div>
            <div>
              <span class="font-headline text-4xl font-medium text-on-surface">1,248</span>
              <div class="flex items-center gap-1 text-sm text-tertiary mt-1">
                <span class="material-symbols-outlined text-[16px]">arrow_upward</span>
                <span>+12 this week</span>
              </div>
            </div>
          </div>
          <!-- Low Stock Alerts -->
          <div class="bg-surface-container-low rounded-lg p-6 flex flex-col justify-between h-40">
            <div class="flex items-center justify-between text-on-surface-variant">
              <span class="font-medium text-sm">Low Stock Alerts</span>
              <span class="material-symbols-outlined text-error">warning</span>
            </div>
            <div>
              <span class="font-headline text-4xl font-medium text-error">24</span>
              <div class="text-sm text-on-surface-variant mt-1">
                <span>Requires immediate attention</span>
              </div>
            </div>
          </div>
          <!-- Inventory Value -->
          <div class="bg-surface-container-low rounded-lg p-6 flex flex-col justify-between h-40">
            <div class="flex items-center justify-between text-on-surface-variant">
              <span class="font-medium text-sm">Inventory Value</span>
              <span class="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div>
              <span class="font-headline text-4xl font-medium text-on-surface">Rp 45.2M</span>
              <div class="text-sm text-on-surface-variant mt-1">
                <span>Estimated retail value</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tabs -->
        <div class="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <button v-for="tab in tabs" :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'px-6 py-2 rounded-full whitespace-nowrap transition-colors cursor-pointer',
                    activeTab === tab.id
                      ? 'bg-surface-container-highest text-on-surface font-semibold'
                      : 'bg-surface text-on-surface-variant hover:bg-surface-container-low font-medium'
                  ]">
            {{ tab.name }}
          </button>
        </div>
        
        <!-- Data Table -->
        <div class="flex flex-col gap-4">
          <!-- Table Header -->
          <div class="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-on-surface-variant border-b border-surface-container-highest/0 mb-2">
            <div class="col-span-4">Product Name & SKU</div>
            <div class="col-span-3">Category</div>
            <div class="col-span-3">Stock Level</div>
            <div class="col-span-2 text-right">Status</div>
          </div>
          
          <!-- Rows -->
          <div v-for="item in inventoryItems" :key="item.sku"
               :class="[
                 'bg-surface-container-lowest rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer group flex flex-col',
                 !item.active ? 'opacity-60 hover:opacity-100' : '',
                 expandedItem === item.sku ? 'shadow-sm' : ''
               ]"
               @click="toggleExpand(item.sku)">
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 lg:px-6">
              <div class="col-span-1 lg:col-span-4 flex items-center gap-4">
                <template v-if="item.image">
                  <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded-lg object-cover" />
                </template>
                <template v-else>
                  <div class="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                    <span class="material-symbols-outlined">{{ item.icon }}</span>
                  </div>
                </template>
                <div>
                  <div :class="[
                    'font-semibold transition-colors',
                    item.active ? 'text-on-surface group-hover:text-primary' : 'text-on-surface-variant line-through decoration-on-surface-variant/50'
                  ]">{{ item.name }}</div>
                  <div class="text-sm text-on-surface-variant font-mono mt-0.5">{{ item.sku }}</div>
                </div>
              </div>
              
              <div class="col-span-1 lg:col-span-3 text-sm text-on-surface-variant">
                {{ item.category }}
              </div>
              
              <div class="col-span-1 lg:col-span-3 flex items-center gap-2">
                <span :class="[
                  'font-medium flex items-center gap-1',
                  item.stock <= 5 && item.active ? 'text-error' : (item.active ? 'text-on-surface' : 'text-on-surface-variant')
                ]">
                  <span v-if="item.stock <= 5 && item.active" class="material-symbols-outlined text-[18px]">warning</span>
                  {{ item.stock }} Unit
                </span>
                <div v-if="item.active" :class="[
                  'h-1.5 w-16 rounded-full overflow-hidden',
                  item.stock <= 5 ? 'bg-error-container' : 'bg-surface-container-highest'
                ]">
                  <div :class="[
                    'h-full rounded-full',
                    item.stock <= 5 ? 'bg-error' : 'bg-tertiary'
                  ]" :style="{ width: Math.min(100, (item.stock / item.maxStock) * 100) + '%' }"></div>
                </div>
              </div>
              
              <div class="col-span-1 lg:col-span-2 lg:text-right">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  item.active 
                    ? 'bg-surface-container-highest text-on-surface' 
                    : 'bg-surface-container border border-outline-variant/50 text-on-surface-variant'
                ]">
                  {{ item.active ? 'Active' : 'Non-Aktif' }}
                </span>
              </div>
            </div>

            <!-- Expanded Actions Area -->
            <div v-if="expandedItem === item.sku" class="border-t border-surface-container-highest/50 p-4 lg:px-6 flex justify-end gap-3 bg-surface-container-low/30 rounded-b-lg" @click.stop>
              <button @click="openEditModal(item)" class="px-5 py-2 text-white text-sm font-medium transition-colors hover:opacity-90 flex items-center cursor-pointer" style="border-radius: 10px; background-color: #c96442;">
                Edit Product
              </button>
              <button class="px-5 py-2 text-white text-sm font-medium transition-colors hover:opacity-90 flex items-center cursor-pointer" style="border-radius: 10px; background-color: #b53333;">
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Edit Product Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 bg-on-background/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <!-- Modal Card -->
      <div class="bg-surface-container-lowest w-full max-w-2xl rounded-[32px] shadow-[0_32px_64px_-12px_rgba(27,28,24,0.08)] flex flex-col overflow-hidden max-h-[90vh]">
        <!-- Modal Header -->
        <div class="px-8 pt-8 pb-6 bg-surface-container-low flex justify-between items-start">
          <div>
            <h2 class="text-3xl font-headline text-on-background font-medium mb-2">Edit Produk</h2>
            <p class="text-sm font-label text-on-surface-variant">Update detail produk dan ketersediaan stok.</p>
          </div>
          <button @click="closeEditModal" class="text-on-surface-variant hover:bg-surface-variant p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer" type="button">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <!-- Modal Body (Form) -->
        <div class="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <form class="space-y-8" @submit.prevent="saveProduct">
            <!-- Basic Info Group -->
            <div class="space-y-6">
              <h3 class="text-sm font-headline font-semibold text-primary uppercase tracking-wider">Informasi Dasar</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="col-span-1 md:col-span-2">
                  <label class="block text-sm font-medium text-on-background mb-2">Nama Produk</label>
                  <input v-model="editingProduct.name" class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 px-4 py-3 rounded-t-lg transition-colors text-on-background font-body placeholder:text-on-surface-variant/50" type="text"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-on-background mb-2">SKU</label>
                  <input v-model="editingProduct.sku" class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 px-4 py-3 rounded-t-lg transition-colors text-on-background font-body font-mono text-sm opacity-60 cursor-not-allowed" type="text" disabled/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-on-background mb-2">Kategori</label>
                  <div class="relative">
                    <select v-model="editingProduct.category" class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 px-4 py-3 rounded-t-lg transition-colors text-on-background font-body appearance-none pr-10">
                      <option value="Minuman / Kopi">Minuman / Kopi</option>
                      <option value="Minuman / Teh">Minuman / Teh</option>
                      <option value="Makanan / Pastry">Makanan / Pastry</option>
                      <option value="Merchandise">Merchandise</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Inventory & Pricing Group -->
            <div class="space-y-6 pt-2">
              <h3 class="text-sm font-headline font-semibold text-primary uppercase tracking-wider">Inventaris & Harga</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-on-background mb-2">Unit</label>
                  <div class="relative">
                    <select class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 px-4 py-3 rounded-t-lg transition-colors text-on-background font-body appearance-none pr-10">
                      <option value="pcs">Pcs</option>
                      <option value="kg">Kg</option>
                      <option value="gram">Gram</option>
                      <option value="liter">Liter</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-on-background mb-2">Stok Tersedia</label>
                  <input v-model="editingProduct.stock" class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 px-4 py-3 rounded-t-lg transition-colors text-on-background font-body text-right" type="number"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-on-background mb-2">Harga Jual</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">Rp</span>
                    <input class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 pl-12 pr-4 py-3 rounded-t-lg transition-colors text-on-background font-body text-right" type="text" placeholder="85.000"/>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Status Group -->
            <div class="pt-4 flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
              <div>
                <p class="text-base font-medium text-on-background">Status Produk</p>
                <p class="text-sm text-on-surface-variant">Produk aktif dapat dilihat dan dibeli di POS.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="editingProduct.active" class="sr-only peer" type="checkbox"/>
                <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span class="ml-3 text-sm font-medium text-primary">Aktif</span>
              </label>
            </div>
          </form>
        </div>
        
        <!-- Modal Footer (Actions) -->
        <div class="px-8 py-6 bg-surface-container-low flex justify-end items-center space-x-4">
          <button @click="closeEditModal" class="px-6 py-3 rounded-full text-on-background font-medium hover:bg-surface-variant transition-colors text-sm cursor-pointer" type="button">
            Batal
          </button>
          <button @click="saveProduct" class="px-8 py-3 rounded-full bg-primary text-on-primary font-medium shadow-[0_4px_12px_rgba(154,64,33,0.2)] hover:bg-primary-container transition-all text-sm flex items-center space-x-2 cursor-pointer" type="button">
            <span class="material-symbols-outlined text-lg">save</span>
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
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
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhZiiGyoCOsuYv_MGbEOcbH36vmbAaGDdfjR8hJfA58lU8laEpfOvbbiAz4Hgq0-9tQD0aPsQhqNQ-H6T3hZ_MDCbLsMFL5EAlm6ZRipKB_JasZ99qnihhZlGJV-GYTq9K_96gE0TLSOytb_BX0BUV28Irld42gHVRUPPmmuYx2aNM4GUa_IEczq5smFqdhFHayQ8g7oE71Efsd-LykeTpw53mXR90TlZXa1eQsjF56o238LqGAmNbvwz8Ogwnn_Cpe2Cj4wMnjH4'
});

const activeTab = ref('semua');
const tabs = ref([
  { id: 'semua', name: 'Semua' },
  { id: 'makanan', name: 'Makanan' },
  { id: 'minuman', name: 'Minuman' },
  { id: 'non-aktif', name: 'Non-Aktif' }
]);

const expandedItem = ref<string | null>(null);

const isEditModalOpen = ref(false);
const editingProduct = ref<any>({});

const openEditModal = (item: any) => {
  editingProduct.value = { ...item };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const saveProduct = () => {
  const index = inventoryItems.value.findIndex(i => i.sku === editingProduct.value.sku);
  if (index !== -1) {
    inventoryItems.value[index] = { ...editingProduct.value };
  }
  closeEditModal();
};

const toggleExpand = (sku: string) => {
  if (expandedItem.value === sku) {
    expandedItem.value = null;
  } else {
    expandedItem.value = sku;
  }
};

const inventoryItems = ref([
  {
    name: 'Artisan Butter Croissant',
    sku: 'SKU-BAK-001',
    category: 'Makanan / Pastry',
    stock: 45,
    maxStock: 60,
    active: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGLiu0g6ZIQ6bzaV2_mPqF-0o1bAxyfMhcbPshwmQv39Fh3-81SyQGabIP8-WuW2V4kGhlbTbLULQZqqpr13ouiWnbeEMADSty_wTyh_lS1D-xbbewFQKbd3LuLrP0GiE9uOVI9tDsy5HY6aSO_W0gHw8Y3P0sDq3k_YtZ5OLI9cxK27AdptKBbyYEjhOn3aUNdpgfED-tsC40H3M77XflgWq4qsiGBwp4ni0LW9ctvGIvdF2WTa2uQKi0GwjA8r3jZX86OCqsFas',
    icon: ''
  },
  {
    name: 'Ethiopian Yirgacheffe Beans (1kg)',
    sku: 'SKU-COF-104',
    category: 'Minuman / Kopi',
    stock: 2,
    maxStock: 24,
    active: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX4_ZSZpkA_zT-Vp8sY-sugKfN2LS-sFKYVNkniMGoNnz2vjMPtPVtU6iO2c9E511rtmvKC-im5pizb784j1XS7SgVMpkawWK6sEv5bYmndWk9Tu_UJSjYu0qMRGBhm4TpXgp1FIROUacKCIAQwtTD_jkOFGednQUPgWaOtJ9__siNkduWjvl_lqYOXMh49NRonVI-5IctuAQndWJMznFQhGYw-06gv7z-PzqbVqS1Py5NKyHd_qAgrMn9Fj-JzEfru6D7PMJJ-vU',
    icon: ''
  },
  {
    name: 'Matcha Powder Premium (500g)',
    sku: 'SKU-TEA-042',
    category: 'Minuman / Teh',
    stock: 18,
    maxStock: 50,
    active: true,
    image: '',
    icon: 'local_drink'
  },
  {
    name: 'Seasonal Berry Tart',
    sku: 'SKU-BAK-089',
    category: 'Makanan / Pastry',
    stock: 0,
    maxStock: 20,
    active: false,
    image: '',
    icon: 'cake'
  }
]);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-surface-variant, #e3e3dc);
  border-radius: 20px;
}
</style>
