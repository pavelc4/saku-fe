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
                  <img :src="getR2Url(product.image)" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                 <span>Tax ({{ taxRate }}%)</span>
                 <span>{{ formatCurrency(tax) }}</span>
               </div>
              <div class="flex justify-between items-end pt-3">
                <span class="font-headline text-lg text-on-surface">Total</span>
                <span class="font-headline text-3xl font-bold text-primary tracking-tight">{{ formatCurrency(total) }}</span>
              </div>
            </div>
            
            <!-- Payment Method Selector -->
            <div class="mb-4">
              <label class="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-2 block">Metode Pembayaran</label>
              <div class="flex gap-2">
                <button v-for="method in paymentMethods" :key="method.value"
                  @click="selectedPaymentMethod = method.value"
                  :class="['flex-1 py-3 rounded-lg font-medium text-sm transition-all flex flex-col items-center gap-1',
                    selectedPaymentMethod === method.value 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high']">
                  <span class="material-symbols-outlined text-xl">{{ method.icon }}</span>
                  <span>{{ method.label }}</span>
                </button>
              </div>
            </div>
            
            <button @click="checkout" :disabled="cart.length === 0 || isCheckoutLoading" class="w-full bg-gradient-to-r from-primary to-primary-container text-white font-bold py-4 rounded-full shadow-[0_4px_16px_rgba(154,64,33,0.3)] hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
              <span>{{ isCheckoutLoading ? 'Memproses...' : 'Bayar Sekarang' }}</span>
              <span v-if="!isCheckoutLoading" class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <div v-if="checkoutError" class="mt-3 p-3 bg-error/10 text-error text-sm rounded-lg text-center">
              {{ checkoutError }}
            </div>
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
    <div v-if="isCloseModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/30 backdrop-blur-[4px] transition-opacity" @click.self="isCloseModalOpen = false">
      <!-- Modal Container -->
      <div class="bg-surface-container-lowest rounded-xl p-10 max-w-[520px] w-full mx-4 shadow-[0_48px_100px_-24px_rgba(27,28,24,0.15)] flex flex-col gap-10 transform transition-transform scale-100 relative overflow-hidden">
        <!-- Subtle decorative gradient orb in background -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <!-- Header -->
        <div>
          <div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6 text-on-surface">
            <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">storefront</span>
          </div>
          <h2 class="font-headline text-4xl text-on-surface tracking-tight mb-2">Tutup Sesi Aktif</h2>
          <p class="font-body text-on-surface-variant text-base">Terminal 01 • {{ cashierName || user.name }}</p>
        </div>

        <!-- Body -->
        <div class="flex flex-col gap-8">
          <!-- Summary Stats -->
          <div class="flex gap-4">
            <div class="bg-surface-container-low p-5 rounded-xl flex-1 flex flex-col gap-1">
              <span class="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Penjualan Sistem</span>
              <span class="font-headline text-2xl text-on-surface">{{ formatCurrency(totalSales) }}</span>
            </div>
            <div class="bg-surface-container-high p-5 rounded-xl flex-1 flex flex-col gap-1">
              <span class="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Tunai Diharapkan</span>
              <span class="font-headline text-2xl text-on-surface">{{ formatCurrency(expectedCash) }}</span>
            </div>
          </div>
          
          <!-- Input -->
          <div class="flex flex-col gap-3">
            <label class="font-label text-sm font-semibold text-on-surface-variant uppercase tracking-wider" for="cash-input">Uang Tunai Fisik di Laci</label>
            <div class="relative flex items-center">
              <span class="absolute left-5 font-headline text-xl text-on-surface-variant">Rp</span>
              <input v-model="actualCash" class="w-full bg-surface-container-low hover:bg-surface-container transition-colors border-0 rounded-lg pl-14 pr-5 py-4 font-headline text-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-surface-container-highest outline-none" id="cash-input" placeholder="0" type="text" />
            </div>
          </div>

          <!-- Discrepancy Indicator -->
          <div class="flex items-center justify-between p-5 bg-surface-container-low rounded-xl">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined" :class="discrepancyClass.iconColor">{{ discrepancyIcon }}</span>
              <span class="font-label font-medium text-sm" :class="discrepancyClass.textColor">Selisih</span>
            </div>
            <span class="font-headline text-xl" :class="discrepancyClass.textColor">{{ formatCurrency(discrepancyAmount) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/10">
          <button @click="isCloseModalOpen = false" class="px-8 py-3 rounded-full font-label font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer">
            Batal
          </button>
          <button @click="closeSession" class="px-8 py-3 rounded-full font-label font-semibold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-[0_8px_16px_-4px_rgba(154,64,33,0.2)] transition-all cursor-pointer flex items-center gap-2">
            <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">print</span>
            Tutup Sesi
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';
import { useAuthStore, getR2Url } from '../stores/auth';
import { useProductsStore } from '../stores/products';
import { useCategoriesStore } from '../stores/categories';
import { usePosStore } from '../stores/pos';
import { useCartStore } from '../stores/cart';
import { settingsApi } from '../api/settings';

const authStore = useAuthStore();
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const posStore = usePosStore();
const cartStore = useCartStore();

const user = computed(() => ({ name: authStore.user?.name || 'Kasir', email: authStore.user?.email || '' }));

const isSessionOpen = computed(() => !!posStore.activeSession);
const isModalOpen = ref(false);
const isCloseModalOpen = ref(false);
const initialCash = ref(0);
const actualCash = ref(0);
const cashierName = ref('');
const selectedPaymentMethod = ref('cash');
const paymentMethods = [
  { value: 'cash', label: 'Tunai', icon: 'payments' },
  { value: 'qris', label: 'QRIS', icon: 'qr_code' },
  { value: 'transfer', label: 'Transfer', icon: 'account_balance' },
];
const totalSales = ref(0);

const expectedCash = computed(() => posStore.activeSession?.opening_cash || 0);
const discrepancyAmount = computed(() => actualCash.value - expectedCash.value);
const discrepancyClass = computed(() => {
  if (discrepancyAmount.value === 0) return { iconColor: 'text-tertiary', textColor: 'text-tertiary' };
  if (discrepancyAmount.value > 0) return { iconColor: 'text-primary', textColor: 'text-primary' };
  return { iconColor: 'text-error', textColor: 'text-error' };
});
const discrepancyIcon = computed(() => {
  if (discrepancyAmount.value === 0) return 'check_circle';
  if (discrepancyAmount.value > 0) return 'add_circle';
  return 'error';
});

const openSession = async () => {
  const ok = await posStore.openSession(initialCash.value, cashierName.value);
  if (ok) isModalOpen.value = false;
};

const closeSession = async () => {
  const ok = await posStore.closeSession(actualCash.value);
  if (ok) {
    isCloseModalOpen.value = false;
    cartStore.clearCart();
  }
};

const activeCategory = ref('semua');
const categories = computed(() => [
  { id: 'semua', name: 'Semua' },
  ...categoriesStore.items.map(c => ({ id: c.id, name: c.name })),
]);

const products = computed(() => {
  if (activeCategory.value === 'semua') return productsStore.items.filter(p => p.is_active !== false);
  return productsStore.items.filter(p => p.category_id === activeCategory.value && p.is_active !== false);
});

const cart = computed(() => cartStore.items);
const taxRate = computed(() => cartStore.taxRate);

const addToCart = (product: any) => cartStore.addToCart(product);
const increaseQty = (index: number) => {
  const item = cart.value[index];
  cartStore.updateQuantity(item.id, item.quantity + 1);
};
const decreaseQty = (index: number) => {
  const item = cart.value[index];
  cartStore.updateQuantity(item.id, item.quantity - 1);
};

const subtotal = computed(() => cartStore.subtotal);
const tax = computed(() => cartStore.tax);
const total = computed(() => cartStore.totalPrice);

const isCheckoutLoading = ref(false);
const checkoutSuccess = ref(false);
const checkoutError = ref<string | null>(null);
const checkout = async () => {
  if (!cart.value.length) return;
  isCheckoutLoading.value = true;
  checkoutError.value = null;
  const items = cart.value.map(i => ({ product_id: i.id, quantity: i.quantity }));
  const taxRate = cartStore.taxRate || 11;
  const result = await posStore.checkout(items, selectedPaymentMethod.value, { tax_rate: taxRate });
  if (result) {
    cartStore.clearCart();
    checkoutSuccess.value = true;
    setTimeout(() => checkoutSuccess.value = false, 3000);
  } else if (posStore.error) {
    checkoutError.value = posStore.error;
    setTimeout(() => checkoutError.value = null, 4000);
  }
  isCheckoutLoading.value = false;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

onMounted(async () => {
  await Promise.all([
    posStore.fetchActiveSession(),
    productsStore.fetchProducts(),
    categoriesStore.fetchCategories(),
  ]);
  
  // Load tax rate from settings
  try {
    const res = await settingsApi.get();
    if (res.data?.data?.tax_rate) {
      cartStore.setTaxRate(res.data.data.tax_rate);
    }
  } catch (e) { console.error(e); }
  
  if (!isSessionOpen.value) isModalOpen.value = true;
});
</script>


