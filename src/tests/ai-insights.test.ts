import { describe, it, expect } from 'vitest'

function detectLang(text: string): 'id' | 'en' {
  const enWords = ['how', 'what', 'when', 'where', 'why', 'who', 'can', 'please', 'hello', 'hi', 'hey', 'sales', 'profit', 'stock', 'product', 'help', 'tell', 'show', 'my', 'is', 'the', 'are', 'was', 'give', 'find', 'check', 'want', 'need', 'thanks', 'thank', 'would', 'could', 'should', 'good', 'do', 'does', 'did', 'have', 'has']
  const words = text.toLowerCase().split(/\s+/)
  let en = 0, id = 0
  for (const w of words) {
    if (enWords.includes(w)) en++
    if (w.endsWith('nya') || w.endsWith('ku') || w.endsWith('mu') || w === 'gak' || w === 'nggak' || w === 'udah' || w === 'aja' || w === 'sih') id++
  }
  if (words.length <= 3) return id >= en ? 'id' : 'en'
  return en > id ? 'en' : 'id'
}

describe('AiInsights detectLang', () => {
  it('detects Indonesian query', () => {
    expect(detectLang('bagaimana penjualan hari ini')).toBe('id')
    expect(detectLang('cek stok produk kopi')).toBe('id')
    expect(detectLang('siapa developer saku')).toBe('id')
    expect(detectLang('total pemasukan bulan ini')).toBe('id')
  })

  it('detects English query', () => {
    expect(detectLang('how was sales today')).toBe('en')
    expect(detectLang('check product stock')).toBe('en')
    expect(detectLang('who is the developer')).toBe('en')
    expect(detectLang('show me the profit')).toBe('en')
  })

  it('defaults to Indonesian for short ambiguous queries', () => {
    expect(detectLang('halo')).toBe('id')
    expect(detectLang('test')).toBe('id')
    expect(detectLang('ya')).toBe('id')
  })

  it('detects Indonesian with informal words', () => {
    expect(detectLang('gak ada stok')).toBe('id')
    expect(detectLang('udah di cek')).toBe('id')
    expect(detectLang('ini barangnya')).toBe('id')
    expect(detectLang('stoknya habis')).toBe('id')
  })

  it('detects English with business keywords', () => {
    expect(detectLang('what is my total sales')).toBe('en')
    expect(detectLang('check product stock please')).toBe('en')
    expect(detectLang('help me find profit')).toBe('en')
  })
})
