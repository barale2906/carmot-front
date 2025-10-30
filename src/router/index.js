import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue')
    },
    {
      path: '/home',
      name: 'Home',
      meta: { requiresAuth: true },
      component: () => import('@/views/home/Home.vue')
    },
    {
      path: '/kpis',
      name: 'Kpis',
      meta: { requiresAuth: true },
      component: () => import('@/views/kpi/KpisView.vue')
    },
    {
      path: '/kpis/new',
      name: 'KpiCreate',
      meta: { requiresAuth: true },
      component: () => import('@/views/kpi/KpiCreate.vue')
    },
    {
      path: '/dashboards',
      name: 'Dashboards',
      meta: { requiresAuth: true },
      component: () => import('@/views/dashboard/DashboardsView.vue')
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('@/views/common/Blank.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/common/NotFound.vue')
    }
  ]
})

// Guard de navegación para autenticación (simplificado)
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    await authStore.checkAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  next()
})

export default router
