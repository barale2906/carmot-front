<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>Agregar Campo al KPI</h2>
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
              <option value="distinct">Distintos</option>
              <option value="where">Filtro</option>
            </select>
            <span v-if="errors.operation" class="error-message">{{ errors.operation }}</span>
            <small class="help-text">
              <strong>Suma/Conteo/Promedio:</strong> Operaciones matemáticas<br>
              <strong>Filtro:</strong> Para aplicar condiciones específicas
            </small>
          </div>

          <!-- Filtro condicional - solo se muestra si la operación es 'where' -->
          <div v-if="fieldData.operation === 'where'" class="filter-section">
            <h4>Configuración del Filtro</h4>
            <div class="filter-config">
              <div class="form-group">
                <label for="filter_field">Campo a Filtrar *</label>
                <select
                  id="filter_field"
                  v-model="fieldData.filter_field"
                  :class="{ 'error': errors.filter_field }"
                >
                  <option value="">Selecciona el campo</option>
                  <option v-for="field in availableFields" :key="field.name" :value="field.name">
                    {{ field.display_name }} ({{ field.type }})
                  </option>
                </select>
                <span v-if="errors.filter_field" class="error-message">{{ errors.filter_field }}</span>
              </div>

              <div class="form-group">
                <label for="operator">Operador *</label>
                <select
                  id="operator"
                  v-model="fieldData.operator"
                  :class="{ 'error': errors.operator }"
                >
                  <option value="">Selecciona operador</option>
                  <option value="=">Igual a (=)</option>
                  <option value="!=">Diferente de (!=)</option>
                  <option value=">">Mayor que (>)</option>
                  <option value="<">Menor que (<)</option>
                  <option value=">=">Mayor o igual (>=)</option>
                  <option value="<=">Menor o igual (<=)</option>
                  <option value="LIKE">Contiene (LIKE)</option>
                  <option value="IN">En la lista (IN)</option>
                </select>
                <span v-if="errors.operator" class="error-message">{{ errors.operator }}</span>
              </div>

              <div class="form-group">
                <label for="filter_value">Valor *</label>
                <input
                  id="filter_value"
                  v-model="fieldData.filter_value"
                  type="text"
                  placeholder="Ej: 1, activo, 100"
                  :class="{ 'error': errors.filter_value }"
                />
                <span v-if="errors.filter_value" class="error-message">{{ errors.filter_value }}</span>
                <small class="help-text">
                  Para operador "IN", separa valores con comas: 1,2,3<br>
                  Para operador "LIKE", usa % para comodines: %activo%
                </small>
              </div>
            </div>
          </div>


          <div class="form-group">
            <label for="order">Orden</label>
            <input
              id="order"
              v-model.number="fieldData.order"
              type="number"
              min="1"
              placeholder="1"
            />
            <small class="help-text">Orden de ejecución del campo</small>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn btn-secondary">
          Cancelar
        </button>
        <button @click="saveField" class="btn btn-primary" :disabled="!isFormValid">
          Agregar Campo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import kpiMetadataService from '@/services/kpiMetadata'

const props = defineProps({
  modelId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

// Estado
const availableFields = ref([])
const isLoading = ref(false)

// Datos del campo
const fieldData = reactive({
  field_name: '',
  display_name: '',
  field_type: '',
  operation: '',
  filter_field: '',
  operator: '',
  filter_value: '',
  order: 1
})

// Errores
const errors = reactive({
  field_name: '',
  display_name: '',
  operation: '',
  filter_field: '',
  operator: '',
  filter_value: ''
})

// Computed
const isFormValid = computed(() => {
  const basicValid = fieldData.field_name && fieldData.display_name && fieldData.field_type && fieldData.operation
  
  // Si la operación es 'where', también validar los campos de filtro
  if (fieldData.operation === 'where') {
    return basicValid && fieldData.filter_field && fieldData.operator && fieldData.filter_value
  }
  
  return basicValid
})

// Métodos
const closeModal = () => {
  emit('close')
}

const onFieldChange = () => {
  const selectedField = availableFields.value.find(f => f.name === fieldData.field_name)
  if (selectedField) {
    if (!fieldData.display_name) {
      fieldData.display_name = selectedField.display_name
    }
    // Asignar automáticamente el tipo del campo
    fieldData.field_type = selectedField.type
  }
}

const onOperationChange = () => {
  // Limpiar campos de filtro si no es operación 'where'
  if (fieldData.operation !== 'where') {
    fieldData.filter_field = ''
    fieldData.operator = ''
    fieldData.filter_value = ''
  }
}

const saveField = () => {
  if (isFormValid.value) {
    emit('save', { ...fieldData })
    closeModal()
  }
}

const loadModelFields = async () => {
  if (!props.modelId) return

  isLoading.value = true
  try {
    const response = await kpiMetadataService.getModelFields(props.modelId)
    availableFields.value = response.data || []
  } catch (error) {
    console.error('Error cargando campos del modelo:', error)
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch(() => props.modelId, () => {
  if (props.modelId) {
    loadModelFields()
  }
})

// Lifecycle
onMounted(() => {
  if (props.modelId) {
    loadModelFields()
  }
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

.help-text {
  margin-top: 0.25rem;
  color: #718096;
  font-size: 0.875rem;
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
}

/* Estilos para la sección de filtros */
.filter-section {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.filter-section h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
}

.filter-config {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-config .form-group {
  margin-bottom: 0;
}
</style>
