import api from './api'

export const kpiMetadataService = {
  // Obtener todos los modelos disponibles
  async getModels() {
    try {
      const response = await api.get('/dashboard/kpi-metadata/models')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener campos de un modelo específico
  async getModelFields(modelId) {
    try {
      const response = await api.get(`/dashboard/kpi-metadata/models/${modelId}/fields`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener tipos de gráfico disponibles
  async getChartTypes() {
    try {
      const response = await api.get('/dashboard/chart-types')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener parámetros de un tipo de gráfico específico
  async getChartTypeParameters(chartType) {
    try {
      const response = await api.get(`/dashboard/chart-types/${chartType}/parameters`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener campos disponibles para agrupar de un modelo
  async getGroupByFields(modelId) {
    try {
      const response = await api.get(`/dashboard/models/${modelId}/group-by-fields`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener tipos de filtro disponibles
  async getFilterTypes() {
    try {
      const response = await api.get('/dashboard/filter-types')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener operaciones disponibles para campos
  async getFieldOperations() {
    try {
      const response = await api.get('/dashboard/field-relations/operations')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default kpiMetadataService
