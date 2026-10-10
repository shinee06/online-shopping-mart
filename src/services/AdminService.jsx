import { apiRequest, saveAuthentication } from './api.js'

const AdminService = {
  async registerAdmin(account) {
    const response = await apiRequest('/admin/setup', {
      method: 'POST',
      body: JSON.stringify(account)
    })
    saveAuthentication(response.data)
    return response.data.customer
  },

  async getOverview() {
    const response = await apiRequest('/admin/dashboard')
    return response.data
  },

  async getCustomers() {
    const response = await apiRequest('/admin/customers')
    return response.data
  },

  async getOrders() {
    const response = await apiRequest('/admin/orders')
    return response.data
  }
}

export default AdminService
