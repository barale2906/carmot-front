import { ref, computed } from 'vue'
import { dashboardService, dashboardCardService, dashboardMetadataService } from '@/services/dashboard'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

/**
 * Composable para gestión de Dashboards
 */
export function useDashboard() {
  // Obtener información del usuario y notificaciones
  const { userId } = useAuth()
  const { success, error: showError, handleApiError } = useNotifications()
  
  // Estado reactivo
  const dashboards = ref([])
  const currentDashboard = ref(null)
  const dashboardCards = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const hasDashboards = computed(() => dashboards.value.length > 0)
  const currentDashboardCards = computed(() => 
    dashboardCards.value.filter(card => card.dashboard_id === currentDashboard.value?.id)
  )

  /**
   * Cargar lista de dashboards
   */
  const loadDashboards = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await dashboardService.getDashboards()
      dashboards.value = response.data || []
    } catch (err) {
      error.value = err.message || 'Error cargando dashboards'
      handleApiError(err, 'Error Cargando Dashboards')
      console.error('Error loading dashboards:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Cargar un dashboard específico
   */
  const loadDashboard = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await dashboardService.getDashboard(id)
      currentDashboard.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Error cargando dashboard'
      console.error('Error loading dashboard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Cargar tarjetas de un dashboard
   */
  const loadDashboardCards = async (dashboardId) => {
    try {
      const response = await dashboardCardService.getDashboardCards(dashboardId)
      dashboardCards.value = response.data || []
    } catch (err) {
      error.value = err.message || 'Error cargando tarjetas del dashboard'
      console.error('Error loading dashboard cards:', err)
    }
  }

  /**
   * Crear un nuevo dashboard
   */
  const createDashboard = async (data) => {
    loading.value = true
    error.value = null
    
    try {
      // Verificar que tenemos el ID del usuario
      if (!userId.value) {
        throw new Error('Usuario no autenticado')
      }
      
      // Incluir el ID del usuario automáticamente
      const dashboardData = {
        ...data,
        user_id: userId.value
      }
      
      const response = await dashboardService.createDashboard(dashboardData)
      dashboards.value.push(response.data)
      
      success('Dashboard Creado', `El dashboard "${data.name}" se ha creado exitosamente`)
      return response.data
    } catch (err) {
      error.value = err.message || 'Error creando dashboard'
      handleApiError(err, 'Error Creando Dashboard')
      console.error('Error creating dashboard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar un dashboard
   */
  const updateDashboard = async (id, data) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await dashboardService.updateDashboard(id, data)
      
      // Actualizar en la lista
      const index = dashboards.value.findIndex(d => d.id === id)
      if (index !== -1) {
        dashboards.value[index] = response.data
      }
      
      // Actualizar dashboard actual si es el mismo
      if (currentDashboard.value?.id === id) {
        currentDashboard.value = response.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.message || 'Error actualizando dashboard'
      console.error('Error updating dashboard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Eliminar un dashboard
   */
  const deleteDashboard = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      await dashboardService.deleteDashboard(id)
      
      // Remover de la lista
      dashboards.value = dashboards.value.filter(d => d.id !== id)
      
      // Si era el dashboard actual, limpiar
      if (currentDashboard.value?.id === id) {
        currentDashboard.value = null
        dashboardCards.value = []
      }
      
      success('Dashboard Eliminado', 'El dashboard se ha eliminado exitosamente')
    } catch (err) {
      error.value = err.message || 'Error eliminando dashboard'
      handleApiError(err, 'Error Eliminando Dashboard')
      console.error('Error deleting dashboard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Establecer dashboard actual
   */
  const setCurrentDashboard = async (dashboard) => {
    currentDashboard.value = dashboard
    if (dashboard) {
      await loadDashboardCards(dashboard.id)
    }
  }

  return {
    // Estado
    dashboards,
    currentDashboard,
    dashboardCards,
    currentDashboardCards,
    loading,
    error,
    
    // Computed
    hasDashboards,
    
    // Métodos
    loadDashboards,
    loadDashboard,
    loadDashboardCards,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    setCurrentDashboard
  }
}

/**
 * Composable para gestión de Dashboard Cards
 */
export function useDashboardCards() {
  const { success, error: showError, handleApiError } = useNotifications()
  
  const cards = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Cargar tarjetas de un dashboard
   */
  const loadCards = async (dashboardId) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('=== CARGANDO DASHBOARD CARDS ===')
      console.log('Dashboard ID:', dashboardId)
      const response = await dashboardCardService.getDashboardCards(dashboardId)
      console.log('Respuesta del servicio:', response)
      cards.value = response.data || []
      console.log('Cards cargadas:', cards.value)
      console.log('Cantidad de cards:', cards.value.length)
      console.log('================================')
    } catch (err) {
      error.value = err.message || 'Error cargando tarjetas'
      console.error('Error loading cards:', err)
      console.error('Error response:', err.response?.data)
      console.error('Error status:', err.response?.status)
    } finally {
      loading.value = false
    }
  }

  /**
   * Crear una nueva tarjeta
   */
  const createCard = async (data) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await dashboardCardService.createDashboardCard(data)
      cards.value.push(response.data)
      
      success('Tarjeta Creada', `La tarjeta "${data.title}" se ha creado exitosamente`)
      return response.data
    } catch (err) {
      const errorMessage = err?.message || err?.response?.data?.message || 'Error creando tarjeta'
      error.value = errorMessage
      console.error('Error creating card:', err)
      console.error('Error details:', err?.response?.data)
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar una tarjeta
   */
  const updateCard = async (id, data) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await dashboardCardService.updateDashboardCard(id, data)
      
      // Actualizar en la lista
      const index = cards.value.findIndex(c => c.id === id)
      if (index !== -1) {
        cards.value[index] = response.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.message || 'Error actualizando tarjeta'
      console.error('Error updating card:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Eliminar una tarjeta
   */
  const deleteCard = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      await dashboardCardService.deleteDashboardCard(id)
      cards.value = cards.value.filter(c => c.id !== id)
      
      success('Tarjeta Eliminada', 'La tarjeta se ha eliminado exitosamente')
    } catch (err) {
      error.value = err.message || 'Error eliminando tarjeta'
      handleApiError(err, 'Error Eliminando Tarjeta')
      console.error('Error deleting card:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener datos de gráfico para una tarjeta
   */
  const getCardChartData = async (cardId) => {
    try {
      const response = await dashboardCardService.getCardChartData(cardId)
      return response.data
    } catch (err) {
      console.error('Error fetching card chart data:', err)
      throw err
    }
  }

  return {
    // Estado
    cards,
    loading,
    error,
    
    // Métodos
    loadCards,
    createCard,
    updateCard,
    deleteCard,
    getCardChartData
  }
}

/**
 * Composable para metadatos de dashboards
 */
export function useDashboardMetadata() {
  const chartTypes = ref([])
  const filterTypes = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Cargar metadatos
   */
  const loadMetadata = async () => {
    loading.value = true
    error.value = null
    
    try {
      const [chartTypesData, filterTypesData] = await Promise.all([
        dashboardMetadataService.getChartTypes(),
        dashboardMetadataService.getFilterTypes()
      ])
      
      chartTypes.value = chartTypesData
      filterTypes.value = filterTypesData
    } catch (err) {
      error.value = err.message || 'Error cargando metadatos'
      console.error('Error loading metadata:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener parámetros de un tipo de gráfico
   */
  const getChartParameters = async (chartType) => {
    try {
      return await dashboardMetadataService.getChartParameters(chartType)
    } catch (err) {
      console.error('Error fetching chart parameters:', err)
      return dashboardMetadataService.getDefaultChartParameters(chartType)
    }
  }

  return {
    // Estado
    chartTypes,
    filterTypes,
    loading,
    error,
    
    // Métodos
    loadMetadata,
    getChartParameters
  }
}
