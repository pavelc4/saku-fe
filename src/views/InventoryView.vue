<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <!-- SideNavBar -->
    <Sidebar />

    <div class="flex-1 flex flex-col h-screen min-w-0 z-10">
      <!-- TopNavBar -->
      <TopNav :user="user" />

      <!-- Main Content Canvas -->
      <main class="flex-1 overflow-y-auto bg-surface rounded-tl-[32px] p-8 lg:p-12 shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)]">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h2 class="font-headline text-4xl font-semibold text-on-surface tracking-tight mb-2">Manajemen Inventaris</h2>
            <p class="text-on-surface-variant font-medium">Kelola dan pantau stok produk Anda.</p>
          </div>
          <button @click="openAddModal" class="bg-primary text-white font-medium px-6 py-3 rounded-full hover:bg-primary-container transition-colors flex items-center justify-center gap-2 shadow-[0_4px_24px_-4px_rgba(154,64,33,0.3)] cursor-pointer">
            <span class="material-symbols-outlined">add</span>
            Tambah Produk
          </button>
        </div>
        
        <!-- Summary Cards Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <!-- Total Products -->
          <div class="bg-surface-container-low rounded-lg p-6 flex flex-col justify-between h-40">
            <div class="flex items-center justify-between text-on-surface-variant">
              <span class="font-medium text-sm">Total Products</span>
              <span class="material-symbols-outlined">category</span>
            </div>
            <div>
              <span class="font-headline text-4xl font-medium text-on-surface">{{ totalProducts }}</span>
              <div class="flex items-center gap-1 text-sm text-tertiary mt-1">
                <span class="material-symbols-outlined text-[16px]">arrow_upward</span>
                <span>Produk aktif</span>
              </div>
            </div>
          </div>
          <!-- Low Stock Alerts -->
          <div class="bg-surface-container-low rounded-lg p-6 flex flex-col justify-between h-40">
            <div class="flex items-center justify-between text-on-surface-variant">
              <span class="font-medium text-sm">Low Stock Alerts</span>
              <span class="material-symbols-outlined text-error">warning</span>
            </div>
            <div>
              <span class="font-headline text-4xl font-medium text-error">{{ lowStockCount }}</span>
              <div class="text-sm text-on-surface-variant mt-1">
                <span>Perlu restock segera</span>
              </div>
            </div>
          </div>
          <!-- Inventory Value -->
          <div class="bg-surface-container-low rounded-lg p-6 flex flex-col justify-between h-40">
            <div class="flex items-center justify-between text-on-surface-variant">
              <span class="font-medium text-sm">Inventory Value</span>
              <span class="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div>
              <span class="font-headline text-4xl font-medium text-on-surface">{{ formatCurrency(inventoryValue) }}</span>
              <div class="text-sm text-on-surface-variant mt-1">
                <span>Total nilai stok</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tabs -->
        <div class="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <button v-for="tab in tabs" :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'px-6 py-2 rounded-full whitespace-nowrap transition-colors cursor-pointer',
                    activeTab === tab.id
                      ? 'bg-surface-container-highest text-on-surface font-semibold'
                      : 'bg-surface text-on-surface-variant hover:bg-surface-container-low font-medium'
                  ]">
            {{ tab.name }}
          </button>
        </div>
        
        <!-- Data Table -->
        <div class="flex flex-col gap-4">
          <!-- Table Header -->
          <div class="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-on-surface-variant border-b border-surface-container-highest/0 mb-2">
            <div class="col-span-4">Product Name & SKU</div>
            <div class="col-span-3">Category</div>
            <div class="col-span-3">Stock Level</div>
            <div class="col-span-2 text-right">Status</div>
          </div>
          
          <!-- Rows -->
          <div v-for="item in filteredItems" :key="item.id"
               :class="[
                 'bg-surface-container-lowest rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer group flex flex-col',
                 !item.active ? 'opacity-60 hover:opacity-100' : '',
                 expandedItem === item.sku ? 'shadow-sm' : ''
               ]"
               @click="toggleExpand(item.sku)">
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 lg:px-6">
              <div class="col-span-1 lg:col-span-4 flex items-center gap-4">
                <template v-if="item.image">
                  <img :src="getR2Url(item.image)" :alt="item.name" class="w-12 h-12 rounded-lg object-cover" />
                </template>
                <template v-else>
                  <div class="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                    <span class="material-symbols-outlined">{{ item.icon }}</span>
                  </div>
                </template>
                <div>
                  <div :class="[
                    'font-semibold transition-colors',
                    item.active ? 'text-on-surface group-hover:text-primary' : 'text-on-surface-variant line-through decoration-on-surface-variant/50'
                  ]">{{ item.name }}</div>
                  <div class="text-sm text-on-surface-variant font-mono mt-0.5">{{ item.sku }}</div>
                </div>
              </div>
              
              <div class="col-span-1 lg:col-span-3 text-sm text-on-surface-variant">
                {{ item.category }}
              </div>
              
              <div class="col-span-1 lg:col-span-3 flex items-center gap-2">
                <span :class="[
                  'font-medium flex items-center gap-1',
                  item.stock <= 5 && item.active ? 'text-error' : (item.active ? 'text-on-surface' : 'text-on-surface-variant')
                ]">
                  <span v-if="item.stock <= 5 && item.active" class="material-symbols-outlined text-[18px]">warning</span>
                  {{ item.stock }} Unit
                </span>
                <div v-if="item.active" :class="[
                  'h-1.5 w-16 rounded-full overflow-hidden',
                  item.stock <= 5 ? 'bg-error-container' : 'bg-surface-container-highest'
                ]">
                  <div :class="[
                    'h-full rounded-full',
                    item.stock <= 5 ? 'bg-error' : 'bg-tertiary'
                  ]" :style="{ width: Math.min(100, (item.stock / item.maxStock) * 100) + '%' }"></div>
                </div>
              </div>
              
              <div class="col-span-1 lg:col-span-2 lg:text-right">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  item.active 
                    ? 'bg-surface-container-highest text-on-surface' 
                    : 'bg-surface-container border border-outline-variant/50 text-on-surface-variant'
                ]">
                  {{ item.active ? 'Active' : 'Non-Aktif' }}
                </span>
              </div>
            </div>

            <!-- Expanded Actions Area -->
            <div v-if="expandedItem === item.sku" class="border-t border-surface-container-highest/50 p-4 lg:px-6 flex justify-end gap-3 bg-surface-container-low/30 rounded-b-lg" @click.stop>
              <button @click="openEditModal(item)" class="px-5 py-2 text-white text-sm font-medium transition-colors hover:opacity-90 flex items-center cursor-pointer" style="border-radius: 10px; background-color: #c96442;">
                Edit Product
              </button>
              <button @click="openDeleteModal(item)" class="px-5 py-2 text-white text-sm font-medium transition-colors hover:opacity-90 flex items-center cursor-pointer" style="border-radius: 10px; background-color: #b53333;">
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Edit Product Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 bg-on-background/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <!-- Modal Card -->
      <div class="bg-surface-container-lowest w-full max-w-2xl rounded-[32px] shadow-[0_32px_64px_-12px_rgba(27,28,24,0.08)] flex flex-col overflow-hidden max-h-[90vh]">
        <!-- Modal Header -->
        <div class="px-8 pt-8 pb-6 bg-surface-container-low flex justify-between items-start">
          <div>
            <h2 class="text-3xl font-headline text-on-background font-medium mb-2">Edit Produk</h2>
            <p class="text-sm font-label text-on-surface-variant">Update detail produk dan ketersediaan stok.</p>
          </div>
          <button @click="closeEditModal" class="text-on-surface-variant hover:bg-surface-variant p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer" type="button">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <!-- Modal Body (Form) -->
        <div class="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <form class="space-y-8" @submit.prevent="saveProduct">
            <!-- Basic Info Group -->
            <div class="space-y-6">
              <h3 class="text-sm font-headline font-semibold text-primary uppercase tracking-wider">Informasi Dasar</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Photo Upload -->
                <div class="flex items-center gap-4">
                  <div class="relative group cursor-pointer w-20 h-20 rounded-lg overflow-hidden bg-surface-container-low shrink-0">
                    <img v-if="editProductPreview || editingProduct.image" :src="editProductPreview || getR2Url(editingProduct.image)" alt="Preview" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <span class="material-symbols-outlined text-on-surface-variant text-2xl">add_photo_alternate</span>
                    </div>
                    <input type="file" ref="editProductImageInput" accept="image/*" class="hidden" @change="handleEditProductImage" />
                    <div @click="editProductImageInput?.click()" class="absolute inset-0 bg-on-surface/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span class="material-symbols-outlined text-surface text-lg">photo_camera</span>
                    </div>
                  </div>
                  <p class="text-sm text-on-surface-variant">Ganti photo</p>
                </div>
                <div class="col-span-1 md:col-span-2">
                  <label class="block text-sm font-medium text-on-background mb-2">Nama Produk</label>
                  <input v-model="editingProduct.name" class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 px-4 py-3 rounded-t-lg transition-colors text-on-background font-body placeholder:text-on-surface-variant/50" type="text"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-on-background mb-2">SKU</label>
                  <input v-model="editingProduct.sku" class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 px-4 py-3 rounded-t-lg transition-colors text-on-background font-body font-mono text-sm opacity-60 cursor-not-allowed" type="text" disabled/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-on-background mb-2">Kategori</label>
                  <div class="relative">
                    <select v-model="editingProduct.product_category_id" class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 px-4 py-3 rounded-t-lg transition-colors text-on-background font-body appearance-none pr-10">
                      <option v-for="cat in categoriesStore.items" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Inventory & Pricing Group -->
            <div class="space-y-6 pt-2">
              <h3 class="text-sm font-headline font-semibold text-primary uppercase tracking-wider">Inventaris & Harga</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-on-background mb-2">Unit</label>
                  <div class="relative">
                    <select class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 px-4 py-3 rounded-t-lg transition-colors text-on-background font-body appearance-none pr-10">
                      <option value="pcs">Pcs</option>
                      <option value="kg">Kg</option>
                      <option value="gram">Gram</option>
                      <option value="liter">Liter</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-on-background mb-2">Stok Tersedia</label>
                  <input v-model="editingProduct.stock" class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 px-4 py-3 rounded-t-lg transition-colors text-on-background font-body text-right" type="number"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-on-background mb-2">Harga Jual</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">Rp</span>
                    <input v-model="editingProduct.price" class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 pl-12 pr-4 py-3 rounded-t-lg transition-colors text-on-background font-body text-right" type="number" placeholder="0"/>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-on-background mb-2">Diskon (Rp)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">Rp</span>
                    <input v-model="editingProduct.discount" class="w-full bg-surface border-0 border-b-2 border-surface-variant focus:border-primary focus:bg-surface-container-lowest focus:ring-0 pl-12 pr-4 py-3 rounded-t-lg transition-colors text-on-background font-body text-right" type="number" placeholder="0"/>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Status Group -->
            <div class="pt-4 flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
              <div>
                <p class="text-base font-medium text-on-background">Status Produk</p>
                <p class="text-sm text-on-surface-variant">Produk aktif dapat dilihat dan dibeli di POS.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="editingProduct.is_active" class="sr-only peer" type="checkbox"/>
                <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span class="ml-3 text-sm font-medium text-primary">Aktif</span>
              </label>
            </div>
          </form>
        </div>
        
        <!-- Modal Footer (Actions) -->
        <div class="px-8 py-6 bg-surface-container-low flex justify-end items-center space-x-4">
          <button @click="closeEditModal" class="px-6 py-3 rounded-full text-on-background font-medium hover:bg-surface-variant transition-colors text-sm cursor-pointer" type="button">
            Batal
          </button>
          <button @click="saveProduct" :disabled="editLoading" class="px-8 py-3 rounded-full bg-primary text-on-primary font-medium shadow-[0_4px_12px_rgba(154,64,33,0.2)] hover:bg-primary-container transition-all text-sm flex items-center space-x-2 cursor-pointer disabled:opacity-50" type="button">
            <span class="material-symbols-outlined text-lg">save</span>
            <span>{{ editLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-on-surface/20 backdrop-blur-[2px]">
      <div class="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-[0_32px_64px_-16px_rgba(27,28,24,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-8 py-6 bg-surface-container-lowest flex justify-between items-center z-10">
          <div>
            <h2 class="font-headline text-3xl font-medium text-on-surface tracking-tight">Tambah Produk Baru</h2>
            <p class="text-on-surface-variant text-sm mt-1">Enter details for the new inventory item.</p>
          </div>
          <button @click="closeAddModal" class="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors focus:outline-none focus:ring-2 focus:ring-outline-variant/20 cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="px-8 py-6 overflow-y-auto flex-1 bg-surface-container-lowest custom-scrollbar">
          <form class="space-y-8" @submit.prevent="addProduct">
            <div class="space-y-6">
              <!-- Photo Upload -->
              <div class="flex items-center gap-6">
                <div class="relative group cursor-pointer w-24 h-24 rounded-lg overflow-hidden bg-surface-container-low shrink-0">
                  <img v-if="newProductPreview" :src="newProductPreview" alt="Preview" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="material-symbols-outlined text-on-surface-variant text-3xl">add_photo_alternate</span>
                  </div>
                  <input type="file" ref="newProductImageInput" accept="image/*" class="hidden" @change="handleNewProductImage" />
                  <div @click="newProductImageInput?.click()" class="absolute inset-0 bg-on-surface/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="material-symbols-outlined text-surface text-xl">photo_camera</span>
                  </div>
                </div>
                <div>
                  <p class="font-medium text-on-surface">Product Photo</p>
                  <p class="text-sm text-on-surface-variant">JPG, PNG, max 5MB</p>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-on-surface mb-2 font-label">Product Name</label>
                <input v-model="newProduct.name" class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(220,193,184,0.2)] transition-all font-body text-base" placeholder="e.g. Artisan Sourdough Loaf" type="text" required />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-on-surface mb-2 font-label">SKU (Unique Code)</label>
                  <input v-model="newProduct.sku" class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(220,193,184,0.2)] transition-all font-body text-base font-mono" placeholder="e.g. BKD-SRD-001" type="text" required />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-on-surface mb-2 font-label">Category</label>
                  <div class="relative">
                    <select v-model="newProduct.product_category_id" class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface appearance-none focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(220,193,184,0.2)] transition-all font-body text-base pr-10" required>
                      <option disabled value="">Select category</option>
                      <option v-for="cat in categoriesStore.items" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="pt-6 border-t-[1px] border-surface-variant/0">
              <h3 class="font-headline text-xl text-on-surface mb-4">Inventory Settings</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-on-surface mb-2 font-label">Harga Jual</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-body">Rp</span>
                    <input v-model="newProduct.price" class="w-full bg-surface-container-low border-none rounded-lg pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(220,193,184,0.2)] transition-all font-body text-base" placeholder="0" type="number" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-on-surface mb-2 font-label">Diskon (Rp)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-body">Rp</span>
                    <input v-model="newProduct.discount" class="w-full bg-surface-container-low border-none rounded-lg pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(220,193,184,0.2)] transition-all font-body text-base" placeholder="0" type="number" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-on-surface mb-2 font-label">Initial Stock</label>
                  <input v-model="newProduct.stock" class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(220,193,184,0.2)] transition-all font-body text-base" min="0" placeholder="0" type="number" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-on-surface mb-2 font-label">Unit</label>
                  <div class="relative">
                    <select class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface appearance-none focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(220,193,184,0.2)] transition-all font-body text-base pr-10">
                      <option value="pcs">Pcs</option>
                      <option value="box">Box</option>
                      <option value="kg">Kg</option>
                      <option value="liter">Liter</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="pt-6 pb-2">
              <div class="flex items-center justify-between p-4 rounded-lg bg-surface-container-low">
                <div>
                  <h4 class="font-semibold text-on-surface font-label text-sm">Product Status</h4>
                  <p class="text-xs text-on-surface-variant mt-0.5">Active products are visible in the POS.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="newProduct.active" class="sr-only peer" type="checkbox" />
                  <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span class="ms-3 text-sm font-medium text-on-surface-variant hidden">Active</span>
                </label>
              </div>
            </div>
          </form>
        </div>
        
        <div class="px-8 py-6 bg-surface-container-lowest flex justify-end gap-4 z-10">
          <button @click="closeAddModal" class="px-6 py-3 rounded-full text-on-surface font-semibold text-sm hover:bg-surface-container-highest transition-colors font-label cursor-pointer" type="button">
            Batal
          </button>
          <button @click="addProduct" :disabled="addLoading" class="px-8 py-3 rounded-full text-on-primary font-semibold text-sm bg-primary shadow-sm hover:bg-primary-container transition-all relative overflow-hidden font-label cursor-pointer disabled:opacity-50" type="button">
            <span class="relative z-10">{{ addLoading ? 'Menyimpan...' : 'Simpan Produk' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-on-background/20 backdrop-blur-md p-4">
      <div class="bg-surface-container-low rounded-xl w-full max-w-[440px] p-8 md:p-10 relative overflow-hidden" style="box-shadow: 0 24px 64px -12px rgba(27,28,24,0.15), 0 0 0 1px rgba(220,193,184,0.1);">
        <div class="mb-6 w-14 h-14 rounded-full bg-error-container/50 flex items-center justify-center text-error">
          <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">delete_forever</span>
        </div>
        <h2 class="font-headline text-[2rem] leading-tight font-medium text-on-surface mb-4 tracking-tight">Hapus Produk?</h2>
        <p class="font-body text-base text-on-surface-variant leading-relaxed mb-10">
          Tindakan ini bersifat permanen. Menghapus produk ini akan menghilangkannya secara permanen dari seluruh riwayat inventaris dan sistem POS Anda.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
          <button @click="closeDeleteModal" class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-container-highest text-on-surface font-body font-semibold hover:bg-surface-variant transition-colors duration-200 cursor-pointer" type="button">
            Batal
          </button>
          <button @click="confirmDelete" :disabled="deleteLoading" class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-error text-on-error font-body font-semibold shadow-sm hover:opacity-90 hover:shadow-md transition-all duration-200 relative overflow-hidden group cursor-pointer disabled:opacity-50" type="button">
            <span class="relative z-10 flex items-center gap-2">{{ deleteLoading ? 'Menghapus...' : 'Hapus Permanen' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';
import { useAuthStore, getR2Url } from '../stores/auth';
import { useProductsStore } from '../stores/products';
import { useCategoriesStore } from '../stores/categories';
import { productsApi } from '../api/products';

const authStore = useAuthStore();
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();

const user = computed(() => ({ name: authStore.user?.name || 'Admin', email: authStore.user?.email || '' }));

const activeTab = ref('semua');
const tabs = computed(() => [
  { id: 'semua', name: 'Semua' },
  ...categoriesStore.items.map(c => ({ id: c.id, name: c.name })),
  { id: 'non-aktif', name: 'Non-Aktif' },
]);

const filteredItems = computed(() => {
  if (activeTab.value === 'semua') return productsStore.items;
  if (activeTab.value === 'non-aktif') return productsStore.items.filter(p => !p.active);
  return productsStore.items.filter(p => p.category_id === activeTab.value);
});

const expandedItem = ref<string | null>(null);
const toggleExpand = (sku: string) => {
  expandedItem.value = expandedItem.value === sku ? null : sku;
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

// Summary computed values
const totalProducts = computed(() => productsStore.items.length);
const lowStockCount = computed(() => productsStore.items.filter(p => p.stock > 0 && p.stock <= 5).length);
const inventoryValue = computed(() => {
  return productsStore.items.reduce((sum, p) => sum + (p.price * p.stock), 0);
});

// Add Modal
const isAddModalOpen = ref(false);
const addLoading = ref(false);
const newProduct = ref({ name: '', sku: '', product_category_id: '', stock: 0, price: 0, discount: 0, is_active: true });
const newProductImageInput = ref<HTMLInputElement | null>(null);
const newProductImage = ref<File | null>(null);
const newProductPreview = ref<string | null>(null);

function handleNewProductImage(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    newProductImage.value = file;
    newProductPreview.value = URL.createObjectURL(file);
  }
}

const openAddModal = () => { isAddModalOpen.value = true; };
const closeAddModal = () => {
  isAddModalOpen.value = false;
  newProduct.value = { name: '', sku: '', product_category_id: '', stock: 0, price: 0, discount: 0, is_active: true };
  newProductImage.value = null;
  newProductPreview.value = null;
};
const addProduct = async () => {
  const payload = {
    name: newProduct.value.name,
    sku: newProduct.value.sku || null,
    product_category_id: newProduct.value.product_category_id || null,
    stock: Number(newProduct.value.stock) || 0,
    price: Number(newProduct.value.price) || 0,
    discount: Number(newProduct.value.discount) || 0,
    is_active: newProduct.value.is_active,
  };
  addLoading.value = true;
  const ok = await productsStore.createProduct(payload);
  
  // Upload photo if exists
  if (ok && newProductImage.value && productsStore.items[0]) {
    const productId = productsStore.items[0].id;
    await productsApi.uploadPhoto(productId, newProductImage.value);
  }
  
  addLoading.value = false;
  if (ok) closeAddModal();
};

// Edit Modal
const isEditModalOpen = ref(false);
const editLoading = ref(false);
const editingProduct = ref<any>({});
const editProductImageInput = ref<HTMLInputElement | null>(null);
const editProductImage = ref<File | null>(null);
const editProductPreview = ref<string | null>(null);

function handleEditProductImage(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    editProductImage.value = file;
    editProductPreview.value = URL.createObjectURL(file);
  }
}

const openEditModal = (item: any) => {
  editingProduct.value = {
    ...item,
    is_active: item.active,
    product_category_id: item.category_id,
  };
  editProductImage.value = null;
  editProductPreview.value = null;
  isEditModalOpen.value = true;
};
const closeEditModal = () => { 
  isEditModalOpen.value = false; 
  editProductImage.value = null;
  editProductPreview.value = null;
};
const saveProduct = async () => {
  const payload = {
    name: editingProduct.value.name,
    product_category_id: editingProduct.value.product_category_id || null,
    stock: Number(editingProduct.value.stock) || 0,
    price: Number(editingProduct.value.price) || 0,
    discount: Number(editingProduct.value.discount) || 0,
    is_active: editingProduct.value.is_active,
  };
  editLoading.value = true;
  const ok = await productsStore.updateProduct(editingProduct.value.id, payload);
  
  // Upload new photo if exists
  if (ok && editProductImage.value) {
    await productsApi.uploadPhoto(editingProduct.value.id, editProductImage.value);
  }
  
  if (ok) {
    await productsStore.fetchProducts();
    closeEditModal();
  }
  
  editLoading.value = false;
};

// Delete Modal
const isDeleteModalOpen = ref(false);
const deleteLoading = ref(false);
const productToDelete = ref<any>(null);
const openDeleteModal = (item: any) => { productToDelete.value = item; isDeleteModalOpen.value = true; };
const closeDeleteModal = () => { isDeleteModalOpen.value = false; productToDelete.value = null; };
const confirmDelete = async () => {
  if (!productToDelete.value) return;
  deleteLoading.value = true;
  await productsStore.deleteProduct(productToDelete.value.id);
  deleteLoading.value = false;
  closeDeleteModal();
};

onMounted(async () => {
  await Promise.all([productsStore.fetchProducts(), categoriesStore.fetchCategories()]);
});
</script>

