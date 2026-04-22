<template>
  <div class="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_16px_rgba(27,28,24,0.02)]">
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-headline text-xl text-on-surface font-medium">Riwayat Transaksi</h3>
      <button @click="isPopupOpen = true" class="text-sm font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer">
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

    <!-- Modal Popup Semua Transaksi -->
    <div v-if="isPopupOpen" class="fixed inset-0 bg-on-background/20 backdrop-blur-md z-50 flex items-center justify-center p-4" @click.self="isPopupOpen = false">
      <div class="bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-[0_32px_64px_-12px_rgba(27,28,24,0.08)] flex flex-col max-h-[85vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="px-8 pt-8 pb-6 bg-surface-container-low flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-headline text-on-surface font-medium mb-1">Semua Transaksi</h2>
            <p class="text-sm font-body text-on-surface-variant">Riwayat lengkap seluruh transaksi hari ini.</p>
          </div>
          <button @click="isPopupOpen = false" class="text-on-surface-variant hover:bg-surface-variant p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="p-4 sm:p-8 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          <div v-for="trx in allTransactions" :key="trx.id" class="flex items-center justify-between p-4 rounded-xl border border-outline-variant/20 hover:bg-surface-container-low transition-colors group cursor-pointer">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-xl">{{ trx.icon }}</span>
              </div>
              <div>
                <p class="font-medium text-on-surface text-base">Order #{{ trx.orderNumber }}</p>
                <p class="text-sm text-on-surface-variant mt-0.5">{{ trx.time }} • {{ trx.items }} items</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-on-surface text-base">{{ formatCurrency(trx.amount) }}</p>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1',
                trx.status === 'Selesai' ? 'bg-tertiary-fixed/30 text-tertiary-container' : 'bg-error-container/30 text-error'
              ]">
                {{ trx.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'

const dashboardStore = useDashboardStore()

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)

const transactions = computed(() =>
  dashboardStore.recentTransactions.map(t => ({
    id: t.id?.slice(0, 8) || '-',
    customer: t.customer_name || 'Pelanggan',
    amount: formatCurrency(t.total || t.amount || 0),
    status: t.status || 'confirmed',
    time: t.created_at ? new Date(t.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
  }))
)
</script>
