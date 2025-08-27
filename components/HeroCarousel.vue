<template>
  <section class="pt-32 pb-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="relative">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-soft mx-auto mb-4"
            ></div>
            <p class="text-gray-600">Carregando produtos em destaque...</p>
          </div>
        </div>

        <!-- Carousel Container -->
        <div v-else-if="slides.length > 0" class="relative overflow-hidden rounded-lg shadow-lg">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div v-for="(slide, index) in slides" :key="index" class="w-full flex-shrink-0">
              <div class="flex flex-col lg:flex-row">
                <!-- Product Image -->
                <div class="lg:w-1/2 p-8 lg:p-12">
                  <div class="relative h-80 lg:h-96 rounded-lg flex items-center justify-center">
                    <img
                      :src="slide.image"
                      :alt="slide.title"
                      class="w-full h-full object-contain object-center rounded-lg"
                    />
                    <!-- Overlay for mobile text -->
                    <div
                      class="lg:hidden absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end"
                    >
                      <div class="p-6 text-white w-full">
                        <!-- Title -->
                        <h2 class="text-3xl font-bold mb-2 leading-tight">{{ slide.title }}</h2>

                        <!-- Price -->
                        <div class="flex items-baseline space-x-2 mb-3">
                          <p class="text-2xl font-bold">{{ slide.price }}</p>
                          <p v-if="slide.originalPrice" class="text-lg opacity-75 line-through">
                            {{ slide.originalPrice }}
                          </p>
                          <span
                            v-if="slide.discount"
                            class="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded"
                            >-{{ slide.discount }}%</span
                          >
                        </div>

                        <!-- CTA Button -->
                        <NuxtLink
                          :to="`/produto/${slide.slug}`"
                          class="inline-block bg-coral-soft text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-coral-dark transition-colors duration-300"
                        >
                          COMPRE AGORA
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div class="space-y-8">
                    <!-- Title -->
                    <div class="flex items-start justify-between">
                      <div>
                        <h2 class="text-4xl lg:text-5xl font-bold text-black leading-tight mb-3">
                          {{ slide.title }}
                        </h2>
                        <div class="w-16 h-1 bg-coral-soft rounded-full"></div>
                      </div>
                      <button
                        @click="toggleWishlist(slide.id)"
                        :disabled="wishlistLoading === slide.id"
                        :class="[
                          'flex items-center justify-center p-3 border-2 rounded-full transition-all duration-300 ml-4 disabled:opacity-50',
                          isInWishlist(slide.id)
                            ? 'border-coral-soft text-coral-soft bg-coral-soft/10'
                            : 'border-gray-300 text-gray-700 hover:border-coral-soft hover:text-coral-soft',
                        ]"
                        :title="
                          isInWishlist(slide.id)
                            ? 'Remover da lista de desejos'
                            : 'Adicionar à lista de desejos'
                        "
                      >
                        <svg
                          v-if="wishlistLoading !== slide.id"
                          class="w-5 h-5"
                          :class="isInWishlist(slide.id) ? 'fill-current' : ''"
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
                          class="w-5 h-5 animate-spin"
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

                    <!-- Features -->
                    <div class="flex flex-wrap gap-3 text-sm">
                      <!-- Lançamento -->
                      <div class="carousel-feature-card card-lancamento">
                        <div class="carousel-feature-icon">
                          <svg
                            class="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            ></path>
                          </svg>
                        </div>
                        <span class="carousel-feature-text">Lançamento</span>
                      </div>

                      <!-- Couro Genuíno -->
                      <div class="carousel-feature-card card-couro">
                        <div class="carousel-feature-icon">
                          <svg
                            class="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m4 0V2a1 1 0 011-1h1a1 1 0 011 1v18a1 1 0 01-1 1H5a1 1 0 01-1-1V2a1 1 0 011-1h1a1 1 0 011 1v2m0 0V2a1 1 0 011-1h4a1 1 0 011 1v2"
                            ></path>
                          </svg>
                        </div>
                        <span class="carousel-feature-text">Couro Genuíno</span>
                      </div>

                      <!-- Confortável -->
                      <div class="carousel-feature-card card-confortavel">
                        <div class="carousel-feature-icon">
                          <svg
                            class="w-4 h-4 text-white"
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
                        </div>
                        <span class="carousel-feature-text">Confortável</span>
                      </div>

                      <!-- Pagamento Seguro -->
                      <div class="carousel-feature-card card-pagamento">
                        <div class="carousel-feature-icon">
                          <svg
                            class="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            ></path>
                          </svg>
                        </div>
                        <span class="carousel-feature-text">Pagamento Seguro</span>
                      </div>
                    </div>

                    <!-- Price and CTA -->
                    <div class="space-y-6">
                      <div class="flex items-baseline space-x-3">
                        <p class="text-3xl font-bold text-black">{{ slide.price }}</p>
                        <p class="text-lg text-gray-500 line-through">R$ 399,90</p>
                        <span
                          class="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded"
                          >-25%</span
                        >
                      </div>

                      <div class="flex flex-col sm:flex-row gap-4">
                        <NuxtLink
                          :to="`/produto/${slide.slug}`"
                          class="btn-primary text-base font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                        >
                          <svg
                            class="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                            ></path>
                          </svg>
                          COMPRE AGORA
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Arrows -->
          <button
            @click="previousSlide"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-coral-soft transition-colors group"
          >
            <svg
              class="w-5 h-5 text-coral-soft group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          <button
            @click="nextSlide"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-coral-soft transition-colors group"
          >
            <svg
              class="w-5 h-5 text-coral-soft group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>

          <!-- Dots Indicators -->
          <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button
              v-for="(slide, index) in slides"
              :key="index"
              @click="goToSlide(index)"
              :class="['carousel-dot', { active: currentSlide === index }]"
            ></button>
          </div>
        </div>

        <!-- No Featured Products State -->
        <div v-else class="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div class="text-center">
            <svg
              class="w-16 h-16 text-gray-400 mx-auto mb-4"
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
            <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum produto em destaque</h3>
            <p class="text-gray-600">
              Adicione produtos marcados como destaque no painel administrativo
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const currentSlide = ref(0);

const slides = ref([]);
const loading = ref(true);
const error = ref(null);
const wishlistLoading = ref(null);

const supabase = useSupabaseClient();
const { wishlist, isInWishlist, addToWishlist, removeFromWishlist, loadWishlist } = useWishlist();
const { success, error: notificationError } = useNotifications();

// Buscar produtos em destaque
const loadFeaturedProducts = async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log('🔄 Carregando produtos em destaque...');

    // Buscar produtos em destaque via API
    const data = await $fetch('/api/products/featured');

    console.log('✅ Produtos carregados:', data);

    // Transformar produtos em slides
    slides.value = (data || []).map(product => {
      console.log('🔄 Processando produto:', product.name);
      return {
        id: product.id,
        title: product.name,
        description: product.description || 'Produto em destaque da AMPLI CALÇADOS',
        price: product.salePrice
          ? `R$ ${parseFloat(product.salePrice).toFixed(2).replace('.', ',')}`
          : `R$ ${product.price.toFixed(2).replace('.', ',')}`,
        originalPrice: product.salePrice
          ? `R$ ${product.price.toFixed(2).replace('.', ',')}`
          : null,
        discount: product.salePrice
          ? Math.round(((product.price - parseFloat(product.salePrice)) / product.price) * 100)
          : null,
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : '/images/placeholder-product.jpg',
        slug: product.slug,
        category: product.category?.name,
      };
    });

    console.log('🎉 Slides criados:', slides.value.length);

    // Se não houver produtos em destaque, usar produtos padrão
    if (slides.value.length === 0) {
      slides.value = [
        {
          title: 'Sandálias Flats Elegantes',
          description:
            'Sandálias de couro genuíno com textura de crocodilo. Design minimalista com tiras cruzadas e fivela no tornozelo.',
          price: 'R$ 299,90',
          image: '/images/placeholder-product.jpg',
          slug: 'sandalias-flats-elegantes',
        },
      ];
    }
  } catch (err) {
    console.error('❌ Erro ao carregar produtos em destaque:', err);
    console.error('📋 Stack trace:', err.stack);
    error.value = err.message;

    // Fallback para produtos padrão em caso de erro
    slides.value = [
      {
        title: 'Sandálias Flats Elegantes',
        description:
          'Sandálias de couro genuíno com textura de crocodilo. Design minimalista com tiras cruzadas e fivela no tornozelo.',
        price: 'R$ 299,90',
        image: '/images/placeholder-product.jpg',
        slug: 'sandalias-flats-elegantes',
      },
    ];
  } finally {
    loading.value = false;
  }
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1;
};

const goToSlide = index => {
  currentSlide.value = index;
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

// Auto-play carousel
onMounted(() => {
  // Carregar produtos em destaque apenas no cliente
  if (process.client) {
    loadFeaturedProducts();

    // Só carregar wishlist se usuário estiver autenticado
    const { user } = useAuth();
    if (user.value) {
      loadWishlist();
    }
  }

  // Auto-play do carrossel
  setInterval(() => {
    nextSlide();
  }, 5000);
});
</script>
