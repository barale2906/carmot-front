import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/kpis',
      name: 'KPIs',
      component: () => import('@/views/KPIs.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/kpis/create',
      name: 'CreateKPI',
      component: () => import('@/views/CreateKPI.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/kpis/:id/edit',
      name: 'EditKPI',
      component: () => import('@/views/EditKPI.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

// Guard de navegación para autenticación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Verificar si el usuario está autenticado
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth()
  }
  
  // Rutas que requieren autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // Rutas solo para invitados (como login)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router
