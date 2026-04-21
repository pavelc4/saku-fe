<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <!-- SideNavBar -->
    <Sidebar />

    <!-- Right Side Area -->
    <div class="flex-1 flex flex-col min-w-0 h-screen relative z-10">
      <!-- TopNavBar -->
      <TopNav :user="user" :showCloseShift="isSessionOpen" @close-shift="isCloseModalOpen = true" />

      <!-- Main Content Area -->
      <main class="flex-1 bg-surface rounded-tl-[32px] overflow-hidden flex p-12 gap-8 relative shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)] border-none">
        
        <template v-if="isSessionOpen">
          <!-- Left Column: Products -->
          <div class="flex-1 flex flex-col min-w-0">
          <!-- Filter Tabs -->
          <div class="flex items-center gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
            <button v-for="cat in categories" :key="cat.id" 
                    @click="activeCategory = cat.id"
                    :class="[
                      'px-6 py-2.5 rounded-full whitespace-nowrap text-sm transition-colors border cursor-pointer',
                      activeCategory === cat.id 
                        ? 'bg-surface-container-highest text-primary font-bold tracking-wide border-transparent' 
                        : 'bg-surface text-secondary hover:bg-surface-container-low font-medium border-outline-variant/30'
                    ]">
              {{ cat.name }}
            </button>
          </div>

          <!-- Product Grid -->
          <div class="flex-1 overflow-y-auto no-scrollbar pb-12">
            <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <!-- Product Cards -->
              <div v-for="product in products" :key="product.id" 
                   class="bg-surface-container-lowest rounded-lg overflow-hidden group cursor-pointer flex flex-col hover:bg-surface-container-low transition-colors duration-300"
                   @click="addToCart(product)">
                <div class="h-40 overflow-hidden relative">
                  <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-headline font-medium text-lg text-on-surface mb-1">{{ product.name }}</h3>
                    <p class="text-xs text-secondary line-clamp-2">{{ product.description }}</p>
                  </div>
                  <div class="mt-4 flex items-center justify-between">
                    <span class="font-bold text-primary">{{ formatCurrency(product.price) }}</span>
                    <button class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors cursor-pointer" @click.stop="addToCart(product)">
                      <span class="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Current Order Panel -->
        <div class="w-96 flex-shrink-0 bg-surface-container-low rounded-xl flex flex-col overflow-hidden relative shadow-[0_8px_32px_rgba(27,28,24,0.06)]">
          <!-- Order Header -->
          <div class="p-6 pb-4">
            <h2 class="font-headline text-2xl font-medium text-on-surface">Current Order</h2>
            <p class="text-sm text-secondary mt-1">Order #0042 • Dine-in</p>
          </div>

          <!-- Order Items List -->
          <div class="flex-1 overflow-y-auto p-6 pt-0 space-y-6">
            <div v-for="(item, index) in cart" :key="index" class="flex justify-between items-start group">
              <div class="flex-1 pr-4">
                <h4 class="font-medium text-on-surface text-sm">{{ item.name }}</h4>
                <p class="text-xs text-secondary mt-1" v-if="item.notes">{{ item.notes }}</p>
                <div class="mt-2 text-primary font-bold text-sm">{{ formatCurrency(item.price * item.quantity) }}</div>
              </div>
              <div class="flex items-center gap-3 bg-surface-container-lowest rounded-full px-2 py-1">
                <button class="w-6 h-6 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-highest transition-colors cursor-pointer" @click="decreaseQty(index)">
                  <span class="material-symbols-outlined text-sm">remove</span>
                </button>
                <span class="text-sm font-medium w-4 text-center">{{ item.quantity }}</span>
                <button class="w-6 h-6 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-highest transition-colors cursor-pointer" @click="increaseQty(index)">
                  <span class="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
            
            <div v-if="cart.length === 0" class="text-center text-secondary text-sm mt-8">
              Order is empty
            </div>
          </div>

          <!-- Total & Checkout Area -->
          <div class="p-6 bg-surface-container-lowest/50 backdrop-blur-xl border-t border-outline-variant/10">
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm text-secondary">
                <span>Subtotal</span>
                <span>{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm text-secondary">
                <span>Tax (10%)</span>
                <span>{{ formatCurrency(tax) }}</span>
              </div>
              <div class="flex justify-between items-end pt-3">
                <span class="font-headline text-lg text-on-surface">Total</span>
                <span class="font-headline text-3xl font-bold text-primary tracking-tight">{{ formatCurrency(total) }}</span>
              </div>
            </div>
            <button class="w-full bg-gradient-to-r from-primary to-primary-container text-white font-bold py-4 rounded-full shadow-[0_4px_16px_rgba(154,64,33,0.3)] hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer" :disabled="cart.length === 0">
              <span>Bayar Sekarang</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          </div>
        </template>

        <!-- Closed Session State -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-center">
          <div class="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mb-6">
            <span class="material-symbols-outlined text-5xl" style="font-variation-settings: 'FILL' 1;">storefront</span>
          </div>
          <h2 class="text-3xl font-headline text-on-surface font-medium mb-2">Kasir Ditutup</h2>
          <p class="text-on-surface-variant max-w-md mb-8 text-lg">Anda harus membuka shift kasir terlebih dahulu sebelum dapat memproses transaksi baru.</p>
          <button @click="isModalOpen = true" class="bg-primary hover:bg-primary-container text-on-primary font-body font-medium text-lg py-4 px-8 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer flex items-center gap-2">
            <span class="material-symbols-outlined text-2xl">vpn_key</span>
            Buka Shift Sekarang
          </button>
        </div>
      </main>
    </div>

    <!-- Modal Buka Shift (Open Session) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/30 backdrop-blur-[4px] transition-opacity" @click.self="isModalOpen = false">
      <!-- Modal Container -->
      <div class="bg-surface-container-lowest rounded-xl p-10 max-w-[520px] w-full mx-4 shadow-[0_48px_100px_-24px_rgba(27,28,24,0.15)] flex flex-col gap-10 transform transition-transform scale-100 relative overflow-hidden">
        <!-- Subtle decorative gradient orb in background -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <!-- Header -->
        <div>
          <div class="w-16 h-16 rounded-full bg-primary-container/30 flex items-center justify-center mb-6 text-primary">
            <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">vpn_key</span>
          </div>
          <h2 class="font-headline text-4xl text-on-surface tracking-tight mb-2">Buka Shift Kasir</h2>
          <p class="font-body text-on-surface-variant text-base">Masukkan modal awal uang fisik dan nama kasir yang bertugas.</p>
        </div>
        
        <!-- Form Content -->
        <form class="flex flex-col gap-8" @submit.prevent="openSession">
          <!-- Input: Cash in Drawer -->
          <div class="flex flex-col gap-3">
            <label class="font-label text-sm font-semibold text-on-surface-variant uppercase tracking-wider" for="modal-awal">Modal Awal (Cash in Drawer)</label>
            <div class="relative flex items-center">
              <span class="absolute left-5 font-body text-on-surface-variant font-medium">Rp</span>
              <input v-model="initialCash" class="w-full bg-surface-container-low hover:bg-surface-container transition-colors border-0 rounded-lg pl-14 pr-5 py-4 font-body text-on-surface text-lg placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-surface-container-highest outline-none" id="modal-awal" placeholder="0" type="text"/>
            </div>
          </div>
          
          <!-- Input: Nama Kasir -->
          <div class="flex flex-col gap-3">
            <label class="font-label text-sm font-semibold text-on-surface-variant uppercase tracking-wider" for="nama-kasir">Nama Kasir</label>
            <div class="relative flex items-center">
              <span class="absolute left-5 material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
              <input v-model="cashierName" class="w-full bg-surface-container-low hover:bg-surface-container transition-colors border-0 rounded-lg pl-14 pr-5 py-4 font-body text-on-surface text-lg placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-surface-container-highest outline-none" id="nama-kasir" placeholder="Masukkan nama kasir" type="text"/>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/10">
            <button type="button" @click="isModalOpen = false" class="px-8 py-3 rounded-full font-label font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              Batal
            </button>
            <button type="submit" class="px-8 py-3 rounded-full font-label font-semibold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-[0_8px_16px_-4px_rgba(154,64,33,0.2)] transition-all cursor-pointer">
              Buka Sesi
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Tutup Sesi (Close Session) -->
    <div v-if="isCloseModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-sm" @click.self="isCloseModalOpen = false">
      <!-- Modal Container -->
      <div class="bg-surface-bright rounded-lg shadow-[0_16px_48px_rgba(27,28,24,0.06)] w-full max-w-2xl overflow-hidden flex flex-col relative border border-outline-variant/20">
        <!-- Modal Header -->
        <div class="px-10 py-8 bg-surface-container-low flex justify-between items-start">
          <div>
            <h2 class="font-headline font-semibold text-3xl text-on-surface mb-2">Tutup Sesi Aktif</h2>
            <p class="font-body text-on-surface-variant text-sm">Terminal 01 • {{ cashierName || user.name }}</p>
          </div>
          <button @click="isCloseModalOpen = false" class="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="px-10 py-10 flex flex-col gap-8 bg-surface-bright">
          <!-- Summary Stats -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-surface-container-low p-6 rounded-lg flex flex-col gap-2">
              <span class="font-label text-sm text-on-surface-variant uppercase tracking-wider">Total Penjualan Sistem</span>
              <span class="font-headline text-3xl text-on-surface">{{ formatCurrency(totalSales) }}</span>
            </div>
            <div class="bg-surface-container-highest p-6 rounded-lg flex flex-col gap-2">
              <span class="font-label text-sm text-on-surface-variant uppercase tracking-wider">Total Uang Tunai Diharapkan</span>
              <span class="font-headline text-3xl text-on-surface">{{ formatCurrency(expectedCash) }}</span>
            </div>
          </div>
          
          <!-- Input Section -->
          <div class="flex flex-col gap-4 mt-4">
            <label class="font-headline text-xl text-on-surface" for="cash-input">Uang Tunai Fisik di Laci</label>
            <div class="relative flex items-center bg-surface-container-low rounded-lg p-1 focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-outline-variant/20 transition-all">
              <span class="pl-6 font-headline text-2xl text-on-surface-variant">Rp</span>
              <input v-model="actualCash" class="w-full bg-transparent border-none focus:ring-0 font-headline text-3xl text-on-surface py-6 px-4 outline-none" id="cash-input" placeholder="0" type="text" />
            </div>
          </div>
          
          <!-- Discrepancy Indicator -->
          <div class="flex items-center justify-between p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-lg">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined" :class="discrepancyClass.iconColor">{{ discrepancyIcon }}</span>
              <span class="font-label font-medium" :class="discrepancyClass.textColor">Selisih</span>
            </div>
            <span class="font-headline text-2xl" :class="discrepancyClass.textColor">{{ formatCurrency(discrepancyAmount) }}</span>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="px-10 py-8 bg-surface-container-low flex justify-end gap-4 mt-auto">
          <button @click="isCloseModalOpen = false" class="px-8 py-4 rounded-xl font-body font-medium text-on-surface bg-surface-container-highest hover:bg-surface-variant transition-colors cursor-pointer">
            Batal
          </button>
          <button @click="closeSession" class="px-8 py-4 rounded-xl font-body font-medium text-on-primary bg-primary hover:bg-surface-tint transition-all shadow-[0_4px_12px_rgba(154,64,33,0.2)] flex items-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">print</span>
            Tutup Sesi & Cetak Laporan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';

const user = ref({
  name: 'Elena R.',
  email: 'elena.r@saku.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhZiiGyoCOsuYv_MGbEOcbH36vmbAaGDdfjR8hJfA58lU8laEpfOvbbiAz4Hgq0-9tQD0aPsQhqNQ-H6T3hZ_MDCbLsMFL5EAlm6ZRipKB_JasZ99qnihhZlGJV-GYTq9K_96gE0TLSOytb_BX0BUV28Irld42gHVRUPPmmuYx2aNM4GUa_IEczq5smFqdhFHayQ8g7oE71Efsd-LykeTpw53mXR90TlZXa1eQsjF56o238LqGAmNbvwz8Ogwnn_Cpe2Cj4wMnjH4'
});

const isSessionOpen = ref(false);
const isModalOpen = ref(false);
const isCloseModalOpen = ref(false);

const initialCash = ref('500.000');
const cashierName = ref('Elena R.');

const totalSales = ref(4250000);
const expectedCash = ref(1550000);
const actualCash = ref('1.550.000');

const actualCashValue = computed(() => {
  return parseInt(actualCash.value.replace(/\D/g, '')) || 0;
});

const discrepancyAmount = computed(() => {
  return actualCashValue.value - expectedCash.value;
});

const discrepancyClass = computed(() => {
  if (discrepancyAmount.value === 0) {
    return { iconColor: 'text-tertiary', textColor: 'text-tertiary' };
  } else if (discrepancyAmount.value > 0) {
    return { iconColor: 'text-primary', textColor: 'text-primary' };
  } else {
    return { iconColor: 'text-error', textColor: 'text-error' };
  }
});

const discrepancyIcon = computed(() => {
  if (discrepancyAmount.value === 0) return 'check_circle';
  if (discrepancyAmount.value > 0) return 'add_circle';
  return 'error';
});

const openSession = () => {
  isSessionOpen.value = true;
  isModalOpen.value = false;
};

const closeSession = () => {
  isCloseModalOpen.value = false;
  isSessionOpen.value = false;
};

const activeCategory = ref('semua');
const categories = ref([
  { id: 'semua', name: 'Semua' },
  { id: 'makanan', name: 'Makanan' },
  { id: 'minuman', name: 'Minuman' },
  { id: 'kopi-susu', name: 'Kopi Susu' },
  { id: 'pastry', name: 'Pastry' }
]);

const products = ref([
  {
    id: 1,
    name: 'Artisan Latte',
    description: 'Espresso with steamed milk and micro-foam',
    price: 45000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj-qrcBjRL4IY6UdC58jqBPzw50I3aklK_P9Ecnv3aXDiK4JVu0MgNj0nDHIO5bPMpc11rBryDCXYrk78huoLLf2sEVK1rerdvbE782ADkDG2x7RVjhZjhLK2DpSOPzWtmfu411zctDioQI0REH5WRqVQPDD78rilDiXr8MXcWWmgYjgNUFTICv8C0-jQ_KEOvU7sgmuU1CrHoBs92ofVXVkEhb_5MVp9oJPbaV0wW04GvSSlCfL9rPnMh5CmgWUM6H_ollHLfbyc'
  },
  {
    id: 2,
    name: 'Butter Croissant',
    description: 'Classic flaky French pastry',
    price: 32000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgFTK5B_a1Kpoz0LtR53F3fj7x36li0UQWjB54YsCc_XHmsf3-ehjvWLAqPz4LIxlGkQ3gi9Pzatx3-VGofaVsBIklV12pCTfQ1rVL9vN1yyuD30miLnB9wC9gnBV6gv7NDRMmxCFuMUT-DGTPT_aJRBoM16fSYMkHLDwAf3hkrqXp_wj6UEbTO9kZ5roX6D6Hl0-wAp68_LuhRPhnD2gxnHbR8OeCjBlbN1Pzyy8yjJOnx7QF99WKZLOkXxhleDNGhoNsHxc3NH8'
  },
  {
    id: 3,
    name: 'Matcha Latte',
    description: 'Premium Uji matcha with steamed milk',
    price: 48000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3QzvbU2fGphg21SOoeKO1P-AzSD9T553j9Zeo4gIp4jgfLew0aMODDZ50VgR1l0gy0xwrKJ3WJ2lNYFn2Qd2yc9BK0M4CHUgE_aZV-jWVDc3f8HK3abCK3VOehL3__8IMWNGAV_HpsPxaJn97XSVMyOTb4QL4H0FJRWeUImvueMq8zLEokk_3eFbBEE1PDRjGaLFyYuZ4z-LG-sj8-ksFIVCHZzy-kvWow6xOk5hZhg-hdgx-GAfPDKzkqZcN4lPHf8zQZ846cYU'
  }
]);

const cart = ref([
  { id: 1, name: 'Artisan Latte', notes: 'Oat Milk (+10k), Less Sugar', price: 55000, quantity: 2 },
  { id: 2, name: 'Butter Croissant', notes: 'Warmed', price: 32000, quantity: 1 }
]);

const addToCart = (product: any) => {
  const existing = cart.value.find(item => item.id === product.id && !item.notes);
  if (existing) {
    existing.quantity++;
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      notes: '',
      price: product.price,
      quantity: 1
    });
  }
};

const increaseQty = (index: number) => {
  cart.value[index].quantity++;
};

const decreaseQty = (index: number) => {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity--;
  } else {
    cart.value.splice(index, 1);
  }
};

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const tax = computed(() => {
  return subtotal.value * 0.1;
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};
</script>

