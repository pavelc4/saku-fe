import apiClient from './client'

export const transactionsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get('/transactions', { params }),

  getById: (id: string) =>
    apiClient.get(`/transactions/${id}`),

  create: (data: object) =>
    apiClient.post('/transactions', data),

  update: (id: string, data: object) =>
    apiClient.put(`/transactions/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/transactions/${id}`),
}
