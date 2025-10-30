<template>
  <div class="kpis-view">
    <NavBar />
    <h1>KPIs</h1>
    <div class="toolbar top">
      <button @click="refresh">Refrescar</button>
      <button @click="goCreate">Nuevo KPI</button>
    </div>
    <div v-if="loading" class="hint">Cargando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Código</th>
          <th>Unidad</th>
          <th>Activo</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in kpis" :key="item.id">
          <td>
            <router-link :to="{ name: 'KpiDetail', params: { id: item.id } }">{{ item.name }}</router-link>
          </td>
          <td>{{ item.code }}</td>
          <td>{{ item.unit }}</td>
          <td>{{ item.is_active ? 'Sí' : 'No' }}</td>
          <td class="actions">
            <button class="danger" @click="askDelete(item)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showConfirm" class="modal-overlay" @click.self="closeConfirm">
      <div class="modal">
        <h3>Eliminar KPI</h3>
        <p>¿Seguro que deseas eliminar el indicador "{{ toDelete?.name }}"?</p>
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
import { getKpis, deleteKpi } from '@/services/kpiService'
import { handleApiError as apiErrorToMessage } from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { success, handleApiError } = useNotifications()
const kpis = ref([])
const loading = ref(false)
const error = ref('')

const refresh = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await getKpis()
    kpis.value = Array.isArray(data?.data) ? data.data : (data || [])
  } catch (err) {
    handleApiError(err, 'Error al cargar KPIs')
    error.value = apiErrorToMessage(err)
  } finally {
    loading.value = false
  }
}

const goCreate = () => router.push('/kpis/new')

const showConfirm = ref(false)
const toDelete = ref(null)
const deleting = ref(false)

const askDelete = (item) => {
  toDelete.value = item
  showConfirm.value = true
}

const closeConfirm = () => {
  showConfirm.value = false
  toDelete.value = null
}

const confirmDelete = async () => {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await deleteKpi(toDelete.value.id)
    success('KPI eliminado', `El indicador "${toDelete.value.name}" fue eliminado.`)
    await refresh()
    closeConfirm()
  } catch (err) {
    handleApiError(err, 'Error al eliminar KPI')
    error.value = apiErrorToMessage(err)
  } finally {
    deleting.value = false
  }
}

onMounted(refresh)
</script>

<style scoped>
.kpis-view { padding: 24px; }
.toolbar { display: flex; gap: 8px; margin: 12px 0; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { border-bottom: 1px solid #e5e7eb; padding: 8px; text-align: left; }
.actions { display: flex; gap: 6px; }
.danger { color: #b91c1c; }
.hint { color: #6b7280; }
.error { color: #b91c1c; margin-bottom: 8px; }
button { padding: 8px 10px; border-radius: 6px; border: none; background: #1f6feb; color: #fff; cursor: pointer; }
button:disabled { opacity: .6; cursor: default; }

/* Modal simple */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 16px; width: 100%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }
</style>


