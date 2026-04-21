import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    subtotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    tax: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.1, // Misal pajak 10%
    totalPrice() {
      return this.subtotal + this.tax
    }
  },

  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId)
    },
    
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.quantity = Math.max(0, quantity)
        if (item.quantity === 0) this.removeFromCart(productId)
      }
    },

    clearCart() {
      this.items = []
    }
  }
})