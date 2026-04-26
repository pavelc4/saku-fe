<template>
  <aside class="relative overflow-hidden rounded-lg p-6 bg-secondary-container/30 backdrop-blur-xl border border-secondary-container/50">
    <div class="relative z-10">
      <span class="material-symbols-outlined text-4xl text-on-secondary-container mb-4">picture_as_pdf</span>
      <h3 class="font-headline text-lg font-medium text-on-surface mb-2">Laporan PDF</h3>
      <p class="font-body text-sm text-on-surface-variant mb-4">Export & download langsung.</p>
      <button @click="exportPdf" :disabled="loading" class="px-4 py-2 bg-primary text-on-primary rounded-full font-body font-medium text-sm w-full hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50">
        {{ loading ? 'Memuat...' : 'Download PDF' }}
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const exportPdf = async () => {
  loading.value = true;
  try {
    const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };
    
    // Fetch data with auth
    const [transRes, summaryRes, insightRes] = await Promise.all([
      fetch('/api/pos/transactions?limit=10', { headers }).then(r => r.json()).catch(() => ({ data: { data: [] } })),
      fetch('/api/pos/summary/today', { headers }).then(r => r.json()).catch(() => ({ data: { data: {} } })),
      fetch('/api/insights/daily', { headers }).then(r => r.json()).catch(() => ({ data: { data: {} } })),
    ]);

const transactions = transRes.data?.data || [];
    const summary = summaryRes.data?.data || {};
    const insight = insightRes.data?.data || {};
    
    const generatedDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const html = generateReportHtml(transactions, summary, insight, generatedDate);
};

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  } catch (e) {
    console.error(e);
    alert('Gagal mengekspor PDF');
  } finally {
    loading.value = false;
  }
};
</script>
