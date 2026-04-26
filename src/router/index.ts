import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/',
    component: () => import('../components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue')
      },
      {
        path: 'sales',
        name: 'sales',
        component: () => import('../views/SalesView.vue')
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: () => import('../views/TransactionsView.vue')
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: () => import('../views/InventoryView.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('../views/CategoriesView.vue')
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: () => import('../views/NotificationsView.vue')
      },
      {
        path: 'ai-insights',
        name: 'ai-insights',
        component: () => import('../views/AiInsightsView.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('../views/ReportView.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/SettingsView.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/oauth/success',
    name: 'oauth-success',
    component: () => import('../views/OAuthSuccess.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/auth/verify',
    name: 'verify-email',
    component: () => import('../views/VerifyEmailView.vue'),
    meta: { guestOnly: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('saku_token')

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' })
  }

  if (to.meta.guestOnly && token) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router