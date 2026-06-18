<template>
  <div class="h-full flex flex-col relative">
    <!-- Overlay backdrop -->
    <transition name="fade">
      <div v-if="sidebarOpen" @click="sidebarOpen = false"
        class="fixed inset-0 bg-black/30 z-30" />
    </transition>

    <!-- Conversation Sidebar (fixed overlay) -->
    <transition name="slide">
      <aside v-if="sidebarOpen"
        class="fixed left-0 top-0 bottom-0 z-40 w-72 sm:w-80 bg-surface-container-low border-r border-surface-container-high flex flex-col shadow-2xl">
        <div class="flex items-center justify-between p-3 sm:p-4">
          <span class="font-headline text-sm sm:text-base font-semibold text-on-surface">Riwayat Chat</span>
          <button @click="sidebarOpen = false" class="w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-highest transition-all">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div class="px-3 sm:px-4 pb-3">
          <button @click="newChat(); sidebarOpen = false"
            class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary-container hover:text-on-primary-container transition-all">
            <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">add</span>
            Chat Baru
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-2 sm:px-3 pb-2 space-y-0.5">
          <div v-for="c in conversations" :key="c.id"
            @click="switchConversation(c.id)"
            :class="['group flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm',
              c.id === conversationId
                ? 'bg-primary/10 text-primary'
                : 'text-secondary hover:bg-surface-container-highest hover:text-on-surface']">
            <span class="material-symbols-outlined text-base shrink-0">chat</span>

            <input v-if="editingId === c.id"
              :data-rename="c.id"
              v-model="editTitle"
              @click.stop
              @keyup.enter="saveRename(c.id)"
              @keyup.escape="cancelRename"
              @blur="saveRename(c.id)"
              class="flex-1 min-w-0 bg-surface-container-lowest rounded px-1.5 py-0.5 text-sm text-on-surface outline-none ring-1 ring-primary/40"
            />

            <span v-else class="flex-1 min-w-0 truncate" @dblclick.stop="startRename(c)">{{ c.title }}</span>

            <div class="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click.stop="startRename(c)"
                class="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container-highest text-secondary hover:text-on-surface">
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
              <button @click.stop="confirmDeleteId = c.id; confirmDeleteTitle = c.title"
                class="w-6 h-6 flex items-center justify-center rounded hover:bg-error/10 text-secondary hover:text-error">
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>

          <div v-if="!loadingConversations && conversations.length === 0" class="text-center text-xs text-secondary py-8">
            Belum ada percakapan
          </div>
          <div v-if="loadingConversations" class="text-center text-xs text-secondary py-8">Memuat...</div>
        </div>
      </aside>
    </transition>

    <!-- Chat Area -->
    <div class="flex flex-col flex-1 min-h-0">
      <!-- Toggle sidebar header -->
      <div class="sticky top-0 z-10 bg-surface/80 backdrop-blur-sm border-b border-surface-container-high">
        <div class="max-w-4xl mx-auto px-2 sm:px-4 h-11 sm:h-14 flex items-center gap-2">
          <button @click="sidebarOpen = !sidebarOpen"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-highest transition-all shrink-0">
            <span class="material-symbols-outlined text-lg">menu</span>
          </button>
          <span class="text-xs sm:text-sm font-medium text-secondary truncate">Riwayat Chat</span>
        </div>
      </div>

      <!-- Messages (scrollable) -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto">
        <!-- Welcome -->
        <div v-if="chatMessages.length === 0 && !advisorLoading" class="text-center max-w-2xl mx-auto mt-8 sm:mt-16 md:mt-24 px-6 sm:px-8">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-primary shadow-[0_8px_32px_rgba(27,28,24,0.06)]">
            <span class="material-symbols-outlined fill text-2xl sm:text-3xl" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
          </div>
          <h2 class="font-headline text-xl sm:text-3xl md:text-4xl text-on-surface mb-2 sm:mb-3">Selamat datang! Ada yang bisa saya bantu?</h2>
          <p class="text-secondary font-body text-sm sm:text-base">Tanyakan tentang penjualan, inventory, atau performa bisnismu.</p>
        </div>

        <!-- Messages list -->
        <div class="max-w-4xl mx-auto w-full flex flex-col gap-3 sm:gap-6 px-3 sm:px-4 py-3 sm:py-4">
          <div v-for="(msg, idx) in chatMessages" :key="idx"
               :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start items-end gap-1.5 sm:gap-3']">
            <!-- User Bubble -->
            <div v-if="msg.role === 'user'" class="bg-primary text-on-primary rounded-2xl rounded-tr-sm py-2 sm:py-3 px-3.5 sm:px-5 max-w-[90%] sm:max-w-xl shadow-md">
              <p class="font-body text-sm sm:text-lg break-words">{{ msg.content }}</p>
            </div>
            <!-- AI Bubble -->
            <template v-else>
              <div class="w-7 h-7 sm:w-10 sm:h-10 bg-surface-container-highest rounded-full flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined fill text-sm sm:text-xl" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
              </div>
              <div class="bg-surface-container-lowest text-on-surface rounded-3xl rounded-bl-sm py-2.5 sm:py-4 px-3.5 sm:px-6 max-w-[90%] sm:max-w-3xl shadow-md">
                <div v-if="msg.loading" class="flex items-center gap-2">
                  <span class="material-symbols-outlined animate-spin text-primary">sync</span>
                  <span class="text-on-surface-variant text-sm">Menganalisis...</span>
                </div>
                <template v-else-if="msg.parsed">
                  <div class="font-body text-sm sm:text-base text-on-surface-variant mb-3 [&_a]:text-primary [&_a]:underline [&_a]:font-medium [&_p]:mb-2 [&_p:last-child]:mb-0 whitespace-pre-wrap break-words" v-html="renderMarkdown(msg.parsed.summary || msg.content)"></div>
                  <div v-if="msg.parsed.data || msg.parsed.chart" class="mt-3 sm:mt-4 bg-surface-container-low rounded-xl p-3 sm:p-4">
                    <div v-if="msg.parsed.data" class="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div v-for="(val, key) in msg.parsed.data" :key="key" class="bg-surface-container-lowest p-2 sm:p-3 rounded-lg min-w-0">
                        <p class="text-[10px] sm:text-xs text-secondary capitalize truncate">{{ String(key).replace(/_/g, ' ') }}</p>
                        <p class="font-headline text-sm sm:text-xl truncate">{{ formatValue(val) }}</p>
                      </div>
                    </div>
                    <div v-if="msg.parsed.chart?.length" class="h-24 sm:h-32 flex items-end gap-1 sm:gap-2 pt-3 sm:pt-4">
                      <div v-for="bar in msg.parsed.chart" :key="bar.label"
                           class="flex-1 flex flex-col items-center justify-end gap-0.5 sm:gap-1 h-full min-w-0">
                        <span v-if="bar.income != null || bar.expense != null" class="text-[9px] sm:text-xs font-semibold text-on-surface-variant leading-none">
                          {{ formatChartValue(Math.max(bar.income||0, bar.expense||0)) }}
                        </span>
                        <span v-else-if="bar.value" class="text-[9px] sm:text-xs font-semibold text-on-surface-variant leading-none">
                          {{ formatChartValue(bar.value) }}
                        </span>
                        <div class="w-full flex flex-col justify-end gap-0.5" style="flex:1">
                          <template v-if="bar.income != null || bar.expense != null">
                            <div v-if="bar.income != null"
                                 class="w-full rounded-t-sm transition-all duration-500 ease-out hover:opacity-80"
                                 :style="{ height: `${Math.max(4, (bar.income / getMaxChartValue(msg.parsed.chart)) * 100)}%`, background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)' }"
                                 :title="'Pemasukan: ' + formatCurrency(bar.income)">
                            </div>
                            <div v-if="bar.expense != null"
                                 class="w-full rounded-t-sm transition-all duration-500 ease-out hover:opacity-80"
                                 :style="{ height: `${Math.max(4, (bar.expense / getMaxChartValue(msg.parsed.chart)) * 100)}%`, background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)' }"
                                 :title="'Pengeluaran: ' + formatCurrency(bar.expense)">
                            </div>
                          </template>
                          <div v-else
                               class="w-full rounded-t-sm transition-all duration-500 ease-out hover:opacity-80"
                               :style="{ height: `${Math.max(4, ((bar.value||0) / getMaxChartValue(msg.parsed.chart)) * 100)}%`, background: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)' }"
                               :title="formatCurrency(bar.value)">
                          </div>
                        </div>
                        <span class="text-[9px] sm:text-xs text-secondary font-medium leading-none truncate w-full text-center">{{ bar.label }}</span>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="font-body text-sm sm:text-base text-on-surface-variant [&_a]:text-primary [&_a]:underline [&_a]:font-medium [&_p]:mb-2 [&_p:last-child]:mb-0 whitespace-pre-wrap break-words" v-html="renderMarkdown(msg.content)"></div>
                </template>
              </div>
            </template>
          </div>
        </div>

        <!-- Bottom padding so last message isn't behind input -->
        <div class="h-4 sm:h-6" />
      </div>

      <!-- Input Area -->
      <div class="bg-gradient-to-t from-surface via-surface to-surface">
        <div class="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-5">
          <input v-model="advisorQuestion"
                 @keyup.enter="sendMessage"
                 class="flex-1 bg-surface-container-lowest border-none rounded-full px-4 sm:px-6 py-2.5 sm:py-4 text-sm sm:text-base text-on-surface placeholder:text-secondary/60 focus:ring-2 focus:ring-primary/30 focus:outline-none"
                 :placeholder="inputPlaceholder"
                 type="text"/>
          <button @click="sendMessage"
                  :disabled="advisorLoading || !advisorQuestion.trim()"
                  class="w-10 h-10 sm:w-14 sm:h-14 bg-primary text-on-primary rounded-full flex items-center justify-center hover:bg-primary-container disabled:opacity-40 transition-all shadow-lg shrink-0">
            <span class="material-symbols-outlined text-lg sm:text-xl" style="font-variation-settings: 'FILL' 1;">send</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <teleport to="body">
      <div v-if="confirmDeleteId" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" @click.self="confirmDeleteId = null">
        <div class="bg-surface-container-lowest rounded-2xl rounded-b-none sm:rounded-b-2xl p-5 sm:p-6 w-full sm:max-w-sm mx-0 sm:mx-4 shadow-xl">
          <div class="flex items-start gap-3 sm:gap-4">
            <div class="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error shrink-0">
              <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">delete</span>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="font-headline text-base sm:text-lg text-on-surface mb-1">Hapus percakapan?</h3>
              <p class="text-sm text-secondary break-words">"{{ confirmDeleteTitle }}" akan dihapus permanen.</p>
            </div>
          </div>
          <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-5 sm:mt-6">
            <button @click="confirmDeleteId = null"
              class="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg text-sm font-medium text-secondary hover:bg-surface-container-highest transition-all">Batal</button>
            <button @click="executeDelete"
              class="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg text-sm font-medium bg-error text-on-error hover:bg-error/90 transition-all">Hapus</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { insightsApi } from '../api/insights';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const authStore = useAuthStore();
const user = computed(() => ({ name: authStore.user?.name || 'Admin', email: authStore.user?.email || '' }));

const loading = ref(false)
const error = ref<string | null>(null)

const monthly = ref<any>(null)
const daily = ref<any>(null)
const productIntel = ref<any>(null)
const cashflow = ref<any>(null)

const advisorQuestion = ref('')
const sidebarOpen = ref(false)
const conversationId = ref<string>('')
const conversations = ref<Array<{ id: string; title: string; created_at: number; updated_at: number; message_count: number }>>([])
const loadingConversations = ref(false)
const chatMessages = ref<Array<{
  role: 'user' | 'ai'
  content: string
  parsed?: any
  loading?: boolean
}>>([])
const advisorLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

// Rename state
const editingId = ref<string | null>(null)
const editTitle = ref('')

// Delete state
const confirmDeleteId = ref<string | null>(null)
const confirmDeleteTitle = ref('')

function detectLang(text: string): 'id' | 'en' {
  const enWords = ['how', 'what', 'when', 'where', 'why', 'who', 'can', 'please', 'hello', 'hi', 'hey', 'sales', 'profit', 'stock', 'product', 'help', 'tell', 'show', 'my', 'is', 'the', 'are', 'was', 'give', 'find', 'check', 'want', 'need', 'thanks', 'thank', 'would', 'could', 'should', 'good', 'do', 'does', 'did', 'have', 'has']
  const words = text.toLowerCase().split(/\s+/)
  let en = 0, id = 0
  for (const w of words) {
    if (enWords.includes(w)) en++
    if (w.endsWith('nya') || w.endsWith('ku') || w.endsWith('mu') || w === 'gak' || w === 'nggak' || w === 'udah' || w === 'aja' || w === 'sih') id++
  }
  if (words.length <= 3) return id >= en ? 'id' : 'en'
  return en > id ? 'en' : 'id'
}

const inputPlaceholder = computed(() => {
  if (!advisorQuestion.value.trim()) return 'Ketik pesan...'
  return detectLang(advisorQuestion.value) === 'en' ? 'Type a message...' : 'Ketik pesan...'
})

async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

watch(() => chatMessages.value.length, () => scrollToBottom())

async function fetchConversations() {
  loadingConversations.value = true
  try {
    const res = await insightsApi.getConversations()
    const raw = res.data?.data?.conversations
    conversations.value = Array.isArray(raw) ? raw : []
  } catch {
    conversations.value = []
  } finally {
    loadingConversations.value = false
  }
}

async function loadConversationMessages(id: string) {
  conversationId.value = id
  advisorLoading.value = true
  try {
    const res = await insightsApi.getConversationMessages(id)
    const msgs = res.data?.data?.messages
    if (!Array.isArray(msgs)) { chatMessages.value = []; return }
    chatMessages.value = msgs.map((m: any) => ({
      role: m.role,
      content: m.content,
      parsed: null,
      loading: false
    }))
  } catch {
    chatMessages.value = []
  } finally {
    advisorLoading.value = false
  }
}

function startRename(c: { id: string; title: string }) {
  editingId.value = c.id
  editTitle.value = c.title
  nextTick(() => {
    const el = document.querySelector<HTMLInputElement>(`input[data-rename="${c.id}"]`)
    el?.focus()
    el?.select()
  })
}

function cancelRename() {
  editingId.value = null
  editTitle.value = ''
}

async function saveRename(id: string) {
  if (editingId.value !== id) return
  const title = editTitle.value.trim()
  if (!title) { cancelRename(); return }
  editingId.value = null
  editTitle.value = ''
  try {
    await insightsApi.renameConversation(id, title)
    const c = conversations.value.find(c => c.id === id)
    if (c) c.title = title
  } catch {}
}

function newChat() {
  conversationId.value = crypto.randomUUID?.() || Math.random().toString(36).slice(2, 15)
  chatMessages.value = []
  advisorQuestion.value = ''
}

async function switchConversation(id: string) {
  if (id === conversationId.value) return
  await loadConversationMessages(id)
  sidebarOpen.value = false
}

async function executeDelete() {
  const id = confirmDeleteId.value
  confirmDeleteId.value = null
  if (!id) return
  try {
    await insightsApi.deleteConversation(id)
    conversations.value = conversations.value.filter(c => c.id !== id)
    if (conversationId.value === id) newChat()
  } catch {}
}

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
    const res = await insightsApi.askAdvisor(userQuestion, conversationId.value)

    if (res.data?.data?.conversation_id) {
      conversationId.value = res.data.data.conversation_id;
    }
    fetchConversations()
    const rawAnswer = res.data?.data?.answer || res.data?.data

    let parsed = null

    if (typeof rawAnswer === 'object' && rawAnswer !== null) {
      parsed = rawAnswer
    } else if (typeof rawAnswer === 'string') {
      try {
        const jsonMatch = rawAnswer.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0])
        }
      } catch {}
    }

    const lastMsg = chatMessages.value[chatMessages.value.length - 1]
    lastMsg.content = typeof rawAnswer === 'string' ? rawAnswer : (parsed?.summary || '')
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
  if (!chart || !Array.isArray(chart) || !chart.length) return 1
  const max = Math.max(...chart.map((c: any) => {
    if (c.income != null || c.expense != null) return Math.max(c.income || 0, c.expense || 0)
    return c.value || 0
  }), 1)
  return max
}

const formatChartValue = (val: number) => {
  if (!val) return ''
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'jt'
  if (val >= 1_000) return (val / 1_000).toFixed(0) + 'rb'
  return String(val)
}

const renderMarkdown = (text: string) => {
  if (!text) return '';
  const rawHtml = marked.parse(text, { async: false }) as string;
  return DOMPurify.sanitize(rawHtml);
}

onMounted(() => {
  conversationId.value = crypto.randomUUID?.() || Math.random().toString(36).slice(2, 15);
  fetchInsights();
  fetchConversations();
})
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
