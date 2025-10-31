<template>
  <form class="form-card" @submit.prevent="onSubmit">
    <div class="grid">
      <h2 class="section-title">{{ title }}</h2>
      <label>
        Nombre
        <input v-model="local.name" required />
      </label>
      <label>
        Tipo de Dashboard
        <select v-model="local.scope">
          <option value="general">general</option>
          <option value="private">privado</option>
        </select>
      </label>
    </div>

    <div class="wizard-actions">
      <button type="button" class="secondary" @click="$emit('cancel')">Cancelar</button>
      <div class="spacer"></div>
      <button type="submit" :disabled="saving">{{ saving ? 'Guardando...' : submitLabel }}</button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </form>
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  mode: { type: String, default: 'create' }
})

const emit = defineEmits(['submit', 'cancel', 'update:modelValue'])

const local = reactive({
  name: '',
  scope: 'general',
  is_default: true
})

watch(() => props.modelValue, (val) => {
  const v = val || {}
  local.name = v.name || ''
  local.scope = v.scope || 'general'
  // si viene definido, respetar is_default; sino inferir desde scope
  local.is_default = typeof v.is_default === 'boolean' ? v.is_default : (local.scope === 'general')
}, { immediate: true, deep: true })

// Mantener is_default sincronizado con scope (general => true, private => false)
watch(() => local.scope, (val) => {
  local.is_default = (val === 'general')
})

watch(local, () => emit('update:modelValue', { ...local }), { deep: true })

const saving = ref(false)
const error = ref('')
const title = computed(() => props.mode === 'edit' ? 'Editar Dashboard' : 'Nuevo Dashboard')
const submitLabel = computed(() => props.mode === 'edit' ? 'Guardar cambios' : 'Crear')

const onSubmit = async () => {
  saving.value = true
  error.value = ''
  try {
    await emit('submit', { ...local })
  } catch (e) {
    error.value = e?.message || 'Ocurrió un error'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.form-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; max-width: 720px; margin: 0 auto; box-shadow: 0 4px 14px rgba(0,0,0,0.04); }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.grid .section-title { grid-column: span 2; margin: 0 0 6px; font-size: 16px; color: #374151; }
label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
input, select, textarea, button { font: inherit; }
input, select, textarea { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; }
.wizard-actions { margin-top: 12px; display: flex; gap: 8px; align-items: center; }
.wizard-actions .spacer { flex: 1; }
.secondary { background: transparent; border: 1px solid #9ca3af; color: #374151; padding: 10px 12px; border-radius: 8px; }
button { padding: 10px 12px; border-radius: 8px; border: none; background: #1f6feb; color: #fff; cursor: pointer; }
.error { color: #b91c1c; margin-top: 8px; }
</style>


