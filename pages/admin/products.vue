<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gerenciar Produtos</h1>
            <p class="text-sm text-gray-600">Visualize, edite e gerencie todos os produtos</p>
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

      <!-- Products Table -->
      <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-900">Produtos ({{ products.length }})</h2>
            <div class="flex items-center space-x-4">
              <!-- Search -->
              <div class="relative">
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="Buscar produtos..."
                  class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                />
                <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <!-- Filter -->
              <select
                v-model="selectedCategory"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <img
                        v-if="product.images && product.images.length > 0"
                        :src="product.images[0]"
                        :alt="product.name"
                        class="h-12 w-12 rounded-lg object-cover"
                      />
                      <div v-else class="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-sm text-gray-500">{{ product.slug }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ getCategoryName(product.categoryId) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <span v-if="product.salePrice" class="line-through text-gray-500">
                      R$ {{ formatPrice(product.price) }}
                    </span>
                    <span class="ml-2 font-medium">
                      R$ {{ formatPrice(product.salePrice || product.price) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <span
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ product.inStock ? 'Em estoque' : 'Sem estoque' }}
                    </span>
                    <span
                      v-if="product.featured"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      Destaque
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0 && !loading" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ searchTerm || selectedCategory ? 'Tente ajustar os filtros.' : 'Comece criando seu primeiro produto.' }}
          </p>
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
// Middleware para verificar se é admin
definePageMeta({
  middleware: 'auth'
});

const { user } = useAuth();

// Verificar se é admin
if (!user.value || user.value.role !== 'ADMIN') {
  await navigateTo('/');
}

// Estados
const loading = ref(false);
const error = ref(null);
const products = ref([]);
const categories = ref([]);
const searchTerm = ref('');
const selectedCategory = ref('');
const showProductModal = ref(false);
const editingProduct = ref(null);

// Computed
const filteredProducts = computed(() => {
  let filtered = products.value;

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.slug.toLowerCase().includes(term)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.categoryId === selectedCategory.value);
  }

  return filtered;
});

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

const loadCategories = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (fetchError) throw fetchError;
    categories.value = data || [];
  } catch (err) {
    console.error('Erro ao carregar categorias:', err);
  }
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Categoria não encontrada';
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

    // Recarregar produtos
    await loadProducts();
  } catch (err) {
    error.value = err.message || 'Erro ao excluir produto';
  }
};

// Carregar dados na montagem
onMounted(() => {
  loadProducts();
  loadCategories();
});
</script> 