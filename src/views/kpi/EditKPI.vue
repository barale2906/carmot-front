<template>
  <div class="edit-kpi-container">
    <!-- Header con navegación -->
    <header class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <router-link to="/kpis" class="breadcrumb-link">KPIs</router-link>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-current">Editar KPI</span>
        </div>
      <h1>Editar KPI</h1>
        <p v-if="currentKPI">{{ currentKPI.name }}</p>
        <p v-else>Cargando información del KPI...</p>
      </div>
    </header>

    <main class="page-content" v-if="!isLoading">
      <!-- Wizard Steps -->
      <div class="wizard-container">
        <div class="wizard-steps">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            :class="['step', { 
              'active': currentStep === index,
              'completed': currentStep > index,
              'disabled': currentStep < index
            }]"
          >
            <div class="step-number">
              <span v-if="currentStep > index">✓</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>

        <!-- Wizard Content -->
        <div class="wizard-content">
          <!-- Paso 1: Información Básica -->
          <div v-if="currentStep === 0" class="step-panel">
            <div class="panel-header">
              <h2>Información Básica</h2>
              <p>Modifica los datos principales del KPI</p>
            </div>

            <form @submit.prevent="nextStep" class="kpi-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="name">Nombre del KPI *</label>
                  <input
                    id="name"
                    v-model="kpiData.name"
                    type="text"
                    placeholder="Ej: Ventas Mensuales"
                    :class="{ 'error': errors.name }"
                    @blur="validateField('name')"
                  />
                  <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                  <div v-if="kpiData.name" class="code-preview">
                    <small class="code-label">Código actual:</small>
                    <code class="generated-code">{{ kpiData.code }}</code>
                  </div>
                </div>

                <div class="form-group full-width">
                  <label for="description">Descripción</label>
                  <textarea
                    id="description"
                    v-model="kpiData.description"
                    placeholder="Describe qué mide este KPI y cómo se calcula..."
                    rows="3"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label for="unit">Unidad de Medida *</label>
                  <input
                    id="unit"
                    v-model="kpiData.unit"
                    type="text"
                    placeholder="Ej: USD, %, unidades"
                    :class="{ 'error': errors.unit }"
                    @blur="validateField('unit')"
                  />
                  <span v-if="errors.unit" class="error-message">{{ errors.unit }}</span>
                </div>

                <div class="form-group">
                  <label for="calculation_type">Tipo de Cálculo *</label>
                  <select
                    id="calculation_type"
                    v-model="kpiData.calculation_type"
                    :class="{ 'error': errors.calculation_type }"
                    @change="validateField('calculation_type')"
                    :disabled="true"
                  >
                    <option value="predefined">Automático</option>
                    <option value="custom_fields">Personalizado</option>
                  </select>
                  <span v-if="errors.calculation_type" class="error-message">{{ errors.calculation_type }}</span>
                  <small class="help-text">
                    <strong>Nota:</strong> El tipo de cálculo no puede modificarse después de crear el KPI
                  </small>
                </div>

                <div class="form-group">
                  <label for="base_model">Modelo Base *</label>
                  <select
                    id="base_model"
                    v-model="kpiData.base_model"
                    :class="{ 'error': errors.base_model }"
                    @change="validateField('base_model')"
                    :disabled="true"
                  >
                    <option value="">Selecciona un modelo</option>
                    <option v-for="model in models" :key="model.id" :value="model.id">
                      {{ model.display_name }}
                    </option>
                  </select>
                  <span v-if="errors.base_model" class="error-message">{{ errors.base_model }}</span>
                  <small class="help-text">
                    <strong>Nota:</strong> El modelo base no puede modificarse después de crear el KPI
                  </small>
                </div>

                <div class="form-group">
                  <label for="default_period_type">Período por Defecto *</label>
                  <select
                    id="default_period_type"
                    v-model="kpiData.default_period_type"
                    :class="{ 'error': errors.default_period_type }"
                    @change="validateField('default_period_type')"
                  >
                    <option value="">Selecciona un período</option>
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="yearly">Anual</option>
                    <option value="custom">Personalizado</option>
                  </select>
                  <span v-if="errors.default_period_type" class="error-message">{{ errors.default_period_type }}</span>
                </div>

                <div class="form-group">
                  <label for="is_active">Estado del KPI</label>
                  <div class="checkbox-group">
                    <input
                      id="is_active"
                      v-model="kpiData.is_active"
                      type="checkbox"
                    />
                    <label for="is_active" class="checkbox-label">KPI Activo</label>
                  </div>
                  <small class="help-text">Los KPIs inactivos no aparecerán en los dashboards</small>
                </div>
              </div>

              <div class="form-actions">
                <router-link to="/kpis" class="btn btn-secondary">
                  Cancelar
                </router-link>
                <button type="submit" class="btn btn-primary" :disabled="!isStepValid(0)">
                  Siguiente: {{ kpiData.calculation_type === 'predefined' ? 'Revisar' : 'Configurar Campos' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Paso 2: Configuración de Campos (solo para custom_fields) -->
          <div v-if="currentStep === 1 && kpiData.calculation_type === 'custom_fields'" class="step-panel">
            <div class="panel-header">
              <h2>Configuración de Campos</h2>
              <p>Modifica los campos necesarios para el cálculo personalizado</p>
            </div>

            <div class="fields-section">
              <div class="section-header">
                <h3>Campos Configurados</h3>
                <button @click="showAddFieldModal = true" class="btn btn-primary btn-sm">
                  Agregar Campo
                </button>
              </div>

              <div v-if="kpiFields.length === 0" class="empty-fields">
                <div class="empty-icon">📊</div>
                <h4>No hay campos configurados</h4>
                <p>Agrega al menos un campo para poder calcular el KPI</p>
                <button @click="showAddFieldModal = true" class="btn btn-primary">
                  Agregar Primer Campo
                </button>
              </div>

              <div v-else class="fields-list">
                <div
                  v-for="field in kpiFields"
                  :key="field.id"
                  class="field-card"
                >
                  <div class="field-header">
                    <h4>{{ field.display_name }}</h4>
                    <span class="field-type">{{ field.field_type }}</span>
                  </div>
                  <div class="field-details">
                    <p><strong>Campo:</strong> {{ field.field_name }}</p>
                    <p><strong>Operación:</strong> {{ field.operation }}</p>
                    <p v-if="field.operation === 'where' && field.operator">
                      <strong>Filtro:</strong> {{ field.operator }} {{ field.value }}
                    </p>
                    <p><strong>Orden:</strong> {{ field.order }}</p>
                    <p><strong>Requerido:</strong> {{ field.is_required ? 'Sí' : 'No' }}</p>
                  </div>
                  <div class="field-actions">
                    <button @click="editField(field)" class="btn btn-outline btn-sm">
                      Editar
                    </button>
                    <button @click="removeField(field.id)" class="btn btn-danger btn-sm">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button @click="prevStep" class="btn btn-secondary">
                Anterior
              </button>
              <button @click="nextStep" class="btn btn-primary" :disabled="!isStepValid(1)">
                Siguiente: Configurar Relaciones
              </button>
            </div>
          </div>

          <!-- Paso 2/3: Relaciones Matemáticas (solo para custom_fields) -->
          <div v-if="(currentStep === 1 && kpiData.calculation_type === 'predefined') || (currentStep === 2 && kpiData.calculation_type === 'custom_fields')" class="step-panel">
            <div class="panel-header">
              <h2>Relaciones Matemáticas</h2>
              <p v-if="kpiData.calculation_type === 'predefined'">
                Los KPIs automáticos no requieren configuración de relaciones matemáticas.
              </p>
              <p v-else>
                Modifica cómo se relacionan los campos para calcular el KPI
              </p>
            </div>

            <!-- Mostrar solo para custom_fields -->
            <div v-if="kpiData.calculation_type === 'custom_fields'" class="relations-section">
              <div class="section-header">
                <h3>Relaciones Configuradas</h3>
                <button @click="showAddRelationModal = true" class="btn btn-primary btn-sm">
                  Agregar Relación
                </button>
              </div>

              <div v-if="kpiRelations.length === 0" class="empty-relations">
                <div class="empty-icon">🔗</div>
                <h4>No hay relaciones configuradas</h4>
                <p>Las relaciones son opcionales. Si solo tienes un campo, puedes continuar sin agregar relaciones.</p>
                <div class="empty-actions">
                  <button @click="showAddRelationModal = true" class="btn btn-primary">
                    Agregar Relación
                  </button>
                  <button @click="nextStep" class="btn btn-outline">
                    Continuar sin Relaciones
                  </button>
                </div>
              </div>

              <div v-else class="relations-list">
                <div
                  v-for="relation in kpiRelations"
                  :key="relation.id"
                  class="relation-card"
                >
                  <div class="relation-content">
                    <div class="relation-formula">
                      <span class="field">{{ getFieldName(relation.field_a_id) }}</span>
                      <span class="operator">{{ getOperationSymbol(relation.operation) }}</span>
                      <span class="field">{{ getFieldName(relation.field_b_id) }}</span>
                    </div>
                    <div class="relation-details">
                      <p><strong>Operación:</strong> {{ relation.operation }}</p>
                      <p><strong>Orden:</strong> {{ relation.order }}</p>
                      <p v-if="relation.description"><strong>Descripción:</strong> {{ relation.description }}</p>
                      <p><strong>Estado:</strong> {{ relation.is_active ? 'Activo' : 'Inactivo' }}</p>
                    </div>
                  </div>
                  <div class="relation-actions">
                    <button @click="editRelation(relation)" class="btn btn-outline btn-sm">
                      Editar
                    </button>
                    <button @click="removeRelation(relation.id)" class="btn btn-danger btn-sm">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mostrar información para predefined -->
            <div v-else class="predefined-info">
              <div class="info-card">
                <div class="info-icon">🔗</div>
                <h3>KPI Automático</h3>
                <p>Este KPI calculará automáticamente el conteo total de registros del modelo seleccionado, sin necesidad de configurar relaciones matemáticas.</p>
                <div class="info-details">
                  <p><strong>Modelo:</strong> {{ getModelName(kpiData.base_model) }}</p>
                  <p><strong>Cálculo:</strong> Conteo automático</p>
                  <p><strong>Período:</strong> {{ getPeriodLabel(kpiData.default_period_type) }}</p>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button @click="prevStep" class="btn btn-secondary">
                Anterior
              </button>
              <button @click="nextStep" class="btn btn-primary" :disabled="!isStepValid(currentStep)">
                Siguiente: Revisar Cambios
              </button>
            </div>
          </div>

          <!-- Paso Final: Revisar y Guardar -->
          <div v-if="currentStep === (kpiData.calculation_type === 'predefined' ? 2 : 3)" class="step-panel">
            <div class="panel-header">
              <h2>Revisar Cambios</h2>
              <p>Revisa los cambios antes de guardar el KPI</p>
            </div>

            <div class="review-section">
              <div class="review-card">
                <h3>Información Básica</h3>
                <div class="review-content">
                  <div class="review-item">
                    <span class="label">Nombre:</span>
                    <span class="value">{{ kpiData.name }}</span>
                  </div>
                  <div class="review-item">
                    <span class="label">Código:</span>
                    <span class="value">{{ kpiData.code }}</span>
                  </div>
                  <div class="review-item">
                    <span class="label">Descripción:</span>
                    <span class="value">{{ kpiData.description || 'Sin descripción' }}</span>
                  </div>
                  <div class="review-item">
                    <span class="label">Unidad:</span>
                    <span class="value">{{ kpiData.unit }}</span>
                  </div>
                  <div class="review-item">
                    <span class="label">Tipo de Cálculo:</span>
                    <span class="value">{{ kpiData.calculation_type === 'predefined' ? 'Automático' : 'Personalizado' }}</span>
                  </div>
                  <div class="review-item">
                    <span class="label">Modelo Base:</span>
                    <span class="value">{{ getModelName(kpiData.base_model) }}</span>
                  </div>
                  <div class="review-item">
                    <span class="label">Período:</span>
                    <span class="value">{{ getPeriodLabel(kpiData.default_period_type) }}</span>
                  </div>
                  <div class="review-item">
                    <span class="label">Estado:</span>
                    <span class="value">{{ kpiData.is_active ? 'Activo' : 'Inactivo' }}</span>
                  </div>
                </div>
              </div>

              <div v-if="kpiData.calculation_type === 'custom_fields'" class="review-card">
                <h3>Campos Configurados ({{ kpiFields.length }})</h3>
                <div class="review-content">
                  <div v-for="field in kpiFields" :key="field.id" class="review-item">
                    <span class="label">{{ field.display_name }}:</span>
                    <span class="value">{{ field.field_name }} ({{ field.operation }})</span>
                  </div>
                </div>
              </div>

              <div v-if="kpiData.calculation_type === 'custom_fields'" class="review-card">
                <h3>Relaciones Configuradas ({{ kpiRelations.length }})</h3>
                <div class="review-content">
                  <div v-for="relation in kpiRelations" :key="relation.id" class="review-item">
                    <span class="label">Relación {{ relation.order }}:</span>
                    <span class="value">
                      {{ getFieldName(relation.field_a_id) }} {{ getOperationSymbol(relation.operation) }} {{ getFieldName(relation.field_b_id) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Información del KPI -->
              <div class="review-card">
                <h3>Información del KPI</h3>
                <div class="kpi-summary">
                  <div class="summary-item">
                    <span class="label">Tipo:</span>
                    <span class="value">{{ kpiData.calculation_type === 'predefined' ? 'Automático' : 'Personalizado' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Modelo:</span>
                    <span class="value">{{ getModelName(kpiData.base_model) }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Período:</span>
                    <span class="value">{{ getPeriodLabel(kpiData.default_period_type) }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Estado:</span>
                    <span class="value" :class="kpiData.is_active ? 'active' : 'inactive'">
                      {{ kpiData.is_active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button @click="prevStep" class="btn btn-secondary">
                Anterior
              </button>
              <button @click="updateKPI" class="btn btn-success" :disabled="isUpdating">
                <span v-if="isUpdating" class="loading-spinner"></span>
                {{ isUpdating ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner-large"></div>
      <p>Cargando información del KPI...</p>
    </div>


    <!-- Modales para agregar campos y relaciones -->
    <FieldModal
      v-if="showAddFieldModal"
      :model-id="kpiData.base_model"
      @close="showAddFieldModal = false"
      @save="addField"
    />

    <RelationModal
      v-if="showAddRelationModal"
      :fields="kpiFields"
      :relations="kpiRelations"
      @close="showAddRelationModal = false"
      @save="addRelation"
    />

    <!-- Modales para editar campos y relaciones -->
    <EditFieldModal
      v-if="showEditFieldModal && selectedField"
      :model-id="kpiData.base_model"
      :field="selectedField"
      @close="showEditFieldModal = false"
      @save="updateField"
    />

    <EditRelationModal
      v-if="showEditRelationModal && selectedRelation"
      :fields="kpiFields"
      :relations="kpiRelations"
      :relation="selectedRelation"
      @close="showEditRelationModal = false"
      @save="updateRelation"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useKPIs } from '@/composables/useKPIs'
import { useNotifications } from '@/composables/useNotifications'
import FieldModal from '@/components/kpi/FieldModal.vue'
import RelationModal from '@/components/kpi/RelationModal.vue'
import EditFieldModal from '@/components/kpi/EditFieldModal.vue'
import EditRelationModal from '@/components/kpi/EditRelationModal.vue'

const router = useRouter()
const route = useRoute()
const kpiId = route.params.id

const {
  kpis,
  currentKPI,
  models,
  kpiFields,
  kpiRelations,
  isLoading,
  error,
  loadModels,
  loadKPI,
  loadKPIFields,
  loadKPIRelations,
  addKPIField,
  addKPIRelation,
  editKPIField,
  editKPIRelation,
  removeKPIField,
  removeKPIRelation,
  updateKPI: updateKPIService,
  clearError
} = useKPIs()

const { error: showError, success: showSuccess } = useNotifications()

// Estado del wizard
const currentStep = ref(0)
const isUpdating = ref(false)
const showAddFieldModal = ref(false)
const showAddRelationModal = ref(false)
const showEditFieldModal = ref(false)
const showEditRelationModal = ref(false)
const selectedField = ref(null)
const selectedRelation = ref(null)

// Pasos del wizard (dinámicos según el tipo de KPI)
const steps = computed(() => {
  const baseSteps = [
    {
      id: 'basic',
      title: 'Información Básica',
      description: 'Datos principales del KPI'
    }
  ]

  if (kpiData.calculation_type === 'custom_fields') {
    baseSteps.push(
      {
        id: 'fields',
        title: 'Configurar Campos',
        description: 'Modificar campos de datos'
      },
      {
        id: 'relations',
        title: 'Relaciones',
        description: 'Operaciones matemáticas'
      }
    )
  }

  baseSteps.push({
    id: 'review',
    title: 'Revisar',
    description: 'Confirmar cambios'
  })

  return baseSteps
})

// Datos del KPI (copia para edición)
const kpiData = reactive({
  name: '',
  code: '',
  description: '',
  unit: '',
  calculation_type: 'predefined',
  base_model: '',
  default_period_type: 'monthly',
  use_custom_time_range: false,
  is_active: true
})

// Errores de validación
const errors = reactive({
  name: '',
  unit: '',
  calculation_type: '',
  base_model: '',
  default_period_type: ''
})

// Computed
const isStepValid = (step) => {
  switch (step) {
    case 0:
      return kpiData.name && kpiData.unit && kpiData.calculation_type && kpiData.base_model && kpiData.default_period_type
    case 1:
      if (kpiData.calculation_type === 'predefined') {
        return true
      }
      return kpiFields.value.length > 0
    case 2:
      if (kpiData.calculation_type === 'predefined') {
        return true
      }
      return kpiFields.value.length > 0
    case 3:
      return true
    default:
      return false
  }
}

// Métodos
const nextStep = () => {
  if (isStepValid(currentStep.value)) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const validateField = (fieldName) => {
  const value = kpiData[fieldName]
  
  switch (fieldName) {
    case 'name':
      errors.name = value ? '' : 'El nombre es requerido'
      break
    case 'unit':
      errors.unit = value ? '' : 'La unidad es requerida'
      break
    case 'calculation_type':
      errors.calculation_type = value ? '' : 'El tipo de cálculo es requerido'
      break
    case 'base_model':
      errors.base_model = value ? '' : 'El modelo base es requerido'
      break
    case 'default_period_type':
      errors.default_period_type = value ? '' : 'El período es requerido'
      break
  }
}

const getPeriodLabel = (period) => {
  const periods = {
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual',
    yearly: 'Anual',
    custom: 'Personalizado'
  }
  return periods[period] || period
}

const getModelName = (modelId) => {
  const model = models.value.find(m => m.id === modelId)
  return model ? model.display_name : 'Modelo no encontrado'
}

const getFieldName = (fieldId) => {
  const field = kpiFields.value.find(f => f.id === fieldId)
  return field ? field.display_name : 'Campo no encontrado'
}

const getOperationSymbol = (operation) => {
  const symbols = {
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/',
    percentage: '%'
  }
  return symbols[operation] || operation
}

const addField = async (fieldData) => {
  try {
    await addKPIField(kpiId, fieldData)
    showAddFieldModal.value = false
    showSuccess('Campo Agregado', 'El campo se ha agregado exitosamente')
  } catch (err) {
    console.error('Error agregando campo:', err)
    showError('Error', 'No se pudo agregar el campo')
  }
}

const addRelation = async (relationData) => {
  try {
    await addKPIRelation(kpiId, relationData)
    showAddRelationModal.value = false
    showSuccess('Relación Agregada', 'La relación se ha agregado exitosamente')
  } catch (err) {
    console.error('Error agregando relación:', err)
    showError('Error', 'No se pudo agregar la relación')
  }
}

const editField = (field) => {
  selectedField.value = field
  showEditFieldModal.value = true
}

const removeField = async (fieldId) => {
  if (confirm('¿Estás seguro de eliminar este campo?')) {
    try {
      await removeKPIField(kpiId, fieldId)
      showSuccess('Campo Eliminado', 'El campo se ha eliminado exitosamente')
    } catch (err) {
      console.error('Error eliminando campo:', err)
      showError('Error', 'No se pudo eliminar el campo')
    }
  }
}

const editRelation = (relation) => {
  selectedRelation.value = relation
  showEditRelationModal.value = true
}

const removeRelation = async (relationId) => {
  if (confirm('¿Estás seguro de eliminar esta relación?')) {
    try {
      await removeKPIRelation(kpiId, relationId)
      showSuccess('Relación Eliminada', 'La relación se ha eliminado exitosamente')
    } catch (err) {
      console.error('Error eliminando relación:', err)
      showError('Error', 'No se pudo eliminar la relación')
    }
  }
}

const updateField = async (fieldData) => {
  try {
    await editKPIField(kpiId, selectedField.value.id, fieldData)
    showEditFieldModal.value = false
    selectedField.value = null
    showSuccess('Campo Actualizado', 'El campo se ha actualizado exitosamente')
  } catch (err) {
    console.error('Error actualizando campo:', err)
    showError('Error', 'No se pudo actualizar el campo')
  }
}

const updateRelation = async (relationData) => {
  try {
    await editKPIRelation(kpiId, selectedRelation.value.id, relationData)
    showEditRelationModal.value = false
    selectedRelation.value = null
    showSuccess('Relación Actualizada', 'La relación se ha actualizado exitosamente')
  } catch (err) {
    console.error('Error actualizando relación:', err)
    showError('Error', 'No se pudo actualizar la relación')
  }
}

const loadKPIData = async () => {
  try {
    clearError()
    
    // Cargar modelos primero
    await loadModels()
    
    // Cargar datos del KPI
    const kpiResponse = await loadKPI(kpiId)
    if (kpiResponse.success && currentKPI.value) {
      // Copiar datos del KPI actual al formulario
      Object.assign(kpiData, {
        name: currentKPI.value.name || '',
        code: currentKPI.value.code || '',
        description: currentKPI.value.description || '',
        unit: currentKPI.value.unit || '',
        calculation_type: currentKPI.value.calculation_type || 'predefined',
        base_model: currentKPI.value.base_model || '',
        default_period_type: currentKPI.value.default_period_type || 'monthly',
        use_custom_time_range: currentKPI.value.use_custom_time_range || false,
        is_active: currentKPI.value.is_active !== false
      })

      // Si es custom_fields, cargar campos y relaciones
      if (kpiData.calculation_type === 'custom_fields') {
        await loadKPIFields(kpiId)
        await loadKPIRelations(kpiId)
      }
    }
  } catch (err) {
    console.error('Error cargando datos del KPI:', err)
  }
}

const updateKPI = async () => {
  isUpdating.value = true
  
  try {
    const updatePayload = {
      name: kpiData.name,
      description: kpiData.description,
      unit: kpiData.unit,
      default_period_type: kpiData.default_period_type,
      use_custom_time_range: kpiData.use_custom_time_range,
      is_active: kpiData.is_active
    }

    console.log('Actualizando KPI con payload:', updatePayload)
    const result = await updateKPIService(kpiId, updatePayload)
    
    if (result.success) {
      showSuccess('KPI Actualizado', 'El indicador se ha actualizado exitosamente')
      router.push('/kpis')
    }
  } catch (err) {
    console.error('Error actualizando KPI:', err)
    showError('Error', 'No se pudo actualizar el KPI')
  } finally {
    isUpdating.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadKPIData()
})
</script>

<style scoped>
.edit-kpi-container {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: #667eea;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #a0aec0;
}

.breadcrumb-current {
  color: #4a5568;
  font-weight: 500;
}

.page-header h1 {
  margin: 0 0 0.5rem 0;
  color: #1a202c;
  font-size: 2rem;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

.page-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.wizard-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.wizard-steps {
  display: flex;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.step {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 1.5rem;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 40px;
  background: #e2e8f0;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
  background: #e2e8f0;
  color: #a0aec0;
}

.step.active .step-number {
  background: #667eea;
  color: white;
}

.step.completed .step-number {
  background: #48bb78;
  color: white;
}

.step-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #4a5568;
}

.step.active .step-content h3 {
  color: #1a202c;
}

.step-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #718096;
}

.step.active .step-content p {
  color: #4a5568;
}

.wizard-content {
  padding: 2rem;
}

.step-panel {
  min-height: 500px;
}

.panel-header {
  margin-bottom: 2rem;
}

.panel-header h2 {
  margin: 0 0 0.5rem 0;
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: 600;
}

.panel-header p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

.kpi-form {
  max-width: 800px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error,
.form-group select.error {
  border-color: #e53e3e;
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f7fafc;
  color: #a0aec0;
  cursor: not-allowed;
}

.error-message {
  margin-top: 0.25rem;
  color: #e53e3e;
  font-size: 0.875rem;
}

.help-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.help-text strong {
  color: #374151;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  margin: 0;
  font-weight: 500;
  color: #4a5568;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #667eea;
  color: #667eea;
}

.btn-success {
  background: #48bb78;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #38a169;
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

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fields-section,
.relations-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  margin: 0;
  color: #1a202c;
  font-size: 1.25rem;
  font-weight: 600;
}

.empty-fields,
.empty-relations {
  text-align: center;
  padding: 3rem 2rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 2px dashed #e2e8f0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-fields h4,
.empty-relations h4 {
  margin: 0 0 0.5rem 0;
  color: #4a5568;
  font-size: 1.25rem;
}

.empty-fields p,
.empty-relations p {
  margin: 0 0 1.5rem 0;
  color: #718096;
}

.empty-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.fields-list,
.relations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-card,
.relation-card {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.field-header h4 {
  margin: 0;
  color: #1a202c;
  font-size: 1.125rem;
  font-weight: 600;
}

.field-type {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.field-details {
  margin-bottom: 1rem;
}

.field-details p {
  margin: 0 0 0.5rem 0;
  color: #4a5568;
  font-size: 0.875rem;
}

.field-actions,
.relation-actions {
  display: flex;
  gap: 0.5rem;
}

.relation-content {
  margin-bottom: 1rem;
}

.relation-formula {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 500;
}

.relation-formula .field {
  background: #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: #4a5568;
}

.relation-formula .operator {
  color: #667eea;
  font-weight: 600;
}

.relation-details p {
  margin: 0 0 0.5rem 0;
  color: #4a5568;
  font-size: 0.875rem;
}

.review-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
}

.review-card h3 {
  margin: 0 0 1rem 0;
  color: #1a202c;
  font-size: 1.125rem;
  font-weight: 600;
}

.review-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.review-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-item .label {
  color: #718096;
  font-weight: 500;
}

.review-item .value {
  color: #2d3748;
  font-weight: 500;
}

.predefined-info {
  margin-top: 2rem;
}

.info-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.info-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.info-card h3 {
  color: #0c4a6e;
  margin-bottom: 1rem;
}

.info-card p {
  color: #0c4a6e;
  margin-bottom: 1.5rem;
}

.info-details {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 1rem;
  text-align: left;
}

.info-details p {
  margin-bottom: 0.5rem;
  color: #0c4a6e;
}

.info-details strong {
  color: #0c4a6e;
}

.code-preview {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.code-label {
  display: block;
  color: #718096;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.generated-code {
  display: block;
  color: #2d3748;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #cbd5e0;
  word-break: break-all;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

.loading-spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-container p {
  color: #718096;
  font-size: 1rem;
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

/* Estilos para información del KPI */
.kpi-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.summary-item .label {
  font-weight: 500;
  color: #4a5568;
}

.summary-item .value {
  font-weight: 600;
  color: #2d3748;
}

.summary-item .value.active {
  color: #38a169;
}

.summary-item .value.inactive {
  color: #e53e3e;
}

.debug-info {
  margin-top: 2rem;
  padding: 1rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-align: left;
}

.debug-info h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
}

.debug-info p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #4a5568;
}

.debug-info strong {
  color: #2d3748;
  font-weight: 600;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }
  
  .page-content {
    padding: 1rem;
  }
  
  .wizard-steps {
    flex-direction: column;
  }

  .step {
    padding: 1rem;
  }

  .step:not(:last-child)::after {
    display: none;
  }

  .wizard-content {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .field-actions,
  .relation-actions {
    flex-direction: column;
  }

  .error-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .step-panel {
    min-height: auto;
  }

  .field-card,
  .relation-card {
    padding: 1rem;
  }

  .relation-formula {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>