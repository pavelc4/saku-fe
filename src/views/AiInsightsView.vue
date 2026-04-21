<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <!-- SideNavBar -->
    <Sidebar />

    <div class="flex-1 flex flex-col h-screen min-w-0 z-10 relative">
      <!-- TopNavBar -->
      <TopNav :user="user" />

      <!-- Chat Canvas -->
      <main class="flex-1 overflow-y-auto no-scrollbar p-8 md:p-12 pb-32 flex flex-col gap-8 bg-surface rounded-tl-[32px] relative z-10 shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)]">
        <!-- Welcome Message / Header -->
        <div class="text-center mb-8 max-w-2xl mx-auto mt-4">
          <div class="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-[0_8px_32px_rgba(27,28,24,0.06)]">
            <span class="material-symbols-outlined fill text-3xl" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
          </div>
          <h2 class="font-headline text-3xl md:text-4xl text-on-surface mb-3">Good afternoon. How can I assist with your business today?</h2>
          <p class="text-secondary font-body">Your scholarly concierge is ready to analyze trends, check inventory, or review staff performance.</p>
        </div>

        <!-- Chat Area -->
        <div class="max-w-4xl mx-auto w-full flex flex-col gap-8">
          <!-- User Message -->
          <div class="flex justify-end">
            <div class="bg-primary text-on-primary rounded-2xl rounded-tr-sm py-4 px-6 max-w-xl shadow-[0_8px_24px_rgba(154,64,33,0.15)]">
              <p class="font-body text-lg">Can you give me a breakdown of how our weekend editorial release performed compared to last month?</p>
            </div>
          </div>

          <!-- AI Response -->
          <div class="flex justify-start items-end gap-4">
            <div class="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center text-primary shrink-0 mb-1">
              <span class="material-symbols-outlined fill text-xl" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
            </div>
            <div class="bg-surface-container-lowest text-on-surface rounded-3xl rounded-bl-sm py-6 px-8 max-w-3xl shadow-[0_12px_48px_rgba(27,28,24,0.06)]">
              <p class="font-headline text-xl mb-4 text-on-surface-variant leading-relaxed">Certainly. I've analyzed the sales data from the recent "Autumn Solstice" release and compared it to the previous month's baseline.</p>
              
              <!-- Rich Card: The Weekend Analysis -->
              <div class="mt-6 bg-surface-container-low rounded-xl p-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <h3 class="font-headline text-2xl mb-6 text-primary">The Weekend Analysis</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div class="bg-surface-container-lowest p-5 rounded-lg shadow-[0_4px_16px_rgba(27,28,24,0.03)]">
                    <p class="text-sm text-secondary mb-1">Total Revenue</p>
                    <p class="font-headline text-3xl text-on-surface">$14,280 <span class="text-sm font-body text-tertiary-container ml-2 bg-tertiary-fixed/30 px-2 py-1 rounded-full">+24%</span></p>
                  </div>
                  <div class="bg-surface-container-lowest p-5 rounded-lg shadow-[0_4px_16px_rgba(27,28,24,0.03)]">
                    <p class="text-sm text-secondary mb-1">Units Moved</p>
                    <p class="font-headline text-3xl text-on-surface">312 <span class="text-sm font-body text-tertiary-container ml-2 bg-tertiary-fixed/30 px-2 py-1 rounded-full">+18%</span></p>
                  </div>
                </div>
                
                <div class="h-32 bg-surface-container-highest rounded-lg relative flex items-end px-4 pt-4 pb-2 gap-2">
                  <div class="flex-1 bg-primary/20 rounded-t-md h-[40%] hover:bg-primary/40 transition-colors cursor-pointer group relative">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Fri</div>
                  </div>
                  <div class="flex-1 bg-primary/80 rounded-t-md h-[90%] hover:bg-primary transition-colors cursor-pointer group relative">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Sat</div>
                  </div>
                  <div class="flex-1 bg-primary/60 rounded-t-md h-[70%] hover:bg-primary/80 transition-colors cursor-pointer group relative">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Sun</div>
                  </div>
                  <div class="flex-1 bg-primary/30 rounded-t-md h-[30%] hover:bg-primary/50 transition-colors cursor-pointer group relative">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Mon</div>
                  </div>
                </div>
                <p class="text-sm text-secondary mt-4 font-body">The Saturday peak was driven primarily by the new ceramic tableware collection, which accounted for 42% of weekend volume.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area (Fixed to bottom of content area) -->
        <div class="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-surface via-surface to-transparent pt-20">
          <div class="max-w-3xl mx-auto relative">
            <div class="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-xl rounded-full shadow-[0_16px_48px_rgba(27,28,24,0.08)]"></div>
            <div class="relative flex items-center p-2 pl-6">
              <input class="flex-1 bg-transparent border-none text-on-surface placeholder:text-secondary focus:ring-0 text-lg font-body py-4 outline-none" placeholder="Ask your consultant..." type="text"/>
              <button class="w-12 h-12 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-highest transition-colors mr-2 cursor-pointer">
                <span class="material-symbols-outlined">attach_file</span>
              </button>
              <button class="w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-[0_8px_24px_rgba(154,64,33,0.3)] cursor-pointer">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">arrow_upward</span>
              </button>
            </div>
          </div>
          <p class="text-center text-xs text-secondary mt-4 font-body">Saku AI may occasionally provide inaccurate insights. Always verify critical data.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';

const user = ref({
  name: 'Alex R.',
  email: 'alex.r@saku.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhZiiGyoCOsuYv_MGbEOcbH36vmbAaGDdfjR8hJfA58lU8laEpfOvbbiAz4Hgq0-9tQD0aPsQhqNQ-H6T3hZ_MDCbLsMFL5EAlm6ZRipKB_JasZ99qnihhZlGJV-GYTq9K_96gE0TLSOytb_BX0BUV28Irld42gHVRUPPmmuYx2aNM4GUa_IEczq5smFqdhFHayQ8g7oE71Efsd-LykeTpw53mXR90TlZXa1eQsjF56o238LqGAmNbvwz8Ogwnn_Cpe2Cj4wMnjH4'
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
