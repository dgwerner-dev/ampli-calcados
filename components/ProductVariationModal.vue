<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Background overlay com blur -->
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        @click="closeModal"
      ></div>

      <!-- Modal panel modernizado -->
      <div
        class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100"
      >
        <!-- Header com gradiente -->
        <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">
                  {{ isEditing ? 'Editar Variação' : 'Nova Variação' }}
                </h3>
                <p class="text-indigo-100 text-sm">Configure as informações da variação do produto</p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-8">
          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p class="text-sm text-red-600 font-medium">{{ error }}</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Informações da variação -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Informações da variação</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Tamanho -->
                <div>
                  <label for="variation-size" class="block text-sm font-medium text-gray-700 mb-2">
                    Tamanho <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="variation-size"
                    v-model="form.size"
                    required
                    @change="updateProductCode"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="">Selecione o tamanho</option>
                    <option v-for="size in availableSizes" :key="size" :value="size">
                      {{ size }}
                    </option>
                  </select>
                </div>

                <!-- Código do produto -->
                <div>
                  <label for="variation-code" class="block text-sm font-medium text-gray-700 mb-2">
                    Código do produto
                  </label>
                  <input
                    id="variation-code"
                    v-model="form.code"
                    type="text"
                    readonly
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-mono cursor-not-allowed"
                    :placeholder="productCode ? `${productCode}-XX` : 'Código será gerado automaticamente'"
                  />
                  <p class="mt-2 text-xs text-gray-500">
                    Código gerado automaticamente: {{ productCode }}-{{ form.size }}
                  </p>
                </div>

                <!-- Preço de custo -->
                <div>
                  <label for="variation-cost-price" class="block text-sm font-medium text-gray-700 mb-2">
                    Preço de custo
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <input
                      id="variation-cost-price"
                      v-model="form.costPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <!-- Preço de venda -->
                <div>
                  <label for="variation-sale-price" class="block text-sm font-medium text-gray-700 mb-2">
                    Preço de venda <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <input
                      id="variation-sale-price"
                      v-model="form.salePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <!-- Preço promocional -->
                <div>
                  <label for="variation-promo-price" class="block text-sm font-medium text-gray-700 mb-2">
                    Preço promocional
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <input
                      id="variation-promo-price"
                      v-model="form.promoPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="0,00"
                    />
                  </div>
                  <p class="mt-2 text-xs text-gray-500">Deixe vazio se não houver promoção</p>
                </div>

                <!-- Quantidade -->
                <div>
                  <label for="variation-quantity" class="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade
                  </label>
                  <input
                    id="variation-quantity"
                    v-model="form.quantity"
                    type="number"
                    min="0"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <!-- Disponibilidade -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Disponibilidade</h4>
              </div>

              <div class="space-y-6">
                <!-- Disponibilidade atual -->
                <div>
                  <label for="variation-availability" class="block text-sm font-medium text-gray-700 mb-2">
                    Disponibilidade <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="variation-availability"
                    v-model="form.availability"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="">Selecione a disponibilidade</option>
                    <option v-for="days in availabilityOptions" :key="days" :value="days">
                      {{ days }} {{ days === 1 ? 'dia útil' : 'dias úteis' }}
                    </option>
                  </select>
                </div>

                <!-- Comportamento quando acabar o estoque -->
                <div>
                  <label for="variation-out-of-stock" class="block text-sm font-medium text-gray-700 mb-2">
                    Quando acabar o estoque
                  </label>
                  <select
                    id="variation-out-of-stock"
                    v-model="form.outOfStockBehavior"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="unavailable">Tornar o produto indisponível</option>
                    <option value="immediate">Vender com disponibilidade imediata</option>
                    <option value="custom">Vender com disponibilidade personalizada</option>
                  </select>
                </div>

                <!-- Disponibilidade personalizada (quando selecionar custom) -->
                <div v-if="form.outOfStockBehavior === 'custom'">
                  <label for="variation-custom-availability" class="block text-sm font-medium text-gray-700 mb-2">
                    Disponibilidade personalizada <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="variation-custom-availability"
                    v-model="form.customAvailability"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="">Selecione a disponibilidade</option>
                    <option v-for="days in availabilityOptions" :key="days" :value="days">
                      {{ days }} {{ days === 1 ? 'dia útil' : 'dias úteis' }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Footer com botões -->
            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg
                  v-if="loading"
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
                {{ isEditing ? 'Atualizar Variação' : 'Criar Variação' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  variation: {
    type: Object,
    default: null,
  },
  productCode: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close', 'saved']);

const { success, error: notificationError } = useNotifications();
const isEditing = computed(() => !!props.variation);

// Estados
const loading = ref(false);
const error = ref(null);

// Opções disponíveis
const availableSizes = ref([
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48
]);

const availabilityOptions = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45
]);

// Formulário
const form = ref({
  size: '',
  code: '',
  costPrice: '',
  salePrice: '',
  promoPrice: '',
  quantity: '',
  availability: '',
  outOfStockBehavior: 'unavailable',
  customAvailability: '',
});

// Métodos
const closeModal = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  form.value = {
    size: '',
    code: '',
    costPrice: '',
    salePrice: '',
    promoPrice: '',
    quantity: '',
    availability: '',
    outOfStockBehavior: 'unavailable',
    customAvailability: '',
  };
  error.value = null;
};

const updateProductCode = () => {
  if (props.productCode && form.value.size) {
    form.value.code = `${props.productCode}-${form.value.size}`;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Validações
    if (!form.value.size) {
      throw new Error('Selecione um tamanho');
    }
    if (!form.value.salePrice) {
      throw new Error('Informe o preço de venda');
    }
    if (!form.value.availability) {
      throw new Error('Selecione a disponibilidade');
    }
    if (form.value.outOfStockBehavior === 'custom' && !form.value.customAvailability) {
      throw new Error('Selecione a disponibilidade personalizada');
    }

    // Preparar dados da variação
    const variationData = {
      ...form.value,
      costPrice: form.value.costPrice ? parseFloat(form.value.costPrice) : null,
      salePrice: parseFloat(form.value.salePrice),
      promoPrice: form.value.promoPrice ? parseFloat(form.value.promoPrice) : null,
      quantity: form.value.quantity ? parseInt(form.value.quantity) : null,
      availability: parseInt(form.value.availability),
      customAvailability: form.value.customAvailability ? parseInt(form.value.customAvailability) : null,
    };

    // Emitir evento com os dados da variação
    emit('saved', variationData);
    
    success(isEditing.value ? 'Variação atualizada com sucesso!' : 'Variação criada com sucesso!');
    
    setTimeout(() => {
      closeModal();
    }, 1500);
  } catch (err) {
    error.value = err.message || `Erro ao ${isEditing.value ? 'atualizar' : 'criar'} variação`;
  } finally {
    loading.value = false;
  }
};

// Carregar dados quando o modal abrir
watch(
  () => props.isOpen,
  newValue => {
    if (newValue) {
      if (props.variation) {
        // Modo de edição: preencher formulário
        form.value = {
          ...props.variation,
          costPrice: props.variation.costPrice?.toString() || '',
          salePrice: props.variation.salePrice?.toString() || '',
          promoPrice: props.variation.promoPrice?.toString() || '',
          quantity: props.variation.quantity?.toString() || '',
          availability: props.variation.availability?.toString() || '',
          customAvailability: props.variation.customAvailability?.toString() || '',
        };
      } else {
        // Modo de criação: resetar formulário
        resetForm();
      }
    } else {
      resetForm();
    }
  }
);

// Atualizar código quando o código do produto mudar
watch(
  () => props.productCode,
  () => {
    if (props.productCode && form.value.size) {
      updateProductCode();
    }
  }
);
</script>
