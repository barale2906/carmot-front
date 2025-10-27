import api from './api'

export const authService = {
  // Login
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Logout
  async logout() {
    try {
      const response = await api.post('/logout')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener información del usuario actual
  async getCurrentUser() {
    try {
      const response = await api.get('/user')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Refrescar token
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Cambiar contraseña
  async changePassword(passwordData) {
    try {
      const response = await api.post('/auth/change-password', passwordData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Solicitar reset de contraseña
  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Reset de contraseña
  async resetPassword(resetData) {
    try {
      const response = await api.post('/auth/reset-password', resetData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Verificar permisos para un endpoint específico
  async checkEndpointPermission(endpoint, method = 'GET') {
    try {
      const response = await api.options(endpoint)
      return {
        allowed: response.status === 200,
        permissions: response.headers['x-permissions'] || null
      }
    } catch (error) {
      return {
        allowed: false,
        error: error.response?.data?.message || 'Permission denied'
      }
    }
  },

  // Obtener roles y permisos del usuario
  async getUserPermissions() {
    try {
      const response = await api.get('/auth/permissions')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default authService
