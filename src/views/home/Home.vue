<template>
  <div class="home">
    <NavBar />

    <main class="content">
      <h1>Centro de navegación</h1>
      <p>Selecciona a dónde quieres ir:</p>
      <div class="actions">
        <router-link class="btn" to="/kpis">Gestionar KPIs</router-link>
        <router-link class="btn outline" to="/dashboards">Gestionar Dashboards</router-link>
      </div>
    </main>
  </div>
  
</template>

<script setup>
import NavBar from '@/components/common/NavBar.vue'
</script>

<style scoped>
.home { min-height: 100vh; display: flex; flex-direction: column; }
.content { padding: 24px; }
.actions { display: flex; gap: 12px; margin-top: 16px; }
.btn { padding: 10px 14px; border-radius: 6px; background: #1f6feb; color: #fff; text-decoration: none; }
.btn.outline { background: transparent; border: 1px solid #1f6feb; color: #1f6feb; }
</style>


