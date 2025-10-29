import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import authService from '@/services/auth'
import { handleApiError } from '@/services/api'

export function useAuth() {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const error = ref(null)

  // Estados computados
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const userRole = computed(() => authStore.userRole)
  const userName = computed(() => authStore.userName)
  const userId = computed(() => authStore.user?.id || null)

  // Función de login
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await authStore.login(credentials)
      
      if (result.success) {
        return { success: true }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Función de logout
  const logout = async () => {
    isLoading.value = true
    error.value = null

    try {
      await authStore.logout()
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Verificar autenticación
  const checkAuth = async () => {
    isLoading.value = true
    error.value = null

    try {
      const isAuth = await authStore.checkAuth()
      return isAuth
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Verificar permisos para un endpoint
  const checkPermission = async (endpoint, method = 'GET') => {
    try {
      const result = await authService.checkEndpointPermission(endpoint, method)
      return result
    } catch (err) {
      console.warn('Permission check failed:', err)
      return { allowed: false, error: 'Permission check failed' }
    }
  }

  // Obtener permisos del usuario
  const getUserPermissions = async () => {
    try {
      const result = await authService.getUserPermissions()
      return result
    } catch (err) {
      console.warn('Failed to get user permissions:', err)
      return null
    }
  }

  // Limpiar errores
  const clearError = () => {
    error.value = null
    authStore.clearError()
  }

  return {
    // Estados
    isLoading,
    error,
    
    // Computed
    isAuthenticated,
    user,
    userRole,
    userName,
    userId,
    
    // Métodos
    login,
    logout,
    checkAuth,
    checkPermission,
    getUserPermissions,
    clearError
  }
}
