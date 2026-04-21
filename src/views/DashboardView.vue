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
                title="Net Profit" 
                value="$4,250.00" 
                icon="trending_up" 
                iconColorClass="text-primary"
                trendText="12% vs last week"
                trendIcon="arrow_upward"
                trendTextColorClass="text-tertiary-container"
              />
              <MetricCard 
                title="Proj. Cashflow" 
                value="$12,800.00" 
                icon="account_balance_wallet" 
                iconColorClass="text-secondary"
                trendText="End of Month Est."
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
import { ref } from 'vue';

import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';
import InsightCard from '../components/dashboard/InsightCard.vue';
import MetricCard from '../components/dashboard/MetricCard.vue';
import RevenueChart from '../components/dashboard/RevenueChart.vue';
import LowStockWidget from '../components/dashboard/LowStockWidget.vue';
import QuickActionWidget from '../components/dashboard/QuickActionWidget.vue';
import RecentTransactionsWidget from '../components/dashboard/RecentTransactionsWidget.vue';
import TopSellingWidget from '../components/dashboard/TopSellingWidget.vue';

const greeting = ref('Selamat Pagi');
const user = ref({
  name: 'Pemilik',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvE2zqFsuHiT6pIwMG3cidJQePpr4_tTsj8TYlzCpOIj9pUeRh77x8o_qjEGgIeGrTHrhfAS5pkQZ1UXBNuED0lDlCxIi-0hhvSSmsd7WDlrWAz6P2JbrLPn5PgTYsU-yqHtaUcQIeVIBxHqPPvnYffVIRQM0zq4iIQ2SPlv_OWilWKo28of8_61oRHP3MuFuLI8S2Wt2PYtLoD_6tcv2_iO0QU-ijocgagoOy8FlX97bjv2Th06fobZ58G9RjKjN6Iy-Cz1TwcMg'
});

const chartData = ref([
  { label: 'Mon', height: '30%', isToday: false },
  { label: 'Tue', height: '50%', isToday: false },
  { label: 'Wed', height: '40%', isToday: false },
  { label: 'Thu', height: '70%', isToday: false },
  { label: 'Fri', height: '90%', isToday: true },
  { label: 'Sat', height: '20%', isToday: false },
  { label: 'Sun', height: '10%', isToday: false },
]);

const lowStockItems = ref([
  {
    name: 'Terracotta Vases',
    remaining: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPHFVXtqC7WzNNChdFFTZXyY4uz4hPR0TgrGXN4WwG_IHMerArfo2R6NQiUoqAtvGMwFDe8CvP7J9KPb002Mk0qU3WbHOntD3xDyTOECPMBQ1DGPka2tRfMmM27eMmchxq98WoJKo_7z0pp4zqe8phEkFFztU4TZMjJ9807xo-QOlr8BZ2CJPDar2mlX9q4qvz6cc6jtHMGWbNNKkcRs8uuNYD-6yBWIcrM7MfLl8remOkKknTwPOBDFqJGaveWUEATnOMvmzQttU',
    initials: '',
    statusColor: 'text-error'
  },
  {
    name: 'Linen Napkin Set',
    remaining: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQC9ntELFEhyRBxRRlMwhHg7JfdBSJlJtPhPdqAi2UshNlvlgFnBDyM7fRJug9trwiB0TSBU0dw5eGTY544FFPdvUM6q2GUCkZt-RIYyadDY_VYRaEAKIDZJaZli3_jAaJC0qKulm6YKFXkd6BzKKys3RcylIGZH2eywt8qHMVSP949uaXUO6N7-Jrcqsua3f4fQ59ihvRo7mXqzGHES7fAl6r28AE_uNOce1DU2PwvutyOOj3tNTpq7z0bmtC4Hgtf5NBuudtYFc',
    initials: '',
    statusColor: 'text-error'
  },
  {
    name: 'Sandalwood Oil',
    remaining: 8,
    image: '',
    initials: 'SO',
    statusColor: 'text-secondary'
  }
]);
</script>
