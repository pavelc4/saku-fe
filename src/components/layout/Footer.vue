<template>
  <footer class="w-full bg-surface-container-low py-20 rounded-soft z-10 relative">
    <div class="max-w-screen-2xl mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-16">
      <div class="col-span-1 md:col-span-2 flex flex-col gap-6">
        <a class="font-headline text-4xl font-medium text-on-background tracking-tight" href="#">Saku.</a>
        <p class="text-on-surface-variant font-headline italic text-xl max-w-md">Intelligence meets commerce. The scholarly concierge for modern retail operations.</p>
      </div>
      <div class="flex flex-col gap-4">
        <h4 class="font-body text-sm font-bold uppercase tracking-widest text-on-background mb-2">Product</h4>
        <a class="font-headline text-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#features">Features</a>
        <a class="font-headline text-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#philosophy">Philosophy</a>
      </div>
      <div class="flex flex-col gap-4">
        <h4 class="font-body text-sm font-bold uppercase tracking-widest text-on-background mb-2">Resources</h4>
        <a class="font-headline text-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#source">Source Code</a>
        <a class="font-headline text-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">GitHub</a>
      </div>
    </div>
    <div class="max-w-screen-2xl mx-auto px-8 md:px-12 mt-20 pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
      <p class="text-on-surface-variant text-sm font-body">© 2024 Saku. Crafted by pavelc4. Built with Hono, D1, and Workers AI.</p>
      <div class="flex gap-4">
        <span class="text-on-surface-variant text-sm font-body cursor-pointer hover:text-primary">Terms of Service</span>
        <span class="text-on-surface-variant text-sm font-body cursor-pointer hover:text-primary">Privacy Policy</span>
      </div>
    </div>
  </footer>
</template>