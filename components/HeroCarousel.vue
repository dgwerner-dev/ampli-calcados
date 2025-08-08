<template>
  <section class="pt-32 pb-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="relative">
        <!-- Carousel Container -->
        <div class="relative overflow-hidden rounded-lg bg-gray-200 shadow-lg">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div v-for="(slide, index) in slides" :key="index" class="w-full flex-shrink-0">
              <div class="flex flex-col lg:flex-row">
                <!-- Product Image -->
                <div class="lg:w-1/2 p-8 lg:p-12">
                  <div
                    class="relative h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center"
                  >
                    <img
                      :src="slide.image"
                      :alt="slide.title"
                      class="w-full h-full object-cover object-center rounded-lg"
                    />
                    <!-- Overlay for mobile text -->
                    <div
                      class="lg:hidden absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end"
                    >
                      <div class="p-6 text-white w-full">
                        <!-- Badge -->
                        <div
                          class="inline-flex items-center px-3 py-1 rounded-full bg-coral-soft/20 text-white text-xs font-semibold mb-3"
                        >
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          Lançamento
                        </div>

                        <!-- Title -->
                        <h2 class="text-3xl font-bold mb-2 leading-tight">{{ slide.title }}</h2>

                        <!-- Price -->
                        <div class="flex items-baseline space-x-2 mb-3">
                          <p class="text-2xl font-bold">{{ slide.price }}</p>
                          <p class="text-lg opacity-75 line-through">R$ 399,90</p>
                          <span
                            class="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded"
                            >-25%</span
                          >
                        </div>

                        <!-- Description -->
                        <p class="text-sm opacity-90 mb-4 leading-relaxed">
                          {{ slide.description }}
                        </p>

                        <!-- CTA Button -->
                        <button
                          class="bg-coral-soft text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-coral-dark transition-colors duration-300"
                        >
                          COMPRE AGORA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div class="space-y-8">
                    <!-- Badge -->
                    <div
                      class="inline-flex items-center px-3 py-1 rounded-full bg-coral-soft/10 text-coral-soft text-sm font-semibold w-fit"
                    >
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      Lançamento
                    </div>

                    <!-- Title -->
                    <div class="flex items-start justify-between">
                      <div>
                        <h2 class="text-4xl lg:text-5xl font-bold text-black leading-tight mb-3">
                          {{ slide.title }}
                        </h2>
                        <div class="w-16 h-1 bg-coral-soft rounded-full"></div>
                      </div>
                      <button
                        class="flex items-center justify-center p-3 border-2 border-gray-300 text-gray-700 rounded-full hover:border-coral-soft hover:text-coral-soft transition-all duration-300 ml-4"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          ></path>
                        </svg>
                      </button>
                    </div>

                    <!-- Description -->
                    <p class="text-gray-600 text-lg leading-relaxed max-w-lg">
                      {{ slide.description }}
                    </p>

                    <!-- Features -->
                    <div class="flex flex-wrap gap-3 text-sm">
                      <div
                        class="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div
                          class="flex items-center justify-center w-6 h-6 bg-coral-soft/10 rounded-full mr-2"
                        >
                          <svg
                            class="w-4 h-4 text-coral-soft"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                        <span class="text-gray-700 font-medium">Couro Genuíno</span>
                      </div>
                      <div
                        class="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div
                          class="flex items-center justify-center w-6 h-6 bg-coral-soft/10 rounded-full mr-2"
                        >
                          <svg
                            class="w-4 h-4 text-coral-soft"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                        <span class="text-gray-700 font-medium">Confortável</span>
                      </div>
                      <div
                        class="flex items-center bg-green-500 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div
                          class="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full mr-2"
                        >
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
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            ></path>
                          </svg>
                        </div>
                        <span class="text-white font-semibold">Pagamento Seguro</span>
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
                        <button
                          class="btn-primary text-base font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <svg
                            class="w-5 h-5 mr-2 inline"
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
                        </button>
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
      </div>
    </div>
  </section>
</template>

<script setup>
const currentSlide = ref(0);

const slides = ref([
  {
    title: 'Sandálias Flats Elegantes',
    description:
      'Sandálias de couro genuíno com textura de crocodilo. Design minimalista com tiras cruzadas e fivela no tornozelo. Perfeitas para o dia a dia com estilo.',
    price: 'R$ 299,90',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop&crop=center',
  },
  {
    title: 'Ballet Flats Clássicos',
    description:
      'Coleção de ballet flats em cores neutras. Design atemporal com laço delicado no bico. Conforto e elegância em cada passo.',
    price: 'R$ 249,90',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop&crop=center',
  },
  {
    title: 'Botas de Couro Premium',
    description:
      'Botas de cano médio em couro liso de alta qualidade. Salto baixo e robusto com cadarços. Ideal para o inverno com estilo.',
    price: 'R$ 399,90',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop&crop=center',
  },
  {
    title: 'Oxfords AMPLI',
    description:
      'Sapatos Oxford com recortes laterais elegantes. Disponíveis em preto e caramelo. Cadarços finos e sola de madeira. Marca AMPLI visível na palmilha.',
    price: 'R$ 349,90',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop&crop=center',
  },
  {
    title: 'Sandálias Block Heel',
    description:
      'Sandálias com salto bloco em couro marrom com detalhes em creme. Design sofisticado com tiras cruzadas e fivela no tornozelo.',
    price: 'R$ 279,90',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop&crop=center',
  },
  {
    title: 'Sandálias Coral Vibrante',
    description:
      'Sandálias em coral vibrante com múltiplas tiras finas. Salto baixo em madeira natural. Design versátil para qualquer ocasião.',
    price: 'R$ 259,90',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop&crop=center',
  },
]);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1;
};

const goToSlide = index => {
  currentSlide.value = index;
};

// Auto-play carousel
onMounted(() => {
  setInterval(() => {
    nextSlide();
  }, 5000);
});
</script>
