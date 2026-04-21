<script setup>
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import Hero from './components/sections/Hero.vue'
import Features from './components/sections/Features.vue'
import Team from './components/sections/Team.vue'
</script>

<template>
  <Navbar />
  
  <main class="flex-grow">
    <Hero />
    <Features />
    <Team />
  </main>

  <Footer />
</template>