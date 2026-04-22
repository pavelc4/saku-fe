import apiClient from './client'

export const productsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; category_id?: string }) =>
    apiClient.get('/products', { params }),

  getById: (id: string) =>
    apiClient.get(`/products/${id}`),

  create: (data: object) =>
    apiClient.post('/products', data),

  update: (id: string, data: object) =>
    apiClient.patch(`/products/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/products/${id}`),

  updateStock: (id: string, data: { stock: number; reason: string }) =>
    apiClient.patch(`/products/${id}/stock`, data),

  uploadPhoto: (id: string, file: File) => {
    const formData = new FormData()
    formData.append('photo', file)
    return apiClient.post(`/products/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}
