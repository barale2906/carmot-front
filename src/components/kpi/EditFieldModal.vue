<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>Editar Campo del KPI</h2>
        <button @click="closeModal" class="close-button">×</button>
      </div>

      <div class="modal-content">
        <form @submit.prevent="saveField" class="field-form">
          <div class="form-group">
            <label for="field_name">Campo *</label>
            <select
              id="field_name"
              v-model="fieldData.field_name"
              :class="{ 'error': errors.field_name }"
              @change="onFieldChange"
            >
              <option value="">Selecciona un campo</option>
              <option v-for="field in availableFields" :key="field.name" :value="field.name">
                {{ field.display_name }} ({{ field.type }})
              </option>
            </select>
            <span v-if="errors.field_name" class="error-message">{{ errors.field_name }}</span>
          </div>

          <div class="form-group">
            <label for="display_name">Nombre para Mostrar *</label>
            <input
              id="display_name"
              v-model="fieldData.display_name"
              type="text"
              placeholder="Ej: Total de Ventas"
              :class="{ 'error': errors.display_name }"
            />
            <span v-if="errors.display_name" class="error-message">{{ errors.display_name }}</span>
          </div>

          <div class="form-group">
            <label for="operation">Operación *</label>
            <select
              id="operation"
              v-model="fieldData.operation"
              :class="{ 'error': errors.operation }"
              @change="onOperationChange"
            >
              <option value="">Selecciona una operación</option>
              <option value="sum">Suma</option>
              <option value="count">Conteo</option>
              <option value="avg">Promedio</option>
              <option value="min">Mínimo</option>
              <option value="max">Máximo</option>
              <option value="where">Filtro</option>
              <option value="group_by">Agrupar por</option>
            </select>
            <span v-if="errors.operation" class="error-message">{{ errors.operation }}</span>
          </div>

          <!-- Campos condicionales para filtros -->
          <div v-if="fieldData.operation === 'where'" class="filter-section">
            <div class="form-group">
              <label for="operator">Operador de Filtro</label>
              <select
                id="operator"
                v-model="fieldData.operator"
                :class="{ 'error': errors.operator }"
              >
                <option value="">Selecciona un operador</option>
                <option value="=">Igual (=)</option>
                <option value="!=">Diferente (!=)</option>
                <option value=">">Mayor que (>)</option>
                <option value="<">Menor que (<)</option>
                <option value=">=">Mayor o igual (>=)</option>
                <option value="<=">Menor o igual (<=)</option>
                <option value="LIKE">Contiene (LIKE)</option>
                <option value="NOT LIKE">No contiene (NOT LIKE)</option>
                <option value="IN">Está en (IN)</option>
                <option value="NOT IN">No está en (NOT IN)</option>
              </select>
              <span v-if="errors.operator" class="error-message">{{ errors.operator }}</span>
            </div>

            <div class="form-group">
              <label for="filter_value">Valor del Filtro</label>
              <input
                id="filter_value"
                v-model="fieldData.filter_value"
                type="text"
                placeholder="Valor para filtrar"
                :class="{ 'error': errors.filter_value }"
              />
              <span v-if="errors.filter_value" class="error-message">{{ errors.filter_value }}</span>
              <small class="help-text">
                Para múltiples valores (IN/NOT IN), separa con comas: valor1,valor2,valor3
              </small>
            </div>
          </div>

          <div class="form-group">
            <label for="order">Orden de Ejecución *</label>
            <input
              id="order"
              v-model.number="fieldData.order"
              type="number"
              min="1"
              placeholder="1"
              :class="{ 'error': errors.order }"
            />
            <span v-if="errors.order" class="error-message">{{ errors.order }}</span>
            <small class="help-text">Orden en que se ejecutará este campo (1 = primero)</small>
          </div>

          <div class="form-group">
            <label for="is_required">Campo Requerido</label>
            <div class="checkbox-group">
              <input
                id="is_required"
                v-model="fieldData.is_required"
                type="checkbox"
              />
              <label for="is_required" class="checkbox-label">Este campo es requerido</label>
            </div>
            <small class="help-text">Los campos requeridos deben tener valor para que el KPI se calcule</small>
          </div>

          <!-- Vista previa del campo -->
          <div v-if="fieldData.field_name && fieldData.operation" class="field-preview">
            <h4>Vista Previa del Campo:</h4>
            <div class="preview-content">
              <div class="preview-item">
                <span class="label">Campo:</span>
                <span class="value">{{ fieldData.field_name }}</span>
              </div>
              <div class="preview-item">
                <span class="label">Operación:</span>
                <span class="value">{{ fieldData.operation }}</span>
              </div>
              <div v-if="fieldData.operation === 'where' && fieldData.operator && fieldData.filter_value" class="preview-item">
                <span class="label">Filtro:</span>
                <span class="value">{{ fieldData.field_name }} {{ fieldData.operator }} {{ fieldData.filter_value }}</span>
              </div>
              <div class="preview-item">
                <span class="label">Orden:</span>
                <span class="value">{{ fieldData.order }}</span>
              </div>
              <div class="preview-item">
                <span class="label">Requerido:</span>
                <span class="value">{{ fieldData.is_required ? 'Sí' : 'No' }}</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn btn-secondary">
          Cancelar
        </button>
        <button @click="saveField" class="btn btn-primary" :disabled="!isFormValid">
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import kpiMetadataService from '@/services/kpiMetadata'

const props = defineProps({
  modelId: {
    type: [String, Number],
    required: true
  },
  field: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

// Estado
const fieldData = reactive({
  field_name: '',
  display_name: '',
  field_type: '',
  operation: '',
  operator: '',
  filter_value: '',
  order: 1,
  is_required: false
})

const availableFields = ref([])
const isLoading = ref(false)

// Errores
const errors = reactive({
  field_name: '',
  display_name: '',
  operation: '',
  operator: '',
  filter_value: '',
  order: ''
})

// Computed
const isFormValid = computed(() => {
  return fieldData.field_name && 
         fieldData.display_name && 
         fieldData.operation && 
         fieldData.order > 0 &&
         (fieldData.operation !== 'where' || (fieldData.operator && fieldData.filter_value))
})

// Métodos
const closeModal = () => {
  emit('close')
}

const loadModelFields = async () => {
  try {
    isLoading.value = true
    const response = await kpiMetadataService.getModelFields(props.modelId)
    availableFields.value = response.data || []
  } catch (error) {
    console.error('Error cargando campos del modelo:', error)
    availableFields.value = []
  } finally {
    isLoading.value = false
  }
}

const onFieldChange = () => {
  const selectedField = availableFields.value.find(field => field.name === fieldData.field_name)
  if (selectedField) {
    fieldData.field_type = selectedField.type
    if (!fieldData.display_name) {
      fieldData.display_name = selectedField.display_name
    }
  }
}

const onOperationChange = () => {
  // Limpiar campos de filtro cuando cambia la operación
  if (fieldData.operation !== 'where') {
    fieldData.operator = ''
    fieldData.filter_value = ''
  }
}

const saveField = () => {
  if (isFormValid.value) {
    // Validar orden único (esto se puede hacer en el backend)
    emit('save', { ...fieldData })
    closeModal()
  }
}

// Inicializar datos del campo
const initializeFieldData = () => {
  Object.assign(fieldData, {
    field_name: props.field.field_name || '',
    display_name: props.field.display_name || '',
    field_type: props.field.field_type || '',
    operation: props.field.operation || '',
    operator: props.field.operator || '',
    filter_value: props.field.filter_value || props.field.value || '',
    order: props.field.order || 1,
    is_required: props.field.is_required || false
  })
}

// Lifecycle
onMounted(async () => {
  initializeFieldData()
  await loadModelFields()
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  color: #1a202c;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.close-button:hover {
  color: #4a5568;
}

.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.field-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
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

.help-text {
  margin-top: 0.25rem;
  color: #718096;
  font-size: 0.875rem;
}

.filter-section {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
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

.field-preview {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
}

.field-preview h4 {
  margin: 0 0 1rem 0;
  color: #4a5568;
  font-size: 1rem;
  font-weight: 600;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-item .label {
  color: #718096;
  font-weight: 500;
}

.preview-item .value {
  color: #2d3748;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
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

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 1rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .preview-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
