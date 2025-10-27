<template>
  <div class="create-kpi-container">
    <header class="page-header">
      <h1>Crear Nuevo KPI</h1>
      <p>Configura un nuevo indicador clave de rendimiento</p>
    </header>

    <div class="page-content">
      <div class="coming-soon-card">
        <div class="coming-soon-icon">🚧</div>
        <h2>En Desarrollo</h2>
        <p>El formulario de creación de KPIs estará disponible próximamente.</p>
        
        <div class="actions">
          <router-link to="/kpis" class="action-button secondary">
            <span class="button-icon">⬅️</span>
            Volver a KPIs
          </router-link>
          <router-link to="/dashboard" class="action-button primary">
            <span class="button-icon">🏠</span>
            Ir al Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Placeholder component - será implementado en la siguiente fase
</script>

<style scoped>
.create-kpi-container {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem;
  text-align: center;
}

.page-header h1 {
  margin: 0 0 0.5rem 0;
  color: #1a202c;
  font-size: 2rem;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

.page-content {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.coming-soon-card {
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.coming-soon-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.coming-soon-card h2 {
  margin: 0 0 1rem 0;
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: 600;
}

.coming-soon-card p {
  margin: 0 0 2rem 0;
  color: #718096;
  font-size: 1rem;
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  display: inline-flex;
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

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }
  
  .page-content {
    padding: 1rem;
  }
  
  .coming-soon-card {
    padding: 2rem 1rem;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>
