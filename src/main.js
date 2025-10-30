import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ECharts from 'vue-echarts'
import 'echarts'

const app = createApp(App)

// Configurar Pinia para manejo de estado
app.use(createPinia())

// Configurar Router
app.use(router)

// Registrar componente global para gráficos
app.component('v-chart', ECharts)

app.mount('#app')
