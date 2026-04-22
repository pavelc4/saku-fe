import { defineStore } from 'pinia'
import { ref } from 'vue'
import { transactionsApi } from '../api/transactions'

export const useTransactionsStore = defineStore('transactions', () => {
  const items = ref<any[]>([])
  const summary = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref({ total: 0, page: 1, limit: 20 })

  async function fetchTransactions(params?: object) {
    loading.value = true
    error.value = null
    try {
      const res = await transactionsApi.getAll(params)
      items.value = res.data?.data?.items || res.data?.data || []
      if (res.data?.data?.meta) meta.value = res.data.data.meta
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal memuat transaksi'
    } finally {
      loading.value = false
    }
  }

  async function fetchSummary() {
    try {
      const res = await transactionsApi.getAll({ summary: true } as any)
      summary.value = res.data?.data
    } catch {}
  }

  async function createTransaction(data: object) {
    loading.value = true
    error.value = null
    try {
      const res = await transactionsApi.create(data)
      items.value.unshift(res.data?.data)
      return res.data?.data
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal membuat transaksi'
      return null
    } finally {
      loading.value = false
    }
  }

  return { items, summary, loading, error, meta, fetchTransactions, fetchSummary, createTransaction }
})
