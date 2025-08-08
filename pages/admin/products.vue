<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Produtos Cadastrados</h1>
            <p class="text-sm text-gray-600">Visualize todos os produtos da loja</p>
          </div>
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-coral-soft hover:bg-coral-dark transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Novo Produto
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-soft"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Product Image -->
          <div class="aspect-w-1 aspect-h-1 w-full">
            <img
              v-if="product.images && product.images.length > 0"
              :src="product.images[0]"
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
            <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-500 mb-3">{{ product.description }}</p>
            
            <!-- Price -->
            <div class="flex items-center mb-3">
              <span v-if="product.salePrice" class="line-through text-gray-500 text-sm">
                R$ {{ formatPrice(product.price) }}
              </span>
              <span class="ml-2 text-lg font-bold text-coral-soft">
                R$ {{ formatPrice(product.salePrice || product.price) }}
              </span>
            </div>

            <!-- Status Badges -->
            <div class="flex items-center space-x-2 mb-4">
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  product.inStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ product.inStock ? 'Em estoque' : 'Sem estoque' }}
              </span>
              <span
                v-if="product.featured"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                Destaque
              </span>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between">
              <button
                @click="editProduct(product)"
                class="text-coral-soft hover:text-coral-dark transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                @click="deleteProduct(product)"
                class="text-red-600 hover:text-red-800 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="products.length === 0 && !loading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">Comece criando seu primeiro produto.</p>
        <div class="mt-6">
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-coral-soft hover:bg-coral-dark transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Criar Produto
          </button>
        </div>
      </div>
    </div>

    <!-- Product Modal -->
    <ProductModal
      :is-open="showProductModal"
      :product="editingProduct"
      @close="closeProductModal"
      @saved="handleProductSaved"
    />
  </div>
</template>

<script setup>
const { user } = useAuth();

// Estados
const loading = ref(false);
const error = ref(null);
const products = ref([]);
const showProductModal = ref(false);
const editingProduct = ref(null);

// Métodos
const loadProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('createdAt', { ascending: false });

    if (fetchError) throw fetchError;
    products.value = data || [];
  } catch (err) {
    error.value = err.message || 'Erro ao carregar produtos';
  } finally {
    loading.value = false;
  }
};

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2).replace('.', ',');
};

const openCreateModal = () => {
  editingProduct.value = null;
  showProductModal.value = true;
};

const editProduct = (product) => {
  editingProduct.value = product;
  showProductModal.value = true;
};

const closeProductModal = () => {
  showProductModal.value = false;
  editingProduct.value = null;
};

const handleProductSaved = () => {
  loadProducts();
  closeProductModal();
};

const deleteProduct = async (product) => {
  if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
    return;
  }

  try {
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

    if (deleteError) throw deleteError;

    await loadProducts();
  } catch (err) {
    error.value = err.message || 'Erro ao excluir produto';
  }
};

// Carregar produtos na montagem
onMounted(() => {
  loadProducts();
});
</script> 