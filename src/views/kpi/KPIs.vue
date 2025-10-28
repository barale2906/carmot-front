<template>
  <div class="kpis-container">
    <header class="page-header">
      <div class="header-content">
        <h1>Gestión de KPIs</h1>
        <p>Configura y administra tus indicadores clave de rendimiento</p>
      </div>
      <div class="header-actions">
        <router-link to="/kpis/create" class="btn btn-primary">
          <span class="btn-icon">➕</span>
          Crear Nuevo KPI
        </router-link>
      </div>
    </header>

    <main class="page-content">
      <!-- Filtros y búsqueda -->
      <div class="filters-section">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar KPIs..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        
        <div class="filter-options">
          <select v-model="statusFilter" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
          
          <select v-model="modelFilter" class="filter-select">
            <option value="">Todos los modelos</option>
            <option v-for="model in models" :key="model.id" :value="model.id">
              {{ model.display_name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Lista de KPIs -->
      <div class="kpis-section">
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando KPIs...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <div class="error-icon">⚠️</div>
          <p>{{ error }}</p>
          <button @click="loadKPIs" class="btn btn-secondary">Reintentar</button>
        </div>

        <div v-else-if="filteredKPIs.length === 0" class="empty-state">
          <div class="empty-icon">📊</div>
          <h3>No hay KPIs</h3>
          <p>Comienza creando tu primer indicador de rendimiento</p>
          <router-link to="/kpis/create" class="btn btn-primary">
            Crear Primer KPI
          </router-link>
        </div>

        <div v-else class="kpis-grid">
          <div
            v-for="kpi in filteredKPIs"
            :key="kpi.id"
            class="kpi-card"
            :class="{ 'inactive': !kpi.is_active }"
          >
            <div class="card-header">
              <div class="kpi-info">
                <h3>{{ kpi.name }}</h3>
                <p class="kpi-code">{{ kpi.code }}</p>
              </div>
              <div class="kpi-status">
                <span :class="['status-badge', kpi.is_active ? 'active' : 'inactive']">
                  {{ kpi.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>

            <div class="card-content">
              <p class="kpi-description">{{ kpi.description }}</p>
              
              <div class="kpi-details">
                <div class="detail-item">
                  <span class="detail-label">Unidad:</span>
                  <span class="detail-value">{{ kpi.unit }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Período:</span>
                  <span class="detail-value">{{ getPeriodLabel(kpi.default_period_type) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Modelo:</span>
                  <span class="detail-value">{{ getModelName(kpi.base_model) }}</span>
                </div>
              </div>
            </div>

            <div class="card-actions">
              <router-link :to="`/kpis/${kpi.id}/edit`" class="btn btn-outline">
                Editar
              </router-link>
              <button @click="toggleKPIStatus(kpi)" class="btn btn-outline">
                {{ kpi.is_active ? 'Desactivar' : 'Activar' }}
              </button>
              <button @click="deleteKPI(kpi.id)" class="btn btn-danger">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useKPIs } from '@/composables/useKPIs'

const router = useRouter()
const {
  kpis,
  models,
  isLoading,
  error,
  loadKPIs,
  loadModels,
  updateKPI,
  removeKPI,
  clearError
} = useKPIs()

// Estado local
const searchQuery = ref('')
const statusFilter = ref('')
const modelFilter = ref('')

// Computed
const filteredKPIs = computed(() => {
  let filtered = kpis.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(kpi => 
      kpi.name.toLowerCase().includes(query) ||
      kpi.code.toLowerCase().includes(query) ||
      kpi.description.toLowerCase().includes(query)
    )
  }

  // Filtro por estado
  if (statusFilter.value) {
    filtered = filtered.filter(kpi => {
      if (statusFilter.value === 'active') return kpi.is_active
      if (statusFilter.value === 'inactive') return !kpi.is_active
      return true
    })
  }

  // Filtro por modelo
  if (modelFilter.value) {
    filtered = filtered.filter(kpi => kpi.base_model === parseInt(modelFilter.value))
  }

  return filtered
})

// Métodos
const getPeriodLabel = (periodType) => {
  const labels = {
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual',
    yearly: 'Anual',
    custom: 'Personalizado'
  }
  return labels[periodType] || periodType
}

const getModelName = (modelId) => {
  const model = models.value.find(m => m.id === modelId)
  return model ? model.display_name : 'Modelo no encontrado'
}

const toggleKPIStatus = async (kpi) => {
  try {
    await updateKPI(kpi.id, { is_active: !kpi.is_active })
  } catch (err) {
    console.error('Error cambiando estado del KPI:', err)
  }
}

const deleteKPI = async (kpiId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este KPI?')) {
    try {
      await removeKPI(kpiId)
    } catch (err) {
      console.error('Error eliminando KPI:', err)
    }
  }
}

// Watchers
watch(searchQuery, () => {
  // Debounce search si es necesario
})

// Lifecycle
onMounted(async () => {
  clearError()
  await Promise.all([
    loadKPIs(),
    loadModels()
  ])
})
</script>

<style scoped>
.kpis-container {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0 0 0.5rem 0;
  color: #1a202c;
  font-size: 2rem;
  font-weight: 600;
}

.header-content p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-outline {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-outline:hover {
  border-color: #667eea;
  color: #667eea;
}

.btn-danger {
  background: #e53e3e;
  color: white;
}

.btn-danger:hover {
  background: #c53030;
}

.btn-secondary {
  background: #718096;
  color: white;
}

.btn-secondary:hover {
  background: #4a5568;
}

.btn-icon {
  font-size: 1.2rem;
}

.page-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.filters-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.kpis-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-icon,
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #4a5568;
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: #718096;
}

.kpis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.kpi-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.kpi-card.inactive {
  opacity: 0.7;
  background: #f7fafc;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.kpi-info h3 {
  margin: 0 0 0.25rem 0;
  color: #1a202c;
  font-size: 1.25rem;
  font-weight: 600;
}

.kpi-code {
  margin: 0;
  color: #718096;
  font-size: 0.875rem;
  font-family: monospace;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.inactive {
  background: #fed7d7;
  color: #742a2a;
}

.card-content {
  margin-bottom: 1.5rem;
}

.kpi-description {
  margin: 0 0 1rem 0;
  color: #4a5568;
  line-height: 1.5;
}

.kpi-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
}

.detail-value {
  color: #2d3748;
  font-size: 0.875rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-actions .btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .page-content {
    padding: 1rem;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: auto;
  }

  .filter-options {
    flex-direction: column;
  }

  .kpis-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    justify-content: stretch;
  }

  .card-actions .btn {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 1rem;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .kpis-section {
    padding: 1rem;
  }

  .kpi-card {
    padding: 1rem;
  }
}
</style>
