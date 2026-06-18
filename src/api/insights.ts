import apiClient from './client'

export const insightsApi = {
  getMonthly: () => apiClient.get('/insights/monthly'),
  getDaily: () => apiClient.get('/insights/daily'),
  getProductIntelligence: () => apiClient.get('/insights/product-intelligence'),
  getCashflowPrediction: () => apiClient.get('/insights/cashflow-prediction'),
  askAdvisor: (question: string, conversationId?: string) =>
    apiClient.post('/insights/advisor', { query: question, conversation_id: conversationId }),
  getConversations: () => apiClient.get('/insights/conversations'),
  getConversationMessages: (id: string) => apiClient.get(`/insights/conversations/${id}`),
  deleteConversation: (id: string) => apiClient.delete(`/insights/conversations/${id}`),
  renameConversation: (id: string, title: string) => apiClient.patch(`/insights/conversations/${id}`, { title }),
}
