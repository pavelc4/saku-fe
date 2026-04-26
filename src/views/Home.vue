<script setup>
import { defineAsyncComponent } from 'vue'
import Hero from '../components/sections/Hero.vue'

const Features = defineAsyncComponent(() => import('../components/sections/Features.vue'))
const Team = defineAsyncComponent(() => import('../components/sections/Team.vue'))
</script>

<template>
  <Head>
    <Title>Saku - Expressive Commerce Platform</Title>
    <Meta name="description" content="Saku is an expressive, scholarly concierge for modern retail operations. Intelligence meets commerce with microsecond performance." />
    <Meta name="keywords" content="POS, Point of Sale, Retail, Commerce, Inventory, Saku, Cloudflare, Indonesia" />
    <Meta property="og:title" content="Saku - Expressive Commerce Platform" />
    <Meta property="og:description" content="Intelligence meets commerce. Saku combines microsecond edge performance with narrative financial insights." />
    <Meta property="og:type" content="website" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:title" content="Saku - Expressive Commerce Platform" />
    <Meta name="twitter:description" content="Intelligence meets commerce." />
  </Head>
  <main class="flex-grow">
    <Hero />
    <Features />
    <Team />
  </main>
</template>