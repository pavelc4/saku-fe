<template>
  <section class="w-full bg-surface-container-low py-32 rounded-soft relative z-10 mb-8 shadow-sm border border-outline-variant/10" id="features">
    <div class="max-w-screen-2xl mx-auto px-8">
      <div class="text-center mb-24">
        <h2 class="text-5xl md:text-6xl font-headline font-medium text-on-surface mb-6 tracking-tight">Designed for Focus & Flow</h2>
        <p class="text-2xl text-on-surface-variant font-headline italic max-w-2xl mx-auto">A seamless intersection of high-speed utility and editorial grace.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="col-span-1 md:col-span-2 bg-surface-container-lowest rounded-[2rem] p-12 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-xl border border-outline-variant/5">
          <div class="mb-10">
            <div class="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-8 text-primary shadow-inner">
              <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 0;">psychology</span>
            </div>
            <h3 class="text-4xl font-headline font-medium text-on-surface mb-4">AI Business Consultant</h3>
            <p class="text-lg text-on-surface-variant font-body leading-relaxed max-w-2xl">Narrative financial insights powered by Llama 3.1. Instead of raw data tables, Saku interprets your daily performance and suggests strategic adjustments in natural language.</p>
          </div>
          <div class="w-full h-56 bg-surface-container-low rounded-[1.5rem] p-8 flex flex-col gap-6 overflow-hidden relative border border-outline-variant/10">
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent z-10"></div>
            <div class="flex gap-4 items-start opacity-40">
              <div class="w-10 h-10 rounded-full bg-surface-variant"></div>
              <div class="flex-1 space-y-3 mt-1"><div class="h-2.5 bg-surface-variant rounded w-3/4"></div><div class="h-2.5 bg-surface-variant rounded w-1/2"></div></div>
            </div>
            <div class="flex gap-5 items-start relative z-20">
              <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md"><span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">smart_toy</span></div>
              <div class="flex-1 bg-surface-container-lowest p-5 rounded-2xl rounded-tl-none shadow-md text-base text-on-surface font-body font-medium leading-relaxed border border-outline-variant/20">
                <span class="text-primary font-bold">Inventory alert:</span> Artisan Sourdough is trending 15% above average today. Based on current burn rate, consider baking an additional batch by 2 PM.
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-1 bg-surface-container-lowest rounded-[2rem] p-12 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-xl border border-outline-variant/5">
          <div>
            <div class="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-8 text-tertiary shadow-inner">
              <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 0;">bolt</span>
            </div>
            <h3 class="text-3xl font-headline font-medium text-on-surface mb-4">Edge Performance</h3>
            <p class="text-on-surface-variant font-body leading-relaxed mb-10">Microsecond latencies via Cloudflare Workers. Your POS never lags, ensuring a frictionless checkout experience at the counter.</p>
          </div>
          <div class="flex items-end gap-3 h-36">
            <div class="flex-1 bg-surface-variant rounded-t-xl h-[20%] group-hover:bg-tertiary/20 transition-colors duration-500"></div>
            <div class="flex-1 bg-surface-variant rounded-t-xl h-[35%] group-hover:bg-tertiary/40 transition-colors duration-500"></div>
            <div class="flex-1 bg-surface-variant rounded-t-xl h-[60%] group-hover:bg-tertiary/60 transition-colors duration-500"></div>
            <div class="flex-1 bg-tertiary rounded-t-xl h-[90%] shadow-[0_0_30px_rgba(0,103,104,0.4)]"></div>
          </div>
        </div>

        <div class="col-span-1 bg-surface-container-lowest rounded-[2rem] p-12 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-xl border border-outline-variant/5">
          <div>
            <div class="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-8 text-secondary shadow-inner">
              <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 0;">point_of_sale</span>
            </div>
            <h3 class="text-3xl font-headline font-medium text-on-surface mb-4">Professional Checkout</h3>
            <p class="text-on-surface-variant font-body leading-relaxed mb-10">Expressive Material 3 layout for fast retail operations. Highly legible, touch-optimized, and aesthetically calming.</p>
          </div>
          <div class="bg-surface-container-low rounded-[1.5rem] p-6 flex gap-4 border border-outline-variant/10">
            <div class="w-20 h-20 rounded-2xl bg-surface-variant shrink-0"></div>
            <div class="flex-1 space-y-3 py-2">
              <div class="h-4 bg-surface-variant rounded w-full"></div>
              <div class="h-4 bg-surface-variant rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <div class="col-span-1 md:col-span-2 bg-surface-container-lowest rounded-[2rem] p-12 flex flex-col md:flex-row gap-12 items-center justify-between group hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-xl border border-outline-variant/5">
          <div class="w-full md:w-1/2">
            <div class="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-8 text-primary shadow-inner">
              <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 0;">inventory_2</span>
            </div>
            <h3 class="text-4xl font-headline font-medium text-on-surface mb-4">Smart Inventory</h3>
            <p class="text-lg text-on-surface-variant font-body leading-relaxed">SKU tracking and predictive low-stock alerts. Maintain perfect oversight of your stockroom without leaving the register interface.</p>
          </div>
          <div class="w-full md:w-1/2 h-72 bg-surface-container-low rounded-[1.5rem] relative overflow-hidden flex items-center justify-center border border-outline-variant/10">
            <div class="grid grid-cols-3 gap-4 p-8 w-full h-full">
              <div class="bg-surface-container-lowest rounded-2xl shadow-sm opacity-80"></div>
              <div class="bg-surface-container-lowest rounded-2xl shadow-sm border-2 border-primary/40 relative">
                <div class="absolute -top-3 -right-3 w-6 h-6 bg-error rounded-full shadow-md animate-pulse border-2 border-surface-container-low"></div>
              </div>
              <div class="bg-surface-container-lowest rounded-2xl shadow-sm opacity-60"></div>
              <div class="bg-surface-container-lowest rounded-2xl shadow-sm opacity-40"></div>
              <div class="bg-surface-container-lowest rounded-2xl shadow-sm opacity-90"></div>
              <div class="bg-surface-container-lowest rounded-2xl shadow-sm opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>