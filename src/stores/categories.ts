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
      const rawItems = res.data?.data || []
      items.value = rawItems.map((c: any) => ({
        ...c,
        icon: c.icon || 'category',
        color: c.color || '#c96442'
      }))
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal memuat kategori'
    } finally {
      loading.value = false
    }
  }

  async function createCategory(data: { name: string; color?: string; icon?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await categoriesApi.create(data)
      const serverData = res.data?.data || {}
      const newItem = { 
        ...data, 
        ...serverData,
        // Preserve local values if server returns null/undefined
        icon: serverData.icon || data.icon,
        color: serverData.color || data.color
      }
      items.value.push(newItem)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal membuat kategori'
      return false
    } finally {
      loading.value = false
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    try {
      await categoriesApi.update(id, { is_active: isActive })
      const idx = items.value.findIndex(c => c.id === id)
      if (idx !== -1) items.value[idx].is_active = isActive
      return true
    } catch (err: any) {
      return false
    }
  }

  async function updateCategory(id: string, data: object) {
    loading.value = true
    error.value = null
    try {
      const res = await categoriesApi.update(id, data)
      const serverData = res.data?.data || {}
      const idx = items.value.findIndex(c => c.id === id)
      if (idx !== -1) {
        items.value[idx] = { 
          ...items.value[idx], 
          ...data, 
          ...serverData,
          // Preserve local values if server returns null/undefined
          icon: serverData.icon || (data as any).icon || items.value[idx].icon,
          color: serverData.color || (data as any).color || items.value[idx].color
        }
      }
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

  return { items, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory, toggleActive }
})
