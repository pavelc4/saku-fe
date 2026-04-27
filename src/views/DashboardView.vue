<template>
  <div>
    <header class="mb-8 md:mb-12">
      <h2 class="font-headline text-3xl md:text-4xl font-medium text-on-surface tracking-tight">{{ greeting }}, {{ user.name }}</h2>
      <p class="font-body text-on-surface-variant mt-2 text-base md:text-lg">Here is your daily editorial overview.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      
      <div class="lg:col-span-2 space-y-6 md:space-y-8">
        <InsightCard 
          :title="dailyInsightTitle" 
          :message="dailyInsightMessage || 'Belum ada insight untuk hari ini.'"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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

        <RevenueChart :total="formatCurrency(metrics?.income || 0)" :data="chartData" />
        <RecentTransactionsWidget />
      </div>

      <div class="space-y-6 md:space-y-8">
        <LowStockWidget :items="lowStockItems" @restock="handleRestock" />
        <TopSellingWidget />
        <QuickActionWidget :loading="reportLoading" @generate="generateReport" />
      </div>
      
    </div>
    
    <div class="h-8 md:h-12"></div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import InsightCard from '../components/dashboard/InsightCard.vue';
import MetricCard from '../components/dashboard/MetricCard.vue';
import RevenueChart from '../components/dashboard/RevenueChart.vue';
import LowStockWidget from '../components/dashboard/LowStockWidget.vue';
import QuickActionWidget from '../components/dashboard/QuickActionWidget.vue';
import RecentTransactionsWidget from '../components/dashboard/RecentTransactionsWidget.vue';
import TopSellingWidget from '../components/dashboard/TopSellingWidget.vue';
import { useAuthStore } from '../stores/auth';
import { useDashboardStore } from '../stores/dashboard';
import { useProductsStore } from '../stores/products';
import { insightsApi } from '../api/insights';

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const productsStore = useProductsStore();

const handleRestock = async (id: string) => {
  const product = productsStore.items.find(p => p.id === id)
  if (product) {
    const newStock = product.stock + 10
    await productsStore.restockProduct(id, newStock)
    dashboardStore.fetchDashboard()
  }
}

const reportLoading = ref(false)
const generateReport = async () => {
  reportLoading.value = true
  try {
    const res = await insightsApi.askAdvisor('Generate daily summary')
    alert(res.data?.data || 'Report generated!')
  } catch (e) {
    alert('Failed to generate report')
  }
  reportLoading.value = false
}

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

const lowStockItems = computed(() =>
  dashboardStore.lowStock.map(p => ({
    id: p.id,
    name: p.name,
    remaining: p.stock,
    image: p.image_url || '',
    initials: p.name?.slice(0, 2).toUpperCase() || '',
    statusColor: p.stock === 0 ? 'text-error' : 'text-secondary',
  }))
);

const chartData = computed(() => dashboardStore.weeklyRevenue.length > 0 
  ? dashboardStore.weeklyRevenue 
  : [
      { label: 'Sen', height: '10%', isToday: false },
      { label: 'Sel', height: '10%', isToday: false },
      { label: 'Rab', height: '10%', isToday: false },
      { label: 'Kam', height: '10%', isToday: false },
      { label: 'Jum', height: '10%', isToday: false },
      { label: 'Sab', height: '10%', isToday: false },
      { label: 'Min', height: '10%', isToday: false },
    ]
)

const dailyInsightTitle = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Insight Pagi';
  if (hour < 15) return 'Insight Siang';
  if (hour < 18) return 'Insight Sore';
  return 'Insight Malam';
})

const dailyInsightMessage = computed(() => dashboardStore.dailyInsight?.insight || '')

onMounted(() => {
  dashboardStore.fetchDashboard();
});
</script>
