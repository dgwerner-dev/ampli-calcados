<template>
  <section class="pt-32 pb-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="relative">
        <!-- Carousel Container -->
        <div class="relative overflow-hidden rounded-lg bg-gray-200 shadow-lg">
          <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div v-for="(slide, index) in slides" :key="index" class="w-full flex-shrink-0">
              <div class="flex flex-col lg:flex-row">
                <!-- Product Image -->
                <div class="lg:w-1/2 p-8 lg:p-12">
                  <div class="relative h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <img 
                      :src="slide.image" 
                      :alt="slide.title"
                      class="w-full h-full object-cover object-center rounded-lg"
                    />
                    <!-- Overlay for mobile text -->
                    <div class="lg:hidden absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                      <div class="p-6 text-white">
                        <h2 class="text-2xl font-bold mb-2">{{ slide.title }}</h2>
                        <p class="text-sm opacity-90">{{ slide.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div class="space-y-6">
                    <h2 class="text-3xl lg:text-4xl font-bold text-black">{{ slide.title }}</h2>
                    <p class="text-gray-700 text-lg leading-relaxed">{{ slide.description }}</p>
                    <div class="space-y-4">
                      <p class="text-2xl font-bold text-black">{{ slide.price }}</p>
                      <button class="btn-primary text-sm font-medium">
                        COMPRE AGORA
                      </button>
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
            <svg class="w-5 h-5 text-coral-soft group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button 
            @click="nextSlide" 
            class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-coral-soft transition-colors group"
          >
            <svg class="w-5 h-5 text-coral-soft group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Dots Indicators -->
          <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button 
              v-for="(slide, index) in slides" 
              :key="index"
              @click="goToSlide(index)"
              :class="[
                'carousel-dot',
                { 'active': currentSlide === index }
              ]"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const currentSlide = ref(0)

const slides = ref([
  {
    title: 'Sandálias Flats Elegantes',
    description: 'Sandálias de couro genuíno com textura de crocodilo. Design minimalista com tiras cruzadas e fivela no tornozelo. Perfeitas para o dia a dia com estilo.',
    price: 'R$ 299,90',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop&crop=center'
  },
  {
    title: 'Ballet Flats Clássicos',
    description: 'Coleção de ballet flats em cores neutras. Design atemporal com laço delicado no bico. Conforto e elegância em cada passo.',
    price: 'R$ 249,90',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop&crop=center'
  },
  {
    title: 'Botas de Couro Premium',
    description: 'Botas de cano médio em couro liso de alta qualidade. Salto baixo e robusto com cadarços. Ideal para o inverno com estilo.',
    price: 'R$ 399,90',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop&crop=center'
  },
  {
    title: 'Oxfords AMPLI',
    description: 'Sapatos Oxford com recortes laterais elegantes. Disponíveis em preto e caramelo. Cadarços finos e sola de madeira. Marca AMPLI visível na palmilha.',
    price: 'R$ 349,90',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop&crop=center'
  },
  {
    title: 'Sandálias Block Heel',
    description: 'Sandálias com salto bloco em couro marrom com detalhes em creme. Design sofisticado com tiras cruzadas e fivela no tornozelo.',
    price: 'R$ 279,90',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop&crop=center'
  },
  {
    title: 'Sandálias Coral Vibrante',
    description: 'Sandálias em coral vibrante com múltiplas tiras finas. Salto baixo em madeira natural. Design versátil para qualquer ocasião.',
    price: 'R$ 259,90',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop&crop=center'
  }
])

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// Auto-play carousel
onMounted(() => {
  setInterval(() => {
    nextSlide()
  }, 5000)
})
</script> 