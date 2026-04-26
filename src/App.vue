<script setup>
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'

const route = useRoute()
const hideLayout = computed(() => ['/register', '/login', '/dashboard', '/settings', '/sales', '/inventory', '/ai-insights', '/categories', '/notifications', '/transactions', '/reports'].includes(route.path))

onMounted(() => {
  // Defer loading heavy font assets until after the initial paint
  Promise.all([
    import('@fontsource/newsreader/400.css'),
    import('@fontsource/newsreader/400-italic.css'),
    import('@fontsource/newsreader/700.css'),
    import('@fontsource/newsreader/700-italic.css'),
    import('@fontsource/manrope/400.css'),
    import('@fontsource/manrope/500.css'),
    import('@fontsource/manrope/600.css'),
    import('@fontsource/manrope/700.css'),
    import('material-symbols/outlined.css')
  ])
})
</script>

<template>
  <Navbar v-if="!hideLayout" />
  <router-view />
  <Footer v-if="!hideLayout" />
</template>