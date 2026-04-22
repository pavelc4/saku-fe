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
          <div v-if="advisorAnswer || advisorLoading" class="flex justify-start items-end gap-4">
            <div class="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center text-primary shrink-0 mb-1">
              <span class="material-symbols-outlined fill text-xl" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
            </div>
            <div class="bg-surface-container-lowest text-on-surface rounded-3xl rounded-bl-sm py-6 px-8 max-w-3xl shadow-[0_12px_48px_rgba(27,28,24,0.06)]">
              <!-- Loading State -->
              <div v-if="advisorLoading" class="flex items-center gap-2">
                <span class="material-symbols-outlined animate-spin text-primary">sync</span>
                <span class="text-on-surface-variant">Menganalisis...</span>
              </div>
              
              <!-- Structured Data Response -->
              <template v-else-if="advisorParsed">
                <p class="font-headline text-xl mb-4 text-on-surface-variant leading-relaxed">{{ advisorParsed.summary }}</p>
                
                <!-- Rich Card -->
                <div v-if="advisorParsed.data || advisorParsed.chart" class="mt-6 bg-surface-container-low rounded-xl p-6 relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  
                  <!-- Data Cards Grid -->
                  <div v-if="advisorParsed.data" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div v-for="(value, key) in advisorParsed.data" :key="key" class="bg-surface-container-lowest p-5 rounded-lg shadow-[0_4px_16px_rgba(27,28,24,0.03)]">
                      <p class="text-sm text-secondary mb-1 capitalize">{{ String(key).replace(/_/g, ' ') }}</p>
                      <p class="font-headline text-3xl text-on-surface">
                        {{ formatValue(value) }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Chart -->
                  <div v-if="advisorParsed.chart && advisorParsed.chart.length" class="h-32 bg-surface-container-highest rounded-lg relative flex items-end px-4 pt-4 pb-2 gap-2">
                    <div v-for="(bar, idx) in advisorParsed.chart" :key="idx"
                         class="flex-1 bg-primary rounded-t-md hover:bg-primary/80 transition-colors cursor-pointer group relative"
                         :style="{ height: `${Math.max(10, (bar.value / getMaxChartValue(advisorParsed.chart)) * 100)}%` }">
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">{{ bar.label }}</div>
                    </div>
                  </div>
                  
                  <p v-if="advisorParsed.insight" class="text-sm text-secondary mt-4 font-body">{{ advisorParsed.insight }}</p>
                </div>
              </template>
              
              <!-- Plain Text Response (fallback) -->
              <template v-else>
                <p class="font-headline text-xl mb-4 text-on-surface-variant leading-relaxed">{{ advisorAnswer }}</p>
              </template>
            </div>
          </div>
        </div>

        <!-- Input Area (Fixed to bottom of content area) -->
        <div class="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-surface via-surface to-transparent pt-20">
          <div class="max-w-3xl mx-auto relative">
            <div class="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-xl rounded-full shadow-[0_16px_48px_rgba(27,28,24,0.08)]"></div>
            <div class="relative flex items-center p-2 pl-6">
              <input v-model="advisorQuestion" @keyup.enter="askAdvisor" class="flex-1 bg-transparent border-none text-on-surface placeholder:text-secondary focus:ring-0 text-lg font-body py-4 outline-none" placeholder="Ask your consultant..." type="text"/>
              <button class="w-12 h-12 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-highest transition-colors mr-2 cursor-pointer">
                <span class="material-symbols-outlined">attach_file</span>
              </button>
              <button @click="askAdvisor" :disabled="advisorLoading || !advisorQuestion.trim()" class="w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-[0_8px_24px_rgba(154,64,33,0.3)] cursor-pointer disabled:opacity-50">
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
import { ref, computed, onMounted } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';
import { useAuthStore } from '../stores/auth';
import { insightsApi } from '../api/insights';

const authStore = useAuthStore();
const user = computed(() => ({ name: authStore.user?.name || 'Admin', email: authStore.user?.email || '' }));

const loading = ref(false)
const error = ref<string | null>(null)

const monthly = ref<any>(null)
const daily = ref<any>(null)
const productIntel = ref<any>(null)
const cashflow = ref<any>(null)

const advisorQuestion = ref('')
const advisorAnswer = ref<string | null>(null)
const advisorParsed = ref<any>(null)
const advisorLoading = ref(false)

async function fetchInsights() {
  loading.value = true
  error.value = null
  try {
    const [m, d, p, c] = await Promise.all([
      insightsApi.getMonthly(),
      insightsApi.getDaily(),
      insightsApi.getProductIntelligence(),
      insightsApi.getCashflowPrediction(),
    ])
    monthly.value = m.data?.data
    daily.value = d.data?.data
    productIntel.value = p.data?.data
    cashflow.value = c.data?.data
  } catch (err: any) {
    error.value = 'Gagal memuat insights'
  } finally {
    loading.value = false
  }
}

async function askAdvisor() {
  if (!advisorQuestion.value.trim()) return
  advisorLoading.value = true
  advisorAnswer.value = null
  advisorParsed.value = null
  try {
    const res = await insightsApi.askAdvisor(advisorQuestion.value)
    const rawAnswer = res.data?.data?.answer || res.data?.data
    
    // Try to parse JSON from response
    try {
      const jsonMatch = rawAnswer.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        advisorParsed.value = JSON.parse(jsonMatch[0])
      }
    } catch {
      // Not JSON, use as plain text
    }
    advisorAnswer.value = rawAnswer
  } catch {
    advisorAnswer.value = 'Gagal mendapatkan jawaban. Coba lagi.'
  } finally {
    advisorLoading.value = false
  }
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)

const formatValue = (val: any) => {
  if (typeof val === 'number') {
    return val > 1000 ? formatCurrency(val) : val
  }
  return val
}

const getMaxChartValue = (chart: any[]) => {
  if (!chart || !chart.length) return 1
  return Math.max(...chart.map((c: any) => c.value || 0), 1)
}

onMounted(() => fetchInsights())
</script>


