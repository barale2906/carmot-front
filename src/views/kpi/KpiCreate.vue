<template>
  <div class="kpi-create">
    <NavBar />
    <h1>Nuevo KPI</h1>

    <div class="steps">
      <div
        v-for="(label, idx) in stepLabels"
        :key="idx"
        class="step"
        :class="{ active: step === idx + 1 }"
      >
        {{ idx + 1 }}. {{ label }}
      </div>
    </div>

    <form class="form-card" @submit.prevent="onSubmit">
      <!-- Paso 1: Datos básicos -->
      <div v-if="step === 1" class="grid">
        <h2 class="section-title">1. Datos básicos</h2>
        <label>
          Nombre
          <input v-model="form.name" required />
        </label>
        <label>
          Código
          <input v-model="form.code" required />
        </label>
        <label class="col-2">
          Descripción
          <textarea v-model="form.description" rows="2" />
        </label>
        <label>
          Unidad
          <input v-model="form.unit" />
        </label>
        <label>
          Activo
          <select v-model="form.is_active">
            <option :value="true">Sí</option>
            <option :value="false">No</option>
          </select>
        </label>
      </div>

      <!-- Paso 2: Numerador -->
      <div v-if="step === 2" class="grid">
        <h2 class="section-title">2. Numerador</h2>
        <label>
          Modelo del numerador
          <select v-model="form.numerator_model">
            <option :value="''">Seleccione un modelo</option>
            <option v-for="m in models" :key="m.id" :value="m.id">{{ m.display_name || m.name || m.label || m.id }}</option>
          </select>
        </label>
        <label>
          Campo del numerador
          <select v-model="form.numerator_field" :disabled="!form.numerator_model">
            <option :value="''">Seleccione un campo</option>
            <option v-for="f in numeratorFields" :key="f.key" :value="f.key">{{ f.label || f.key }}</option>
          </select>
        </label>
        <label class="col-2">
          Campo de fechas a evaluar
          <select v-model="form.date_field" :disabled="!form.numerator_model || dateFields.length === 0">
            <option :value="''">Seleccione un campo de fecha</option>
            <option v-for="f in dateFields" :key="f.key" :value="f.key">{{ f.label || f.key }}</option>
          </select>
        </label>
        <label>
          Operación del numerador
          <select v-model="form.numerator_operation" :disabled="!form.numerator_field">
            <option v-for="op in numeratorAllowedOps" :key="op" :value="op">{{ opLabel(op) }}</option>
          </select>
        </label>
      </div>

      <!-- Paso 3: Denominador -->
      <div v-if="step === 3" class="grid">
        <h2 class="section-title">3. Denominador</h2>
        <label>
          Modelo del denominador
          <select v-model="form.denominator_model">
            <option :value="''">Seleccione un modelo</option>
            <option v-for="m in models" :key="m.id" :value="m.id">{{ m.display_name || m.name || m.label || m.id }}</option>
          </select>
        </label>
        <label>
          Campo del denominador
          <select v-model="form.denominator_field" :disabled="!form.denominator_model">
            <option :value="''">Seleccione un campo</option>
            <option v-for="f in denominatorFields" :key="f.key" :value="f.key">{{ f.label || f.key }}</option>
          </select>
        </label>
        <label>
          Operación del denominador
          <select v-model="form.denominator_operation" :disabled="!form.denominator_field">
            <option :value="''">—</option>
            <option v-for="op in denominatorAllowedOps" :key="op" :value="op">{{ opLabel(op) }}</option>
          </select>
        </label>
      </div>

      <!-- Paso 4: Cálculo y período -->
      <div v-if="step === 4" class="grid">
        <h2 class="section-title">4. Parámetros</h2>
        <label>
          Factor de cálculo
          <input v-model.number="form.calculation_factor" type="number" step="0.0001" />
        </label>
        <label>
          Meta (opcional)
          <input v-model.number="form.target_value" type="number" step="0.0001" />
        </label>
        <label>
          Tipo de período
          <select v-model="form.period_type">
            <option value="daily">diario</option>
            <option value="weekly">semanal</option>
            <option value="monthly">mensual</option>
            <option value="quarterly">trimestral</option>
            <option value="yearly">anual</option>
          </select>
        </label>
      </div>

      <!-- Paso 5: Gráfico -->
      <div v-if="step === 5" class="grid">
        <h2 class="section-title">5. Gráfico</h2>
        <label>
          Tipo de gráfico
          <select v-model="form.chart_type">
            <option value="bar">barras</option>
            <option value="line">líneas</option>
            <option value="pie">pastel</option>
            <option value="area">área</option>
            <option value="gauge">indicador</option>
            <option value="funnel">embudo</option>
          </select>
        </label>
        <label class="col-2">
          Esquema del gráfico (JSON)
          <textarea v-model="form.chart_schema" rows="6" placeholder='{"title": {...}, "series": [...]}'></textarea>
        </label>
      </div>

      <div class="wizard-actions">
        <button type="button" class="secondary" :disabled="step === 1" @click="prev">Atrás</button>
        <div class="spacer"></div>
        <button v-if="step < 5" type="button" @click="next" :disabled="!canNext">Siguiente</button>
        <button v-else type="submit" :disabled="saving">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
        <button type="button" class="secondary" @click="cancelar">Cancelar</button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import NavBar from '@/components/common/NavBar.vue'
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createKpi, getKpiModels, getKpiModelFields, getKpiOperations } from '@/services/kpiService'
import { handleApiError as apiErrorToMessage } from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const saving = ref(false)
const error = ref('')
const { success, handleApiError } = useNotifications()
const step = ref(1)
const stepLabels = ['Datos básicos', 'Numerador', 'Denominador', 'Parámetros', 'Gráfico']

// Estado del formulario (debe declararse antes de watchers/computed que lo usen)
const form = reactive({
  name: '',
  code: '',
  description: '',
  unit: '',
  is_active: true,
  numerator_model: '',
  numerator_field: '',
  numerator_operation: 'count',
  denominator_model: '',
  denominator_field: '',
  denominator_operation: '',
  calculation_factor: 1,
  target_value: null,
  date_field: '',
  period_type: 'monthly',
  chart_type: 'bar',
  chart_schema: ''
})

// Listas para selects (modelos, campos, operaciones)
const models = ref([])
const loadingModels = ref(false)
const numeratorFields = ref([])
const denominatorFields = ref([])
const numeratorAllowedOps = ref([])
const denominatorAllowedOps = ref([])
const dateFields = computed(() => numeratorFields.value.filter(f => ['date', 'datetime'].includes(String(f.type).toLowerCase())))

// Reset dependencias al cambiar modelo/campo
watch(() => form.numerator_model, async (modelId) => {
  form.numerator_field = ''
  form.numerator_operation = ''
  form.date_field = ''
  numeratorFields.value = []
  numeratorAllowedOps.value = []
  if (!modelId) return
  try {
    const res = await getKpiModelFields(modelId)
    const payload = res?.data || res
    const fields = Array.isArray(payload?.fields) ? payload.fields : (Array.isArray(payload) ? payload : [])
    numeratorFields.value = fields
  } catch (err) {
    handleApiError(err, 'Error cargando campos del numerador')
  }
})

watch(() => form.numerator_field, async (fieldKey) => {
  form.numerator_operation = ''
  numeratorAllowedOps.value = []
  if (!fieldKey) return
  const field = numeratorFields.value.find(f => (f.name || f.key) === fieldKey)
  const type = field?.type
  if (!type) return
  try {
    const res = await getKpiOperations(type)
    const payload = res?.data || res
    const ops = Array.isArray(payload?.operations) ? payload.operations : (Array.isArray(payload) ? payload : (typeof payload?.operations === 'string' ? payload.operations.split(',') : []))
    numeratorAllowedOps.value = ops
  } catch (err) {
    handleApiError(err, 'Error cargando operaciones del numerador')
  }
})

watch(() => form.denominator_model, async (modelId) => {
  form.denominator_field = ''
  form.denominator_operation = ''
  denominatorFields.value = []
  denominatorAllowedOps.value = []
  if (!modelId) return
  try {
    const res = await getKpiModelFields(modelId)
    const payload = res?.data || res
    const fields = Array.isArray(payload?.fields) ? payload.fields : (Array.isArray(payload) ? payload : [])
    denominatorFields.value = fields
  } catch (err) {
    handleApiError(err, 'Error cargando campos del denominador')
  }
})

watch(() => form.denominator_field, async (fieldKey) => {
  form.denominator_operation = ''
  denominatorAllowedOps.value = []
  if (!fieldKey) return
  const field = denominatorFields.value.find(f => (f.name || f.key) === fieldKey)
  const type = field?.type
  if (!type) return
  try {
    const res = await getKpiOperations(type)
    const payload = res?.data || res
    const ops = Array.isArray(payload?.operations) ? payload.operations : (Array.isArray(payload) ? payload : (typeof payload?.operations === 'string' ? payload.operations.split(',') : []))
    denominatorAllowedOps.value = ops
  } catch (err) {
    handleApiError(err, 'Error cargando operaciones del denominador')
  }
})

// Etiquetas de operaciones
const opLabel = (op) => ({
  count: 'contar', sum: 'suma', avg: 'promedio', min: 'mínimo', max: 'máximo'
}[op] || op)

onMounted(async () => {
  try {
    loadingModels.value = true
    const res = await getKpiModels()
    const data = res?.data || res || []
    models.value = Array.isArray(data) ? data : []
  } catch (err) {
    handleApiError(err, 'Error cargando modelos')
  } finally {
    loadingModels.value = false
  }
})

// (removido: declaración duplicada de form)

const cancelar = () => router.push('/kpis')

const canNext = computed(() => {
  if (step.value === 1) return !!form.name && !!form.code
  return true
})

const next = () => {
  if (!canNext.value) return
  if (step.value < 5) step.value += 1
}

const prev = () => {
  if (step.value > 1) step.value -= 1
}

const onSubmit = async () => {
  saving.value = true
  error.value = ''
  try {
    let payload = { ...form }
    if (typeof payload.chart_schema === 'string' && payload.chart_schema.trim()) {
      try { payload.chart_schema = JSON.parse(payload.chart_schema) } catch { /* mantener como string si no es JSON */ }
    }
    await createKpi(payload)
    success('KPI creado', `El indicador "${form.name}" fue creado correctamente.`)
    router.push('/kpis')
  } catch (err) {
    // Mostrar notificación y setear mensaje local
    handleApiError(err, 'Error al crear KPI')
    error.value = apiErrorToMessage(err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.kpi-create { padding: 24px; }
.form-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; max-width: 960px; margin: 0 auto; box-shadow: 0 4px 14px rgba(0,0,0,0.04); }
.steps { display: flex; gap: 12px; margin: 12px 0 20px; flex-wrap: wrap; max-width: 960px; }
.step { border-radius: 999px; border: 1px solid #cbd5e1; padding: 6px 12px; color: #475569; background: #f8fafc; }
.step.active { background: #1f6feb; color: #fff; border-color: #1f6feb; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.section-title { grid-column: span 2; margin: 4px 0 4px; font-size: 16px; color: #374151; }
.grid .col-2 { grid-column: span 2; }
label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
input, select, textarea, button { font: inherit; }
input, select, textarea { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; }
.wizard-actions { margin-top: 12px; display: flex; gap: 8px; align-items: center; }
.wizard-actions .spacer { flex: 1; }
.secondary { background: transparent; border: 1px solid #9ca3af; color: #374151; padding: 10px 12px; border-radius: 8px; }
button { padding: 10px 12px; border-radius: 8px; border: none; background: #1f6feb; color: #fff; cursor: pointer; }
.error { color: #b91c1c; margin-top: 8px; }
</style>


