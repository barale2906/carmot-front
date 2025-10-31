<template>
  <div class="dashboard-edit">
    <NavBar />
    <h1>Editar Dashboard</h1>
    <div v-if="loading" class="hint">Cargando…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <DashboardForm v-else v-model="form" mode="edit" @submit="handleSubmit" @cancel="goBack" />
  </div>
</template>

<script setup>
import NavBar from '@/components/common/NavBar.vue'
import DashboardForm from './DashboardForm.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getDashboard, updateDashboard } from '@/services/kpiService'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const route = useRoute()
const { success, handleApiError } = useNotifications()

const id = computed(() => route.params.id)
const loading = ref(true)
const error = ref('')
const form = ref({ name: '', scope: 'general', is_default: true })

const goBack = () => router.push({ name: 'Dashboards' })

onMounted(async () => {
  try {
    const res = await getDashboard(id.value)
    const data = res?.data || res || {}
    form.value = {
      name: data.name || '',
      scope: data.scope || 'general',
      is_default: typeof data.is_default === 'boolean' ? data.is_default : ((data.scope || 'general') === 'general')
    }
  } catch (err) {
    handleApiError(err, 'Error al cargar Dashboard')
    error.value = err?.message || 'Error'
  } finally {
    loading.value = false
  }
})

const handleSubmit = async (payload) => {
  try {
    await updateDashboard(id.value, payload)
    success('Dashboard actualizado', `"${payload.name}" fue actualizado.`)
    goBack()
  } catch (err) {
    handleApiError(err, 'Error al actualizar Dashboard')
    throw err
  }
}
</script>

<style scoped>
.dashboard-edit { padding: 24px; }
.hint { color: #6b7280; }
.error { color: #b91c1c; margin-bottom: 8px; }
</style>


