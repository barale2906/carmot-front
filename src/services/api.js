import axios from 'axios'

// Configuración base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Agregar token si existe
    const token = sessionStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log para desarrollo
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    // Log para desarrollo (sin datos sensibles)
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`)
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Log del error (sin datos sensibles)
    console.error('❌ API Error:', error.response?.status, error.message)
    
    // Manejo de errores de autenticación
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Intentar refrescar el token
        const refreshResponse = await api.post('/auth/refresh')
        
        if (refreshResponse.data.success) {
          const newToken = refreshResponse.data.data.token
          sessionStorage.setItem('auth_token', newToken)
          
          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.warn('Token refresh failed:', refreshError)
        // Redirigir al login
        sessionStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    }
    
    // Manejo de errores 403 (Forbidden)
    if (error.response?.status === 403) {
      console.warn('🔒 Access denied for this endpoint')
      // Aquí podrías mostrar un modal o notificación
    }
    
    // Manejo de errores 422 (Validation Error)
    if (error.response?.status === 422) {
      console.warn('📝 Validation errors detected')
    }
    
    // Manejo de errores 500 (Server Error)
    if (error.response?.status >= 500) {
      console.error('🔥 Server error occurred')
    }
    
    return Promise.reject(error)
  }
)

// Funciones helper para manejo de errores
export const handleApiError = (error) => {
  if (error.response) {
    // Error con respuesta del servidor
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return data.message || 'Solicitud incorrecta'
      case 401:
        return 'No autorizado. Por favor, inicia sesión nuevamente.'
      case 403:
        return 'No tienes permisos para realizar esta acción'
      case 404:
        return 'Recurso no encontrado'
      case 422:
        return data.message || 'Datos de validación incorrectos'
      case 500:
        return 'Error interno del servidor'
      default:
        return data.message || 'Error desconocido'
    }
  } else if (error.request) {
    // Error de red
    return 'Error de conexión. Verifica tu conexión a internet.'
  } else {
    // Otros errores
    return error.message || 'Error desconocido'
  }
}

// Funciones helper para validación de permisos
export const checkPermission = async (endpoint, method = 'GET') => {
  try {
    // Hacer una petición OPTIONS para verificar permisos
    const response = await api.options(endpoint)
    return response.status === 200
  } catch (error) {
    console.warn(`Permission check failed for ${method} ${endpoint}:`, error)
    return false
  }
}

export default api
