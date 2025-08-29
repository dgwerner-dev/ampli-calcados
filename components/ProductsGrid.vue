<template>
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="products-grid">
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/produto/${product.slug}`"
          class="product-card group cursor-pointer"
          :data-testid="`product-card-${product.id}`"
        >
          <!-- Product Image -->
          <div class="relative rounded-t-lg">
            <div
              class="flex items-center justify-center aspect-square group-hover:scale-105 transition-transform duration-300 p-2"
            >
              <img
                v-if="product.images && product.images.length > 0"
                :src="product.images[0]"
                :alt="product.name"
                class="w-auto h-auto max-w-full max-h-full object-contain"
                data-testid="product-image"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg
                  class="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
            </div>

            <!-- Quick Actions -->
            <div
              class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <button
                @click.prevent="toggleWishlist(product.id)"
                :disabled="wishlistLoading === product.id"
                :class="[
                  'w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-colors disabled:opacity-50',
                  isInWishlist(product.id)
                    ? 'bg-coral-soft text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50',
                ]"
                :title="
                  isInWishlist(product.id)
                    ? 'Remover da lista de desejos'
                    : 'Adicionar à lista de desejos'
                "
                data-testid="wishlist-button"
              >
                <svg
                  v-if="wishlistLoading !== product.id"
                  class="w-4 h-4"
                  :class="isInWishlist(product.id) ? 'fill-current' : ''"
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
                <svg
                  v-else
                  class="w-4 h-4 animate-spin"
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
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="font-medium text-black mb-2 group-hover:text-gray-700 transition-colors" data-testid="product-name">
              {{ product.name }}
            </h3>
            <p class="text-lg font-bold text-black" data-testid="product-price">R$ {{ formatPrice(product.price) }}</p>
            
            <!-- Color Options -->
            <div class="flex space-x-1 mt-2">
              <div class="w-4 h-4 bg-red-500 rounded-full color-dot" data-testid="color-option"></div>
              <div class="w-4 h-4 bg-blue-500 rounded-full color-dot" data-testid="color-option"></div>
              <div class="w-4 h-4 bg-green-500 rounded-full color-dot" data-testid="color-option"></div>
            </div>
            
            <!-- Size Options -->
            <div class="flex space-x-1 mt-2">
              <button class="px-2 py-1 text-xs border rounded size-option" data-testid="size-option">40</button>
              <button class="px-2 py-1 text-xs border rounded size-option" data-testid="size-option">41</button>
              <button class="px-2 py-1 text-xs border rounded size-option" data-testid="size-option">42</button>
            </div>

            <!-- Add to Cart Button - Always Visible -->
            <button
              class="w-full mt-3 py-2 text-sm font-medium rounded transition-all duration-300 bg-coral-soft text-white hover:bg-coral-dark"
              data-testid="add-to-cart-button"
            >
              Adicionar ao Carrinho
            </button>
            
            <!-- Ver Detalhes Button -->
            <button
              class="w-full mt-2 py-2 text-sm font-medium rounded transition-all duration-300 border border-gray-300 text-gray-700 hover:bg-gray-50"
              data-testid="quick-view-button"
            >
              Ver Detalhes
            </button>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    default: () => [],
  },
});

const wishlistLoading = ref(null);

const { wishlist, isInWishlist, addToWishlist, removeFromWishlist, loadWishlist } = useWishlist();
const { success, error: notificationError } = useNotifications();

const formatPrice = price => {
  if (typeof price !== 'number') return '0,00';
  return price.toFixed(2).replace('.', ',');
};

// Função para alternar wishlist
const toggleWishlist = async productId => {
  try {
    wishlistLoading.value = productId;

    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
      success('Produto removido da lista de desejos');
    } else {
      await addToWishlist(productId);
      success('Produto adicionado à lista de desejos');
    }
  } catch (err) {
    console.error('Erro ao atualizar wishlist:', err);
    notificationError('Erro ao atualizar lista de desejos');
  } finally {
    wishlistLoading.value = null;
  }
};

// Carregar wishlist quando o componente for montado
onMounted(() => {
  if (process.client) {
    // Só carregar wishlist se usuário estiver autenticado
    const { user } = useAuth();
    if (user.value) {
      loadWishlist();
    }
  }
});
</script>
