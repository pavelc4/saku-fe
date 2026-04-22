import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../stores/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockProduct = { id: '1', name: 'Kopi Susu', price: 25000 }
  const mockProduct2 = { id: '2', name: 'Teh Manis', price: 10000 }

  it('cart awal kosong', () => {
    const store = useCartStore()
    expect(store.items).toHaveLength(0)
    expect(store.totalItems).toBe(0)
    expect(store.subtotal).toBe(0)
  })

  it('addToCart menambah produk baru', () => {
    const store = useCartStore()
    store.addToCart(mockProduct)
    expect(store.items).toHaveLength(1)
    expect(store.items[0].quantity).toBe(1)
    expect(store.totalItems).toBe(1)
  })

  it('addToCart menambah quantity jika produk sudah ada', () => {
    const store = useCartStore()
    store.addToCart(mockProduct)
    store.addToCart(mockProduct)
    expect(store.items).toHaveLength(1)
    expect(store.items[0].quantity).toBe(2)
    expect(store.totalItems).toBe(2)
  })

  it('removeFromCart menghapus produk', () => {
    const store = useCartStore()
    store.addToCart(mockProduct)
    store.removeFromCart('1')
    expect(store.items).toHaveLength(0)
  })

  it('updateQuantity mengubah jumlah produk', () => {
    const store = useCartStore()
    store.addToCart(mockProduct)
    store.updateQuantity('1', 5)
    expect(store.items[0].quantity).toBe(5)
  })

  it('updateQuantity dengan 0 menghapus produk', () => {
    const store = useCartStore()
    store.addToCart(mockProduct)
    store.updateQuantity('1', 0)
    expect(store.items).toHaveLength(0)
  })

  it('subtotal dihitung dengan benar', () => {
    const store = useCartStore()
    store.addToCart(mockProduct)   // 25000
    store.addToCart(mockProduct2)  // 10000
    expect(store.subtotal).toBe(35000)
  })

  it('tax 10% dihitung dengan benar', () => {
    const store = useCartStore()
    store.addToCart(mockProduct) // 25000
    expect(store.tax).toBe(2500)
  })

  it('totalPrice = subtotal + tax', () => {
    const store = useCartStore()
    store.addToCart(mockProduct) // 25000 + 2500 tax
    expect(store.totalPrice).toBe(27500)
  })

  it('clearCart mengosongkan semua item', () => {
    const store = useCartStore()
    store.addToCart(mockProduct)
    store.addToCart(mockProduct2)
    store.clearCart()
    expect(store.items).toHaveLength(0)
    expect(store.totalItems).toBe(0)
  })
})
