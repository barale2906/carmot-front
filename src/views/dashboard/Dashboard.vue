<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-left">
        <h1>Dashboard Carmot</h1>
        <p>Bienvenido, {{ userName }}</p>
      </div>
      <div class="header-right">
        <div class="user-info">
          <span class="user-role">{{ userRole }}</span>
          <button @click="handleLogout" class="logout-button" :disabled="isLoading">
            {{ isLoading ? 'Cerrando...' : 'Cerrar Sesión' }}
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="welcome-section">
        <div class="welcome-card">
          <h2>¡Bienvenido al dashboard!</h2>
          <p>Aquí podrás gestionar KPIs y crear dashboards personalizados.</p>
          
          <div class="quick-actions">
            <router-link to="/kpis" class="action-button primary">
              <span class="button-icon">📊</span>
              Gestionar KPIs
            </router-link>
            <router-link to="/kpis/create" class="action-button secondary">
              <span class="button-icon">➕</span>
              Crear Nuevo KPI
            </router-link>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <h3>KPIs Activos</h3>
              <p class="stat-number">0</p>
              <p class="stat-label">Indicadores configurados</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
              <h3>Dashboards</h3>
              <p class="stat-number">0</p>
              <p class="stat-label">Dashboards creados</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>Gráficos</h3>
              <p class="stat-number">0</p>
              <p class="stat-label">Visualizaciones activas</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3>Usuarios</h3>
              <p class="stat-number">1</p>
              <p class="stat-label">Usuario activo</p>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-section">
        <h2>Actividad Reciente</h2>
        <div class="recent-card">
          <p class="no-activity">No hay actividad reciente</p>
          <p class="no-activity-sub">Los KPIs y dashboards que crees aparecerán aquí</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, userName, userRole, logout, isLoading } = useAuth()

// Manejar logout
const handleLogout = async () => {
  const result = await logout()
  if (result.success) {
    router.push('/login')
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left h1 {
  margin: 0;
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-left p {
  margin: 0.25rem 0 0 0;
  color: #718096;
  font-size: 0.9rem;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-role {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.logout-button {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover:not(:disabled) {
  background: #c53030;
}

.logout-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dashboard-main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.welcome-card h2 {
  margin: 0 0 0.5rem 0;
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: 600;
}

.welcome-card p {
  margin: 0 0 1.5rem 0;
  color: #718096;
  font-size: 1rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.action-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-button.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.action-button.secondary {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.action-button.secondary:hover {
  border-color: #667eea;
  color: #667eea;
}

.button-icon {
  font-size: 1.2rem;
}

.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  border-radius: 12px;
}

.stat-content h3 {
  margin: 0 0 0.5rem 0;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-number {
  margin: 0 0 0.25rem 0;
  color: #1a202c;
  font-size: 2rem;
  font-weight: 700;
}

.stat-label {
  margin: 0;
  color: #718096;
  font-size: 0.8rem;
}

.recent-section h2 {
  margin: 0 0 1rem 0;
  color: #1a202c;
  font-size: 1.25rem;
  font-weight: 600;
}

.recent-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  text-align: center;
}

.no-activity {
  margin: 0 0 0.5rem 0;
  color: #718096;
  font-size: 1rem;
}

.no-activity-sub {
  margin: 0;
  color: #a0aec0;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .dashboard-main {
    padding: 1rem;
  }

  .welcome-card {
    padding: 1.5rem;
  }

  .quick-actions {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1rem;
  }
}
</style>
