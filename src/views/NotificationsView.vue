<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <Sidebar />

    <div class="flex-1 flex flex-col h-screen min-w-0 z-10 relative">
      <TopNav :user="user" />

      <main class="flex-1 overflow-y-auto bg-surface rounded-tl-[32px] p-8 md:p-12 shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)]">
        <div class="max-w-5xl mx-auto space-y-12">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 class="font-headline text-2xl sm:text-3xl md:text-4xl text-on-surface tracking-tight">Notifications</h1>
            
            <div class="flex items-center gap-6">
              <!-- Utilities -->
              <div class="flex gap-4">
                <button class="p-3 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant group relative cursor-pointer">
                  <span class="material-symbols-outlined group-hover:text-primary transition-colors">filter_list</span>
                  <div class="absolute inset-0 rounded-full group-hover:shadow-[0_0_24px_rgba(154,64,33,0.1)] transition-shadow"></div>
                </button>
                <button class="p-3 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant group relative cursor-pointer">
                  <span class="material-symbols-outlined group-hover:text-error transition-colors">delete_sweep</span>
                  <div class="absolute inset-0 rounded-full group-hover:shadow-[0_0_24px_rgba(186,26,26,0.1)] transition-shadow"></div>
                </button>
              </div>
            </div>
          </div>

          <!-- Filter & Action Row -->
          <div class="flex flex-col sm:flex-row gap-4 justify-between items-end mb-8">
            <div class="flex flex-wrap gap-2 sm:gap-3">
              <button class="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface font-medium text-sm transition-colors hover:bg-surface-variant cursor-pointer">All</button>
              <button class="px-6 py-2.5 rounded-full bg-surface text-on-surface-variant font-medium text-sm transition-colors hover:bg-surface-container-highest cursor-pointer">Inventory</button>
              <button class="px-6 py-2.5 rounded-full bg-surface text-on-surface-variant font-medium text-sm transition-colors hover:bg-surface-container-highest cursor-pointer">Sales</button>
              <button class="px-6 py-2.5 rounded-full bg-surface text-on-surface-variant font-medium text-sm transition-colors hover:bg-surface-container-highest cursor-pointer">AI Insights</button>
            </div>
            <button class="text-primary font-medium text-sm hover:opacity-80 transition-opacity flex items-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">done_all</span>
              Mark all as read
            </button>
          </div>

          <!-- Notifications List -->
          <div class="space-y-4">
            <!-- Item 1: Low Stock (Warning) -->
            <div class="group flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg bg-surface-container-lowest transition-all hover:bg-surface-container-low relative overflow-hidden border border-outline-variant/10">
              <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary"></div>
              <div class="flex-shrink-0 mt-1 w-12 h-12 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                <span class="material-symbols-outlined">inventory_2</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 sm:gap-0 mb-1">
                  <h3 class="text-lg font-headline font-semibold text-on-surface truncate">Low Stock Alert: Organic Match</h3>
                  <span class="text-xs text-on-surface-variant font-label whitespace-nowrap sm:ml-4">10 mins ago</span>
                </div>
                <p class="text-on-surface-variant text-sm font-body leading-relaxed mb-3">Inventory for "Premium Ceremonial Matcha 50g" has dropped below the threshold of 5 units. Current stock: 3.</p>
                <button class="text-sm font-medium text-tertiary hover:opacity-80 transition-opacity cursor-pointer">Reorder Now</button>
              </div>
              <button class="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-error transition-all rounded-full hover:bg-surface-variant self-center cursor-pointer">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <!-- Item 2: AI Insight (Info) -->
            <div class="group flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg bg-surface-container-lowest transition-all hover:bg-surface-container-low relative overflow-hidden border border-outline-variant/10">
              <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
              <div class="flex-shrink-0 mt-1 w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined">lightbulb</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 sm:gap-0 mb-1">
                  <h3 class="text-lg font-headline font-semibold text-on-surface truncate">Sales Trend Identified</h3>
                  <span class="text-xs text-on-surface-variant font-label whitespace-nowrap sm:ml-4">2 hours ago</span>
                </div>
                <p class="text-on-surface-variant text-sm font-body leading-relaxed">Afternoon sales of iced beverages have increased by 45% compared to last week. Consider adjusting staffing for the 2 PM - 5 PM rush.</p>
              </div>
              <button class="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-error transition-all rounded-full hover:bg-surface-variant self-center cursor-pointer">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <!-- Item 3: New Sale (Success) -->
            <div class="group flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg bg-surface-container-lowest transition-all hover:bg-surface-container-low relative overflow-hidden border border-outline-variant/10">
              <div class="flex-shrink-0 mt-1 w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                <span class="material-symbols-outlined">payments</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 sm:gap-0 mb-1">
                  <h3 class="text-lg font-headline font-semibold text-on-surface truncate">Large Order Processed</h3>
                  <span class="text-xs text-on-surface-variant font-label whitespace-nowrap sm:ml-4">Yesterday, 4:30 PM</span>
                </div>
                <p class="text-on-surface-variant text-sm font-body leading-relaxed">Transaction #8924 completed successfully. Total: Rp 450.000. Customer: Corporate Account (Acme Corp).</p>
              </div>
              <button class="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-error transition-all rounded-full hover:bg-surface-variant self-center cursor-pointer">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <!-- Item 4: System Update -->
            <div class="group flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg bg-surface-container-lowest transition-all hover:bg-surface-container-low relative overflow-hidden opacity-75 border border-outline-variant/10">
              <div class="flex-shrink-0 mt-1 w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                <span class="material-symbols-outlined">system_update</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 sm:gap-0 mb-1">
                  <h3 class="text-lg font-headline font-semibold text-on-surface truncate">Saku POS v2.4 Release</h3>
                  <span class="text-xs text-on-surface-variant font-label whitespace-nowrap sm:ml-4">Oct 12, 2023</span>
                </div>
                <p class="text-on-surface-variant text-sm font-body leading-relaxed">System updated successfully overnight. Includes minor performance improvements and new tax reporting features.</p>
                <button class="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mt-2 cursor-pointer">View Changelog</button>
              </div>
              <button class="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-error transition-all rounded-full hover:bg-surface-variant self-center cursor-pointer">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          <!-- Load More -->
          <div class="mt-10 flex justify-center pb-8">
            <button class="px-8 py-3 rounded-full border-none bg-surface-container-highest text-on-surface font-medium hover:bg-surface-variant transition-colors cursor-pointer">
              Load Older Notifications
            </button>
          </div>
          
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/layout/Sidebar.vue'
import TopNav from '../components/layout/TopNav.vue'
import { useAuthStore } from '../stores/auth'
import { useProductsStore } from '../stores/products'
import { useTransactionsStore } from '../stores/transactions'

const authStore = useAuthStore()
const productsStore = useProductsStore()
const transactionsStore = useTransactionsStore()

const user = computed(() => ({ name: authStore.user?.name || 'Admin', email: authStore.user?.email || '' }))

const notifications = computed(() => {
  const notifs: any[] = []

  // Low stock notifications
  productsStore.lowStockItems.forEach(p => {
    notifs.push({
      id: `low-${p.id}`,
      type: 'warning',
      icon: 'warning',
      title: 'Stok Hampir Habis',
      message: `${p.name} tersisa ${p.stock} unit`,
      time: 'Baru saja',
      read: false,
    })
  })

  // Out of stock notifications
  productsStore.outOfStock.forEach(p => {
    notifs.push({
      id: `out-${p.id}`,
      type: 'error',
      icon: 'error',
      title: 'Stok Habis',
      message: `${p.name} sudah habis`,
      time: 'Baru saja',
      read: false,
    })
  })

  // Recent transactions
  transactionsStore.items.slice(0, 3).forEach(t => {
    notifs.push({
      id: `tx-${t.id}`,
      type: 'info',
      icon: 'receipt_long',
      title: 'Transaksi Baru',
      message: `Transaksi #${t.id?.slice(0, 8)} berhasil`,
      time: t.created_at ? new Date(t.created_at).toLocaleString('id-ID') : '',
      read: true,
    })
  })

  return notifs
})

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

onMounted(async () => {
  await Promise.all([
    productsStore.fetchProducts(),
    transactionsStore.fetchTransactions({ limit: 5 }),
  ])
})
</script>

