<template>
  <header class="nav">
    <div class="brand" @click="$router.push('/home')" role="button">Panel</div>
    <div class="spacer"></div>
    <div class="user">
      <span class="username">{{ userName }}</span>
      <button class="logout" @click="onLogout">Cerrar sesión</button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { userName, logout } = useAuth()

const onLogout = async () => {
  const result = await logout()
  if (result?.success) {
    router.push('/login')
  }
}
</script>

<style scoped>
.nav { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid #e5e7eb; background: #fff; }
.brand { font-weight: 600; cursor: pointer; }
.spacer { flex: 1; }
.user { display: flex; align-items: center; gap: 10px; }
.username { color: #374151; }
.logout { padding: 6px 10px; border-radius: 6px; border: 1px solid #9ca3af; background: transparent; color: #374151; cursor: pointer; }
</style>


