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
    
    // Generate HTML content for print
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Laporan Harian Saku</title>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@400;600&family=Manrope:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Manrope', sans-serif; padding: 48px; max-width: 800px; margin: 0 auto; color: #1a1a1a; background: #fff; }
    h1 { color: #c96442; font-family: 'Newsreader', serif; font-size: 36px; margin-bottom: 4px; font-style: italic; }
    .date { color: #666; margin-bottom: 40px; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
    .card { background: #f5f4ed; padding: 24px; border-radius: 20px; }
    .card-label { font-size: 11px; text-transform: uppercase; color: #666; letter-spacing: 0.1em; font-weight: 600; }
    .card-value { font-size: 32px; font-weight: 600; margin-top: 8px; }
    h2 { font-size: 20px; margin: 32px 0 20px; color: #1a1a1a; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 14px 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { font-size: 11px; text-transform: uppercase; color: #999; font-weight: 600; }
    .amount { text-align: right; font-weight: 600; }
    .ai-box { background: linear-gradient(135deg, #f5f4ed 0%, #ebe9e3 100%); padding: 24px; border-radius: 24px; margin-top: 32px; }
    .ai-title { font-size: 14px; font-weight: 600; color: #c96442; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .ai-content { line-height: 1.7; color: #444; }
    .footer { margin-top: 48px; text-align: center; font-size: 12px; color: #999; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>Laporan Harian Saku</h1>
  <p class="date">${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
  
  <div class="grid">
    <div class="card">
      <div class="card-label">Total Omzet</div>
      <div class="card-value" style="color: #c96442;">${formatCurrency(summary.total_omzet || 0)}</div>
    </div>
    <div class="card">
      <div class="card-label">Transaksi</div>
      <div class="card-value">${summary.total_transaksi || 0}</div>
    </div>
    <div class="card">
      <div class="card-label">Pending</div>
      <div class="card-value">${summary.pending_count || 0}</div>
    </div>
  </div>
  
  <h2>Transaksi Terbaru</h2>
  <table>
    <tr><th>Waktu</th><th>Item</th><th class="amount">Total</th></tr>
    ${transactions.length > 0 ? transactions.map((t: any) => `<tr>
      <td>${t.created_at ? new Date(t.created_at * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
      <td>${t.items?.slice(0, 2).map((i: any) => i.name).join(', ') || 'POS'}${t.items?.length > 2 ? ` +${t.items.length - 2}` : ''}</td>
      <td class="amount">${formatCurrency(t.amount)}</td>
    </tr>`).join('') : '<tr><td colspan="3" style="text-align:center;color:#999;padding:24px;">Belum ada transaksi hari ini</td></tr>'}
  </table>
  
  ${insight?.insight ? `<div class="ai-box">
    <div class="ai-title">🤖 Analisis AI</div>
    <p class="ai-content">${insight.insight}</p>
  </div>` : ''}
  
  <p class="footer">Generated by Saku POS</p>
</body>
</html>`;

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
