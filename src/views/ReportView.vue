<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <Sidebar />

    <div class="flex-1 flex flex-col h-screen min-w-0">
      <TopNav :user="user" />

      <main class="flex-1 overflow-y-auto bg-surface rounded-tl-[32px] p-12 shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)]">
        
        <header v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <span class="material-symbols-outlined text-5xl text-primary animate-spin">sync</span>
            <p class="font-body text-on-surface-variant mt-4">Memuat data...</p>
          </div>
        </header>
        
        <template v-else>
          <header class="mb-12 flex justify-between items-center">
          <div>
            <h2 class="font-headline text-4xl font-medium text-on-surface tracking-tight">Business Performance Review</h2>
            <p class="font-body text-on-surface-variant mt-2 text-lg">Generate and export your monthly performance report.</p>
          </div>
          <button 
            @click="exportToPdf" 
            :disabled="isExporting"
            class="flex items-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-full font-body font-semibold hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span class="material-symbols-outlined group-hover:animate-bounce">download</span>
            {{ isExporting ? 'Exporting...' : 'Download PDF' }}
          </button>
        </header>

        <!-- Report Container (Scrollable Preview) -->
        <div class="flex justify-center pb-24">
          <!-- The Report Document - A4 Proportions -->
          <div id="report-document" class="bg-surface-container-lowest w-full max-w-[210mm] min-h-[297mm] rounded-lg shadow-[0_24px_64px_-12px_rgba(27,28,24,0.12)] p-16 flex flex-col relative overflow-hidden text-on-surface font-body">
            
            <!-- Watermark / Decorative -->
            <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <!-- Header -->
            <header class="flex justify-between items-end mb-20 pb-10 border-b border-outline-variant/30">
              <div class="flex flex-col gap-2">
                <div class="text-5xl font-headline font-medium text-primary italic tracking-tighter mb-2">Saku</div>
                <h1 class="text-3xl font-headline font-semibold text-on-surface uppercase tracking-tight">Business Performance Review</h1>
                <div class="flex items-center gap-4 text-on-surface-variant font-label text-sm mt-2">
                  <span class="font-medium">Period: October 2024</span>
                  <span class="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                  <span class="font-medium italic">Generated: {{ generatedDate }}</span>
                </div>
              </div>
              <div class="text-right flex flex-col items-end">
                <span class="material-symbols-outlined text-5xl text-primary/80 mb-3" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
                <span class="font-headline text-xl italic text-on-surface-variant">The Scholarly Concierge</span>
              </div>
            </header>

            <!-- Executive Summary -->
            <section class="mb-20">
              <h2 class="text-2xl font-headline font-medium text-on-surface mb-8 flex items-center gap-3">
                Ringkasan Eksekutif
                <span class="h-[1px] flex-1 bg-outline-variant/30"></span>
              </h2>
              <div class="grid grid-cols-3 gap-8">
                <!-- Total Revenue -->
                <div class="bg-surface-container-low p-8 rounded-2xl flex flex-col gap-3 border border-outline-variant/10">
                  <span class="font-label text-xs text-on-surface-variant uppercase tracking-[0.15em] font-bold">Total Pendapatan</span>
                  <span class="font-headline text-5xl font-medium text-primary tracking-tighter">{{ formatCurrency(summary?.total_omzet || 0) }}</span>
                  <span class="font-label text-sm text-tertiary flex items-center gap-1.5 mt-2 bg-tertiary/10 self-start px-3 py-1 rounded-full font-bold">
                    <span class="material-symbols-outlined text-[18px]">trending_up</span>
                    {{ summary?.total_transaksi || 0 }} transaksi
                  </span>
                </div>
                <!-- Total Transactions -->
                <div class="bg-surface-container-low p-8 rounded-2xl flex flex-col gap-3 border border-outline-variant/10">
                  <span class="font-label text-xs text-on-surface-variant uppercase tracking-[0.15em] font-bold">Total Transaksi</span>
                  <span class="font-headline text-5xl font-medium text-on-surface tracking-tighter">{{ summary?.total_transaksi || 0 }}</span>
                  <span class="font-label text-sm text-secondary flex items-center gap-1.5 mt-2 bg-secondary/10 self-start px-3 py-1 rounded-full font-bold">
                    <span class="material-symbols-outlined text-[18px]">receipt_long</span>
                    Hari ini
                  </span>
                </div>
                <!-- Pending Orders -->
                <div class="bg-surface-container-high p-8 rounded-2xl flex flex-col gap-3 border border-outline-variant/10">
                  <span class="font-label text-xs text-on-surface-variant uppercase tracking-[0.15em] font-bold">Pending</span>
                  <span class="font-headline text-5xl font-medium text-on-surface tracking-tighter">{{ summary?.pending_count || 0 }}</span>
                  <span class="font-label text-sm text-tertiary flex items-center gap-1.5 mt-2 bg-tertiary/10 self-start px-3 py-1 rounded-full font-bold">
                    <span class="material-symbols-outlined text-[18px]">hourglass_empty</span>
                    Menunggu
                  </span>
                </div>
              </div>
            </section>

            <!-- AI Insights Narrative -->
            <section class="mb-20 bg-surface p-10 rounded-[32px] border border-outline-variant/30 relative overflow-hidden">
              <div class="absolute -top-32 -right-32 w-80 h-80 bg-primary-container/10 rounded-full blur-[80px] pointer-events-none"></div>
              <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">psychology</span>
                </div>
                <h2 class="text-2xl font-headline font-medium text-primary">Analisis AI</h2>
              </div>
              <div class="font-headline text-xl text-on-surface/90 leading-[1.8] space-y-6">
                <p v-if="aiInsight?.insight">
                  {{ aiInsight.insight }}
                </p>
                <p v-else class="text-on-surface-variant italic">
                  Belum ada analisis untuk periode ini.
                </p>
              </div>
            </section>

            <!-- Transaction Details -->
            <section class="mb-12 flex-grow">
              <h2 class="text-2xl font-headline font-medium text-on-surface mb-8 flex items-center gap-3">
                Notable Transactions
                <span class="h-[1px] flex-1 bg-outline-variant/30"></span>
              </h2>
              <div class="w-full">
                <!-- Header -->
                <div class="grid grid-cols-12 gap-6 pb-6 mb-4 border-b-2 border-on-surface/5">
                  <div class="col-span-2 font-label text-xs text-on-surface-variant uppercase tracking-[0.2em] font-bold">Date</div>
                  <div class="col-span-5 font-label text-xs text-on-surface-variant uppercase tracking-[0.2em] font-bold">Description</div>
                  <div class="col-span-3 font-label text-xs text-on-surface-variant uppercase tracking-[0.2em] font-bold">Category</div>
                  <div class="col-span-2 font-label text-xs text-on-surface-variant uppercase tracking-[0.2em] font-bold text-right">Amount</div>
                </div>
                <!-- Rows -->
                <div class="flex flex-col gap-2">
                  <div v-for="t in transactions" :key="t.id" class="grid grid-cols-12 gap-6 py-6 items-center border-b border-outline-variant/10">
                    <div class="col-span-2 font-label text-sm text-on-surface-variant font-medium">{{ t.date }}</div>
                    <div class="col-span-5 font-headline text-xl text-on-surface font-medium">{{ t.desc }}</div>
                    <div class="col-span-3">
                      <span class="font-label text-xs px-3 py-1 bg-surface-container-highest rounded-full text-on-surface-variant font-bold uppercase tracking-wider">{{ t.cat }}</span>
                    </div>
                    <div :class="['col-span-2 font-headline text-xl font-semibold text-right', t.amount > 0 ? 'text-tertiary' : 'text-on-surface']">
                      {{ t.amount > 0 ? '+' : '' }}{{ formatCurrency(t.amount) }}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Footer -->
            <footer class="mt-20 pt-10 border-t border-outline-variant/30 flex justify-between items-center text-sm font-label text-on-surface-variant font-medium">
              <div class="flex items-center gap-4">
                <span>Saku POS Document ID: REP-2024-10-884</span>
                <span class="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span class="italic text-primary/70">Verified by AI Oracle</span>
              </div>
              <span class="font-headline italic text-lg text-on-surface">Page 1 of 1</span>
            </footer>
          </div>
        </div>
        </template>

        <div class="h-12"></div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';
import { useAuthStore } from '../stores/auth';
import { usePosStore } from '../stores/pos';
import { insightsApi } from '../api/insights';
import html2pdf from 'html2pdf.js';

const authStore = useAuthStore();
const posStore = usePosStore();
const isExporting = ref(false);
const loading = ref(true);

const user = computed(() => ({
  name: authStore.user?.name || 'Owner',
  avatar: authStore.user?.avatar || '',
}));

const generatedDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const summary = computed(() => posStore.summary || {});
const transactions = computed(() => (posStore.transactions || []).slice(0, 10).map((t: any) => ({
  id: t.id,
  date: t.created_at ? new Date(t.created_at * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-',
  desc: t.items?.map((i: any) => i.name).join(', ') || 'POS Transaction',
  cat: t.payment_method || 'cash',
  amount: t.amount || 0,
})));

const aiInsight = ref<any>(null);

const loadAiInsight = async () => {
  try {
    const res = await insightsApi.getDaily();
    aiInsight.value = res.data?.data || {};
  } catch (e) {
    aiInsight.value = { insight: 'Belum ada data untuk hari ini' };
  }
};

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

const exportToPdf = async () => {
  isExporting.value = true;
  
  const element = document.getElementById('report-document');
  const opt = {
    margin: 10,
    filename: `Saku_Report_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      letterRendering: true,
      windowWidth: 1200
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF Export failed:', error);
    alert('Gagal mengekspor PDF. Silakan coba lagi.');
  } finally {
    isExporting.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([
    posStore.fetchTransactions({ limit: 20 }),
    posStore.fetchSummary(),
    loadAiInsight(),
  ]);
  loading.value = false;
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Manrope:wght@200..800&display=swap');

#report-document {
  /* A4 Proportions */
  background-color: white;
  margin: 0 auto;
}

/* Material Symbols configuration */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Transitions */
.animate-in {
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
