<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <!-- SideNavBar -->
    <Sidebar />

    <!-- Right Side Area -->
    <div class="flex-1 flex flex-col min-w-0 h-screen relative z-10">
      <!-- TopNavBar -->
      <TopNav :user="user" />

      <!-- Main Content Area -->
      <main class="flex-1 bg-surface rounded-tl-[32px] overflow-hidden flex p-12 gap-8 relative shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)] border-none">
        
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
      </main>
    </div>

    <!-- Modal Buka Shift (Open Session) -->
    <div v-if="!isSessionOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md">
      <!-- Modal Container -->
      <div class="bg-surface-bright rounded-xl shadow-[0_32px_64px_-12px_rgba(27,28,24,0.15)] w-full max-w-md p-10 transform transition-all relative overflow-hidden">
        <!-- Decorative Accent -->
        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-container opacity-80"></div>
        <!-- Header -->
        <div class="text-center mb-10 mt-2">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-highest mb-6 text-primary">
            <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">vpn_key</span>
          </div>
          <h2 class="text-3xl font-headline text-on-surface font-medium mb-2 tracking-tight">Buka Shift</h2>
          <p class="text-sm text-on-surface-variant font-body">Terminal 01 • Evening Shift</p>
        </div>
        <!-- Form -->
        <form class="space-y-8" @submit.prevent="openSession">
          <!-- Field 1: Cash in Drawer -->
          <div class="relative">
            <label class="block text-sm font-medium text-on-surface mb-2 font-body ml-1" for="modal-awal">Modal Awal (Cash in Drawer)</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="text-on-surface-variant font-medium">Rp</span>
              </div>
              <input v-model="initialCash" class="block w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-0 rounded-lg text-lg text-on-surface font-body shadow-sm ring-1 ring-inset ring-outline-variant/30 focus:ring-2 focus:ring-inset focus:ring-primary focus:bg-surface-bright transition-colors outline-none" id="modal-awal" name="modal-awal" placeholder="0" type="text"/>
            </div>
          </div>
          <!-- Field 2: Nama Kasir -->
          <div class="relative">
            <label class="block text-sm font-medium text-on-surface mb-2 font-body ml-1" for="nama-kasir">Nama Kasir</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                <span class="material-symbols-outlined text-lg">person</span>
              </div>
              <input v-model="cashierName" class="block w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-0 rounded-lg text-base text-on-surface font-body shadow-sm ring-1 ring-inset ring-outline-variant/30 focus:ring-2 focus:ring-inset focus:ring-primary focus:bg-surface-bright transition-colors outline-none" id="nama-kasir" name="nama-kasir" placeholder="Masukkan nama..." type="text"/>
            </div>
          </div>
          <!-- Actions -->
          <div class="pt-6">
            <button type="submit" class="w-full bg-primary hover:bg-primary-container text-on-primary font-body font-medium text-lg py-4 px-6 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
              Buka Sesi Sekarang
            </button>
            <div class="mt-4 text-center">
              <router-link to="/dashboard" class="text-sm font-body font-medium text-on-surface-variant hover:text-on-surface transition-colors py-2 px-4 rounded-lg hover:bg-surface-container-highest inline-block">
                Kembali ke Dashboard
              </router-link>
            </div>
          </div>
        </form>
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
const initialCash = ref('500.000');
const cashierName = ref('Elena R.');

const openSession = () => {
  isSessionOpen.value = true;
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

