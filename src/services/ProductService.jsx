import { apiRequest } from './api.js'

const ProductService = {
  async getAll() {
    const response = await apiRequest('/products')
    return response.data
  },

  async getById(productId) {
    const id = Number(productId)
    if (!Number.isInteger(id) || id < 1) {
      throw new TypeError('Product ID must be a positive integer')
    }

    const response = await apiRequest(`/products/${id}`)
    return response.data
  },

  async create(product) {
    const response = await apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product)
    })
    return response.data ?? response
  },

  async update(productId, product) {
    const id = Number(productId)
    if (!Number.isInteger(id) || id < 1) {
      throw new TypeError('Product ID must be a positive integer')
    }

    const response = await apiRequest(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    })
    return response.data ?? response
  },

  async remove(productId) {
    const id = Number(productId)
    if (!Number.isInteger(id) || id < 1) {
      throw new TypeError('Product ID must be a positive integer')
    }

    const response = await apiRequest(`/admin/products/${id}`, {
      method: 'DELETE'
    })
    return response.data ?? response
  }
}

export default ProductService
