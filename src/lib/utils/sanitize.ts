// Strips HTML tags from user-supplied strings before rendering as text.
// Use this on any data that came from user input and is rendered in the DOM.
export function sanitizeText(raw: string): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/<[^>]*>/g, '').trim();
}
