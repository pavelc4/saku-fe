import apiClient from './client'

export const insightsApi = {
  getMonthly: () => apiClient.get('/insights/monthly'),
  getDaily: () => apiClient.get('/insights/daily'),
  getProductIntelligence: () => apiClient.get('/insights/product-intelligence'),
  getCashflowPrediction: () => apiClient.get('/insights/cashflow-prediction'),
  askAdvisor: (question: string) => apiClient.post('/insights/advisor', { question }),
}
