<template>
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Products Grid Skeleton -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="i in count"
          :key="i"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
        >
          <!-- Product Image Skeleton -->
          <div class="relative rounded-t-lg">
            <div class="flex items-center justify-center aspect-square p-2">
              <div class="w-full h-full bg-gray-200 rounded-lg"></div>
            </div>

            <!-- Wishlist Button Skeleton -->
            <div class="absolute top-4 right-4">
              <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          <!-- Product Info Skeleton -->
          <div class="p-4 space-y-3">
            <!-- Product Name Skeleton -->
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>

            <!-- Product Price Skeleton -->
            <div class="h-6 bg-gray-200 rounded w-1/2"></div>

            <!-- Color Options Skeleton -->
            <div class="flex space-x-1 mt-2">
              <div class="w-4 h-4 bg-gray-200 rounded-full"></div>
              <div class="w-4 h-4 bg-gray-200 rounded-full"></div>
              <div class="w-4 h-4 bg-gray-200 rounded-full"></div>
            </div>

            <!-- Size Options Skeleton -->
            <div class="flex space-x-1 mt-2">
              <div class="w-8 h-6 bg-gray-200 rounded"></div>
              <div class="w-8 h-6 bg-gray-200 rounded"></div>
              <div class="w-8 h-6 bg-gray-200 rounded"></div>
            </div>

            <!-- Add to Cart Button Skeleton -->
            <div class="w-full h-8 bg-gray-200 rounded mt-3"></div>

            <!-- Ver Detalhes Button Skeleton -->
            <div class="w-full h-8 bg-gray-200 rounded mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  count: {
    type: Number,
    default: 8,
  },
});
</script>
