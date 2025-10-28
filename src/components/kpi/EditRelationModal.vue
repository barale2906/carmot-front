<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>Editar Relación entre Campos</h2>
        <button @click="closeModal" class="close-button">×</button>
      </div>

      <div class="modal-content">
        <form @submit.prevent="saveRelation" class="relation-form">
          <div class="form-group">
            <label for="field_a_id">Primer Campo *</label>
            <select
              id="field_a_id"
              v-model="relationData.field_a_id"
              :class="{ 'error': errors.field_a_id }"
            >
              <option value="">Selecciona el primer campo</option>
              <option v-for="field in availableFields" :key="field.id" :value="field.id">
                {{ field.display_name }}
              </option>
            </select>
            <span v-if="errors.field_a_id" class="error-message">{{ errors.field_a_id }}</span>
          </div>

          <div class="form-group">
            <label for="operation">Operación *</label>
            <select
              id="operation"
              v-model="relationData.operation"
              :class="{ 'error': errors.operation }"
            >
              <option value="">Selecciona una operación</option>
              <option value="add">Suma (+)</option>
              <option value="subtract">Resta (-)</option>
              <option value="multiply">Multiplicación (×)</option>
              <option value="divide">División (÷)</option>
              <option value="percentage">Módulo (%)</option>
            </select>
            <span v-if="errors.operation" class="error-message">{{ errors.operation }}</span>
          </div>

          <div class="form-group">
            <label for="field_b_id">Segundo Campo *</label>
            <select
              id="field_b_id"
              v-model="relationData.field_b_id"
              :class="{ 'error': errors.field_b_id }"
            >
              <option value="">Selecciona el segundo campo</option>
              <option v-for="field in availableFields" :key="field.id" :value="field.id">
                {{ field.display_name }}
              </option>
            </select>
            <span v-if="errors.field_b_id" class="error-message">{{ errors.field_b_id }}</span>
          </div>

          <div class="form-group">
            <label for="order">Orden de Ejecución *</label>
            <input
              id="order"
              v-model.number="relationData.order"
              type="number"
              min="1"
              placeholder="1"
              :class="{ 'error': errors.order }"
            />
            <span v-if="errors.order" class="error-message">{{ errors.order }}</span>
            <small class="help-text">Orden en que se ejecutará esta relación (1 = primero)</small>
          </div>

          <div class="form-group">
            <label for="description">Descripción</label>
            <textarea
              id="description"
              v-model="relationData.description"
              placeholder="Describe qué representa esta relación..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="is_active">Estado de la Relación</label>
            <div class="checkbox-group">
              <input
                id="is_active"
                v-model="relationData.is_active"
                type="checkbox"
              />
              <label for="is_active" class="checkbox-label">Relación Activa</label>
            </div>
            <small class="help-text">Las relaciones inactivas no se aplicarán en el cálculo</small>
          </div>

          <!-- Vista previa de la fórmula -->
          <div v-if="relationData.field_a_id && relationData.operation && relationData.field_b_id" class="formula-preview">
            <h4>Vista Previa de la Fórmula:</h4>
            <div class="formula-display">
              <span class="field">{{ getFieldName(relationData.field_a_id) }}</span>
              <span class="operator">{{ getOperationSymbol(relationData.operation) }}</span>
              <span class="field">{{ getFieldName(relationData.field_b_id) }}</span>
            </div>
            <div class="formula-details">
              <div class="detail-item">
                <span class="label">Orden:</span>
                <span class="value">{{ relationData.order }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Estado:</span>
                <span class="value">{{ relationData.is_active ? 'Activo' : 'Inactivo' }}</span>
              </div>
              <div v-if="relationData.description" class="detail-item">
                <span class="label">Descripción:</span>
                <span class="value">{{ relationData.description }}</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn btn-secondary">
          Cancelar
        </button>
        <button @click="saveRelation" class="btn btn-primary" :disabled="!isFormValid">
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  fields: {
    type: Array,
    required: true,
    default: () => []
  },
  relations: {
    type: Array,
    required: true,
    default: () => []
  },
  relation: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

// Estado
const relationData = reactive({
  field_a_id: '',
  operation: '',
  field_b_id: '',
  order: 1,
  description: '',
  is_active: true
})

// Errores
const errors = reactive({
  field_a_id: '',
  operation: '',
  field_b_id: '',
  order: ''
})

// Computed
const availableFields = computed(() => props.fields)

const isFormValid = computed(() => {
  return relationData.field_a_id && 
         relationData.operation && 
         relationData.field_b_id && 
         relationData.order > 0 &&
         relationData.field_a_id !== relationData.field_b_id
})

// Métodos
const closeModal = () => {
  emit('close')
}

const getFieldName = (fieldId) => {
  const field = availableFields.value.find(f => f.id === fieldId)
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

const saveRelation = () => {
  if (isFormValid.value) {
    // Validar que no sea la misma relación
    if (relationData.field_a_id === relationData.field_b_id) {
      errors.field_b_id = 'Los campos deben ser diferentes'
      return
    }

    // Validar orden único (excluyendo la relación actual)
    const existingOrder = props.relations.find(r => r.order === relationData.order && r.id !== props.relation.id)
    if (existingOrder) {
      errors.order = 'Ya existe una relación con este orden'
      return
    }

    emit('save', { ...relationData })
    closeModal()
  }
}

// Inicializar datos de la relación
const initializeRelationData = () => {
  Object.assign(relationData, {
    field_a_id: props.relation.field_a_id || '',
    operation: props.relation.operation || '',
    field_b_id: props.relation.field_b_id || '',
    order: props.relation.order || 1,
    description: props.relation.description || '',
    is_active: props.relation.is_active !== false
  })
}

// Inicializar al montar
initializeRelationData()
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

.relation-form {
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

.formula-preview {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
}

.formula-preview h4 {
  margin: 0 0 1rem 0;
  color: #4a5568;
  font-size: 1rem;
  font-weight: 600;
}

.formula-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.formula-display .field {
  background: #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: #4a5568;
}

.formula-display .operator {
  color: #667eea;
  font-weight: 600;
  font-size: 1.25rem;
}

.formula-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item .label {
  color: #718096;
  font-weight: 500;
}

.detail-item .value {
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

  .formula-display {
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
