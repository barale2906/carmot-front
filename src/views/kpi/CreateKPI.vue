<template>
  <div class="create-kpi-container">
    <!-- Header con navegación -->
    <header class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <router-link to="/kpis" class="breadcrumb-link">KPIs</router-link>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-current">Crear KPI</span>
        </div>
      <h1>Crear Nuevo KPI</h1>
        <p>Configura un nuevo indicador de rendimiento paso a paso</p>
      </div>
    </header>

    <main class="page-content">
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
              <p>Define los datos principales del KPI</p>
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
                    <small class="code-label">Código generado:</small>
                    <code class="generated-code">{{ generateSlug(kpiData.name) }}</code>
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
                  >
                    <option value="">Selecciona un tipo de cálculo</option>
                    <option value="predefined">Automático</option>
                    <option value="custom_fields">Personalizado</option>
                  </select>
                  <span v-if="errors.calculation_type" class="error-message">{{ errors.calculation_type }}</span>
                  <small class="help-text">
                    <strong>Automático:</strong> Conteos simples sin configuración adicional<br>
                    <strong>Personalizado:</strong> Con filtros y operaciones específicas
                  </small>
                </div>

                <div class="form-group">
                  <label for="base_model">Modelo Base *</label>
                  <select
                    id="base_model"
                    v-model="kpiData.base_model"
                    :class="{ 'error': errors.base_model }"
                    @change="validateField('base_model')"
                  >
                    <option value="">Selecciona un modelo</option>
                    <option v-for="model in models" :key="model.id" :value="model.id">
                      {{ model.display_name }}
                    </option>
                  </select>
                  <span v-if="errors.base_model" class="error-message">{{ errors.base_model }}</span>
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
              </div>

              <div class="form-actions">
                <router-link to="/kpis" class="btn btn-secondary">
                  Cancelar
          </router-link>
                <button type="submit" class="btn btn-primary" :disabled="!isStepValid(0)">
                  Siguiente: Configurar Campos
                </button>
              </div>
            </form>
          </div>

          <!-- Paso 2: Configuración de Campos -->
          <div v-if="currentStep === 1" class="step-panel">
            <div class="panel-header">
              <h2>Configuración de Campos</h2>
              <p v-if="kpiData.calculation_type === 'predefined'">
                Los KPIs automáticos no requieren configuración de campos adicionales.
              </p>
              <p v-else>
                Selecciona y configura los campos necesarios para el cálculo personalizado.
              </p>
            </div>

            <!-- Mostrar solo para custom_fields -->
            <div v-if="kpiData.calculation_type === 'custom_fields'" class="fields-section">
              <div class="section-header">
                <h3>Campos Disponibles</h3>
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
                    <p v-if="field.operation === 'where' && field.filter_field">
                      <strong>Filtro:</strong> {{ field.filter_field }} {{ field.operator }} {{ field.filter_value }}
                    </p>
                    <p v-else-if="field.filter_condition">
                      <strong>Filtro:</strong> {{ field.filter_condition }}
                    </p>
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

            <!-- Mostrar información para predefined -->
            <div v-else class="predefined-info">
              <div class="info-card">
                <div class="info-icon">⚡</div>
                <h3>KPI Automático</h3>
                <p>Este KPI calculará automáticamente el conteo total de registros del modelo seleccionado.</p>
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
              <button @click="nextStep" class="btn btn-primary" :disabled="!isStepValid(1)">
                {{ kpiData.calculation_type === 'predefined' ? 'Siguiente: Revisar' : 'Siguiente: Configurar Relaciones' }}
              </button>
            </div>
          </div>

          <!-- Paso 3: Relaciones Matemáticas -->
          <div v-if="currentStep === 2" class="step-panel">
            <div class="panel-header">
              <h2>Relaciones Matemáticas</h2>
              <p v-if="kpiData.calculation_type === 'predefined'">
                Los KPIs automáticos no requieren configuración de relaciones matemáticas.
              </p>
              <p v-else>
                Define cómo se relacionan los campos para calcular el KPI (opcional si solo tienes un campo)
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
                      <span class="field">{{ getFieldName(relation.field1_id) }}</span>
                      <span class="operator">{{ relation.operation }}</span>
                      <span class="field">{{ getFieldName(relation.field2_id) }}</span>
                    </div>
                    <div class="relation-details">
                      <p><strong>Operación:</strong> {{ relation.operation }}</p>
                      <p><strong>Orden:</strong> {{ relation.order }}</p>
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
              <button @click="nextStep" class="btn btn-primary" :disabled="!isStepValid(2)">
                {{ kpiData.calculation_type === 'predefined' ? 'Siguiente: Revisar y Crear' : 'Siguiente: Revisar y Crear' }}
              </button>
            </div>
          </div>

          <!-- Paso 4: Revisar y Crear -->
          <div v-if="currentStep === 3" class="step-panel">
            <div class="panel-header">
              <h2>Revisar y Crear KPI</h2>
              <p>Revisa la configuración antes de crear el KPI</p>
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
                    <span class="value">{{ generateSlug(kpiData.name) }}</span>
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
                      {{ getFieldName(relation.field1_id) }} {{ relation.operation }} {{ getFieldName(relation.field2_id) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button @click="prevStep" class="btn btn-secondary">
                Anterior
              </button>
              <button @click="createKPI" class="btn btn-success" :disabled="isCreating">
                <span v-if="isCreating" class="loading-spinner"></span>
                {{ isCreating ? 'Creando...' : 'Crear KPI' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useKPIs } from '@/composables/useKPIs'
import { useNotifications } from '@/composables/useNotifications'
import FieldModal from '@/components/kpi/FieldModal.vue'
import RelationModal from '@/components/kpi/RelationModal.vue'

const router = useRouter()
const {
  kpis,
  models,
  kpiFields,
  kpiRelations,
  isLoading,
  error,
  loadModels,
  loadKPIs,
  loadKPI,
  addKPIField,
  addKPIRelation,
  saveKPI,
  clearError
} = useKPIs()

const { error: showError, warning: showWarning } = useNotifications()

// Estado del wizard
const currentStep = ref(0)
const isCreating = ref(false)
const showAddFieldModal = ref(false)
const showAddRelationModal = ref(false)

// Pasos del wizard
const steps = [
  {
    id: 'basic',
    title: 'Información Básica',
    description: 'Datos principales del KPI'
  },
  {
    id: 'fields',
    title: 'Configurar Campos',
    description: 'Seleccionar campos de datos'
  },
  {
    id: 'relations',
    title: 'Relaciones',
    description: 'Operaciones matemáticas (opcional)'
  },
  {
    id: 'review',
    title: 'Revisar',
    description: 'Confirmar configuración'
  }
]

// Datos del KPI
const kpiData = reactive({
  name: '',
  description: '',
  unit: '',
  calculation_type: 'predefined', // Nuevo campo requerido
  base_model: '',
  default_period_type: 'monthly',
  use_custom_time_range: false, // Nuevo campo
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
      // Si es predefined, no necesita campos
      if (kpiData.calculation_type === 'predefined') {
        return true
      }
      // Si es custom_fields, necesita al menos un campo
      return kpiFields.value.length > 0
    case 2:
      // Para predefined, siempre permitir continuar (no necesita campos ni relaciones)
      if (kpiData.calculation_type === 'predefined') {
        return true
      }
      // Para custom_fields, permitir continuar si hay al menos un campo (las relaciones son opcionales)
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

// Función para generar slug automático basado en el nombre
const generateSlug = (name) => {
  if (!name) return ''
  
  return name
    .toLowerCase()
    .trim()
    .replace(/[áàäâã]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõ]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
    .replace(/-+/g, '_') // Reemplazar múltiples guiones con uno solo
    .replace(/^_+|_+$/g, '') // Eliminar guiones al inicio y final
}

// Función para generar código único
const generateUniqueCode = async (baseName) => {
  const baseSlug = generateSlug(baseName)
  
  // Primero verificar en caché local
  if (!existingCodesCache.value.has(baseSlug)) {
    return baseSlug
  }
  
  // Si existe en caché, generar con timestamp (muy poco probable que exista)
  const timestamp = Date.now().toString().slice(-6)
  const codeWithTimestamp = `${baseSlug}_${timestamp}`
  
  if (!existingCodesCache.value.has(codeWithTimestamp)) {
    return codeWithTimestamp
  }
  
  // Último recurso: usar UUID corto (prácticamente imposible que exista)
  const shortId = Math.random().toString(36).substring(2, 8)
  return `${baseSlug}_${shortId}`
}

// Cache local para códigos existentes
const existingCodesCache = ref(new Set())

const getFieldName = (fieldId) => {
  const field = kpiFields.value.find(f => f.id === fieldId)
  return field ? field.display_name : 'Campo no encontrado'
}

const addField = async (fieldData) => {
  try {
    await addKPIField(null, fieldData) // null porque aún no tenemos KPI ID
    showAddFieldModal.value = false
  } catch (err) {
    console.error('Error agregando campo:', err)
  }
}

const addRelation = async (relationData) => {
  try {
    await addKPIRelation(null, relationData) // null porque aún no tenemos KPI ID
    showAddRelationModal.value = false
  } catch (err) {
    console.error('Error agregando relación:', err)
  }
}

const editField = (field) => {
  // TODO: Implementar edición de campo
  console.log('Edit field:', field)
}

const removeField = (fieldId) => {
  if (confirm('¿Estás seguro de eliminar este campo?')) {
    // TODO: Implementar eliminación de campo
    console.log('Remove field:', fieldId)
  }
}

const editRelation = (relation) => {
  // TODO: Implementar edición de relación
  console.log('Edit relation:', relation)
}

const removeRelation = (relationId) => {
  if (confirm('¿Estás seguro de eliminar esta relación?')) {
    // TODO: Implementar eliminación de relación
    console.log('Remove relation:', relationId)
  }
}

const createKPI = async () => {
  isCreating.value = true
  
  try {
    // Generar código único automáticamente
    const generatedCode = await generateUniqueCode(kpiData.name)
    
    const kpiPayload = {
      name: kpiData.name,
      code: generatedCode,
      description: kpiData.description,
      unit: kpiData.unit,
      calculation_type: kpiData.calculation_type,
      base_model: kpiData.base_model,
      default_period_type: kpiData.default_period_type,
      use_custom_time_range: kpiData.use_custom_time_range,
      is_active: kpiData.is_active
    }

    // Solo agregar campos si es custom_fields
    if (kpiData.calculation_type === 'custom_fields') {
      kpiPayload.kpi_fields = kpiFields.value.map(field => ({
        field_name: field.field_name,
        display_name: field.display_name,
        field_type: field.field_type,
        operation: field.operation,
        operator: field.operator,
        value: field.filter_value,
        is_required: field.is_required,
        order: field.order
      }))
    }

    // Crear el KPI primero
    console.log('Creando KPI con payload:', kpiPayload)
    const result = await saveKPI(kpiPayload)
    if (result.success) {
      const kpiId = result.data.id
      console.log('KPI creado con ID:', kpiId)
      
      // Si hay relaciones, crearlas por separado
      if (kpiData.calculation_type === 'custom_fields' && kpiRelations.value.length > 0) {
        console.log('Creando relaciones:', kpiRelations.value)
        try {
          // Obtener los campos creados del KPI para mapear correctamente los IDs
          const kpiResponse = await loadKPI(kpiId)
          if (kpiResponse.success) {
            const createdFields = kpiResponse.data.kpi_fields || []
            console.log('Campos creados:', createdFields)
            
            // Crear cada relación
            for (const relation of kpiRelations.value) {
              // Encontrar los IDs reales de los campos creados
              const field1Index = kpiFields.value.findIndex(field => field.id === relation.field1_id)
              const field2Index = kpiFields.value.findIndex(field => field.id === relation.field2_id)
              
              console.log(`Mapeando relación: field1Index=${field1Index}, field2Index=${field2Index}`)
              
              if (field1Index !== -1 && field2Index !== -1 && createdFields[field1Index] && createdFields[field2Index]) {
                const relationData = {
                  field_a_id: createdFields[field1Index].id,
                  field_b_id: createdFields[field2Index].id,
                  operation: relation.operation === '+' ? 'add' : 
                           relation.operation === '-' ? 'subtract' :
                           relation.operation === '*' ? 'multiply' :
                           relation.operation === '/' ? 'divide' :
                           relation.operation === '%' ? 'percentage' : relation.operation,
                  order: relation.order,
                  is_active: true,
                  description: relation.description
                }
                
                console.log('Creando relación con datos:', relationData)
                await addKPIRelation(kpiId, relationData)
                console.log('Relación creada exitosamente')
              } else {
                console.error('No se pudo mapear la relación:', { field1Index, field2Index, createdFields })
              }
            }
          }
        } catch (relationError) {
          console.error('Error creando relaciones:', relationError)
          // No fallar la creación del KPI si las relaciones fallan
        }
      }
      
      router.push('/kpis')
    }
    // No necesitamos manejar el error aquí porque saveKPI ya lo maneja
  } catch (err) {
    // Este catch solo debería ejecutarse en casos muy excepcionales
    console.error('Error inesperado creando KPI:', err)
    showError('Error Inesperado', 'Ha ocurrido un error inesperado al crear el KPI')
  } finally {
    isCreating.value = false
  }
}

// Función para inicializar caché de códigos existentes
const initializeCodesCache = async () => {
  try {
    // Cargar KPIs existentes para poblar la caché
    await loadKPIs()
    
    // Agregar códigos existentes a la caché
    kpis.value.forEach(kpi => {
      if (kpi.code) {
        existingCodesCache.value.add(kpi.code)
      }
    })
  } catch (error) {
    console.warn('No se pudo inicializar la caché de códigos:', error)
  }
}

// Lifecycle
onMounted(async () => {
  clearError()
  await loadModels()
  await initializeCodesCache()
})
</script>

<style scoped>
.create-kpi-container {
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

.error-message {
  margin-top: 0.25rem;
  color: #e53e3e;
  font-size: 0.875rem;
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

/* Estilos para los nuevos elementos */
.help-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.help-text strong {
  color: #374151;
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

/* Estilos para vista previa del código */
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
</style>