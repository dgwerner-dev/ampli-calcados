<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
      <h1 class="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'products'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'products'
                ? 'border-coral-soft text-coral-soft'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Produtos
          </button>
          <button
            @click="activeTab = 'categories'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'categories'
                ? 'border-coral-soft text-coral-soft'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Categorias
          </button>
        </nav>
      </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'" class="space-y-6">
        <!-- Products Header -->
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Gerenciar Produtos</h3>
          <button
            @click="openCreateProductModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-coral-soft hover:bg-coral-dark transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Novo Produto
          </button>
        </div>

        <!-- Products Loading -->
        <div v-if="productsLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-soft"></div>
        </div>

        <!-- Products Error -->
        <div v-else-if="productsError" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-600">{{ productsError }}</p>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div
                v-else
                class="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
            </div>

            <!-- Product Info -->
            <div>
              <h4 class="font-medium text-gray-900 mb-1">{{ product.name }}</h4>
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
                    product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
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
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="deleteProduct(product)"
                  class="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Empty State -->
        <div v-if="products.length === 0 && !productsLoading" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            ></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
          <p class="mt-1 text-sm text-gray-500">Comece criando seu primeiro produto.</p>
        </div>
      </div>

      <!-- Categories Tab -->
      <div v-if="activeTab === 'categories'" class="space-y-6">
        <!-- Categories Header -->
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Gerenciar Categorias</h3>
          <button
            @click="openCreateCategoryModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-coral-soft hover:bg-coral-dark transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Nova Categoria
          </button>
        </div>

        <!-- Categories Loading -->
        <div v-if="categoriesLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-soft"></div>
        </div>

        <!-- Categories Error -->
        <div v-else-if="categoriesError" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-600">{{ categoriesError }}</p>
        </div>

        <!-- Categories Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="category in categories"
            :key="category.id"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <!-- Category Image -->
            <div class="mb-3">
              <img
                v-if="category.image"
                :src="category.image"
                :alt="category.name"
                class="w-full h-32 object-cover rounded-lg"
              />
              <div
                v-else
                class="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
            </div>

            <!-- Category Info -->
            <div>
              <h4 class="font-medium text-gray-900 mb-1">{{ category.name }}</h4>
              <p class="text-sm text-gray-500 mb-2">
                {{ category.description || 'Sem descrição' }}
              </p>
              <p class="text-xs text-gray-400 mb-3">Slug: {{ category.slug }}</p>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <button
                  @click="editCategory(category)"
                  class="text-coral-soft hover:text-coral-dark transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="deleteCategory(category)"
                  class="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories Empty State -->
        <div v-if="categories.length === 0 && !categoriesLoading" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma categoria encontrada</h3>
          <p class="mt-1 text-sm text-gray-500">Comece criando sua primeira categoria.</p>
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

    <!-- Category Modal -->
    <CategoryModal
      :is-open="showCategoryModal"
      :category="editingCategory"
      @close="closeCategoryModal"
      @saved="handleCategorySaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Estados
const activeTab = ref('products');
const productsLoading = ref(false);
const categoriesLoading = ref(false);
const productsError = ref(null);
const categoriesError = ref(null);
const products = ref([]);
const categories = ref([]);
const showProductModal = ref(false);
const showCategoryModal = ref(false);
const editingProduct = ref(null);
const editingCategory = ref(null);

const supabase = useSupabaseClient();

// Métodos
const loadProducts = async () => {
  productsLoading.value = true;
  productsError.value = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('createdAt', { ascending: false });

    if (fetchError) throw fetchError;
    products.value = data || [];
  } catch (err) {
    productsError.value = err.message || 'Erro ao carregar produtos';
  } finally {
    productsLoading.value = false;
  }
};

const loadCategories = async () => {
  categoriesLoading.value = true;
  categoriesError.value = null;

  try {
    const { data, error: fetchError } = await supabase.from('categories').select('*').order('name');

    if (fetchError) throw fetchError;
    categories.value = data || [];
  } catch (err) {
    categoriesError.value = err.message || 'Erro ao carregar categorias';
  } finally {
    categoriesLoading.value = false;
  }
};

const formatPrice = price => {
  if (typeof price !== 'number') return '0,00';
  return price.toFixed(2).replace('.', ',');
};

const openCreateProductModal = () => {
  editingProduct.value = null;
  showProductModal.value = true;
};

const editProduct = product => {
  editingProduct.value = { ...product };
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

const deleteProduct = async product => {
  if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
    return;
  }

  try {
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id);

    if (deleteError) throw deleteError;

    await loadProducts();
  } catch (err) {
    productsError.value = err.message || 'Erro ao excluir produto';
  }
};

const openCreateCategoryModal = () => {
  editingCategory.value = null;
  showCategoryModal.value = true;
};

const editCategory = category => {
  editingCategory.value = { ...category };
  showCategoryModal.value = true;
};

const closeCategoryModal = () => {
  showCategoryModal.value = false;
  editingCategory.value = null;
};

const handleCategorySaved = () => {
  loadCategories();
  closeCategoryModal();
};

const deleteCategory = async category => {
  if (!confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
    return;
  }

  try {
    const { error: deleteError } = await supabase.from('categories').delete().eq('id', category.id);

    if (deleteError) throw deleteError;

    await loadCategories();
  } catch (err) {
    categoriesError.value = err.message || 'Erro ao excluir categoria';
  }
};

// Carregar dados quando a página for montada
onMounted(() => {
  loadProducts();
  loadCategories();
});

definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
});

useHead({
  title: 'Admin - AMPLI CALÇADOS',
});
</script>
