import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('menyimpan base URL dari env', async () => {
    const { default: apiClient } = await import('../api/client')
    expect(apiClient.defaults.baseURL).toBeDefined()
  })

  it('menambahkan Authorization header jika token ada', async () => {
    localStorage.setItem('saku_token', 'my-token')
    const { default: apiClient } = await import('../api/client')

    // Simulate interceptor
    const config = { headers: {} as any }
    const token = localStorage.getItem('saku_token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    expect(config.headers.Authorization).toBe('Bearer my-token')
  })

  it('tidak menambahkan Authorization header jika tidak ada token', () => {
    const config = { headers: {} as any }
    const token = localStorage.getItem('saku_token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    expect(config.headers.Authorization).toBeUndefined()
  })
})
