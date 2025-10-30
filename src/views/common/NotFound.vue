<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-icon">🔍</div>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe o ha sido movida.</p>
      
      <div class="actions">
        <router-link to="/blank" class="action-button primary">
          <span class="button-icon">🏠</span>
          Ir al Inicio
        </router-link>
        <button @click="goBack" class="action-button secondary">
          <span class="button-icon">⬅️</span>
          Volver Atrás
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/blank')
  }
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.not-found-content {
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.not-found-content h1 {
  margin: 0 0 0.5rem 0;
  color: #e53e3e;
  font-size: 4rem;
  font-weight: 700;
}

.not-found-content h2 {
  margin: 0 0 1rem 0;
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: 600;
}

.not-found-content p {
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

/* Responsive */
@media (max-width: 480px) {
  .not-found-content {
    padding: 2rem 1.5rem;
  }
  
  .not-found-content h1 {
    font-size: 3rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .action-button {
    justify-content: center;
  }
}
</style>
