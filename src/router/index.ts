import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/RegisterPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/pages/DashboardPage.vue')
        },
        {
          path: 'claims',
          name: 'claims',
          component: () => import('@/pages/ClaimsPage.vue')
        },
        {
          path: 'claims/upload',
          name: 'claims-upload',
          component: () => import('@/pages/ClaimsUploadPage.vue')
        },
        {
          path: 'claims/:claimId',
          name: 'claim-detail',
          component: () => import('@/pages/ClaimDetailPage.vue')
        },
        {
          path: 'audit/dashboard',
          name: 'audit-dashboard',
          component: () => import('@/pages/AuditDashboardPage.vue')
        },
        {
          path: 'audit/flagged',
          name: 'audit-flagged',
          component: () => import('@/pages/FlaggedClaimsPage.vue')
        },
        {
          path: 'audit-results',
          name: 'audit-results',
          component: () => import('@/pages/AuditResultsPage.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/pages/SettingsPage.vue')
        },
        // Legacy route - redirect to new audit routes
        {
          path: 'flagged-claims',
          redirect: '/audit/flagged'
        }
      ]
    },
    {
      path: '/showcase',
      name: 'showcase',
      component: () => import('@/pages/ComponentShowcase.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue')
    }
  ]
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (!to.meta.requiresAuth && authStore.isAuthenticated && to.name !== 'not-found') {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
