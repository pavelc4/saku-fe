// Format date in ID locale
export function formatDate(dateStr: string | number | Date): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d);
  } catch {
    return '';
  }
}

export function formatRelative(dateStr: string | number | Date): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hari ini';
    if (diffInDays === 1) return 'Kemarin';
    if (diffInDays > 1 && diffInDays < 7) return `${diffInDays} hari yang lalu`;
    
    return formatDate(d);
  } catch {
    return '';
  }
}

export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp);
}
