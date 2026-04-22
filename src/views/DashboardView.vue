<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <Sidebar />

    <div class="flex-1 flex flex-col h-screen min-w-0">
      <TopNav :user="user" />

      <main class="flex-1 overflow-y-auto bg-surface rounded-tl-[32px] p-12 shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)]">
        
        <header class="mb-12">
          <h2 class="font-headline text-4xl font-medium text-on-surface tracking-tight">{{ greeting }}, {{ user.name }}</h2>
          <p class="font-body text-on-surface-variant mt-2 text-lg">Here is your daily editorial overview.</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div class="lg:col-span-2 space-y-8">
            <InsightCard 
              title="Morning Insight" 
              message="Inventory for 'Artisan Clay Mugs' is moving 20% faster than usual due to the upcoming weekend festival. Consider restocking or highlighting complementary items near the checkout."
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard 
                title="Total Pendapatan" 
                :value="formatCurrency(metrics?.income || 0)" 
                icon="trending_up" 
                iconColorClass="text-primary"
                :trendText="`Bulan ini`"
                trendIcon="arrow_upward"
                trendTextColorClass="text-tertiary-container"
              />
              <MetricCard 
                title="Total Pengeluaran" 
                :value="formatCurrency(metrics?.expense || 0)" 
                icon="account_balance_wallet" 
                iconColorClass="text-secondary"
                :trendText="`Bulan ini`"
                trendTextColorClass="text-on-surface-variant"
              />
            </div>

            <RevenueChart total="$8,420" :data="chartData" />
            <RecentTransactionsWidget />
          </div>

          <div class="space-y-8">
            <LowStockWidget :items="lowStockItems" />
            <TopSellingWidget />
            <QuickActionWidget />
          </div>
          
        </div>
        
        <div class="h-12"></div>
      </main>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';
import InsightCard from '../components/dashboard/InsightCard.vue';
import MetricCard from '../components/dashboard/MetricCard.vue';
import RevenueChart from '../components/dashboard/RevenueChart.vue';
import LowStockWidget from '../components/dashboard/LowStockWidget.vue';
import QuickActionWidget from '../components/dashboard/QuickActionWidget.vue';
import RecentTransactionsWidget from '../components/dashboard/RecentTransactionsWidget.vue';
import TopSellingWidget from '../components/dashboard/TopSellingWidget.vue';
import { useAuthStore } from '../stores/auth';
import { useDashboardStore } from '../stores/dashboard';

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
});

const user = computed(() => ({
  name: authStore.user?.name || 'Pemilik',
  avatar: authStore.user?.avatar || '',
}))

const metrics = computed(() => dashboardStore.metrics)

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

const netProfit = computed(() => formatCurrency(dashboardStore.metrics?.net || 0));
const totalTransactions = computed(() => dashboardStore.metrics?.transaction_count || 0);

const lowStockItems = computed(() =>
  dashboardStore.lowStock.map(p => ({
    name: p.name,
    remaining: p.stock,
    image: p.image_url || '',
    initials: p.name?.slice(0, 2).toUpperCase() || '',
    statusColor: p.stock === 0 ? 'text-error' : 'text-secondary',
  }))
);

const chartData = ref([
  { label: 'Sen', height: '30%', isToday: false },
  { label: 'Sel', height: '50%', isToday: false },
  { label: 'Rab', height: '40%', isToday: false },
  { label: 'Kam', height: '70%', isToday: false },
  { label: 'Jum', height: '90%', isToday: true },
  { label: 'Sab', height: '20%', isToday: false },
  { label: 'Min', height: '10%', isToday: false },
]);

onMounted(() => {
  dashboardStore.fetchDashboard();
});
</script>
