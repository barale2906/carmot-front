<template>
  <div class="kpis-container">
    <header class="page-header">
      <h1>Gestión de KPIs</h1>
      <p>Configura y administra tus indicadores clave de rendimiento</p>
    </header>

    <div class="page-content">
      <div class="coming-soon-card">
        <div class="coming-soon-icon">🚧</div>
        <h2>Próximamente</h2>
        <p>El sistema de gestión de KPIs está en desarrollo.</p>
        <p>Aquí podrás crear, editar y configurar tus indicadores.</p>
        
        <div class="features-preview">
          <h3>Características que incluirá:</h3>
          <ul>
            <li>✅ Creación de KPIs personalizados</li>
            <li>✅ Configuración de campos y cálculos</li>
            <li>✅ Relaciones matemáticas entre campos</li>
            <li>✅ Diferentes tipos de períodos</li>
            <li>✅ Validación de datos</li>
          </ul>
        </div>

        <div class="actions">
          <router-link to="/dashboard" class="action-button secondary">
            <span class="button-icon">⬅️</span>
            Volver al Dashboard
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
.kpis-container {
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
  max-width: 800px;
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
  margin: 0 0 1rem 0;
  color: #718096;
  font-size: 1rem;
  line-height: 1.5;
}

.features-preview {
  margin: 2rem 0;
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.features-preview h3 {
  margin: 0 0 1rem 0;
  color: #4a5568;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
}

.features-preview ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-preview li {
  padding: 0.5rem 0;
  color: #4a5568;
  font-size: 0.9rem;
}

.actions {
  margin-top: 2rem;
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
}
</style>
