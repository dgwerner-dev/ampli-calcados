<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-6xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Produtos Cadastrados</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-soft"></div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-600">{{ error }}</p>
          </div>

          <!-- Products Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
            <div
              v-for="product in products"
              :key="product.id"
              class="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <!-- Product Image -->
              <div class="mb-3">
                <img
                  v-if="product.images && product.images.length > 0"
                  :src="product.images[0]"
                  :alt="product.name"
                  class="w-full h-32 object-cover rounded-lg"
                />
                <div v-else class="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>

              <!-- Product Info -->
              <div>
                <h3 class="font-medium text-gray-900 mb-1">{{ product.name }}</h3>
                <p class="text-sm text-gray-500 mb-2 line-clamp-2">{{ product.description }}</p>
                
                <!-- Price -->
                <div class="flex items-center mb-2">
                  <span v-if="product.salePrice" class="line-through text-gray-500 text-sm">
                    R$ {{ formatPrice(product.price) }}
                  </span>
                  <span class="ml-2 font-bold text-coral-soft">
                    R$ {{ formatPrice(product.salePrice || product.price) }}
                  </span>
                </div>

                <!-- Status Badges -->
                <div class="flex items-center space-x-2 mb-3">
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
                <div class="flex items-center space-x-2">
                  <button
                    @click="editProduct(product)"
                    class="text-coral-soft hover:text-coral-dark transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteProduct(product)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

// Debug log
console.log('ViewProductsModal props:', props.isOpen);

const emit = defineEmits(['close']);

// Estados
const loading = ref(false);
const error = ref(null);
const products = ref([]);

// Métodos
const closeModal = () => {
  emit('close');
};

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

const editProduct = (product) => {
  // Emitir evento para abrir modal de edição
  emit('edit-product', product);
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

// Carregar produtos quando o modal abrir
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      loadProducts();
    }
  }
);
</script> 