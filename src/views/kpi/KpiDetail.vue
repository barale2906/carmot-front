<template>
  <div class="kpi-detail">
    <NavBar />
    <div class="header">
      <h1>{{ kpiTitle }}</h1>
      <div class="actions">
        <button class="secondary" @click="goBack">Volver</button>
      </div>
    </div>

    <div v-if="loadingInfo" class="hint">Cargando…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="content">
      <div class="meta">
        <div class="meta-item"><strong>Descripción:</strong> <span>{{ metaDescription || '—' }}</span></div>
        <div class="meta-item"><strong>Rango:</strong> <span>{{ metaRangeText || '—' }}</span></div>
      </div>

      <div class="chart">
        <KpiChart :kpi-id="kpiId" :params="params" :auto-refresh="false" :height="420" @data-loaded="onDataLoaded" />
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/common/NavBar.vue'
import KpiChart from '@/components/KpiChart.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getKpi } from '@/services/kpiService'

const route = useRoute()
const router = useRouter()

const kpiId = computed(() => route.params.id)
const kpiTitle = ref('Indicador')
const loadingInfo = ref(true)
const error = ref('')

// Metadatos devueltos por compute
const metaDescription = ref('')
const metaRange = ref(null)
const metaRangeText = computed(() => {
  const r = metaRange.value
  if (!r) return ''
  if (typeof r === 'string') return r
  const { start, end } = r || {}
  if (!start && !end) return ''
  return [start, end].filter(Boolean).join(' → ')
})

// En esta vista mostramos el KPI con los parámetros por defecto (periodo mensual, sin filtros)
const params = ref({ period_type: 'monthly' })

function onDataLoaded(data) {
  // Guardamos metadatos útiles que entrega el endpoint de compute
  // description puede venir del KPI o del resultado; priorizamos el del resultado si existe
  const d = data || {}
  metaDescription.value = d.description || metaDescription.value
  metaRange.value = d.range || null
}

const goBack = () => router.push('/kpis')

onMounted(async () => {
  try {
    const res = await getKpi(kpiId.value)
    const payload = res?.data || res
    if (payload?.name) kpiTitle.value = payload.name
    if (payload?.description) metaDescription.value = payload.description
  } catch (e) {
    error.value = e?.message || 'No fue posible cargar el KPI'
  } finally {
    loadingInfo.value = false
  }
})
</script>

<style scoped>
.kpi-detail { padding: 24px; }
.header { display: flex; align-items: center; gap: 12px; justify-content: space-between; margin-bottom: 12px; }
.actions { display: flex; gap: 8px; }
.hint { color: #6b7280; }
.error { color: #b91c1c; margin-bottom: 8px; }
.meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0 16px; }
.meta-item { font-size: 14px; color: #374151; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; }
.chart { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.04); }
.secondary { background: transparent; border: 1px solid #9ca3af; color: #374151; padding: 10px 12px; border-radius: 8px; }
</style>


