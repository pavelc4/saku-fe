import apiClient from './client'

export const usersApi = {
  updateProfile: (data: { name?: string; email?: string }) =>
    apiClient.put('/users/me', data),
}
