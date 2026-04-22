import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoriesApi } from '../api/categories'

export const useCategoriesStore = defineStore('categories', () => {
  const items = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const res = await categoriesApi.getAll()
      items.value = res.data?.data || []
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal memuat kategori'
    } finally {
      loading.value = false
    }
  }

  async function createCategory(data: { name: string; description?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await categoriesApi.create(data)
      items.value.push(res.data?.data)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal membuat kategori'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id: string, data: object) {
    loading.value = true
    error.value = null
    try {
      const res = await categoriesApi.update(id, data)
      const idx = items.value.findIndex(c => c.id === id)
      if (idx !== -1) items.value[idx] = res.data?.data
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal mengupdate kategori'
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id: string) {
    loading.value = true
    error.value = null
    try {
      await categoriesApi.delete(id)
      items.value = items.value.filter(c => c.id !== id)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal menghapus kategori'
      return false
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory }
})
