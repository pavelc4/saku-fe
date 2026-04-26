<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <Sidebar />

    <div class="flex-1 flex flex-col h-screen min-w-0">
      <TopNav :user="user" />

      <main class="flex-1 overflow-hidden flex gap-8 p-8 bg-surface rounded-tl-[32px] shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)]">
        <!-- Transaction List -->
        <div class="flex-1 flex flex-col overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm">
          <div class="p-6 pb-2">
            <h3 class="font-headline text-2xl font-medium text-on-surface mb-4">Today's Ledger</h3>
            <div class="flex gap-2 mb-4">
              <button 
                v-for="filter in filters" 
                :key="filter"
                @click="activeFilter = filter"
                :class="[
                  'px-4 py-1.5 rounded-full text-sm transition-all',
                  activeFilter === filter 
                    ? 'bg-primary-container text-on-primary-container font-bold' 
                    : 'bg-surface-container text-secondary font-medium hover:bg-surface-container-high'
                ]"
              >
                {{ filter }}
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
            <!-- List Items -->
            <div 
              v-for="txn in transactions" 
              :key="txn.id"
              @click="selectedTxn = txn"
              :class="[
                'p-4 mx-4 rounded-lg flex justify-between items-center cursor-pointer transition-all',
                selectedTxn?.id === txn.id 
                  ? 'bg-surface-container-low border-l-4 border-primary shadow-sm' 
                  : 'hover:bg-surface-container'
              ]"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary">
                  <span class="material-symbols-outlined">receipt</span>
                </div>
                <div>
                  <p class="font-bold text-on-surface">{{ txn.id }}</p>
                  <p class="text-sm text-secondary">{{ txn.time }} • {{ txn.itemsCount }} Items</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-on-surface">{{ formatCurrency(txn.amount) }}</p>
                <p class="text-sm text-secondary">{{ txn.method }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Detail Panel -->
        <div v-if="selectedTxn" class="w-96 flex flex-col bg-surface-container-lowest rounded-xl shadow-lg shadow-on-background/5 overflow-hidden border-none ring-1 ring-outline-variant/20">
          <!-- Header -->
          <div class="p-8 pb-6 bg-surface-container-low flex flex-col items-center relative text-center">
            <button 
              @click="selectedTxn = null"
              class="absolute top-4 right-4 text-secondary hover:text-on-surface p-2 rounded-full hover:bg-surface-container-highest transition-colors"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
            <div class="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mb-4 shadow-sm">
              <span class="material-symbols-outlined" style="font-size: 32px; font-variation-settings: 'FILL' 1;">check_circle</span>
            </div>
            <h2 class="font-headline text-3xl font-medium text-on-surface mb-1">{{ formatCurrency(selectedTxn.amount) }}</h2>
            <p class="text-sm text-secondary font-label bg-surface-variant px-3 py-1 rounded-full mt-2">Completed</p>
          </div>

          <!-- Meta Data -->
          <div class="px-8 py-6 flex flex-col gap-4 border-none">
            <div class="flex justify-between items-center">
              <span class="text-sm text-secondary">Transaction ID</span>
              <span class="font-bold text-on-surface text-sm">{{ selectedTxn.id }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-secondary">Date & Time</span>
              <span class="font-medium text-on-surface text-sm">{{ selectedTxn.date }} • {{ selectedTxn.time }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-secondary">Payment Method</span>
              <span class="font-medium text-on-surface text-sm flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">payments</span>
                {{ selectedTxn.method }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-secondary">Cashier</span>
              <span class="font-medium text-on-surface text-sm">{{ selectedTxn.cashier }}</span>
            </div>
          </div>

          <div class="h-4 bg-surface-container-low w-full"></div>

          <!-- Itemized List -->
          <div class="flex-1 overflow-y-auto px-8 py-6">
            <h4 class="font-headline text-lg font-medium text-on-surface mb-4">Items</h4>
            <div class="flex flex-col gap-4">
              <div v-for="(item, idx) in selectedTxn.items" :key="idx" class="flex justify-between items-start">
                <div>
                  <p class="font-bold text-on-surface text-sm">{{ item.name }}</p>
                  <p class="text-xs text-secondary mt-0.5">{{ item.quantity }} x {{ formatCurrency(item.price) }}</p>
                </div>
                <span class="font-medium text-on-surface text-sm">{{ formatCurrency(item.quantity * item.price) }}</span>
              </div>
            </div>
          </div>

          <!-- Summary Totals -->
          <div class="px-8 py-6 bg-surface-container-low rounded-t-xl mt-auto">
            <div class="flex flex-col gap-2 mb-6">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary">Subtotal</span>
                <span class="text-sm font-medium text-on-surface">{{ formatCurrency(selectedTxn.amount) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary">Tax (0%)</span>
                <span class="text-sm font-medium text-on-surface">{{ formatCurrency(0) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary">Discount</span>
                <span class="text-sm font-medium text-on-surface">-{{ formatCurrency(0) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-3">
              <button 
                @click="isReceiptOpen = true"
                class="w-full py-4 rounded-full bg-surface-container-highest text-primary font-bold hover:bg-primary/10 transition-all flex items-center justify-center gap-2 border border-primary/20"
              >
                <span class="material-symbols-outlined">qr_code_2</span>
                View Digital Receipt
              </button>
              <button class="w-full py-4 rounded-full bg-primary text-on-primary font-bold shadow-md shadow-primary/10 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">print</span>
                Reprint Receipt
              </button>
              <button class="w-full py-4 rounded-full bg-transparent text-error font-bold hover:bg-error-container/50 transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-error-container">
                <span class="material-symbols-outlined">undo</span>
                Refund Transaction
              </button>
            </div>
          </div>
        </div>

        <!-- Receipt Modal -->
        <ReceiptModal 
          v-if="selectedTxn"
          :is-open="isReceiptOpen"
          :transaction="selectedTxn"
          @close="isReceiptOpen = false"
        />

        <!-- Empty State for Detail -->
        <div v-else class="w-96 flex flex-col items-center justify-center bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/50 text-secondary italic">
          <span class="material-symbols-outlined text-4xl mb-2">info</span>
          Select a transaction to view details
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';
import ReceiptModal from '../components/transactions/ReceiptModal.vue';
import { useAuthStore } from '../stores/auth';
import { usePosStore } from '../stores/pos';

const authStore = useAuthStore();
const posStore = usePosStore();
const user = computed(() => ({
  name: authStore.user?.name || 'Manager',
  avatar: authStore.user?.avatar || '',
}));

const activeFilter = ref('All');
const filters = ['All', 'Completed', 'Refunded'];

onMounted(async () => {
  await posStore.fetchTransactions();
});

const transactions = computed(() => posStore.transactions.map((t: any) => {
  const createdDate = t.created_at ? new Date(t.created_at * 1000) : new Date();
  return {
    id: t.id,
    time: createdDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    date: createdDate.toLocaleDateString('id-ID'),
    itemsCount: t.items?.length || 0,
    amount: t.amount || 0,
    method: t.payment_method || 'cash',
    cashier: t.cashier_name || '-',
    items: t.items || []
  };
}));

const selectedTxn = ref<any>(null);
const isReceiptOpen = ref(false);

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
</script>

<style scoped>
.font-headline {
  font-family: 'Newsreader', serif;
}
</style>
