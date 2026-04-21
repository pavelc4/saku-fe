<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'

const route = useRoute()
const hideLayout = computed(() => ['/register', '/login', '/dashboard', '/settings', '/sales', '/inventory'].includes(route.path))
</script>

<template>
  <Navbar v-if="!hideLayout" />
  <router-view />
  <Footer v-if="!hideLayout" />
</template>