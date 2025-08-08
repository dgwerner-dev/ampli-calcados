<template>
  <section class="py-16 bg-white border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-black mb-4">LANÇAMENTOS</h2>
        <p class="text-gray-700 text-lg">Descubra os produtos mais recentes da AMPLI CALÇADOS</p>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card group cursor-pointer"
        >
          <!-- Product Image -->
          <div class="relative overflow-hidden rounded-t-lg">
            <div
              class="aspect-square bg-gray-200 group-hover:scale-105 transition-transform duration-300"
            >
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover object-center"
              />
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
            <p class="text-lg font-bold text-black">{{ product.price }}</p>

            <!-- Add to Cart Button - Always Visible -->
            <button
              class="w-full mt-3 py-2 text-sm font-medium rounded transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-coral-soft hover:text-white"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <div class="text-center mt-12">
        <button class="btn-secondary">VER TODOS OS LANÇAMENTOS</button>
      </div>
    </div>
  </section>
</template>

<script setup>
const products = ref([
  {
    id: 1,
    name: 'Sandálias Flats Elegantes',
    price: 'R$ 199,90',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 2,
    name: 'Ballet Flats Clássicos',
    price: 'R$ 249,90',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 3,
    name: 'Botas de Couro Premium',
    price: 'R$ 299,90',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 4,
    name: 'Oxfords AMPLI',
    price: 'R$ 179,90',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
  },
]);
</script>
