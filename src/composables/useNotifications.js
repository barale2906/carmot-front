import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

export function useNotifications() {
  const notificationStore = useNotificationStore()

  // Estados computados
  const notifications = computed(() => notificationStore.notifications)
  const hasNotifications = computed(() => notificationStore.notifications.length > 0)

  // Métodos de conveniencia
  const success = (title, message, options = {}) => {
    return notificationStore.success(title, message, options)
  }

  const error = (title, message, options = {}) => {
    return notificationStore.error(title, message, options)
  }

  const warning = (title, message, options = {}) => {
    return notificationStore.warning(title, message, options)
  }

  const info = (title, message, options = {}) => {
    return notificationStore.info(title, message, options)
  }

  // Manejo de errores de API
  const handleApiError = (error, defaultTitle = 'Error') => {
    return notificationStore.handleApiError(error, defaultTitle)
  }

  // Métodos de gestión
  const removeNotification = (id) => {
    notificationStore.removeNotification(id)
  }

  const clearAll = () => {
    notificationStore.clearAll()
  }

  // Método para mostrar errores de creación de KPI
  const showKPIError = (apiError) => {
    let title = 'Error Creando KPI'
    let message = 'Ha ocurrido un error al crear el KPI'

    if (apiError.response?.data) {
      const data = apiError.response.data
      
      // Usar el mensaje específico del backend
      if (data.message) {
        message = data.message
      }
      
      // Si hay errores específicos, mostrarlos
      if (data.errors && typeof data.errors === 'object') {
        const errorMessages = Object.values(data.errors).flat()
        if (errorMessages.length > 0) {
          message = errorMessages.join(', ')
        }
      }
    }

    return error(title, message, {
      persistent: true,
      actions: [
        {
          label: 'Reintentar',
          action: () => {
            console.log('Reintentar creación de KPI')
          }
        }
      ]
    })
  }

  // Método para mostrar errores de campos
  const showFieldError = (apiError) => {
    return handleApiError(apiError, 'Error con Campo')
  }

  // Método para mostrar errores de relaciones
  const showRelationError = (apiError) => {
    return handleApiError(apiError, 'Error con Relación')
  }

  // Método para mostrar errores de metadatos
  const showMetadataError = (apiError) => {
    return handleApiError(apiError, 'Error Cargando Metadatos')
  }

  return {
    // Estado
    notifications,
    hasNotifications,

    // Métodos de notificación
    success,
    error,
    warning,
    info,

    // Manejo de errores
    handleApiError,
    showKPIError,
    showFieldError,
    showRelationError,
    showMetadataError,

    // Gestión
    removeNotification,
    clearAll
  }
}
