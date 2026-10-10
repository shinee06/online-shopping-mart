import { apiRequest } from '../../services/api.js'

const basePath = '/admin/employees'

const EmployeeService = {
  async getAll() {
    const response = await apiRequest(basePath)
    return response.data || []
  },
  async getById(id) {
    const response = await apiRequest(`${basePath}/${encodeURIComponent(id)}`)
    return response.data
  },
  async create(employee) {
    return apiRequest(basePath, { method: 'POST', body: JSON.stringify(employee) })
  },
  async update(id, employee) {
    return apiRequest(`${basePath}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(employee) })
  },
  async remove(id) {
    return apiRequest(`${basePath}/${encodeURIComponent(id)}`, { method: 'DELETE' })
  }
}

export default EmployeeService
