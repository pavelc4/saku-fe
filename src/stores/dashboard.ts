import { defineStore } from 'pinia'
import { ref } from 'vue'
import { insightsApi } from '../api/insights'
import { posApi } from '../api/pos'
import apiClient from '../api/client'

export const useDashboardStore = defineStore('dashboard', () => {
  const metrics = ref<any>(null)
  const recentTransactions = ref<any[]>([])
  const lowStock = ref<any[]>([])
  const topSelling = ref<any[]>([])
  const dailyInsight = ref<any>(null)
  const weeklyRevenue = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    loading.value = true
    error.value = null
    try {
      const [summaryRes, transRes, productsRes, dailyRes, posSummaryRes] = await Promise.all([
        apiClient.get('/transactions/summary'),
        apiClient.get('/transactions', { params: { limit: 5 } }),
        apiClient.get('/products', { params: { limit: 50 } }),
        insightsApi.getDaily().catch(() => ({ data: { data: {} } })),
        posApi.getSummaryToday().catch(() => ({ data: { data: {} } })),
      ])

      metrics.value = summaryRes.data?.data
      recentTransactions.value = transRes.data?.data?.items || transRes.data?.data || []
      dailyInsight.value = dailyRes.data?.data

      const products = productsRes.data?.data?.items || productsRes.data?.data || []
      lowStock.value = products.filter((p: any) => p.stock <= 5 && p.stock > 0).slice(0, 5)
      topSelling.value = products.filter((p: any) => p.stock === 0).slice(0, 5)

      const posSummary = posSummaryRes.data?.data
      weeklyRevenue.value = posSummary?.daily_income 
        ? generateWeeklyRevenueFromPOS(posSummary.daily_income)
        : generateWeeklyRevenue(transRes.data?.data?.items || [])
    } catch (err: any) {
      error.value = 'Gagal memuat data dashboard'
    } finally {
      loading.value = false
    }
  }

  function generateWeeklyRevenueFromPOS(dailyData: Record<string, number>) {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    const result = []
    let maxVal = 0
    for (const val of Object.values(dailyData)) if (val > maxVal) maxVal = val
    for (let i = 0; i < 7; i++) {
      const dayName = days[i]
      const amount = dailyData[dayName] || 0
      result.push({
        label: dayName,
        height: `${Math.max(5, maxVal > 0 ? (amount / maxVal) * 100 : 0)}%`,
        isToday: i === new Date().getDay()
      })
    }
    return result
  }

  function generateWeeklyRevenue(transactions: any[]) {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    const today = new Date().getDay()
    const result = []

    for (let i = 0; i < 7; i++) {
      const dayIndex = (today - 6 + i + 7) % 7
      const dayTransactions = transactions.filter(t => {
        const txDate = new Date(t.date)
        return txDate.getDay() === dayIndex
      })
      const total = dayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
      const maxRevenue = 10000000
      result.push({
        label: days[dayIndex],
        height: `${Math.max(5, (total / maxRevenue) * 100)}%`,
        isToday: i === 6
      })
    }
    return result
  }

  return { metrics, recentTransactions, lowStock, topSelling, dailyInsight, weeklyRevenue, loading, error, fetchDashboard }
})
