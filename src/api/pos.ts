import apiClient from './client'

export const posApi = {
  openSession: (data: { opening_balance: number }) =>
    apiClient.post('/pos/sessions/open', data),

  closeSession: (sessionId: string, data: { closing_balance: number }) =>
    apiClient.post(`/pos/sessions/${sessionId}/close`, data),

  getActiveSession: () =>
    apiClient.get('/pos/sessions/active'),

  createTransaction: (data: object) =>
    apiClient.post('/pos/transactions', data),

  getTransactions: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/pos/transactions', { params }),
}
