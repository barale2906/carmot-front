import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Configurar Pinia para manejo de estado
app.use(createPinia())

// Configurar Router
app.use(router)

app.mount('#app')
