<template>
  <div class="bg-white">
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-soft mx-auto"></div>
        <p class="mt-4 text-gray-600">Carregando detalhes do produto...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center">
        <h1 class="text-2xl font-bold text-red-600 mb-2">Erro ao carregar o produto</h1>
        <p class="text-gray-600">{{ error }}</p>
      </div>

      <!-- Product Details -->
      <div
        v-else-if="product"
        class="grid grid-cols-1 lg:grid-cols-5 gap-x-12 gap-y-12 lg:items-start"
      >
        <!-- Image gallery -->
        <div class="lg:col-span-2">
          <div class="w-full overflow-hidden rounded-lg flex justify-center">
            <img
              :src="selectedImage"
              :alt="product.name"
              class="max-w-full max-h-full object-contain transition-opacity duration-300"
            />
          </div>
          <div
            v-if="product.images && product.images.length > 1"
            class="flex justify-center space-x-2 mt-2"
          >
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImage = image"
              :class="[
                'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                selectedImage === image ? 'border-coral-soft' : 'border-transparent',
              ]"
            >
              <img
                :src="image"
                :alt="`${product.name} - imagem ${index + 1}`"
                class="w-full h-full object-contain object-center"
              />
            </button>
          </div>
        </div>

        <!-- Product info -->
        <div class="lg:col-span-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <!-- Left column: Description -->
            <div>
              <nav aria-label="Breadcrumb" class="mb-4">
                <ol class="flex items-center space-x-2 text-sm">
                  <li>
                    <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">Home</NuxtLink>
                  </li>
                  <li v-if="product.categories">
                    <div class="flex items-center">
                      <svg
                        class="h-5 w-5 flex-shrink-0 text-gray-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                      <NuxtLink
                        :to="`/categoria/${product.categories.slug}`"
                        class="ml-2 text-gray-500 hover:text-gray-700"
                        >{{ product.categories.name }}</NuxtLink
                      >
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {{ product.name }}
              </h1>
              <p v-if="product.code" class="mt-1 text-sm text-gray-500">
                Cód. de referência: {{ product.code }}
              </p>
              <!-- Description -->
              <div class="mt-8">
                <p class="text-sm text-gray-600">
                  Vendido e entregue por:
                  <span class="font-semibold text-coral-soft">Ampli Calçados</span>
                </p>
                <h3 class="mt-6 flex items-center text-lg font-semibold text-gray-800">
                  <svg
                    class="mr-2 h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Sobre o produto
                </h3>
                <div class="mt-4 text-base leading-relaxed text-gray-700 space-y-4">
                  <p v-for="(paragraph, index) in descriptionParagraphs" :key="index">
                    {{ paragraph }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Right column: Purchase actions -->
            <div>
              <!-- Price section -->
              <div class="mt-4">
                <p class="text-3xl font-bold text-coral-soft">R$ {{ boletoPrice }}</p>
                <p class="text-sm text-green-600 font-semibold">
                  À vista no Boleto com 10% de desconto
                </p>
                <p class="mt-2 text-sm text-gray-500">
                  R$ {{ formatPrice(product.price) }} em até
                  <span class="font-bold text-gray-700">5x de R$ {{ installmentPrice }}</span>
                  sem juros
                </p>
              </div>

              <!-- Stock -->
              <div class="mt-4">
                <p class="font-semibold text-green-600">Em estoque</p>
              </div>

              <!-- Sizes -->
              <div class="mt-6">
                <h3 class="text-sm text-gray-900 font-medium">Numeração</h3>
                <fieldset class="mt-2">
                  <legend class="sr-only">Escolha a numeração</legend>
                  <div class="flex flex-wrap gap-3">
                    <label
                      v-for="size in product.sizes"
                      :key="size"
                      class="group relative border rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none cursor-pointer"
                      :class="{
                        'bg-coral-soft text-white border-coral-soft shadow-sm':
                          selectedSize === size,
                        'bg-white text-gray-900 border-gray-200': selectedSize !== size,
                      }"
                    >
                      <input
                        type="radio"
                        name="size-choice"
                        :value="size"
                        v-model="selectedSize"
                        class="sr-only"
                      />
                      <span>{{ size }}</span>
                      <span
                        class="absolute -inset-px rounded-md pointer-events-none"
                        aria-hidden="true"
                      ></span>
                    </label>
                  </div>
                </fieldset>
              </div>

              <!-- Action buttons -->
              <div class="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  @click="buyNow"
                  :disabled="buyNowLoading"
                  class="flex w-full items-center justify-center rounded-md border border-transparent bg-coral-soft py-3 px-8 text-base font-medium uppercase text-white hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-coral-soft focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="buyNowLoading"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="mr-2 h-5 w-5"
                  >
                    <path
                      d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.46-5.23c.18-.487.18-1.035 0-1.522a3.75 3.75 0 00-2.46-2.17H6.622L5.42 2.515A.75.75 0 004.646 2.25H2.25z"
                    />
                  </svg>
                  {{ buyNowLoading ? 'Processando...' : 'Comprar Agora' }}
                </button>
                <button
                  type="button"
                  class="flex w-full items-center justify-center rounded-md border-2 border-coral-soft py-3 px-8 text-base font-medium uppercase text-coral-soft hover:bg-coral-soft hover:text-white focus:outline-none focus:ring-2 focus:ring-coral-soft focus:ring-offset-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="mr-2 h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  Adicionar ao Carrinho
                </button>
              </div>

              <!-- Shipping calculator -->
              <div class="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <h3 class="flex items-center text-base font-medium text-coral-soft">
                  <svg
                    class="mr-2 h-6 w-6"
                    version="1.0"
                    viewBox="0 0 1000.000000 1000.000000"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,1000.000000) scale(0.100000,-0.100000)"
                      fill="currentColor"
                      stroke="none"
                    >
                      <path
                        d="M1845 7935 c-90 -20 -168 -52 -234 -96 -70 -47 -111 -95 -149 -176 -27 -58 -27 -58 -30 -325 -4 -288 0 -311 51 -340 17 -10 282 -14 1272 -18 l1250 -5 58 -23 c81 -33 168 -116 209 -200 l33 -67 0 -165 c0 -164 0 -166 -31 -230 -39 -82 -108 -151 -193 -193 l-66 -32 -1263 -5 -1264 -5 -29 -33 c-28 -31 -29 -35 -29 -140 0 -83 4 -113 16 -131 37 -52 22 -51 896 -51 481 0 841 -4 881 -10 135 -20 253 -104 311 -221 57 -118 59 -341 3 -462 -30 -66 -102 -146 -162 -182 -95 -55 -89 -55 -980 -55 -564 0 -832 -4 -860 -11 -21 -6 -54 -26 -72 -44 l-33 -33 0 -539 c0 -455 2 -548 16 -598 38 -148 156 -270 305 -316 50 -16 92 -19 239 -19 210 0 210 0 210 90 0 171 73 383 188 545 263 371 740 525 1171 379 384 -130 667 -498 688 -894 3 -52 10 -101 15 -107 8 -10 229 -13 1044 -13 568 0 1035 3 1037 8 3 4 10 58 16 119 18 180 69 329 158 467 184 285 485 458 823 473 191 9 352 -29 529 -123 108 -57 171 -106 261 -201 168 -176 262 -393 279 -643 l6 -95 320 0 320 0 69 33 c127 60 203 143 245 270 20 59 21 81 21 614 0 660 -9 761 -81 914 -57 122 -132 174 -320 223 -287 75 -369 104 -459 161 -100 64 -126 106 -359 575 -147 296 -233 456 -261 490 -72 86 -160 153 -275 210 -159 78 -202 85 -558 85 -275 0 -296 1 -318 19 l-24 19 -6 404 c-3 243 -9 415 -16 433 -40 114 -120 206 -221 253 l-57 27 -2265 2 c-1851 1 -2276 -1 -2325 -12z m5442 -1470 c137 -32 270 -111 372 -221 59 -64 80 -102 271 -482 177 -354 204 -414 192 -425 -12 -9 -171 -13 -677 -15 -642 -2 -663 -2 -686 17 l-24 19 -3 541 c-2 531 -2 541 18 561 19 19 32 20 248 20 164 0 244 -4 289 -15z"
                      />
                      <path
                        d="M1049 6752 c-43 -23 -59 -38 -82 -82 -28 -53 -29 -60 -25 -167 3 -105 5 -114 33 -154 17 -23 50 -53 74 -66 l45 -23 1442 2 1442 3 44 30 c25 18 53 49 66 75 21 41 23 56 20 162 -3 111 -4 118 -33 159 -16 23 -48 52 -70 63 -40 21 -42 21 -1471 24 l-1431 2 -54 -28z"
                      />
                      <path
                        d="M529 5467 c-29 -15 -54 -40 -74 -71 -25 -42 -30 -59 -33 -140 -5 -119 8 -169 62 -222 32 -33 53 -44 96 -53 40 -8 410 -11 1350 -9 l1295 3 42 23 c24 12 55 41 70 64 26 38 28 50 31 159 4 127 -7 167 -60 216 -59 56 15 53 -1416 53 l-1319 0 -44 -23z"
                      />
                      <path
                        d="M3092 4030 c-294 -53 -533 -268 -624 -560 -19 -63 -23 -97 -23 -215 0 -119 4 -151 23 -215 85 -270 282 -465 548 -542 114 -33 316 -33 424 1 348 108 570 402 570 756 0 351 -234 660 -570 755 -86 24 -265 34 -348 20z m284 -470 c73 -36 126 -91 163 -169 57 -122 24 -290 -76 -382 -72 -66 -143 -94 -238 -94 -66 0 -90 5 -136 26 -79 37 -133 90 -171 167 -29 58 -33 76 -33 147 0 71 4 88 33 147 85 174 285 243 458 158z"
                      />
                      <path
                        d="M7258 4030 c-316 -57 -563 -284 -638 -584 -27 -109 -27 -274 0 -382 72 -282 269 -480 565 -570 93 -29 304 -26 410 4 266 77 480 295 551 562 25 90 25 301 0 389 -75 274 -292 492 -561 565 -70 19 -260 29 -327 16z m207 -445 c157 -41 257 -169 257 -330 1 -296 -348 -453 -566 -254 -33 30 -66 73 -83 107 -24 50 -28 69 -28 147 0 71 5 100 21 136 43 92 134 169 233 195 62 17 96 17 166 -1z"
                      />
                    </g>
                  </svg>
                  Calcule o frete
                </h3>
                <div class="mt-4 flex items-stretch gap-2">
                  <div class="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Inserir CEP"
                      class="w-full rounded-md border-gray-300 py-2 pr-10 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                    />
                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <svg
                        class="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    </div>
                  </div>
                  <button
                    class="rounded-md border-2 border-coral-soft bg-white py-2 px-5 text-sm font-semibold text-coral-soft hover:bg-coral-soft hover:text-white"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const supabase = useSupabaseClient();

const loading = ref(true);
const error = ref<string | null>(null);
const product = ref<any>(null);
const selectedImage = ref('');
const selectedSize = ref('');
const buyNowLoading = ref(false);
const { success, error: notificationError } = useNotifications();

const formatPrice = (price: number | null | undefined) => {
  if (typeof price !== 'number') return '0,00';
  return price.toFixed(2).replace('.', ',');
};

const installmentPrice = computed(() => {
  if (!product.value?.price) return '0,00';
  return formatPrice(product.value.price / 5);
});

const boletoPrice = computed(() => {
  if (!product.value?.price) return '0,00';
  return formatPrice(product.value.price * 0.9);
});

const descriptionParagraphs = computed(() => {
  if (!product.value?.description) return [];
  return product.value.description.split('\n').filter(p => p.trim() !== '');
});

const fetchData = async () => {
  const slug = route.params.slug as string;
  if (!slug) return;

  loading.value = true;
  error.value = null;

  try {
    const { data, error: queryError } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('slug', slug)
      .single();

    if (queryError || !data) {
      throw new Error(queryError?.message || 'Produto não encontrado.');
    }
    product.value = data;
    selectedImage.value = data.images?.[0] || '';
    if (data.sizes && data.sizes.length > 0) {
      selectedSize.value = data.sizes[0];
    }
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Função para comprar agora
const buyNow = async () => {
  if (!product.value) return;

  buyNowLoading.value = true;

  try {
    // Verificar se usuário está logado
    const {
      data: { user },
    } = await useSupabaseClient().auth.getUser();

    if (!user) {
      // Redirecionar para login
      navigateTo('/login?redirect=' + encodeURIComponent(route.fullPath));
      return;
    }

    // Validar se tamanho foi selecionado (se o produto tem tamanhos)
    if (product.value.sizes && product.value.sizes.length > 0 && !selectedSize.value) {
      notificationError('Selecione um tamanho antes de continuar');
      return;
    }

    // Criar pedido
    const response = await $fetch('/api/orders/create', {
      method: 'POST',
      body: {
        productId: product.value.id,
        quantity: 1,
        size: selectedSize.value || null,
        color: null, // Implementar seleção de cor se necessário
      },
    });

    if (response.success) {
      success('Pedido criado com sucesso!');
      // Redirecionar para checkout
      navigateTo(`/checkout?orderId=${response.order.id}`);
    }
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);

    if (error.statusCode === 401) {
      // Usuário não autenticado
      navigateTo('/login?redirect=' + encodeURIComponent(route.fullPath));
    } else {
      notificationError(error.data?.statusMessage || 'Erro ao processar compra');
    }
  } finally {
    buyNowLoading.value = false;
  }
};

onMounted(fetchData);

useHead({
  title: computed(() => (product.value ? `${product.value.name} - AMPLI CALÇADOS` : 'Produto')),
  meta: [
    {
      name: 'description',
      content: computed(() => (product.value ? product.value.description : 'Detalhes do produto')),
    },
  ],
});
</script>
