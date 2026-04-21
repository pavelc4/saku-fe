<template>
  <div class="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_16px_rgba(27,28,24,0.02)]">
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-headline text-xl text-on-surface font-medium">Riwayat Transaksi</h3>
      <button class="text-sm font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer">
        Lihat Semua
        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="trx in transactions" :key="trx.id" class="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer group">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant group-hover:text-primary transition-colors">
            <span class="material-symbols-outlined text-xl">{{ trx.icon }}</span>
          </div>
          <div>
            <p class="font-medium text-on-surface text-sm">Order #{{ trx.orderNumber }}</p>
            <p class="text-xs text-on-surface-variant mt-0.5">{{ trx.time }} • {{ trx.items }} items</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-bold text-on-surface text-sm">{{ formatCurrency(trx.amount) }}</p>
          <p :class="[
            'text-xs font-medium mt-0.5',
            trx.status === 'Selesai' ? 'text-tertiary-container' : 'text-error'
          ]">{{ trx.status }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const transactions = ref([
  { id: 1, orderNumber: '0045', time: '10:42 AM', items: 3, amount: 125000, status: 'Selesai', icon: 'receipt_long' },
  { id: 2, orderNumber: '0044', time: '10:28 AM', items: 1, amount: 45000, status: 'Selesai', icon: 'receipt_long' },
  { id: 3, orderNumber: '0043', time: '09:55 AM', items: 5, amount: 210000, status: 'Selesai', icon: 'receipt_long' },
  { id: 4, orderNumber: '0042', time: '09:15 AM', items: 2, amount: 85000, status: 'Refund', icon: 'assignment_return' },
]);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};
</script>
