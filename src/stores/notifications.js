import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  // Estado
  const notifications = ref([])
  const maxNotifications = 5

  // Tipos de notificación
  const types = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }

  // Acciones
  const addNotification = (notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: notification.type || types.INFO,
      title: notification.title || '',
      message: notification.message || '',
      duration: notification.duration || 5000,
      persistent: notification.persistent || false,
      actions: notification.actions || [],
      timestamp: new Date()
    }

    notifications.value.unshift(newNotification)

    // Limitar número de notificaciones
    if (notifications.value.length > maxNotifications) {
      notifications.value = notifications.value.slice(0, maxNotifications)
    }

    // Auto-remover si no es persistente
    if (!newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value = []
  }

  // Métodos de conveniencia
  const success = (title, message, options = {}) => {
    return addNotification({
      type: types.SUCCESS,
      title,
      message,
      ...options
    })
  }

  const error = (title, message, options = {}) => {
    return addNotification({
      type: types.ERROR,
      title,
      message,
      persistent: true, // Los errores son persistentes por defecto
      ...options
    })
  }

  const warning = (title, message, options = {}) => {
    return addNotification({
      type: types.WARNING,
      title,
      message,
      ...options
    })
  }

  const info = (title, message, options = {}) => {
    return addNotification({
      type: types.INFO,
      title,
      message,
      ...options
    })
  }

  // Método para manejar errores de API
  const handleApiError = (error, defaultTitle = 'Error') => {
    let title = defaultTitle
    let message = 'Ha ocurrido un error inesperado'

    if (error.response) {
      // Error de respuesta del servidor
      const status = error.response.status
      const data = error.response.data

      // Siempre usar el mensaje del backend si está disponible
      if (data && data.message) {
        message = data.message
      }

      switch (status) {
        case 400:
          title = 'Error de Validación'
          if (!data.message) message = 'Los datos enviados no son válidos'
          break
        case 401:
          title = 'No Autorizado'
          message = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
          break
        case 403:
          title = 'Acceso Denegado'
          message = 'No tienes permisos para realizar esta acción'
          break
        case 404:
          title = 'No Encontrado'
          message = 'El recurso solicitado no existe'
          break
        case 422:
          title = 'Error de Validación'
          if (!data.message) message = 'Los datos enviados no son válidos'
          break
        case 500:
          title = 'Error del Servidor'
          if (!data.message) message = 'Ha ocurrido un error interno del servidor'
          break
        default:
          title = `Error ${status}`
          if (!data.message) message = 'Ha ocurrido un error'
      }

      // Mostrar errores de validación específicos si no hay mensaje principal
      if (data.errors && typeof data.errors === 'object' && !data.message) {
        const errorMessages = Object.values(data.errors).flat()
        if (errorMessages.length > 0) {
          message = errorMessages.join(', ')
        }
      }
    } else if (error.request) {
      // Error de red
      title = 'Error de Conexión'
      message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
    } else {
      // Otros errores
      title = 'Error'
      message = error.message || 'Ha ocurrido un error inesperado'
    }

    return error(title, message, {
      persistent: true,
      actions: [
        {
          label: 'Reintentar',
          action: () => {
            // Esta acción se puede personalizar según el contexto
            console.log('Reintentar acción')
          }
        }
      ]
    })
  }

  return {
    // Estado
    notifications,
    types,

    // Acciones
    addNotification,
    removeNotification,
    clearAll,

    // Métodos de conveniencia
    success,
    error,
    warning,
    info,

    // Manejo de errores
    handleApiError
  }
})
