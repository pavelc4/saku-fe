export function formatRupiah(amount: number): string {
  if (isNaN(amount)) amount = 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseCurrency(formatted: string): number {
  if (typeof formatted !== 'string') return 0;
  const numeric = formatted.replace(/[^0-9-]/g, '');
  return parseInt(numeric, 10) || 0;
}
