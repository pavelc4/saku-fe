import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

// Mock API
vi.mock('../api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getMe: vi.fn(),
  }
}))

import { authApi } from '../api/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('isAuthenticated is false when no token', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
  })

  it('login berhasil menyimpan token', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      data: { data: { token: 'test-token-123' } }
    } as any)
    vi.mocked(authApi.getMe).mockResolvedValue({
      data: { data: { email: 'test@example.com', name: 'Test User' } }
    } as any)

    const store = useAuthStore()
    const result = await store.login('test@example.com', 'password123')

    expect(result).toBe(true)
    expect(store.token).toBe('test-token-123')
    expect(localStorage.getItem('saku_token')).toBe('test-token-123')
    expect(store.isAuthenticated).toBe(true)
  })

  it('login gagal mengembalikan false dan set error', async () => {
    vi.mocked(authApi.login).mockRejectedValue({
      response: { data: { error: { message: 'Invalid email or password' } } }
    })

    const store = useAuthStore()
    const result = await store.login('wrong@example.com', 'wrongpass')

    expect(result).toBe(false)
    expect(store.error).toBe('Invalid email or password')
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('register berhasil mengembalikan true', async () => {
    vi.mocked(authApi.register).mockResolvedValue({ data: { success: true } } as any)

    const store = useAuthStore()
    const result = await store.register('Test User', 'test@example.com', 'password123')

    expect(result).toBe(true)
    expect(store.error).toBeNull()
  })

  it('register gagal mengembalikan false dan set error', async () => {
    vi.mocked(authApi.register).mockRejectedValue({
      response: { data: { error: { message: 'Email is already registered' } } }
    })

    const store = useAuthStore()
    const result = await store.register('Test', 'exists@example.com', 'pass')

    expect(result).toBe(false)
    expect(store.error).toBe('Email is already registered')
  })

  it('logout membersihkan token dan user', async () => {
    vi.mocked(authApi.logout).mockResolvedValue({ data: {} } as any)
    vi.mocked(authApi.getMe).mockResolvedValue({
      data: { data: { email: 'test@example.com' } }
    } as any)

    localStorage.setItem('saku_token', 'existing-token')
    const store = useAuthStore()
    store.token = 'existing-token'
    store.user = { email: 'test@example.com' }

    await store.logout()

    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(localStorage.getItem('saku_token')).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
