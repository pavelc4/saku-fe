<template>
  <div class="flex flex-col gap-4 md:gap-6">
        <!-- Welcome Message / Header (only show if no messages) -->
        <div v-if="chatMessages.length === 0" class="text-center mb-8 max-w-2xl mx-auto mt-4">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-primary shadow-[0_8px_32px_rgba(27,28,24,0.06)]">
            <span class="material-symbols-outlined fill text-2xl sm:text-3xl" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
          </div>
          <h2 class="font-headline text-2xl sm:text-3xl md:text-4xl text-on-surface mb-3">Selamat datang! Ada yang bisa saya bantu?</h2>
          <p class="text-secondary font-body text-sm sm:text-base">Tanyakan tentang penjualan, inventory, atau performa bisnismu.</p>
        </div>

        <!-- Chat Messages -->
        <div class="max-w-4xl mx-auto w-full flex flex-col gap-4 sm:gap-6 pb-24 sm:pb-28">
          <div v-for="(msg, idx) in chatMessages" :key="idx" 
               :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start items-end gap-2 sm:gap-3']">
            
            <!-- User Bubble -->
            <div v-if="msg.role === 'user'" class="bg-primary text-on-primary rounded-2xl rounded-tr-sm py-2 sm:py-3 px-4 sm:px-5 max-w-[85%] sm:max-w-xl shadow-md">
              <p class="font-body text-sm sm:text-lg">{{ msg.content }}</p>
            </div>
            
            <!-- AI Bubble -->
            <template v-else>
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-surface-container-highest rounded-full flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined fill text-lg sm:text-xl" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
              </div>
              <div class="bg-surface-container-lowest text-on-surface rounded-3xl rounded-bl-sm py-3 sm:py-4 px-4 sm:px-6 max-w-[85%] sm:max-w-3xl shadow-md">
                <!-- Loading -->
                <div v-if="msg.loading" class="flex items-center gap-2">
                  <span class="material-symbols-outlined animate-spin text-primary">sync</span>
                  <span class="text-on-surface-variant">Menganalisis...</span>
                </div>
                
                <!-- Parsed JSON -->
                <template v-else-if="msg.parsed">
                  <p class="font-body text-on-surface-variant mb-3">{{ msg.parsed.summary || msg.content }}</p>
                  
                  <div v-if="msg.parsed.data || msg.parsed.chart" class="mt-4 bg-surface-container-low rounded-xl p-4">
                    <div v-if="msg.parsed.data" class="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div v-for="(val, key) in msg.parsed.data" :key="key" class="bg-surface-container-lowest p-2 sm:p-3 rounded-lg">
                        <p class="text-xs text-secondary capitalize">{{ String(key).replace(/_/g, ' ') }}</p>
                        <p class="font-headline text-lg sm:text-xl">{{ formatValue(val) }}</p>
                      </div>
                    </div>
                    <div v-if="msg.parsed.chart?.length" class="h-24 flex items-end gap-1">
                      <div v-for="bar in msg.parsed.chart" :key="bar.label"
                           class="flex-1 bg-primary rounded-t-sm hover:bg-primary/80"
                           :style="{ height: `${Math.max(10, (bar.value / getMaxChartValue(msg.parsed.chart)) * 100)}%` }"></div>
                    </div>
                  </div>
                </template>
                
                <!-- Plain text -->
                <template v-else>
                  <p class="font-body text-sm sm:text-lg text-on-surface-variant">{{ msg.content }}</p>
                </template>
            </div>
            </template>
          </div>
        </div>

        <!-- Input Area (fixed at bottom) -->
        <div class="fixed bottom-0 left-0 right-0 p-3 sm:p-6 bg-gradient-to-t from-surface via-surface to-surface">
          <div class="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
            <input v-model="advisorQuestion" 
                   @keyup.enter="sendMessage"
                   class="flex-1 bg-surface-container-lowest border-none rounded-full px-4 sm:px-6 py-2 sm:py-4 text-sm sm:text-base text-on-surface placeholder:text-secondary focus:ring-2 focus:ring-primary/30" 
                   placeholder="Ketik pesan..." 
                   type="text"/>
            <button @click="sendMessage" 
                    :disabled="advisorLoading || !advisorQuestion.trim()" 
                    class="w-10 h-10 sm:w-14 sm:h-14 bg-primary text-on-primary rounded-full flex items-center justify-center hover:bg-primary-container disabled:opacity-50 transition-all shadow-lg">
              <span class="material-symbols-outlined text-lg sm:text-xl" style="font-variation-settings: 'FILL' 1;">send</span>
            </button>
          </div>
        </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
const chatMessages = ref<Array<{
  role: 'user' | 'ai'
  content: string
  parsed?: any
  loading?: boolean
}>>([])
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

async function sendMessage() {
  if (!advisorQuestion.value.trim() || advisorLoading.value) return
  
  const userQuestion = advisorQuestion.value.trim()
  advisorQuestion.value = ''
  
  chatMessages.value.push({
    role: 'user',
    content: userQuestion
  })
  
  chatMessages.value.push({
    role: 'ai',
    content: '',
    loading: true
  })
  
  advisorLoading.value = true
  
  try {
    const res = await insightsApi.askAdvisor(userQuestion)
    const rawAnswer = res.data?.data?.answer || res.data?.data
    
    let parsed = null
    try {
      const jsonMatch = rawAnswer.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      }
    } catch {}
    
    const lastMsg = chatMessages.value[chatMessages.value.length - 1]
    lastMsg.content = rawAnswer
    lastMsg.parsed = parsed
    lastMsg.loading = false
  } catch {
    const lastMsg = chatMessages.value[chatMessages.value.length - 1]
    lastMsg.content = 'Gagal mendapatkan jawaban. Coba lagi.'
    lastMsg.loading = false
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


