import {
  apiRequest,
  saveAuthentication
} from './api.js'

const UserService = {
  async register(userData) {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    saveAuthentication(response.data)
    return response.data.customer
  },

  async login(credentials) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    saveAuthentication(response.data)
    return response.data.customer
  },

  async getProfile() {
    const response = await apiRequest('/customers/me')
    return response.data
  },

  async updateProfile(profile) {
    const response = await apiRequest('/customers/me', {
      method: 'PUT',
      body: JSON.stringify(profile)
    })
    const updatedProfile = {
      ...UserService.getCurrentUser(),
      ...response.data
    }
    localStorage.setItem('user', JSON.stringify(updatedProfile))
    return response.data
  },

  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch (error) {
      throw new Error('Saved user data is invalid. Clear browser storage and try again.', {
        cause: error
      })
    }
  }
}

export default UserService
