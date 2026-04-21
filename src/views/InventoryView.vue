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
              <button class="px-5 py-2 text-white text-sm font-medium transition-colors hover:opacity-90 flex items-center cursor-pointer" style="border-radius: 10px; background-color: #c96442;">
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
</style>
