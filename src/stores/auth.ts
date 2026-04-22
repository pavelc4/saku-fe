import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/auth'

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || ''

export function getR2Url(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (R2_PUBLIC_URL) {
    const ts = Date.now()
    return `${R2_PUBLIC_URL}/${path}?t=${ts}`
  }
  return ''
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('saku_token'))
  const user = ref<any | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await authApi.login(email, password)
      const data = res.data?.data
      token.value = data.token
      localStorage.setItem('saku_token', data.token)
      await fetchMe()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Login gagal'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      await authApi.register(name, email, password)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Registrasi gagal'
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    try {
      const res = await authApi.getMe()
      user.value = res.data?.data
    } catch {
      logout()
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {}
    token.value = null
    user.value = null
    localStorage.removeItem('saku_token')
    window.location.href = '/login'
  }

  // Auto fetch user on init if token exists
  if (token.value) {
    fetchMe()
  }

  return { token, user, loading, error, isAuthenticated, login, register, logout, fetchMe }
})
