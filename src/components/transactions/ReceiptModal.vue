<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12 overflow-hidden">
    <!-- Blurred Background Backdrop -->
    <div @click="$emit('close')" class="absolute inset-0 bg-on-background/20 backdrop-blur-md transition-opacity"></div>
    
    <!-- Thermal Receipt Card -->
    <div 
      class="relative w-full max-w-md bg-surface-container-lowest text-on-surface shadow-[0_32px_64px_-12px_rgba(27,28,24,0.25)] flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300 rounded-t-2xl"
      id="thermal-receipt"
    >
      
      <!-- Scrollable Receipt Body -->
      <div class="flex-1 overflow-y-auto px-10 py-12 no-scrollbar flex flex-col min-h-0">
        <!-- Header -->
        <div class="text-center mb-10 flex flex-col items-center">
          <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-primary text-5xl" style="font-variation-settings: 'FILL' 1;">spa</span>
          </div>
          <h2 class="font-headline text-5xl font-bold text-primary mb-1 italic tracking-tighter">Saku</h2>
          <p class="font-body text-sm text-on-surface-variant uppercase tracking-[0.2em] font-bold">Apothecary & Botanicals</p>
          <p class="font-body text-xs text-on-surface-variant mt-4 leading-relaxed italic">
            Jl. Senopati No. 45, Kebayoran Baru<br/>
            Jakarta Selatan, 12190
          </p>
        </div>

        <!-- Meta Info -->
        <div class="border-y border-dashed border-outline-variant py-6 mb-8 text-sm grid grid-cols-2 gap-y-3 font-body">
          <div class="text-on-surface-variant font-medium">Receipt No.</div>
          <div class="text-right font-bold text-on-surface truncate ml-4" :title="transaction.id">{{ transaction.id.slice(0, 12) }}...</div>
          <div class="text-on-surface-variant font-medium">Date</div>
          <div class="text-right font-bold text-on-surface">{{ transaction.date }}, {{ transaction.time }}</div>
          <div class="text-on-surface-variant font-medium">Cashier</div>
          <div class="text-right font-bold text-on-surface">{{ transaction.cashier }}</div>
          <div class="text-on-surface-variant font-medium">Payment</div>
          <div class="text-right font-bold text-on-surface uppercase">{{ transaction.method }}</div>
        </div>

        <!-- Items List -->
        <div class="flex flex-col gap-6 mb-10 flex-1 font-body">
          <div v-for="(item, idx) in transaction.items" :key="idx" class="flex justify-between items-start">
            <div class="flex-1 pr-4">
              <p class="font-bold text-on-surface leading-tight mb-1">{{ item.name }}</p>
              <p class="text-xs text-on-surface-variant font-medium italic">{{ item.quantity }} x {{ formatCurrency(item.price) }}</p>
            </div>
            <p class="font-bold text-on-surface mt-0.5">{{ formatCurrency(item.quantity * item.price) }}</p>
          </div>
        </div>

        <!-- Totals -->
        <div class="border-t border-dashed border-outline-variant pt-8 mb-10 flex flex-col gap-3 font-body">
          <div class="flex justify-between text-sm font-medium">
            <span class="text-on-surface-variant">Subtotal</span>
            <span class="text-on-surface">{{ formatCurrency(transaction.amount) }}</span>
          </div>
          <div class="flex justify-between text-sm font-medium">
            <span class="text-on-surface-variant">Tax (11%)</span>
            <span class="text-on-surface">{{ formatCurrency(transaction.amount * 0.11) }}</span>
          </div>
          <div class="flex justify-between items-end mt-6 pt-6 border-t-2 border-on-surface/10">
            <span class="font-headline text-xl text-on-surface-variant italic">Grand Total</span>
            <span class="font-headline text-4xl font-bold text-primary tracking-tighter">{{ formatCurrency(transaction.amount * 1.11) }}</span>
          </div>
        </div>

        <!-- Footer & QR -->
        <div class="text-center mt-auto flex flex-col items-center pt-6 border-t border-dashed border-outline-variant">
          <p class="font-headline italic text-2xl text-on-surface-variant">Terima kasih telah berbelanja</p>
        </div>
      </div>

      <!-- Bottom Thermal Edge -->
      <div class="thermal-edge-bottom w-full absolute -bottom-4 left-0"></div>

      <!-- Action Buttons (Floating Outside) -->
      <div class="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col gap-4 hidden lg:flex">
        <button 
          @click="printReceipt"
          class="w-14 h-14 bg-surface-container-lowest rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-all shadow-xl hover:scale-110 group"
          title="Print"
        >
          <span class="material-symbols-outlined group-hover:rotate-12 transition-transform">print</span>
        </button>
        <button 
          class="w-14 h-14 bg-surface-container-lowest rounded-full flex items-center justify-center text-secondary hover:bg-secondary/10 transition-all shadow-xl hover:scale-110"
          title="Share"
        >
          <span class="material-symbols-outlined">share</span>
        </button>
        <button 
          @click="$emit('close')"
          class="w-14 h-14 bg-surface-container-lowest rounded-full flex items-center justify-center text-on-surface hover:bg-error/10 hover:text-error transition-all shadow-xl hover:scale-110"
          title="Close"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  transaction: {
    id: string;
    date: string;
    time: string;
    cashier: string;
    amount: number;
    method: string;
    items: Array<{ name: string; quantity: number; price: number }>;
  };
}>();

defineEmits(['close']);

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

const printReceipt = () => {
  window.print();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Manrope:wght@200..800&display=swap');

.font-headline {
  font-family: 'Newsreader', serif;
}

.font-body {
  font-family: 'Manrope', sans-serif;
}


.thermal-edge-bottom {
  background-image: radial-gradient(circle at 12px -12px, transparent 12px, #ffffff 13px);
  background-size: 24px 24px;
  background-repeat: repeat-x;
  height: 20px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.05));
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoom-in-95 {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}

.animate-in {
  animation: fade-in 0.3s ease-out, zoom-in-95 0.3s ease-out;
}

@media print {
  .thermal-edge-bottom, button {
    display: none !important;
  }
  #thermal-receipt {
    box-shadow: none !important;
    max-height: none !important;
  }
  body * {
    visibility: hidden;
  }
  #thermal-receipt, #thermal-receipt * {
    visibility: visible;
  }
  #thermal-receipt {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
