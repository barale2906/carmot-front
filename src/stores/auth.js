import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(null)
  const token = ref(sessionStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref(null)

  // Getters computados
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.name || '')

  // Acciones
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/login', credentials)
      
      if (response.data.access_token) {
        const { access_token, token_type } = response.data
        
        // Guardar token en sessionStorage
        sessionStorage.setItem('auth_token', access_token)
        token.value = access_token
        
        // Configurar token en axios
        api.defaults.headers.common['Authorization'] = `${token_type} ${access_token}`
        
        // Obtener información del usuario
        await getUserInfo()
        
        return { success: true }
      } else {
        error.value = 'Error en el login'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error de conexión'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const getUserInfo = async () => {
    try {
      const response = await api.get('/user')
      user.value = response.data
    } catch (err) {
      console.warn('Error obteniendo información del usuario:', err)
      user.value = null
    }
  }

  const logout = async () => {
    loading.value = true
    
    try {
      // Llamar al endpoint de logout si existe
      await api.post('/logout')
    } catch (err) {
      console.warn('Error en logout:', err)
    } finally {
      // Limpiar estado local independientemente del resultado del servidor
      sessionStorage.removeItem('auth_token')
      token.value = null
      user.value = null
      
      // Remover token de axios
      delete api.defaults.headers.common['Authorization']
      
      loading.value = false
    }
  }

  const checkAuth = async () => {
    if (!token.value) {
      return false
    }
    
    loading.value = true
    
    try {
      // Configurar token en axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      // Verificar token con el servidor
      await getUserInfo()
      
      if (user.value) {
        return true
      } else {
        // Token inválido, limpiar estado
        await logout()
        return false
      }
    } catch (err) {
      // Error de autenticación, limpiar estado
      await logout()
      return false
    } finally {
      loading.value = false
    }
  }

  const refreshToken = async () => {
    if (!token.value) {
      return false
    }
    
    try {
      const response = await api.post('/auth/refresh')
      
      if (response.data.success) {
        const { token: newToken } = response.data.data
        
        sessionStorage.setItem('auth_token', newToken)
        token.value = newToken
        
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        
        return true
      }
    } catch (err) {
      console.warn('Error refreshing token:', err)
      await logout()
    }
    
    return false
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // Estado
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    userRole,
    userName,
    
    // Acciones
    login,
    logout,
    checkAuth,
    refreshToken,
    clearError
  }
})
