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

  // Métodos específicos de dominio removidos (KPI)

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
    showFieldError,
    showRelationError,
    showMetadataError,

    // Gestión
    removeNotification,
    clearAll
  }
}
