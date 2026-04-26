import { defineStore } from 'pinia'
import { ref } from 'vue'
import { posApi } from '../api/pos'

export const usePosStore = defineStore('pos', () => {
  const activeSession = ref<any>(null)
  const transactions = ref<any[]>([])
  const summary = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchActiveSession() {
    loading.value = true
    error.value = null
    try {
      const res = await posApi.getActiveSession()
      activeSession.value = res.data?.data || null
    } catch (err: any) {
      activeSession.value = null
    } finally {
      loading.value = false
    }
  }

  async function openSession(openingBalance: number, cashierName?: string) {
    loading.value = true
    error.value = null
    try {
      const res = await posApi.openSession({ opening_cash: openingBalance, cashier_name: cashierName })
      activeSession.value = res.data?.data
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal membuka sesi'
      return false
    } finally {
      loading.value = false
    }
  }

  async function closeSession(closingBalance: number) {
    if (!activeSession.value) return false
    loading.value = true
    error.value = null
    try {
      await posApi.closeSession({ closing_cash: closingBalance })
      activeSession.value = null
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal menutup sesi'
      return false
    } finally {
      loading.value = false
    }
  }

  async function checkout(items: any[], paymentMethod: 'cash' | 'transfer' | 'qris', options?: { tax_rate?: number }) {
    loading.value = true
    error.value = null
    try {
      const res = await posApi.createTransaction({
        items,
        payment_method: paymentMethod,
        ...options,
      })
      return res.data?.data
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Checkout gagal'
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchTransactions(params?: { page?: number; limit?: number; session_id?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await posApi.getTransactions(params)
      transactions.value = res.data?.data || []
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal memuat transaksi'
    } finally {
      loading.value = false
    }
  }

  async function fetchSummary() {
    try {
      const res = await posApi.getSummaryToday()
      summary.value = res.data?.data || null
    } catch (err: any) {
      summary.value = null
    }
  }

  return { activeSession, transactions, summary, loading, error, fetchActiveSession, openSession, closeSession, checkout, fetchTransactions, fetchSummary }
})
