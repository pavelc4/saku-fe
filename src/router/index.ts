import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
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

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/sales',
    name: 'sales',
    component: SalesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: InventoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/ai-insights',
    name: 'ai-insights',
    component: AiInsightsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true }
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
