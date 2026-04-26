import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import AppLayout from '../components/layout/AppLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import SettingsView from '../views/SettingsView.vue'
import SalesView from '../views/SalesView.vue'
import InventoryView from '../views/InventoryView.vue'
import AiInsightsView from '../views/AiInsightsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import NotificationsView from '../views/NotificationsView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import OAuthSuccess from '../views/OAuthSuccess.vue'
import TransactionsView from '../views/TransactionsView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView
      },
      {
        path: 'sales',
        name: 'sales',
        component: SalesView
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: TransactionsView
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: InventoryView
      },
      {
        path: 'categories',
        name: 'categories',
        component: CategoriesView
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: NotificationsView
      },
      {
        path: 'ai-insights',
        name: 'ai-insights',
        component: AiInsightsView
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('../views/ReportView.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: SettingsView
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/oauth/success',
    name: 'oauth-success',
    component: OAuthSuccess,
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