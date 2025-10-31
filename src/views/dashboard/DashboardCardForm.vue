<template>
  <form class="form-card" @submit.prevent="onSubmit">
    <div class="grid">
      <label class="col-2">
        Título
        <input v-model="local.title" required maxlength="255" placeholder="Título de la tarjeta" />
      </label>
      <label>
        Modelo
        <select v-model="selectedModelId">
          <option :value="''">Seleccione modelo</option>
          <option v-for="m in models" :key="m.id" :value="m.id">{{ m.display_name || m.name || m.label || m.id }}</option>
        </select>
      </label>
      <label>
        KPI
        <select v-model="local.kpi_id" required>
          <option :value="''">Seleccione KPI</option>
          <option v-for="k in filteredKpis" :key="k.id" :value="k.id">{{ k.name }}</option>
        </select>
      </label>

      <label>
        Posición X
        <input type="number" v-model.number="local.x_position" min="0" />
      </label>
      <label>
        Posición Y
        <input type="number" v-model.number="local.y_position" min="0" />
      </label>
      <label>
        Ancho (w)
        <input type="number" v-model.number="local.width" min="1" />
      </label>
      <label>
        Alto (h)
        <input type="number" v-model.number="local.height" min="1" />
      </label>

      <label>
        Fondo
        <input type="color" v-model="local.background_color" />
      </label>
      <label>
        Color de texto
        <input type="color" v-model="local.text_color" />
      </label>

      <label>
        Orden
        <input type="number" v-model.number="local.order" min="0" />
      </label>

      <h3 class="section-title">Parámetros</h3>
      <label>
        Fecha inicio
        <input type="date" v-model="local.start_date" />
      </label>
      <label>
        Fecha fin
        <input type="date" v-model="local.end_date" />
      </label>
      <label>
        Variable de fecha
        <select v-model="local.date_field" :disabled="dateFieldOptions.length === 0">
          <option :value="''">Sin variable</option>
          <option v-for="f in dateFieldOptions" :key="f.key" :value="f.key">{{ f.label || f.key }}</option>
        </select>
      </label>
      <label>
        Agrupar por
        <select v-model="local.group_by" :disabled="groupByOptions.length === 0">
          <option :value="''">Sin agrupación</option>
          <option v-for="opt in groupByOptions" :key="opt.key" :value="opt.key">{{ opt.label || opt.key }}</option>
        </select>
      </label>
      <label>
        Filtro por
        <select v-model="filterField" :disabled="modelFields.length === 0">
          <option :value="''">Sin filtro</option>
          <option v-for="f in modelFields" :key="f.key || f.name" :value="f.key || f.name">{{ f.label || f.name || f.key }}</option>
        </select>
      </label>
      <label>
        Valor del filtro
        <input v-model="filterValue" :disabled="!filterField" placeholder="valor" />
      </label>
      

      <div class="col-2 preview">
        <KpiChart
          v-if="local.kpi_id"
          :kpi-id="local.kpi_id"
          :params="previewParams"
          :auto-refresh="false"
          :height="280"
          @data-loaded="onPreviewLoaded"
          @chart-updated="onChartUpdated"
        />
        <div v-if="local.kpi_id" class="meta">
          <div class="meta-row"><strong>Descripción:</strong> <span>{{ previewDescription || '—' }}</span></div>
          <div class="meta-row"><strong>Rango:</strong> <span>{{ previewRangeText || '—' }}</span></div>
        </div>
      </div>
    </div>

    <div class="wizard-actions">
      <button type="button" class="secondary" @click="$emit('cancel')">Cancelar</button>
      <div class="spacer"></div>
      <button type="submit">{{ submitLabel }}</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, computed, ref, onMounted } from 'vue'
import KpiChart from '@/components/KpiChart.vue'
import { getKpiModels, getKpis, getKpiModelFields } from '@/services/kpiService'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  kpis: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'chart-schema-updated'])

const local = reactive({
  id: undefined,
  dashboard_id: undefined,
  kpi_id: '',
  title: '',
  x_position: 0,
  y_position: 0,
  width: 4,
  height: 6,
  background_color: '#ffffff',
  text_color: '#111827',
  period_type: 'monthly',
  start_date: '',
  end_date: '',
  date_field: '',
  group_by: '',
  order: 0,
  filters: {}
})

const models = ref([])
const selectedModelId = ref('')

const allKpis = ref([])
const groupByOptions = ref([])
const modelFields = ref([])
const filterField = ref('')
const filterValue = ref('')
const dateFieldOptions = computed(() => {
  return (modelFields.value || [])
    .filter(f => ['date', 'datetime'].includes(String(f.type || '').toLowerCase()))
    .map(f => ({ key: f.key || f.name, label: f.label || f.name || f.key }))
})

const filteredKpis = computed(() => allKpis.value)

onMounted(async () => {
  try {
    const res = await getKpiModels()
    const data = res?.data || res || []
    models.value = Array.isArray(data) ? data : []
  } catch (e) {
    models.value = []
  }
  try {
    // Usar KPIs provistos; si no hay, cargar del API
    if (Array.isArray(props.kpis) && props.kpis.length > 0) {
      allKpis.value = props.kpis
    } else {
      const r = await getKpis({ per_page: 1000 })
      const arr = Array.isArray(r?.data) ? r.data : (Array.isArray(r?.data?.data) ? r.data.data : (Array.isArray(r) ? r : []))
      allKpis.value = arr
    }
    // Si ya tenemos un kpi_id, intentar seleccionar el modelo y cargar campos ahora que los KPIs están cargados
    if (local.kpi_id && allKpis.value.length > 0) {
      const k = allKpis.value.find(x => String(x.id) === String(local.kpi_id))
      if (k && k.numerator_model) {
        selectedModelId.value = String(k.numerator_model)
        // Cargar campos del modelo
        await loadModelFields(k.numerator_model)
      }
    }
  } catch (e) {
    allKpis.value = []
  }
})

// Si los KPIs se cargan después y ya tenemos un kpi_id, seleccionar el modelo y cargar campos
watch(allKpis, (kpis) => {
  if (kpis.length > 0 && local.kpi_id) {
    const k = kpis.find(x => String(x.id) === String(local.kpi_id))
    if (k && k.numerator_model) {
      selectedModelId.value = String(k.numerator_model)
      // Cargar campos si aún no están cargados
      if (modelFields.value.length === 0) {
        loadModelFields(k.numerator_model)
      }
    }
  }
}, { immediate: true })

// Si el KPI actual no pertenece al modelo seleccionado, lo reseteamos
watch(selectedModelId, () => {
  const match = filteredKpis.value.some(k => String(k.id) === String(local.kpi_id))
  if (!match && selectedModelId.value) local.kpi_id = ''
})

watch(() => props.modelValue, (v) => {
  const val = v || {}
  Object.assign(local, {
    id: val.id,
    dashboard_id: val.dashboard_id,
    kpi_id: val.kpi_id || '',
    title: val.title || '',
    x_position: (val.x_position ?? val.position_x) ?? 0,
    y_position: (val.y_position ?? val.position_y) ?? 0,
    width: val.width ?? 4,
    height: val.height ?? 6,
    background_color: val.background_color || '#ffffff',
    text_color: val.text_color || '#111827',
    period_type: val.period_type || 'monthly',
    start_date: val.start_date || '',
    end_date: val.end_date || '',
    date_field: val.date_field || '',
    group_by: val.group_by || '',
    order: val.order ?? 0,
    filters: val.filters || {}
  })
  
  // Inicializar filtros si vienen en el modelo
  if (val.filters && typeof val.filters === 'object') {
    const filterKeys = Object.keys(val.filters)
    if (filterKeys.length > 0) {
      filterField.value = filterKeys[0]
      filterValue.value = val.filters[filterKeys[0]]
    } else {
      filterField.value = ''
      filterValue.value = ''
    }
  } else {
    filterField.value = ''
    filterValue.value = ''
  }
  
  // Si viene kpi_id, intentar inferir el modelo para prefiltrar y cargar campos
  if (local.kpi_id && allKpis.value.length > 0) {
    // Buscar en allKpis (array completo cargado) en lugar de props.kpis
    const k = allKpis.value.find(x => String(x.id) === String(local.kpi_id))
    if (k && k.numerator_model) {
      selectedModelId.value = String(k.numerator_model)
      // Cargar campos del modelo
      loadModelFields(k.numerator_model)
    }
  }
}, { immediate: true, deep: true })

watch(local, () => emit('update:modelValue', { ...local }), { deep: true })

// Función reutilizable para cargar campos del modelo (definida antes de los watchers)
async function loadModelFields(modelId) {
  if (!modelId) {
    modelFields.value = []
    groupByOptions.value = []
    return
  }
  try {
    const res = await getKpiModelFields(modelId)
    const payload = res?.data || res
    const fields = Array.isArray(payload?.fields) ? payload.fields : (Array.isArray(payload) ? payload : [])
    modelFields.value = fields
    // Campos aplicables para agrupar: exponer todos por ahora
    groupByOptions.value = fields.map(f => ({ key: f.key || f.name, label: f.label || f.name || f.key }))
    // reset si el actual no existe
    if (!groupByOptions.value.some(o => o.key === local.group_by)) {
      local.group_by = ''
    }
    // reset date_field si el actual ya no aplica
    const hasDate = dateFieldOptions.value.some(o => o.key === local.date_field)
    if (!hasDate) local.date_field = ''
  } catch (e) {
    modelFields.value = []
    groupByOptions.value = []
    local.group_by = ''
    local.date_field = ''
  }
}

const previewParams = computed(() => {
  const filters = filterField.value && filterValue.value ? { [filterField.value]: filterValue.value } : undefined
  return {
    period_type: local.period_type,
    start_date: local.start_date || undefined,
    end_date: local.end_date || undefined,
    date_field: local.date_field || undefined,
    group_by: local.group_by || undefined,
    filters
  }
})

const submitLabel = computed(() => local.id ? 'Guardar cambios' : 'Crear')

const onSubmit = () => {
  // Incluir los filtros en el payload
  const payload = { ...local }
  if (filterField.value && filterValue.value) {
    payload.filters = { [filterField.value]: filterValue.value }
  }
  // Incluir el chart_schema actual si está disponible
  if (currentChartSchema.value) {
    payload.chart_schema = currentChartSchema.value
  }
  emit('submit', payload)
}

// Cargar opciones de agrupación basado en KPI seleccionado (modelo del numerador)
watch(() => local.kpi_id, async (kpiId) => {
  if (!kpiId) { 
    local.group_by = ''
    modelFields.value = []
    groupByOptions.value = []
    return 
  }
  const k = (allKpis.value || []).find(x => String(x.id) === String(kpiId))
  // Sincronizar period_type con el KPI seleccionado
  if (k && k.period_type) {
    local.period_type = k.period_type
  }
  const modelId = k?.numerator_model
  if (!modelId) { 
    local.group_by = ''
    modelFields.value = []
    groupByOptions.value = []
    return 
  }
  await loadModelFields(modelId)
})

// Metadatos de previsualización (description, range)
const previewDescription = ref('')
const previewRange = ref(null)
const previewRangeText = computed(() => {
  const r = previewRange.value
  if (!r) return ''
  if (typeof r === 'string') return r
  const start = r.start || r.from
  const end = r.end || r.to
  return [start, end].filter(Boolean).join(' → ')
})

// Chart schema actual del gráfico
const currentChartSchema = ref(null)

function onPreviewLoaded(data) {
  const d = data || {}
  if (d.description) previewDescription.value = d.description
  if (d.range) previewRange.value = d.range
}

function onChartUpdated(chartOption) {
  // Capturar el chartOption cuando se actualiza el gráfico
  currentChartSchema.value = chartOption
  // Emitir el evento para que el componente padre pueda capturarlo
  emit('chart-schema-updated', chartOption)
}
</script>

<style scoped>
.form-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.grid .section-title { grid-column: span 2; margin: 0 0 6px; font-size: 16px; color: #374151; }
.col-2 { grid-column: span 2; }
label { 
  display: flex !important; 
  flex-direction: column !important; 
  gap: 6px; 
  font-size: 14px; 
  color: #374151;
}
label > *:first-child {
  font-weight: 500;
}
input, select, textarea, button { font: inherit; }
input, select, textarea { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; }
.wizard-actions { margin-top: 12px; display: flex; gap: 8px; align-items: center; }
.wizard-actions .spacer { flex: 1; }
.secondary { background: transparent; border: 1px solid #9ca3af; color: #374151; padding: 10px 12px; border-radius: 8px; }
button { padding: 10px 12px; border-radius: 8px; border: none; background: #1f6feb; color: #fff; cursor: pointer; }
.preview { margin-top: 8px; }
</style>


