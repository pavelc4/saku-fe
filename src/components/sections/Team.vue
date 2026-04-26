<template>
  <section class="w-full bg-near-black text-[#f5f4ed] py-32 rounded-soft relative z-20 mb-8 shadow-2xl" id="team">
    <div class="max-w-screen-2xl mx-auto px-8 md:px-12">
      <div class="flex flex-col mb-24 md:mb-32">
        <h2 class="text-6xl md:text-8xl font-headline font-medium mb-6 tracking-tight">The Architects</h2>
        <p class="text-2xl md:text-3xl text-surface-variant font-headline italic font-light leading-relaxed max-w-4xl border-l-4 border-primary pl-8 mt-4">
          The engineers crafting Saku's expressive commerce experience.
        </p>
      </div>

      <div class="flex flex-col gap-32">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-center group">
          <div class="md:col-span-7 relative h-[600px] bg-surface-container-highest/5 rounded-[2rem] overflow-hidden border border-surface-variant/10">
            <div class="absolute inset-0 flex items-center justify-center text-surface-variant/10 font-headline text-[30rem] font-light italic select-none">D</div>
          </div>
          <div class="md:col-span-5 flex flex-col items-start z-10 md:-ml-16">
            <h3 class="text-5xl md:text-6xl font-headline font-medium text-[#f5f4ed] mb-4">Dimas Dwi Ariyanto</h3>
            <div class="flex items-center gap-4 mb-8">
              <span class="text-[#fbdcd1] font-headline text-2xl">Lead Developer</span>
              <span class="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
              <span class="text-surface-variant font-headline text-xl">pavelc4</span>
            </div>
            <p class="text-surface-variant text-lg font-body leading-relaxed mb-10 max-w-md">
              Architecting the backend infrastructure with Cloudflare Workers and Hono, ensuring microsecond response times and robust data integrity.
            </p>
            <div class="flex gap-4">
              <a class="flex items-center gap-2 border border-surface-variant/30 px-6 py-3 rounded-full hover:bg-surface-variant/10 hover:border-surface-variant transition-all font-body text-[#f5f4ed]" href="https://github.com/pavelc4" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 lg:px-24">
          <div class="flex flex-col group md:mt-16">
            <div class="relative h-[400px] bg-surface-container-highest/5 rounded-2xl mb-8 overflow-hidden border border-surface-variant/10">
              <div class="absolute inset-0 flex items-center justify-center text-surface-variant/10 font-headline text-[20rem] font-light italic select-none">A</div>
            </div>
            <h3 class="text-3xl font-headline font-medium text-[#f5f4ed] mb-2">Arief Riyukhari</h3>
          </div>

          <div class="flex flex-col group md:mb-16">
            <div class="relative h-[400px] bg-surface-container-highest/5 rounded-2xl mb-8 overflow-hidden border border-surface-variant/10">
              <div class="absolute inset-0 flex items-center justify-center text-surface-variant/10 font-headline text-[20rem] font-light italic select-none">D</div>
            </div>
            <h3 class="text-3xl font-headline font-medium text-[#f5f4ed] mb-2">Dyral Setiawan</h3>
          </div>

          <div class="flex flex-col group md:mt-16">
            <div class="relative h-[400px] bg-surface-container-highest/5 rounded-2xl mb-8 overflow-hidden border border-surface-variant/10">
              <div class="absolute inset-0 flex items-center justify-center text-surface-variant/10 font-headline text-[20rem] font-light italic select-none">M</div>
            </div>
            <h3 class="text-3xl font-headline font-medium text-[#f5f4ed] mb-2">Muhammad Hanif</h3>
          </div>

          <div class="flex flex-col group md:mb-16">
            <div class="relative h-[400px] bg-surface-container-highest/5 rounded-2xl mb-8 overflow-hidden border border-surface-variant/10">
              <div class="absolute inset-0 flex items-center justify-center text-surface-variant/10 font-headline text-[20rem] font-light italic select-none">M</div>
            </div>
            <h3 class="text-3xl font-headline font-medium text-[#f5f4ed] mb-2">Muhammad Fahrul</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>