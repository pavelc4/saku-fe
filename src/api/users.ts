import apiClient from './client'

export const usersApi = {
  updateProfile: (data: { name?: string; email?: string }) =>
    apiClient.put('/users/me', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return apiClient.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  deleteAvatar: () =>
    apiClient.delete('/users/me/avatar'),
}
