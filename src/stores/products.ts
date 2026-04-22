import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productsApi } from '../api/products'

export const useProductsStore = defineStore('products', () => {
  const items = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref({ total: 0, page: 1, limit: 20 })
  const search = ref('')
  const activeCategoryId = ref<string | null>(null)

  const lowStockItems = computed(() => items.value.filter(p => p.stock <= 5 && p.stock > 0))
  const outOfStock = computed(() => items.value.filter(p => p.stock === 0))
  const totalValue = computed(() => items.value.reduce((sum, p) => sum + (p.price * p.stock), 0))

  async function fetchProducts(params?: object) {
    loading.value = true
    error.value = null
    try {
      const res = await productsApi.getAll({ search: search.value, category_id: activeCategoryId.value || undefined, ...params })
      const rawItems = res.data?.data?.items || res.data?.data || []
      items.value = rawItems.map((p: any) => ({
        ...p,
        category_id: p.product_category_id,
        category: p.category_name,
        active: !!p.is_active,
        image: p.photo_url,
      }))
      if (res.data?.data?.meta) meta.value = res.data.data.meta
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal memuat produk'
    } finally {
      loading.value = false
    }
  }

  async function createProduct(data: object) {
    loading.value = true
    error.value = null
    try {
      const res = await productsApi.create(data)
      const p = res.data?.data
      items.value.unshift({
        ...p,
        category_id: p.product_category_id,
        category: p.category_name,
        active: !!p.is_active,
      })
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal membuat produk'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(id: string, data: any) {
    loading.value = true
    error.value = null
    try {
      await productsApi.update(id, data)
      const idx = items.value.findIndex(p => p.id === id)
      if (idx !== -1) {
        items.value[idx] = {
          ...items.value[idx],
          ...data,
          active: data.is_active,
        }
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal mengupdate produk'
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(id: string) {
    loading.value = true
    error.value = null
    try {
      await productsApi.delete(id)
      items.value = items.value.filter(p => p.id !== id)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Gagal menghapus produk'
      return false
    } finally {
      loading.value = false
    }
  }

  async function restockProduct(id: string, quantity: number) {
    try {
      await productsApi.updateStock(id, { stock: quantity, reason: 'Restock from dashboard' })
      const idx = items.value.findIndex(p => p.id === id)
      if (idx !== -1) items.value[idx].stock = quantity
      return true
    } catch (err: any) {
      return false
    }
  }

  return { items, loading, error, meta, search, activeCategoryId, lowStockItems, outOfStock, totalValue, fetchProducts, createProduct, updateProduct, deleteProduct, restockProduct }
})
