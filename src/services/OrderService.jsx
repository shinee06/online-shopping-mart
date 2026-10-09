import { apiRequest } from './api.js'

const OrderService = {
  async getAll() {
    const response = await apiRequest('/orders')
    return response.data
  },

  async create({ customer, items }) {
    if (!customer || !Array.isArray(items) || items.length === 0) {
      throw new Error('Customer details and at least one order item are required')
    }

    const normalizedItems = items.map((item) => ({
      productId: Number(item.productId ?? item.id),
      quantity: Number(item.quantity || 1)
    }))

    if (normalizedItems.some((item) => (
      !Number.isInteger(item.productId) ||
      item.productId < 1 ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    ))) {
      throw new Error('Each order item needs a valid product ID and quantity')
    }

    const response = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({ customer, items: normalizedItems })
    })

    return response.data
  }
}

export default OrderService
