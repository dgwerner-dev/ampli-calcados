<template>
  <div class="min-h-screen bg-gray-50 pt-32">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compras</h1>
      
      <div v-if="isEmpty" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Carrinho vazio</h3>
        <p class="mt-1 text-sm text-gray-500">Adicione alguns produtos ao seu carrinho.</p>
        <div class="mt-6">
          <NuxtLink to="/" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-coral-soft hover:bg-coral-dark">
            Continuar Comprando
          </NuxtLink>
        </div>
      </div>

      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="item in cart" :key="item.id" class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-16 w-16">
                <img v-if="item.product.images && item.product.images.length > 0" :src="item.product.images[0]" :alt="item.product.name" class="h-16 w-16 object-cover rounded">
                <div v-else class="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                  <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <div class="flex justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">{{ item.product.name }}</h3>
                    <p v-if="item.size" class="text-sm text-gray-500">Tamanho: {{ item.size }}</p>
                    <p v-if="item.color" class="text-sm text-gray-500">Cor: {{ item.color }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">R$ {{ (item.price * item.quantity).toFixed(2) }}</p>
                    <p class="text-sm text-gray-500">R$ {{ item.price.toFixed(2) }} cada</p>
                  </div>
                </div>
                <div class="flex justify-between items-center mt-2">
                  <div class="flex items-center space-x-2">
                    <button @click="updateQuantity(item.id, item.quantity - 1)" class="text-gray-500 hover:text-gray-700">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="text-sm text-gray-900">{{ item.quantity }}</span>
                    <button @click="updateQuantity(item.id, item.quantity + 1)" class="text-gray-500 hover:text-gray-700">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <button @click="removeFromCart(item.id)" class="text-red-600 hover:text-red-800 text-sm">
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-lg font-medium text-gray-900">Total: R$ {{ total.toFixed(2) }}</p>
              <p class="text-sm text-gray-500">{{ itemCount }} item(s)</p>
            </div>
            <div class="flex space-x-3">
              <NuxtLink to="/" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Continuar Comprando
              </NuxtLink>
              <button @click="clearCart" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Limpar Carrinho
              </button>
              <NuxtLink to="/checkout" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-coral-soft hover:bg-coral-dark">
                Comprar Agora
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção de Produtos Recomendados -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Produtos Recomendados</h2>
        <div v-if="loadingProducts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div class="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div class="space-y-2">
              <div class="bg-gray-200 h-4 rounded"></div>
              <div class="bg-gray-200 h-4 rounded w-2/3"></div>
              <div class="bg-gray-200 h-6 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <div v-else-if="recommendedProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="product in recommendedProducts" :key="product.id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div class="relative">
              <img 
                :src="product.images?.[0] || '/images/placeholder.jpg'" 
                :alt="product.name"
                class="w-full h-48 object-cover rounded-t-lg"
              />
              <button
                @click="addProductToCart(product)"
                class="absolute top-2 right-2 bg-coral-soft text-white p-2 rounded-full hover:bg-coral-dark transition-colors duration-200 shadow-lg"
                title="Adicionar ao carrinho"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ product.name }}</h3>
              <p class="text-2xl font-bold text-coral-soft mb-3">
                R$ {{ (product.salePrice || product.price).toFixed(2) }}
              </p>
              <NuxtLink 
                :to="`/produto/${product.slug}`"
                class="block w-full text-center px-4 py-2 border border-coral-soft text-coral-soft rounded-md hover:bg-coral-soft hover:text-white transition-colors duration-200"
              >
                Ver Produto
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500">Nenhum produto recomendado disponível no momento.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { cart, total, itemCount, isEmpty, removeFromCart, updateQuantity, clearCart, addToCart } = useCart();
const { success, error: notificationError } = useNotifications();

// Estado para produtos recomendados
const recommendedProducts = ref([]);
const loadingProducts = ref(false);

// Carregar produtos recomendados
const loadRecommendedProducts = async () => {
  loadingProducts.value = true;
  try {
    const data = await $fetch('/api/products/featured');
    recommendedProducts.value = data || [];
  } catch (err) {
    console.error('Erro ao carregar produtos recomendados:', err);
    recommendedProducts.value = [];
  } finally {
    loadingProducts.value = false;
  }
};

// Adicionar produto ao carrinho
const addProductToCart = async (product) => {
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

// Carregar produtos recomendados quando a página for montada
onMounted(() => {
  loadRecommendedProducts();
});

useHead({
  title: 'Carrinho de Compras - AMPLI CALÇADOS',
  meta: [
    {
      name: 'description',
      content: 'Seu carrinho de compras na AMPLI CALÇADOS',
    },
  ],
});
</script>
