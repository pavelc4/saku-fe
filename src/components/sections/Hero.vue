<template>
  <section class="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-24 md:pb-32 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
    <div class="w-full lg:w-1/2 flex flex-col gap-6 sm:gap-8 items-start">
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.05] font-headline font-medium text-on-background tracking-tight">
        Saku. Intelligence <br/>
        <span class="text-primary italic">meets commerce.</span>
      </h1>
      
      <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-on-surface-variant font-body font-light leading-relaxed max-w-xl">
        Rejecting the cold utility of standard SaaS. Saku is an expressive, scholarly concierge for your business, combining microsecond edge performance with narrative financial insights.
      </p>
      
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mt-2 sm:mt-4">
        <button class="bg-primary text-on-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg shadow-[0_8px_30px_rgba(154,64,33,0.3)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
          Explore Features
        </button>
        <a class="font-headline text-base sm:text-lg md:text-xl text-on-surface hover:text-primary transition-colors flex items-center gap-2 border-b border-transparent hover:border-primary pb-1" href="#source">
          View Source Code
          <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 0;">arrow_forward</span>
        </a>
      </div>
    </div>
    
    <div class="w-full lg:w-1/2 relative">
      <div class="absolute inset-0 bg-primary opacity-5 blur-[100px] rounded-full"></div>
      <div class="relative w-full aspect-[4/3] rounded-soft bg-gradient-to-br from-primary/10 via-surface-container-low to-surface-container-lowest overflow-hidden shadow-[0_32px_64px_-12px_rgba(27,28,24,0.1)]">
        <!-- Placeholder gradient pattern -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(154,64,33,0.15),transparent_50%)]"></div>
        <div class="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.1)_50%,transparent_60%)]"></div>
        
        <!-- Simple icon placeholder -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-3xl bg-surface-container-lowest/50 backdrop-blur-sm flex items-center justify-center border border-outline-variant/20">
            <!-- Inline SVG for point_of_sale to prevent LCP delay from font loading -->
            <svg class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-primary/30" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 8H5V6h14v2zm-1 9v2H6v-2h12zm-3-4v2H9v-2h6zm4-7H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM5 20h14v-2H5v2zm14-4H5V8h14v8z"/>
            </svg>
          </div>
        </div>
        
        <!-- Decorative circles -->
        <div class="absolute top-8 right-8 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-tertiary/10"></div>
        <div class="absolute bottom-12 left-12 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-secondary/10"></div>
        
        <div class="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 bg-surface-container-lowest/80 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-lg border border-white/20 flex justify-between items-center">
          <div class="min-w-0">
            <p class="text-[10px] sm:text-xs text-primary font-bold uppercase tracking-widest mb-1 sm:mb-2 font-body">Today's Narrative Insight</p>
            <p class="text-sm sm:text-xl font-headline text-on-surface font-medium italic leading-tight">"Morning espresso sales are up 12% following the seasonal blend launch."</p>
          </div>
          <div class="w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 ml-2 sm:ml-8">
            <span class="material-symbols-outlined text-xl sm:text-2xl">auto_awesome</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>