import { defineStore } from 'pinia'
import { ref } from 'vue'
import { insightsApi } from '../api/insights'
import apiClient from '../api/client'

export const useDashboardStore = defineStore('dashboard', () => {
  const metrics = ref<any>(null)
  const recentTransactions = ref<any[]>([])
  const lowStock = ref<any[]>([])
  const topSelling = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    loading.value = true
    error.value = null
    try {
      const [summaryRes, transRes, productsRes, dailyRes] = await Promise.all([
        apiClient.get('/transactions/summary'),
        apiClient.get('/transactions', { params: { limit: 5 } }),
        apiClient.get('/products', { params: { limit: 50 } }),
        insightsApi.getDaily().catch(() => ({ data: { data: {} } })),
      ])

      metrics.value = summaryRes.data?.data
      recentTransactions.value = transRes.data?.data?.items || transRes.data?.data || []

      const products = productsRes.data?.data?.items || productsRes.data?.data || []
      lowStock.value = products.filter((p: any) => p.stock <= 5 && p.stock > 0).slice(0, 5)
      topSelling.value = products.filter((p: any) => p.stock === 0).slice(0, 5)
    } catch (err: any) {
      error.value = 'Gagal memuat data dashboard'
    } finally {
      loading.value = false
    }
  }

  return { metrics, recentTransactions, lowStock, topSelling, loading, error, fetchDashboard }
})
