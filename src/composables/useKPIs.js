import { ref, computed } from 'vue'
import { useKPIStore } from '@/stores/kpi'
import { handleApiError } from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'

export function useKPIs() {
  const kpiStore = useKPIStore()
  const { showKPIError, showFieldError, showRelationError, showMetadataError, success } = useNotifications()
  const isLoading = ref(false)
  const error = ref(null)

  // Estados computados
  const kpis = computed(() => kpiStore.kpis)
  const currentKPI = computed(() => kpiStore.currentKPI)
  const kpiFields = computed(() => kpiStore.kpiFields)
  const kpiRelations = computed(() => kpiStore.kpiRelations)
  const models = computed(() => kpiStore.models)
  const chartTypes = computed(() => kpiStore.chartTypes)
  const filterTypes = computed(() => kpiStore.filterTypes)
  const fieldOperations = computed(() => kpiStore.fieldOperations)
  const activeKPIs = computed(() => kpiStore.activeKPIs)
  const kpiCount = computed(() => kpiStore.kpiCount)
  const hasKPIs = computed(() => kpiStore.hasKPIs)

  // Funciones para KPIs
  const loadKPIs = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      await kpiStore.fetchKPIs(params)
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const loadKPI = async (kpiId) => {
    isLoading.value = true
    error.value = null

    try {
      await kpiStore.fetchKPI(kpiId)
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const saveKPI = async (kpiData) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await kpiStore.createKPI(kpiData)
      success('KPI Creado', 'El indicador se ha creado exitosamente')
      return { success: true, data: result.data }
    } catch (err) {
      console.log('Error completo del backend:', err.response?.data)
      console.log('Llamando showKPIError con:', err)
      const errorMessage = handleApiError(err)
      const notificationId = showKPIError(err)
      console.log('Notificación creada con ID:', notificationId)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const updateKPI = async (kpiId, kpiData) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await kpiStore.updateKPI(kpiId, kpiData)
      return { success: true, data: result.data }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const removeKPI = async (kpiId) => {
    isLoading.value = true
    error.value = null

    try {
      await kpiStore.deleteKPI(kpiId)
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Funciones para campos de KPI
  const loadKPIFields = async (kpiId) => {
    try {
      await kpiStore.fetchKPIFields(kpiId)
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const addKPIField = async (kpiId, fieldData) => {
    try {
      // Si no hay KPI ID, agregamos temporalmente al estado local
      if (!kpiId) {
        const tempField = {
          id: Date.now(), // ID temporal
          ...fieldData,
          created_at: new Date().toISOString()
        }
        kpiFields.value.push(tempField)
        return { success: true, data: tempField }
      }
      
      const result = await kpiStore.createKPIField(kpiId, fieldData)
      return { success: true, data: result.data }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const editKPIField = async (kpiId, fieldId, fieldData) => {
    try {
      const result = await kpiStore.updateKPIField(kpiId, fieldId, fieldData)
      return { success: true, data: result.data }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const removeKPIField = async (kpiId, fieldId) => {
    try {
      await kpiStore.deleteKPIField(kpiId, fieldId)
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  // Funciones para relaciones entre campos
  const loadKPIRelations = async (kpiId) => {
    try {
      await kpiStore.fetchKPIRelations(kpiId)
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const addKPIRelation = async (kpiId, relationData) => {
    try {
      // Si no hay KPI ID, agregamos temporalmente al estado local
      if (!kpiId) {
        const tempRelation = {
          id: Date.now(), // ID temporal
          ...relationData,
          created_at: new Date().toISOString()
        }
        kpiRelations.value.push(tempRelation)
        return { success: true, data: tempRelation }
      }
      
      const result = await kpiStore.createKPIRelation(kpiId, relationData)
      return { success: true, data: result.data }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const editKPIRelation = async (kpiId, relationId, relationData) => {
    try {
      const result = await kpiStore.updateKPIRelation(kpiId, relationId, relationData)
      return { success: true, data: result.data }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const removeKPIRelation = async (kpiId, relationId) => {
    try {
      await kpiStore.deleteKPIRelation(kpiId, relationId)
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  // Funciones para metadatos
  const loadModels = async () => {
    try {
      await kpiStore.fetchModels()
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      showMetadataError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const loadChartTypes = async () => {
    try {
      await kpiStore.fetchChartTypes()
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const loadFilterTypes = async () => {
    try {
      await kpiStore.fetchFilterTypes()
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const loadFieldOperations = async () => {
    try {
      await kpiStore.fetchFieldOperations()
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  // Funciones de utilidad
  const clearError = () => {
    error.value = null
    kpiStore.clearError()
  }

  const resetCurrentKPI = () => {
    kpiStore.resetCurrentKPI()
  }

  return {
    // Estados
    isLoading,
    error,
    
    // Computed
    kpis,
    currentKPI,
    kpiFields,
    kpiRelations,
    models,
    chartTypes,
    filterTypes,
    fieldOperations,
    activeKPIs,
    kpiCount,
    hasKPIs,
    
    // Métodos KPIs
    loadKPIs,
    loadKPI,
    saveKPI,
    updateKPI,
    removeKPI,
    
    // Métodos campos
    loadKPIFields,
    addKPIField,
    editKPIField,
    removeKPIField,
    
    // Métodos relaciones
    loadKPIRelations,
    addKPIRelation,
    editKPIRelation,
    removeKPIRelation,
    
    // Métodos metadatos
    loadModels,
    loadChartTypes,
    loadFilterTypes,
    loadFieldOperations,
    
    // Utilidades
    clearError,
    resetCurrentKPI
  }
}
