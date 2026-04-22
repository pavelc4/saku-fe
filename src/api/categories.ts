import apiClient from './client'

export const categoriesApi = {
  getAll: () =>
    apiClient.get('/categories'),

  getById: (id: string) =>
    apiClient.get(`/categories/${id}`),

  create: (data: { name: string; description?: string }) =>
    apiClient.post('/categories', data),

  update: (id: string, data: { name?: string; description?: string }) =>
    apiClient.put(`/categories/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/categories/${id}`),
}
