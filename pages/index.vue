<template>
  <div>
    <!-- Hero Carousel -->
    <ClientOnly>
      <HeroCarousel />
      <template #fallback>
        <!-- Skeleton Loading for Hero Carousel -->
        <section class="pt-32 pb-16 bg-white">
          <div class="max-w-7xl mx-auto px-4">
            <div class="relative">
              <div class="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                <div class="text-center">
                  <div class="animate-pulse">
                    <div class="h-12 w-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div class="h-4 bg-gray-300 rounded w-48 mx-auto mb-2"></div>
                    <div class="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </ClientOnly>

    <!-- Products Grid -->
    <ClientOnly>
      <ProductsGrid />
      <template #fallback>
        <ProductsGridSkeleton />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
useHead({
  title: 'AMPLI CALÇADOS - E-commerce',
  meta: [
    {
      name: 'description',
      content: 'E-commerce AMPLI CALÇADOS - Calçados de qualidade',
    },
  ],
});
</script>
