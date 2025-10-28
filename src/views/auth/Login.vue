<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="/favicon.ico" alt="Carmot Logo" class="logo" />
        <h1>Dashboard</h1>
        <p>Inicia sesión para acceder al dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="isLoading"
            :class="{ 'error': errors.email }"
            placeholder="tu@email.com"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="password-input">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              :disabled="isLoading"
              :class="{ 'error': errors.password }"
              placeholder="Tu contraseña"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
              :disabled="isLoading"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input
              v-model="form.remember"
              type="checkbox"
              :disabled="isLoading"
            />
            <span>Recordarme</span>
          </label>
          <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
        </div>

        <button
          type="submit"
          :disabled="isLoading || !isFormValid"
          class="login-button"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>

        <div v-if="error" class="error-alert">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>
      </form>

      <div class="login-footer">
        <p>¿No tienes cuenta? <a href="#">Contacta al administrador</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, isLoading, error, clearError } = useAuth()

// Estado del formulario
const form = reactive({
  email: '',
  password: '',
  remember: false
})

// Estado de la UI
const showPassword = ref(false)
const errors = ref({})

// Validaciones
const isFormValid = computed(() => {
  return form.email && form.password && form.email.includes('@')
})

// Manejar login
const handleLogin = async () => {
  clearError()
  errors.value = {}

  // Validaciones básicas
  if (!form.email) {
    errors.value.email = 'El correo es obligatorio'
    return
  }

  if (!form.email.includes('@')) {
    errors.value.email = 'Ingresa un correo válido'
    return
  }

  if (!form.password) {
    errors.value.password = 'La contraseña es obligatoria'
    return
  }

  if (form.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  // Intentar login
  const result = await login({
    email: form.email,
    password: form.password,
    remember: form.remember
  })

  if (result.success) {
    // Redirigir al dashboard
    router.push('/dashboard')
  }
}

onMounted(() => {
  // Limpiar errores al montar
  clearError()
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  min-width: 280px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
}

.login-header h1 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.login-header p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error {
  border-color: #e74c3c;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.login-button:hover:not(:disabled) {
  opacity: 0.9;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.error-alert {
  background: #fdf2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.error-icon {
  font-size: 1.1rem;
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e5e9;
  font-size: 0.9rem;
  color: #666;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    padding: 0.5rem;
  }
  
  .login-card {
    padding: 1.5rem;
    margin: 0.5rem;
    max-width: 100%;
  }
  
  .login-header h1 {
    font-size: 1.5rem;
  }
  
  .login-header p {
    font-size: 0.8rem;
  }
  
  .form-group input {
    padding: 0.875rem;
    font-size: 16px; /* Evita zoom en iOS */
  }
  
  .login-button {
    padding: 1rem;
    font-size: 1rem;
  }
  
  .form-options {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
  
  .forgot-password {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 0.25rem;
  }
  
  .login-card {
    padding: 1rem;
    margin: 0.25rem;
    border-radius: 8px;
  }
  
  .login-header {
    margin-bottom: 1.5rem;
  }
  
  .logo {
    width: 50px;
    height: 50px;
  }
  
  .login-header h1 {
    font-size: 1.25rem;
  }
  
  .login-header p {
    font-size: 0.75rem;
  }
  
  .login-form {
    gap: 1rem;
  }
  
  .form-group input {
    padding: 0.75rem;
  }
  
  .login-button {
    padding: 0.875rem;
  }
  
  .login-footer {
    margin-top: 1rem;
    padding-top: 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 320px) {
  .login-card {
    padding: 0.75rem;
    margin: 0.125rem;
  }
  
  .login-header h1 {
    font-size: 1.1rem;
  }
  
  .form-group input {
    padding: 0.625rem;
  }
  
  .login-button {
    padding: 0.75rem;
  }
}
</style>
