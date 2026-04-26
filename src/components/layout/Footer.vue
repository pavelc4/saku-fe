<template>
  <footer class="w-full bg-surface-container-low py-12 sm:py-16 md:py-20 rounded-soft z-10 relative">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 md:gap-16">
      <div class="col-span-1 sm:col-span-2 md:col-span-2 flex flex-col gap-4 sm:gap-6">
        <a class="font-headline text-3xl sm:text-4xl font-medium text-on-background tracking-tight" href="#">Saku.</a>
        <p class="text-base sm:text-lg md:text-xl text-on-surface-variant font-headline italic max-w-md">Intelligence meets commerce. The scholarly concierge for modern retail operations.</p>
      </div>
      <div class="flex flex-col gap-3 sm:gap-4">
        <h4 class="font-body text-xs sm:text-sm font-bold uppercase tracking-widest text-on-background mb-1 sm:mb-2">Product</h4>
        <a class="font-headline text-base sm:text-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#features">Features</a>
        <a class="font-headline text-base sm:text-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#philosophy">Philosophy</a>
      </div>
      <div class="flex flex-col gap-3 sm:gap-4">
        <h4 class="font-body text-xs sm:text-sm font-bold uppercase tracking-widest text-on-background mb-1 sm:mb-2">Resources</h4>
        <a class="font-headline text-base sm:text-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#source">Source Code</a>
        <a class="font-headline text-base sm:text-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">GitHub</a>
      </div>
    </div>
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12 mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-center sm:text-left">
      <p class="text-on-surface-variant text-xs sm:text-sm font-body">© 2025 Saku.</p>
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
        <span class="text-on-surface-variant text-xs sm:text-sm font-body cursor-pointer hover:text-primary">Terms of Service</span>
        <span class="text-on-surface-variant text-xs sm:text-sm font-body cursor-pointer hover:text-primary">Privacy Policy</span>
      </div>
    </div>
  </footer>
</template>