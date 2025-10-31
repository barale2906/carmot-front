<template>
  <div class="kpi-chart">
    <div v-if="loading" class="kpi-chart__state">Cargando…</div>
    <div v-else-if="error" class="kpi-chart__state error">{{ error }}</div>
    <v-chart v-else :option="chartOption" :style="{ width: '100%', height: chartHeight, display: 'block' }" />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { computeKpi as apiComputeKpi, computeDashboardCard as apiComputeDashboardCard } from '@/services/kpiService'

const props = defineProps({
  kpiId: { type: [Number, String], required: false },
  cardId: { type: [Number, String], required: false },
  params: { type: Object, default: () => ({}) },
  autoRefresh: { type: Boolean, default: false },
  refreshInterval: { type: Number, default: 30000 },
  height: { type: [Number, String], default: 360 }
})

const emit = defineEmits(['data-loaded', 'error', 'chart-updated'])

const loading = ref(false)
const error = ref('')
const chartData = ref(null)
let timer = null

const chartHeight = computed(() => typeof props.height === 'number' ? `${props.height}px` : String(props.height))

const chartOption = computed(() => {
  if (!chartData.value || !chartData.value.chart) return {}
  return chartData.value.chart
})

async function load() {
  if (!props.kpiId && !props.cardId) return
  loading.value = true
  error.value = ''
  try {
    const res = props.cardId
      ? await apiComputeDashboardCard(props.cardId, props.params || {})
      : await apiComputeKpi(props.kpiId, props.params || {})
    const data = res?.data || res
    chartData.value = data
    emit('data-loaded', data)
    // Emitir el chartOption cuando se actualiza el gráfico
    if (data && data.chart) {
      emit('chart-updated', data.chart)
    }
  } catch (e) {
    const message = e?.message || 'No fue posible cargar el KPI'
    error.value = message
    emit('error', e)
  } finally {
    loading.value = false
  }
}

function startAuto() {
  stopAuto()
  if (!props.autoRefresh) return
  timer = setInterval(load, Math.max(5000, Number(props.refreshInterval) || 30000))
}

function stopAuto() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(() => props.kpiId, () => load(), { immediate: true })
watch(() => props.cardId, () => load(), { immediate: true })
watch(() => props.params, () => load(), { deep: true })
watch(() => props.autoRefresh, (val) => { if (val) startAuto(); else stopAuto() })

onMounted(() => { if (props.autoRefresh) startAuto() })
onBeforeUnmount(stopAuto)
</script>

<style scoped>
.kpi-chart__state { color: #64748b; font-size: 14px; padding: 8px 0; }
.kpi-chart__state.error { color: #b91c1c; }
</style>


