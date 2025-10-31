<template>
  <div class="dashboards-view">
    <NavBar />
    <h1>Dashboards</h1>

    <div class="toolbar top">
      <button @click="refresh">Refrescar</button>
      <button @click="goCreate">Nuevo Dashboard</button>
    </div>

    <div v-if="loading" class="hint">Cargando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Scope</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in dashboards" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.scope || 'general' }}</td>
          <td class="actions">
            <button @click="goDetail(item.id)">Ver</button>
            <button @click="goEdit(item.id)">Editar</button>
            <button class="danger" @click="askDelete(item)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showConfirm" class="modal-overlay" @click.self="closeConfirm">
      <div class="modal">
        <h3>Eliminar Dashboard</h3>
        <p>¿Seguro que deseas eliminar "{{ toDelete?.name }}"?</p>
        <div class="modal-actions">
          <button class="secondary" @click="closeConfirm">Cancelar</button>
          <button class="danger" @click="confirmDelete" :disabled="deleting">{{ deleting ? 'Eliminando...' : 'Eliminar' }}</button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import NavBar from '@/components/common/NavBar.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDashboards, deleteDashboard } from '@/services/kpiService'
import { handleApiError as apiErrorToMessage } from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { success, handleApiError } = useNotifications()

const dashboards = ref([])
const loading = ref(false)
const error = ref('')

const refresh = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await getDashboards()
    dashboards.value = Array.isArray(data?.data) ? data.data : (data || [])
  } catch (err) {
    handleApiError(err, 'Error al cargar Dashboards')
    error.value = apiErrorToMessage(err)
  } finally {
    loading.value = false
  }
}

const goCreate = () => router.push({ name: 'DashboardCreate' })
const goEdit = (id) => router.push({ name: 'DashboardEdit', params: { id } })
const goDetail = (id) => router.push({ name: 'DashboardDetail', params: { id } })

const showConfirm = ref(false)
const toDelete = ref(null)
const deleting = ref(false)

const askDelete = (item) => { toDelete.value = item; showConfirm.value = true }
const closeConfirm = () => { showConfirm.value = false; toDelete.value = null }

const confirmDelete = async () => {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await deleteDashboard(toDelete.value.id)
    success('Dashboard eliminado', `"${toDelete.value.name}" fue eliminado.`)
    await refresh()
    closeConfirm()
  } catch (err) {
    handleApiError(err, 'Error al eliminar Dashboard')
    error.value = apiErrorToMessage(err)
  } finally {
    deleting.value = false
  }
}

onMounted(refresh)
</script>

<style scoped>
.dashboards-view { padding: 24px; }
.toolbar { display: flex; gap: 8px; margin: 12px 0; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { border-bottom: 1px solid #e5e7eb; padding: 8px; text-align: left; }
.actions { display: flex; gap: 6px; }
.danger { color: #b91c1c; }
.hint { color: #6b7280; }
.error { color: #b91c1c; margin-bottom: 8px; }
button { padding: 8px 10px; border-radius: 6px; border: none; background: #1f6feb; color: #fff; cursor: pointer; }
button.secondary { background: transparent; border: 1px solid #9ca3af; color: #374151; }
button:disabled { opacity: .6; cursor: default; }

/* Modal simple */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 16px; width: 100%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }
</style>


