<template>
  <div>
    <AppHeader />
    <div class="pt-20">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Header da página -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Lista de Desejos</h1>
          <p class="text-gray-600">
            {{ wishlist.length }} {{ wishlist.length === 1 ? 'produto' : 'produtos' }} na sua lista
          </p>
        </div>

        <!-- Loading state -->
        <div
          v-if="loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            v-for="i in 8"
            :key="i"
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div class="animate-pulse">
              <div class="h-48 bg-gray-200"></div>
              <div class="p-4">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Wishlist vazia -->
        <div v-else-if="wishlist.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Sua lista de desejos está vazia</h3>
          <p class="text-gray-600 mb-6">
            Adicione produtos que você gostaria de comprar mais tarde.
          </p>
          <NuxtLink
            to="/produtos"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-coral-soft hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-colors duration-200"
          >
            Ver Produtos
          </NuxtLink>
        </div>

        <!-- Lista de produtos -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="item in wishlist"
            :key="item.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <!-- Imagem do produto -->
            <div class="relative">
              <NuxtLink :to="`/produto/${item.product.slug}`">
                <img
                  :src="item.product.images[0] || '/placeholder-product.jpg'"
                  :alt="item.product.name"
                  class="w-full h-48 object-cover"
                  loading="lazy"
                  @error="$event.target.src = '/placeholder-product.jpg'"
                />
              </NuxtLink>

              <!-- Botão remover da wishlist -->
              <button
                @click="handleRemoveFromWishlist(item.productId)"
                :disabled="removingItem === item.productId"
                class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                title="Remover da lista de desejos"
              >
                <svg
                  v-if="removingItem !== item.productId"
                  class="w-4 h-4 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 text-gray-600 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            <!-- Informações do produto -->
            <div class="p-4">
              <NuxtLink :to="`/produto/${item.product.slug}`" class="block">
                <h3
                  class="text-sm font-medium text-gray-900 mb-2 hover:text-coral-soft transition-colors duration-200"
                >
                  {{ item.product.name }}
                </h3>
              </NuxtLink>

              <!-- Preço -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <span v-if="item.product.salePrice" class="text-lg font-bold text-coral-soft">
                    R$ {{ formatPrice(item.product.salePrice) }}
                  </span>
                  <span v-else class="text-lg font-bold text-gray-900">
                    R$ {{ formatPrice(item.product.price) }}
                  </span>
                  <span v-if="item.product.salePrice" class="text-sm text-gray-500 line-through">
                    R$ {{ formatPrice(item.product.price) }}
                  </span>
                </div>
              </div>

              <!-- Botões de ação -->
              <div class="flex space-x-2">
                <button
                  @click="handleAddToCart(item.productId)"
                  :disabled="addingToCart === item.productId"
                  class="flex-1 bg-coral-soft text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="addingToCart !== item.productId">Adicionar ao Carrinho</span>
                  <span v-else class="flex items-center justify-center">
                    <svg
                      class="w-4 h-4 animate-spin mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Adicionando...
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth', requiresAuth: true });

useHead({
  title: 'Lista de Desejos - AMPLI CALÇADOS',
  meta: [
    {
      name: 'description',
      content: 'Gerencie sua lista de desejos na AMPLI CALÇADOS',
    },
  ],
});

const { wishlist, loading, removeFromWishlist, addToWishlist, loadWishlist } = useWishlist();
const { addToCart } = useCart();
const { success, error } = useNotifications();

const removingItem = ref(null);
const addingToCart = ref(null);

// Formatar preço
const formatPrice = price => {
  return Number(price).toFixed(2).replace('.', ',');
};

// Remover da wishlist
const handleRemoveFromWishlist = async productId => {
  try {
    removingItem.value = productId;
    await removeFromWishlist(productId);
    success('Produto removido da lista de desejos');
  } catch (err) {
    error('Erro ao remover produto da lista de desejos');
  } finally {
    removingItem.value = null;
  }
};

// Adicionar ao carrinho
const handleAddToCart = async productId => {
  try {
    addingToCart.value = productId;
    const { addToCart: addToCartFn } = useCart();
    await addToCartFn(productId, 1);
    success('Produto adicionado ao carrinho');
  } catch (err) {
    error('Erro ao adicionar produto ao carrinho');
  } finally {
    addingToCart.value = null;
  }
};

// Carregar wishlist quando o componente for montado
onMounted(() => {
  if (process.client) {
    // Aguardar um pouco para garantir que a autenticação foi carregada
    nextTick(() => {
      loadWishlist().catch(error => {
        console.error('Erro ao carregar wishlist:', error);
      });
    });
  }
});
</script>
