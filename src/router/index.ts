import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import DashboardView from '../views/DashboardView.vue'
import SettingsView from '../views/SettingsView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router