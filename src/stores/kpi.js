import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import kpiService from '@/services/kpi'
import kpiMetadataService from '@/services/kpiMetadata'

export const useKPIStore = defineStore('kpi', () => {
  // Estado
  const kpis = ref([])
  const currentKPI = ref(null)
  const kpiFields = ref([])
  const kpiRelations = ref([])
  const models = ref([])
  const chartTypes = ref([])
  const filterTypes = ref([])
  const fieldOperations = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters computados
  const activeKPIs = computed(() => kpis.value.filter(kpi => kpi.is_active))
  const kpiCount = computed(() => kpis.value.length)
  const hasKPIs = computed(() => kpis.value.length > 0)

  // Acciones para KPIs
  const fetchKPIs = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await kpiService.getKPIs(params)
      kpis.value = response.data || []
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error cargando KPIs'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchKPI = async (kpiId) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await kpiService.getKPI(kpiId)
      currentKPI.value = response.data
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error cargando KPI'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createKPI = async (kpiData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await kpiService.createKPI(kpiData)
      kpis.value.push(response.data)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creando KPI'
      throw err // Re-lanzar el error para que el composable lo maneje
    } finally {
      loading.value = false
    }
  }

  const updateKPI = async (kpiId, kpiData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await kpiService.updateKPI(kpiId, kpiData)
      const index = kpis.value.findIndex(kpi => kpi.id === kpiId)
      if (index !== -1) {
        kpis.value[index] = response.data
      }
      if (currentKPI.value?.id === kpiId) {
        currentKPI.value = response.data
      }
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error actualizando KPI'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteKPI = async (kpiId) => {
    loading.value = true
    error.value = null
    
    try {
      await kpiService.deleteKPI(kpiId)
      kpis.value = kpis.value.filter(kpi => kpi.id !== kpiId)
      if (currentKPI.value?.id === kpiId) {
        currentKPI.value = null
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error eliminando KPI'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Acciones para campos de KPI
  const fetchKPIFields = async (kpiId) => {
    try {
      const response = await kpiService.getKPIFields(kpiId)
      kpiFields.value = response.data || []
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error cargando campos del KPI'
      throw err
    }
  }

  const createKPIField = async (kpiId, fieldData) => {
    try {
      const response = await kpiService.createKPIField(kpiId, fieldData)
      kpiFields.value.push(response.data)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creando campo del KPI'
      throw err
    }
  }

  const updateKPIField = async (kpiId, fieldId, fieldData) => {
    try {
      const response = await kpiService.updateKPIField(kpiId, fieldId, fieldData)
      const index = kpiFields.value.findIndex(field => field.id === fieldId)
      if (index !== -1) {
        kpiFields.value[index] = response.data
      }
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error actualizando campo del KPI'
      throw err
    }
  }

  const deleteKPIField = async (kpiId, fieldId) => {
    try {
      await kpiService.deleteKPIField(kpiId, fieldId)
      kpiFields.value = kpiFields.value.filter(field => field.id !== fieldId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Error eliminando campo del KPI'
      throw err
    }
  }

  // Acciones para relaciones entre campos
  const fetchKPIRelations = async (kpiId) => {
    try {
      const response = await kpiService.getKPIFieldRelations(kpiId)
      kpiRelations.value = response.data || []
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error cargando relaciones del KPI'
      throw err
    }
  }

  const createKPIRelation = async (kpiId, relationData) => {
    try {
      const response = await kpiService.createKPIFieldRelation(kpiId, relationData)
      kpiRelations.value.push(response.data)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creando relación del KPI'
      throw err
    }
  }

  const updateKPIRelation = async (kpiId, relationId, relationData) => {
    try {
      const response = await kpiService.updateKPIFieldRelation(kpiId, relationId, relationData)
      const index = kpiRelations.value.findIndex(relation => relation.id === relationId)
      if (index !== -1) {
        kpiRelations.value[index] = response.data
      }
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error actualizando relación del KPI'
      throw err
    }
  }

  const deleteKPIRelation = async (kpiId, relationId) => {
    try {
      await kpiService.deleteKPIFieldRelation(kpiId, relationId)
      kpiRelations.value = kpiRelations.value.filter(relation => relation.id !== relationId)
    } catch (err) {
      error.value = err.response?.data?.message || 'Error eliminando relación del KPI'
      throw err
    }
  }

  // Acciones para metadatos
  const fetchModels = async () => {
    try {
      const response = await kpiMetadataService.getModels()
      models.value = response.data || []
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error cargando modelos'
      throw err
    }
  }

  const fetchChartTypes = async () => {
    try {
      const response = await kpiMetadataService.getChartTypes()
      chartTypes.value = response.data || []
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error cargando tipos de gráfico'
      throw err
    }
  }

  const fetchFilterTypes = async () => {
    try {
      const response = await kpiMetadataService.getFilterTypes()
      filterTypes.value = response.data || []
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error cargando tipos de filtro'
      throw err
    }
  }

  const fetchFieldOperations = async () => {
    try {
      const response = await kpiMetadataService.getFieldOperations()
      fieldOperations.value = response.data || []
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error cargando operaciones de campo'
      throw err
    }
  }

  // Limpiar estado
  const clearError = () => {
    error.value = null
  }

  const resetCurrentKPI = () => {
    currentKPI.value = null
    kpiFields.value = []
    kpiRelations.value = []
  }

  return {
    // Estado
    kpis,
    currentKPI,
    kpiFields,
    kpiRelations,
    models,
    chartTypes,
    filterTypes,
    fieldOperations,
    loading,
    error,
    
    // Getters
    activeKPIs,
    kpiCount,
    hasKPIs,
    
    // Acciones KPIs
    fetchKPIs,
    fetchKPI,
    createKPI,
    updateKPI,
    deleteKPI,
    
    // Acciones campos
    fetchKPIFields,
    createKPIField,
    updateKPIField,
    deleteKPIField,
    
    // Acciones relaciones
    fetchKPIRelations,
    createKPIRelation,
    updateKPIRelation,
    deleteKPIRelation,
    
    // Acciones metadatos
    fetchModels,
    fetchChartTypes,
    fetchFilterTypes,
    fetchFieldOperations,
    
    // Utilidades
    clearError,
    resetCurrentKPI
  }
})
