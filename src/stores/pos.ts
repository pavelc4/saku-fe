import { defineStore } from 'pinia'
import { ref } from 'vue'
import { posApi } from '../api/pos'

export const usePosStore = defineStore('pos', () => {
  const activeSession = ref<any>(null)
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

  async function openSession(openingBalance: number) {
    loading.value = true
    error.value = null
    try {
      const res = await posApi.openSession({ opening_balance: openingBalance })
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
      await posApi.closeSession(activeSession.value.id, { closing_balance: closingBalance })
      activeSession.value = null
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal menutup sesi'
      return false
    } finally {
      loading.value = false
    }
  }

  async function checkout(items: any[], paymentMethod: string, amountPaid: number) {
    loading.value = true
    error.value = null
    try {
      const res = await posApi.createTransaction({
        session_id: activeSession.value?.id,
        items,
        payment_method: paymentMethod,
        amount_paid: amountPaid,
      })
      return res.data?.data
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Checkout gagal'
      return null
    } finally {
      loading.value = false
    }
  }

  return { activeSession, loading, error, fetchActiveSession, openSession, closeSession, checkout }
})
