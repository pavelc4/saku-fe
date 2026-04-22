import apiClient from './client'

export const productsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; category_id?: string }) =>
    apiClient.get('/products', { params }),

  getById: (id: string) =>
    apiClient.get(`/products/${id}`),

  create: (data: FormData | object) =>
    apiClient.post('/products', data),

  update: (id: string, data: FormData | object) =>
    apiClient.put(`/products/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/products/${id}`),
}
