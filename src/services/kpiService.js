import api from './api'

// Base paths
const BASE = '/dashboard'
const KPIS = `${BASE}/kpis`
const DASHBOARDS = `${BASE}/dashboards`
const DASHBOARD_CARDS = `${BASE}/dashboard-cards`

// Helpers
const unwrap = (response) => response?.data

// Config / metadata
export const getConfig = () => api.get(`${BASE}/config`).then(unwrap)

// Nuevos endpoints granulares para modelos/campos/operaciones
export const getKpiModels = () => api.get(`${KPIS}/models`).then(unwrap)
export const getKpiModelFields = (modelId) => api.get(`${KPIS}/models/${modelId}/fields`).then(unwrap)
export const getKpiOperations = (fieldType) => api.get(`${KPIS}/operations/${fieldType}`).then(unwrap)

// KPIs
export const getKpis = (params = {}) => api.get(KPIS, { params }).then(unwrap)
export const getKpi = (id) => api.get(`${KPIS}/${id}`).then(unwrap)
export const createKpi = (payload) => api.post(KPIS, payload).then(unwrap)
export const updateKpi = (id, payload) => api.put(`${KPIS}/${id}`, payload).then(unwrap)
export const deleteKpi = (id) => api.delete(`${KPIS}/${id}`).then(unwrap)
export const computeKpi = (id, params) => api.get(`${KPIS}/${id}/compute`, { params }).then(unwrap)

// Dashboards
export const getDashboards = (params = {}) => api.get(DASHBOARDS, { params }).then(unwrap)
export const getDashboard = (id) => api.get(`${DASHBOARDS}/${id}`).then(unwrap)
export const createDashboard = (payload) => api.post(DASHBOARDS, payload).then(unwrap)
export const updateDashboard = (id, payload) => api.put(`${DASHBOARDS}/${id}`, payload).then(unwrap)
export const deleteDashboard = (id) => api.delete(`${DASHBOARDS}/${id}`).then(unwrap)
export const exportDashboardPdf = (id) => api.post(`${DASHBOARDS}/${id}/export-pdf`, {}, { responseType: 'blob' })

// Dashboard Cards
export const getDashboardCards = (dashboardId, params = {}) =>
  api.get(`${DASHBOARDS}/${dashboardId}/cards`, { params }).then(unwrap)

export const getDashboardCard = (id) => api.get(`${DASHBOARD_CARDS}/${id}`).then(unwrap)
export const createDashboardCard = (payload) => api.post(DASHBOARD_CARDS, payload).then(unwrap)
export const updateDashboardCard = (id, payload) => api.put(`${DASHBOARD_CARDS}/${id}`, payload).then(unwrap)
export const deleteDashboardCard = (id) => api.delete(`${DASHBOARD_CARDS}/${id}`).then(unwrap)
export const computeDashboardCard = (id, params) => api.get(`${DASHBOARD_CARDS}/${id}/compute`, { params }).then(unwrap)

// Group by options
export const getGroupByOptions = (modelId, field, params = {}) =>
  api.get(`${KPIS}/models/${modelId}/group-by/${field}`, { params }).then(unwrap)

export default {
  // Config
  getConfig,
  // KPIs
  getKpis,
  getKpi,
  createKpi,
  updateKpi,
  deleteKpi,
  computeKpi,
  // Dashboards
  getDashboards,
  getDashboard,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  exportDashboardPdf,
  // Dashboard Cards
  getDashboardCards,
  getDashboardCard,
  createDashboardCard,
  updateDashboardCard,
  deleteDashboardCard,
  computeDashboardCard,
  // Group By
  getGroupByOptions
}


