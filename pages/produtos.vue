<template>
  <ClientOnly>
    <div class="min-h-screen bg-gray-50 pt-32">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header da página -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ selectedSize ? `Produtos - Tamanho ${selectedSize}` : 'Todos os Produtos' }}
        </h1>
        <p class="text-gray-600">
          {{
            selectedSize
              ? `Encontramos ${filteredProducts.length} produto(s) no tamanho ${selectedSize}`
              : 'Explore nossa coleção completa'
          }}
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div class="flex flex-wrap items-center gap-4">
          <span class="text-gray-700 font-medium">Filtrar por tamanho:</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="size in availableSizes"
              :key="size"
              @click="filterBySize(size)"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                selectedSize === size
                  ? 'bg-coral-soft text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ size }}
            </button>
            <button
              @click="clearFilter"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                !selectedSize
                  ? 'bg-coral-soft text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              Todos
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white rounded-lg shadow-sm p-4 animate-pulse">
          <div class="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div class="space-y-2">
            <div class="bg-gray-200 h-4 rounded"></div>
            <div class="bg-gray-200 h-4 rounded w-2/3"></div>
            <div class="bg-gray-200 h-6 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Produtos -->
      <div
        v-else-if="filteredProducts.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full"
        >
                      <NuxtLink :to="`/produto/${product.slug}`" class="flex flex-col h-full">
              <div class="relative flex-shrink-0">
                <img
                  :src="product.images?.[0] || '/images/placeholder.jpg'"
                  :alt="product.name"
                  class="w-full h-48 object-cover"
                />
              </div>
              <div class="p-4 flex flex-col flex-grow">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                {{ product.name }}
              </h3>
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p v-if="product.salePrice" class="text-2xl font-bold text-coral-soft">
                    R$ {{ product.salePrice.toFixed(2) }}
                  </p>
                  <p v-else class="text-2xl font-bold text-coral-soft">
                    R$ {{ product.price.toFixed(2) }}
                  </p>
                  <p v-if="product.salePrice" class="text-sm text-gray-500 line-through">
                    R$ {{ product.price.toFixed(2) }}
                  </p>
                </div>
                <div v-if="!selectedSize && product.sizes && product.sizes.length > 0" class="text-sm text-gray-600">
                  Tamanhos: {{ product.sizes.join(', ') }}
                </div>
              </div>
              <button
                @click.prevent="addProductToCart(product)"
                class="w-full bg-coral-soft text-white py-2 px-4 rounded-lg hover:bg-coral-dark transition-colors duration-200 font-medium mt-auto"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="bg-white rounded-lg p-8 max-w-md mx-auto">
          <svg
            class="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{
              selectedSize
                ? `Nenhum produto disponível no tamanho ${selectedSize}`
                : 'Nenhum produto encontrado'
            }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{
              selectedSize
                ? `Infelizmente não temos produtos no tamanho ${selectedSize} no momento. Tente outro tamanho ou explore nossa coleção completa.`
                : 'Tente ajustar os filtros ou explore nossa coleção.'
            }}
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              @click="clearFilter"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-coral-soft hover:bg-coral-dark"
            >
              Ver Todos os Produtos
            </button>
            <button
              v-if="selectedSize"
              @click="filterBySize(40)"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Ver Tamanho 40
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <template #fallback>
    <div class="min-h-screen bg-gray-50 pt-32">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="text-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-soft mx-auto"></div>
          <p class="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    </div>
  </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const route = useRoute();
const { addToCart } = useCart();
const { success, error: notificationError } = useNotifications();

// Estados
const loading = ref(false);
const products = ref([]);
const selectedSize = ref<number | null>(null);
const availableSizes = [40, 41, 42, 43];

// Computed
const filteredProducts = computed(() => {
  if (!selectedSize.value) {
    return products.value;
  }

  return products.value.filter(product => {
    return product.sizes && Array.isArray(product.sizes) && product.sizes.includes(selectedSize.value.toString());
  });
});

// Funções
const loadProducts = async () => {
  loading.value = true;
  try {
    const data = await $fetch('/api/products');
    products.value = data || [];
  } catch (err) {
    console.error('Erro ao carregar produtos:', err);
    notificationError('Erro ao carregar produtos');
  } finally {
    loading.value = false;
  }
};

const filterBySize = (size: number) => {
  selectedSize.value = size;
  // Atualizar URL
  navigateTo({
    query: { ...route.query, tamanho: size.toString() },
  });
};

const clearFilter = () => {
  selectedSize.value = null;
  // Limpar query da URL
  navigateTo({
    query: { ...route.query, tamanho: undefined },
  });
};

const addProductToCart = async (product: any) => {
  try {
    const result = await addToCart(product, 1);

    if (result.success) {
      success(`✅ ${product.name} adicionado ao carrinho!`);
    } else {
      notificationError(result.error || 'Erro ao adicionar produto ao carrinho');
    }
  } catch (err) {
    console.error('Erro ao adicionar produto ao carrinho:', err);
    notificationError('Erro ao adicionar produto ao carrinho. Tente novamente.');
  }
};

// Inicialização
onMounted(async () => {
  // Verificar se há filtro na URL
  const tamanhoQuery = route.query.tamanho;
  if (tamanhoQuery) {
    const size = parseInt(tamanhoQuery as string);
    if (availableSizes.includes(size)) {
      selectedSize.value = size;
    }
  }

  await loadProducts();
});

// Head
useHead({
  title: computed(() =>
    selectedSize.value
      ? `Produtos - Tamanho ${selectedSize.value} - AMPLI CALÇADOS`
      : 'Produtos - AMPLI CALÇADOS'
  ),
  meta: [
    {
      name: 'description',
      content: computed(() =>
        selectedSize.value
          ? `Encontre calçados no tamanho ${selectedSize.value} na AMPLI CALÇADOS`
          : 'Explore nossa coleção completa de calçados na AMPLI CALÇADOS'
      ),
    },
  ],
});
</script>
