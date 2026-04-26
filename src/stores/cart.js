import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    taxRate: 11, // default 11%
  }),
  
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    subtotal: (state) => state.items.reduce((total, item) => {
      const discount = (item.discount || 0) / 100;
      return total + (item.price * (1 - discount) * item.quantity);
    }, 0),
    subtotalBeforeDiscount: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    totalDiscount: (state) => state.items.reduce((total, item) => {
      const discount = (item.discount || 0) / 100;
      return total + (item.price * discount * item.quantity);
    }, 0),
    tax() {
      return this.subtotal * (this.taxRate / 100)
    },
    totalPrice() {
      return this.subtotal + this.tax
    }
  },

  actions: {
    setTaxRate(rate) {
      this.taxRate = rate || 11
    },

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