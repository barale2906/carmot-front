<template>
  <div class="dashboard-detail">
    <NavBar />

    <div class="header">
      <div>
        <h1>{{ dashboard?.name || 'Dashboard' }}</h1>
        <div class="sub">Tipo: {{ (dashboard?.scope || 'general') }} · Default: {{ dashboard?.is_default ? 'Sí' : 'No' }}</div>
      </div>
      <div class="actions">
        <button class="secondary" @click="goBack">Volver</button>
        <button @click="goCreate">Nueva Tarjeta</button>
      </div>
    </div>

    <div v-if="loading" class="hint">Cargando…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="cards-grid">
        <div
          v-for="c in orderedCards"
          :key="c.id"
          class="card"
        >
          <div class="card" :style="cardStyle(c)">
            <div class="card-header">
              <div class="card-title">{{ c.title || kpiName(c.kpi_id) }}</div>
              <div class="card-actions">
                <button class="small" @click="toggleEdit(c)">{{ editingId === c.id ? 'Cerrar' : 'Agrupar/Editar' }}</button>
                <button class="small danger" @click="askDelete(c)">Eliminar</button>
              </div>
            </div>
            <div class="card-body">
              <KpiChart
                :card-id="c.id"
                :params="{ period_type: c.period_type }"
                :auto-refresh="false"
                :height="240"
              />
              <DashboardCardForm
                v-if="editingId === c.id"
                :key="`card-form-${c.id}-${editingId}`"
                v-model="editModel"
                :kpis="kpis"
                class="inline-form"
                @submit="saveInline"
                @cancel="toggleEdit(c)"
                @chart-schema-updated="onChartSchemaUpdated"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmación eliminar -->
    <div v-if="showConfirm" class="modal-overlay" @click.self="closeConfirm">
      <div class="modal">
        <h3>Eliminar Tarjeta</h3>
        <p>¿Seguro que deseas eliminar la tarjeta {{ toDelete?.id }}?</p>
        <div class="modal-actions">
          <button class="secondary" @click="closeConfirm">Cancelar</button>
          <button class="danger" @click="confirmDelete" :disabled="deleting">{{ deleting ? 'Eliminando…' : 'Eliminar' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/common/NavBar.vue'
import { ref, computed, onMounted, nextTick } from 'vue'
import KpiChart from '@/components/KpiChart.vue'
import DashboardCardForm from './DashboardCardForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { getDashboard, getDashboardCards, createDashboardCard, updateDashboardCard, deleteDashboardCard, getKpis, updateKpi } from '@/services/kpiService'
import { useNotifications } from '@/composables/useNotifications'
import { handleApiError as apiErrorToMessage } from '@/services/api'

const route = useRoute()
const router = useRouter()
const { success, handleApiError } = useNotifications()

const id = computed(() => route.params.id)

const dashboard = ref(null)
const cards = ref([])
const kpis = ref([])
const loading = ref(true)
const error = ref('')

const toDelete = ref(null)
const showConfirm = ref(false)
const deleting = ref(false)

const goBack = () => router.push({ name: 'Dashboards' })
const goCreate = () => router.push({ name: 'DashboardCardCreate', params: { id: id.value } })
const openEdit = (c) => router.push({ name: 'DashboardCardEdit', params: { dashboardId: id.value, cardId: c.id } })
const editingId = ref(null)
const editModel = ref({})
const currentChartSchema = ref(null)
async function toggleEdit(c) {
  if (editingId.value === c.id) {
    editingId.value = null
    editModel.value = {}
    currentChartSchema.value = null
  } else {
    // Cerrar primero si había otra abierta
    if (editingId.value) {
      editingId.value = null
      editModel.value = {}
      currentChartSchema.value = null
      await nextTick()
    }
    // Luego abrir la nueva
    editingId.value = c.id
    editModel.value = { ...c }
    currentChartSchema.value = null
  }
}

function onChartSchemaUpdated(chartOption) {
  // Capturar el chart_schema cuando se actualiza el gráfico en el formulario
  currentChartSchema.value = chartOption
}
async function saveInline(payload) {
  try {
    // 1. Construir título dinámico según parámetros seleccionados (solo al guardar)
    const titleSegments = []
    if (payload.start_date || payload.end_date) {
      titleSegments.push(`Rango: ${payload.start_date || '—'} - ${payload.end_date || '—'};`)
    }
    if (payload.date_field) {
      titleSegments.push(`Campo fecha: ${payload.date_field};`)
    }
    if (payload.group_by) {
      titleSegments.push(`Agrupa: ${payload.group_by};`)
    }
    if (payload.filters && typeof payload.filters === 'object') {
      const keys = Object.keys(payload.filters)
      if (keys.length > 0) {
        const kf = keys[0]
        const vf = payload.filters[kf]
        titleSegments.push(`Filtro: ${kf}: ${vf};`)
      }
    }
    const computedTitle = titleSegments.length > 0 ? titleSegments.join(' ') : payload.title

    // 2. Actualizar el DashboardCard con los mismos campos que se usan al crear
    const k = (kpis.value || []).find(x => String(x.id) === String(payload.kpi_id))
    const submit = {
      dashboard_id: id.value,
      kpi_id: payload.kpi_id,
      title: computedTitle,
      period_type: payload.period_type,
      background_color: payload.background_color,
      text_color: payload.text_color,
      width: payload.width,
      height: payload.height,
      x_position: payload.x_position ?? payload.position_x ?? 0,
      y_position: payload.y_position ?? payload.position_y ?? 0,
      order: payload.order ?? 0,
      // Adjuntar esquema de gráfico del KPI (si existe)
      chart_schema: k && k.chart_schema ? k.chart_schema : undefined
    }
    await updateDashboardCard(editingId.value, submit)

    // 3. Actualizar el KPI con el chart_schema si está disponible
    // Usar el chart_schema del payload o del estado actual
    const chartSchemaToUse = payload.chart_schema || currentChartSchema.value
    
    if (payload.kpi_id && chartSchemaToUse) {
      try {
        // Convertir el chartOption a JSON string si es un objeto
        let chartSchemaValue
        if (typeof chartSchemaToUse === 'string') {
          // Ya es un string, intentar parsearlo para validar
          try {
            JSON.parse(chartSchemaToUse)
            chartSchemaValue = chartSchemaToUse
          } catch (e) {
            chartSchemaValue = JSON.stringify(chartSchemaToUse, null, 2)
          }
        } else {
          // Es un objeto, convertir a JSON string
          // Usar replacer para omitir funciones y valores no serializables
          chartSchemaValue = JSON.stringify(chartSchemaToUse, (key, value) => {
            // Omitir funciones
            if (typeof value === 'function') {
              return undefined
            }
            // Omitir símbolos
            if (typeof value === 'symbol') {
              return undefined
            }
            return value
          }, 2)
        }
        
        // Validar que el JSON es válido antes de enviar
        try {
          JSON.parse(chartSchemaValue)
        } catch (parseErr) {
          throw new Error('El chart_schema generado no es un JSON válido: ' + parseErr.message)
        }
        
        await updateKpi(payload.kpi_id, {
          chart_schema: chartSchemaValue
        })
      } catch (kpiErr) {
        // Si falla la actualización del KPI, mostrar error pero continuar
        handleApiError(kpiErr, 'Error al actualizar chart_schema del KPI')
      }
    }

    success('Tarjeta actualizada', 'La tarjeta fue actualizada correctamente')
    editingId.value = null
    editModel.value = {}
    currentChartSchema.value = null
    await loadAll()
  } catch (err) {
    handleApiError(err, 'Error al actualizar tarjeta')
  }
}

const askDelete = (c) => { toDelete.value = c; showConfirm.value = true }
const closeConfirm = () => { toDelete.value = null; showConfirm.value = false }

const kpiName = (kpiId) => {
  const k = (kpis.value || []).find(x => String(x.id) === String(kpiId))
  return k?.name || kpiId
}

async function loadAll() {
  loading.value = true
  error.value = ''
  try {
    const [d, list, kp] = await Promise.all([
      getDashboard(id.value),
      getDashboardCards(id.value),
      getKpis({ per_page: 1000 })
    ])
    dashboard.value = d?.data || d || null
    const rawCards = list?.data || list || []
    cards.value = Array.isArray(rawCards) ? rawCards : []
    // Asegurar extracción correcta del array de KPIs
    // Normalizar KPIs desde varias estructuras comunes
    let rawKpis = []
    const source = kp
    if (Array.isArray(source)) rawKpis = source
    else if (Array.isArray(source?.data)) rawKpis = source.data
    else if (Array.isArray(source?.items)) rawKpis = source.items
    else if (Array.isArray(source?.results)) rawKpis = source.results
    else if (Array.isArray(source?.rows)) rawKpis = source.rows
    kpis.value = rawKpis
  } catch (err) {
    handleApiError(err, 'Error al cargar Dashboard')
    error.value = apiErrorToMessage(err)
  } finally {
    loading.value = false
  }
}

async function confirmDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await deleteDashboardCard(toDelete.value.id)
    success('Tarjeta eliminada', `Tarjeta ${toDelete.value.id} eliminada`)
    await loadAll()
    closeConfirm()
  } catch (err) {
    handleApiError(err, 'Error al eliminar tarjeta')
  } finally {
    deleting.value = false
  }
}

onMounted(loadAll)

// Orden de render basado en 'order' y luego por id
const orderedCards = computed(() => {
  return [...(cards.value || [])].sort((a, b) => {
    const ao = a.order ?? 0, bo = b.order ?? 0
    if (ao !== bo) return ao - bo
    return (a.id || 0) - (b.id || 0)
  })
})

function coerceNum(primary, fallback, def) {
  const n = Number(primary ?? fallback)
  return Number.isFinite(n) ? n : def
}

// Estilo visual de la tarjeta (colores)
function cardStyle(card) {
  const bg = card.background_color || '#ffffff'
  const color = card.text_color || '#111827'
  return { background: bg, color }
}

// Posicionamiento CSS Grid (no draggable por compatibilidad con Vue 3)
function gridItemStyle(card) {
  const x = coerceNum(card.x_position, card.position_x, 0)
  const y = coerceNum(card.y_position, card.position_y, 0)
  const w = coerceNum(card.width, null, 4)
  const h = coerceNum(card.height, null, 6)
  return {
    gridColumn: `${x + 1} / span ${w}`,
    gridRow: `${y + 1} / span ${h}`
  }
}
</script>

<style scoped>
.dashboard-detail { padding: 24px; }
.header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; gap: 12px; }
.sub { color: #6b7280; font-size: 13px; }
.actions { display: flex; gap: 8px; }
.hint { color: #6b7280; }
.error { color: #b91c1c; margin-bottom: 8px; }
.actions .danger { color: #b91c1c; }
button { padding: 8px 10px; border-radius: 6px; border: none; background: #1f6feb; color: #fff; cursor: pointer; }
button.secondary { background: transparent; border: 1px solid #9ca3af; color: #374151; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 16px; width: 100%; max-width: 640px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }

/* Grid de tarjetas: 12 columnas, alto de fila 60px (h=1 equivale a 60px) */
.cards-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  width: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: rgba(0,0,0,0.03);
}
.card-title { font-weight: 600; font-size: 14px; }
.card-actions { display: flex; gap: 6px; }
button.small { padding: 6px 8px; font-size: 12px; }
.card-body { padding: 6px; width: 100%; }
.card-body > * { width: 100%; }
.inline-form { margin-top: 10px; }
</style>


