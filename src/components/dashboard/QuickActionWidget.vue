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

const generateReportHtml = (transactions: any[], summary: any, insight: any, generatedDate: string) => {
  return `<!DOCTYPE html>
<html class="light" lang="id">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Saku POS - Laporan Harian</title>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Manrope:wght@200..800&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<style>
  .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #fbf9f2; font-family: 'Manrope', sans-serif; color: #1b1c18; min-height: 100vh; display: flex; justify-content: center; padding: 48px; }
  main { background: #ffffff; width: 100%; max-width: 850px; min-height: 1100px; border-radius: 2rem; box-shadow: 0 12px 48px -12px rgba(27,28,24,0.06); padding: 64px; display: flex; flex-direction: column; position: relative; overflow: hidden; }
  header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 64px; padding-bottom: 32px; border-bottom: 1px solid #dcc1b8; }
  .brand { display: flex; flex-direction: column; gap: 8px; }
  .brand-title { color: #9a4021; font-family: 'Newsreader', serif; font-size: 40px; font-style: italic; font-weight: 500; margin-bottom: 4px; }
  .page-title { font-family: 'Newsreader', serif; font-size: 32px; font-weight: 600; }
  .meta { display: flex; align-items: center; gap: 16px; font-size: 14px; color: #56423c; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #dcc1b8; }
  .badge { display: flex; flex-direction: column; align-items: flex-end; }
  .badge-icon { font-size: 40px; color: #9a4021; opacity: 0.8; margin-bottom: 8px; }
  .badge-text { font-family: 'Newsreader', serif; font-style: italic; color: #56423c; }
  
  section { margin-bottom: 64px; }
  .section-title { font-family: 'Newsreader', serif; font-size: 24px; font-weight: 500; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
  .section-title::after { content: ''; flex: 1; height: 1px; background: #dcc1b8; }
  
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .card { background: #f5f4ed; padding: 24px; border-radius: 16px; display: flex; flex-direction: column; gap: 8px; }
  .card-label { font-size: 12px; text-transform: uppercase; color: #56423c; letter-spacing: 0.1em; font-weight: 600; }
  .card-value { font-size: 36px; font-weight: 600; margin-top: 8px; }
  .card-value.primary { color: #9a4021; }
  
  .transaction-table { width: 100%; border-collapse: collapse; }
  .transaction-table th { font-size: 12px; text-transform: uppercase; color: #56423c; letter-spacing: 0.1em; padding: 16px 12px; text-align: left; border-bottom: 2px solid #e3e3dc; }
  .transaction-table td { padding: 20px 12px; border-bottom: 1px solid #e3e3dc; }
  .transaction-table .amount { text-align: right; font-weight: 600; }
  
  .ai-section { background: #f5f4ed; padding: 32px; border-radius: 24px; position: relative; overflow: hidden; }
  .ai-decor { position: absolute; top: -96px; right: -96px; width: 256px; height: 256px; background: #b95837; opacity: 0.1; border-radius: 50%; filter: blur(80px); pointer-events: none; }
  .ai-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
  .ai-icon { width: 48px; height: 48px; border-radius: 50%; background: rgba(154,64,51,0.1); display: flex; align-items: center; justify-content: center; }
  .ai-title { font-family: 'Newsreader', serif; font-size: 24px; color: #9a4021; }
  .ai-content { line-height: 1.8; font-size: 18px; color: rgba(27,28,24,0.9); }
  
  footer { margin-top: auto; padding-top: 32px; border-top: 1px solid #dcc1b8; display: flex; justify-content: space-between; font-size: 14px; color: #56423c; }
  
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<main>
<header>
<div class="brand">
  <div class="brand-title">Saku</div>
  <div class="page-title">Laporan Harian</div>
  <div class="meta">
    <span>${generatedDate}</span>
    <span class="dot"></span>
    <span>Generated by Saku POS</span>
  </div>
</div>
<div class="badge">
  <span class="material-symbols-outlined badge-icon">auto_awesome</span>
  <span class="badge-text">Daily Report</span>
</div>
</header>

<section>
<div class="section-title">Ringkasan</div>
<div class="grid">
<div class="card">
<div class="card-label">Total Omzet</div>
<div class="card-value primary">${formatCurrency(summary.total_omzet || 0)}</div>
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
</section>

<section>
<div class="section-title">Transaksi Terbaru</div>
<table class="transaction-table">
<tr><th>Waktu</th><th>Item</th><th style="text-align:right">Total</th></tr>
${transactions.length > 0 ? transactions.map((t: any) => `
<tr>
<td>${t.created_at ? new Date(t.created_at * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
<td>${t.items?.slice(0, 2).map((i: any) => i.name).join(', ') || 'POS'}${t.items?.length > 2 ? \` +\${t.items.length - 2}\` : ''}</td>
<td class="amount">${formatCurrency(t.amount)}</td>
</tr>`).join('') : '<tr><td colspan="3" style="text-align:center;padding:32px;color:#89726b;">Belum ada transaksi hari ini</td></tr>'}
</table>
</section>

${insight?.insight ? \`
<section class="ai-section">
<div class="ai-decor"></div>
<div class="ai-header">
<div class="ai-icon"><span class="material-symbols-outlined" style="font-size:24px;color:#9a4021;">psychology</span></div>
<div class="ai-title">Analisis AI</div>
</div>
<div class="ai-content">\${insight.insight}</div>
</section>
\` : ''}

<footer>
<span>Saku POS Document</span>
<span>Page 1 of 1</span>
</footer>
</main>
</body>
</html>`;
};

const exportPdf = async () => {
  loading.value = true;
  try {
    const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };
    
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