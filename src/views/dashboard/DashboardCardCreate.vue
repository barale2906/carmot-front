<template>
  <div class="dashboard-card-create">
    <NavBar />
    <h1>Nueva Tarjeta</h1>
    <div v-if="loading" class="hint">Cargando…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <DashboardCardForm v-else v-model="form" :kpis="kpis" @submit="handleSubmit" @cancel="goBack" />
  </div>
</template>

<script setup>
import NavBar from '@/components/common/NavBar.vue'
import DashboardCardForm from './DashboardCardForm.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDashboard, getKpis, createDashboardCard } from '@/services/kpiService'
import { useNotifications } from '@/composables/useNotifications'
import { handleApiError as apiErrorToMessage } from '@/services/api'

const route = useRoute()
const router = useRouter()
const { success, handleApiError } = useNotifications()

const dashboardId = computed(() => route.params.id)
const loading = ref(true)
const error = ref('')
const kpis = ref([])
const form = ref({ dashboard_id: dashboardId.value })

const goBack = () => router.push({ name: 'DashboardDetail', params: { id: dashboardId.value } })

onMounted(async () => {
  try {
    await getDashboard(dashboardId.value) // valida que existe
    const kp = await getKpis({ per_page: 1000 })
    const arr = Array.isArray(kp?.data) ? kp.data : (Array.isArray(kp?.data?.data) ? kp.data.data : (Array.isArray(kp) ? kp : []))
    kpis.value = arr
  } catch (err) {
    handleApiError(err, 'Error cargando datos')
    error.value = apiErrorToMessage(err)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async (payload) => {
  try {
    const k = (kpis.value || []).find(x => String(x.id) === String(payload.kpi_id))
    const submit = {
      dashboard_id: dashboardId.value,
      kpi_id: payload.kpi_id,
      title: payload.title,
      period_type: payload.period_type,
      background_color: payload.background_color,
      text_color: payload.text_color,
      width: payload.width,
      height: payload.height,
      x_position: payload.x_position,
      y_position: payload.y_position,
      order: payload.order,
      // Adjuntar esquema de gráfico del KPI (si existe)
      chart_schema: k && k.chart_schema ? k.chart_schema : undefined
    }
    await createDashboardCard(submit)
    success('Tarjeta creada', 'La tarjeta fue creada correctamente')
    goBack()
  } catch (err) {
    handleApiError(err, 'Error al crear tarjeta')
    throw err
  }
}
</script>

<style scoped>
.dashboard-card-create { padding: 24px; }
.hint { color: #6b7280; }
.error { color: #b91c1c; margin-bottom: 8px; }
</style>


