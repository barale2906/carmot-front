import api from './api'

export const kpiService = {
  // Obtener lista de KPIs
  async getKPIs(params = {}) {
    try {
      const response = await api.get('/dashboard/kpis', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener un KPI específico
  async getKPI(kpiId) {
    try {
      const response = await api.get(`/dashboard/kpis/${kpiId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Crear nuevo KPI
  async createKPI(kpiData) {
    try {
      const response = await api.post('/dashboard/kpis', kpiData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Actualizar KPI existente
  async updateKPI(kpiId, kpiData) {
    try {
      const response = await api.put(`/dashboard/kpis/${kpiId}`, kpiData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Eliminar KPI
  async deleteKPI(kpiId) {
    try {
      const response = await api.delete(`/dashboard/kpis/${kpiId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener campos de un KPI
  async getKPIFields(kpiId) {
    try {
      const response = await api.get(`/dashboard/kpis/${kpiId}/fields`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Crear campo para un KPI
  async createKPIField(kpiId, fieldData) {
    try {
      const response = await api.post(`/dashboard/kpis/${kpiId}/fields`, fieldData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Actualizar campo de KPI
  async updateKPIField(kpiId, fieldId, fieldData) {
    try {
      const response = await api.put(`/dashboard/kpis/${kpiId}/fields/${fieldId}`, fieldData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Eliminar campo de KPI
  async deleteKPIField(kpiId, fieldId) {
    try {
      const response = await api.delete(`/dashboard/kpis/${kpiId}/fields/${fieldId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener relaciones entre campos de un KPI
  async getKPIFieldRelations(kpiId) {
    try {
      const response = await api.get(`/dashboard/kpis/${kpiId}/field-relations`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Crear relación entre campos
  async createKPIFieldRelation(kpiId, relationData) {
    try {
      const response = await api.post(`/dashboard/kpis/${kpiId}/field-relations`, relationData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Actualizar relación entre campos
  async updateKPIFieldRelation(kpiId, relationId, relationData) {
    try {
      const response = await api.put(`/dashboard/kpis/${kpiId}/field-relations/${relationId}`, relationData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Eliminar relación entre campos
  async deleteKPIFieldRelation(kpiId, relationId) {
    try {
      const response = await api.delete(`/dashboard/kpis/${kpiId}/field-relations/${relationId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener datos de gráfico para un KPI
  async getKPIChartData(kpiId, params = {}) {
    try {
      const response = await api.get(`/dashboard/kpis/${kpiId}/chart-data`, { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener estadísticas de un KPI
  async getKPIStatistics(kpiId, params = {}) {
    try {
      const response = await api.get(`/dashboard/kpis/${kpiId}/chart-statistics`, { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Verificar si un código de KPI ya existe
  async checkCodeExists(code) {
    try {
      const response = await api.get('/dashboard/kpis/check-code', { 
        params: { code } 
      })
      return response.data.exists
    } catch (error) {
      // Si el endpoint no existe, usar método alternativo
      try {
        const response = await api.get('/dashboard/kpis', { 
          params: { code } 
        })
        return response.data.data && response.data.data.length > 0
      } catch (fallbackError) {
        console.warn('No se pudo verificar la existencia del código:', fallbackError)
        return false
      }
    }
  }
}

export default kpiService
