import apiClient from './client'

export interface UserSettings {
  tax_rate: number
  currency: string
  auto_sync_inventory: boolean
  business_name?: string
  business_address?: string
}

export const settingsApi = {
  get: () => apiClient.get('/settings'),
  update: (data: Partial<UserSettings>) => apiClient.put('/settings', data),
}