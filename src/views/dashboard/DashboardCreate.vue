<template>
  <div class="dashboard-create">
    <NavBar />
    <h1>Nuevo Dashboard</h1>
    <DashboardForm v-model="form" mode="create" @submit="handleSubmit" @cancel="goBack" />
  </div>
</template>

<script setup>
import NavBar from '@/components/common/NavBar.vue'
import DashboardForm from './DashboardForm.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createDashboard } from '@/services/kpiService'
import { useNotifications } from '@/composables/useNotifications'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const { success, handleApiError } = useNotifications()

const form = ref({ name: '', scope: 'general', is_default: true })

const goBack = () => router.push({ name: 'Dashboards' })

const handleSubmit = async (payload) => {
  try {
    const userId = auth?.user?.id || auth?.user?.user_id || null
    const submitPayload = userId ? { ...payload, user_id: userId } : { ...payload }
    await createDashboard(submitPayload)
    success('Dashboard creado', `"${payload.name}" fue creado correctamente.`)
    goBack()
  } catch (err) {
    handleApiError(err, 'Error al crear Dashboard')
    throw err
  }
}
</script>

<style scoped>
.dashboard-create { padding: 24px; }
</style>


