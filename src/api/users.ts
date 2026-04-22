import apiClient from './client'
import { fachApi } from './fach'

export const usersApi = {
  updateProfile: (data: { name?: string; email?: string }) =>
    apiClient.put('/users/me', data),

  uploadAvatar: async (file: File) => {
    // Upload to fach worker for storage
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'avatars')
    
    const res = await fetch('https://fach.pavelc4.workers.dev/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('saku_token')}`
      }
    })
    
    if (!res.ok) {
      throw new Error('Upload failed')
    }
    
    const data = await res.json()
    return { data }
  },

  deleteAvatar: () =>
    apiClient.delete('/users/me/avatar'),
}
