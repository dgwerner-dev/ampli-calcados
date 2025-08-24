<template>
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/produto/${product.slug}`"
          class="product-card group cursor-pointer"
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
                class="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg
                  class="w-4 h-4 text-gray-700"
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
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="font-medium text-black mb-2 group-hover:text-gray-700 transition-colors">
              {{ product.name }}
            </h3>
            <p class="text-lg font-bold text-black">R$ {{ formatPrice(product.price) }}</p>

            <!-- Add to Cart Button - Always Visible -->
            <button
              class="w-full mt-3 py-2 text-sm font-medium rounded transition-all duration-300 bg-coral-soft text-white hover:bg-coral-dark"
            >
              Adicionar ao Carrinho
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

const formatPrice = price => {
  if (typeof price !== 'number') return '0,00';
  return price.toFixed(2).replace('.', ',');
};
</script>
