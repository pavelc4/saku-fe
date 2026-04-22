import apiClient from './client'

export const categoriesApi = {
  getAll: () =>
    apiClient.get('/products/categories'),

  getById: (id: string) =>
    apiClient.get(`/products/categories/${id}`),

  create: (data: { name: string; color?: string }) =>
    apiClient.post('/products/categories', data),

  update: (id: string, data: { name?: string; color?: string }) =>
    apiClient.patch(`/products/categories/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/products/categories/${id}`),
}
