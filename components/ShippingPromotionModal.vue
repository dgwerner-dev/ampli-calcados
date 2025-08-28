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
        <div class="bg-gradient-to-r from-coral-soft to-coral-dark px-6 py-4">
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">
                  {{ promotion ? 'Editar Promoção de Frete' : 'Nova Promoção de Frete' }}
                </h3>
                <p class="text-coral-100 text-sm">
                  Configure as opções de frete grátis ou desconto
                </p>
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
          <form @submit.prevent="savePromotion" class="space-y-8">
            <!-- 1. Informações básicas -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Informações básicas</h4>
              </div>

              <div class="space-y-6">
                <!-- Nome -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                    Nome da promoção <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                    placeholder="Ex: Frete grátis para pedidos acima de R$ 100"
                  />
                </div>

                <!-- Descrição -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 resize-none"
                    placeholder="Descreva os detalhes da promoção..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- 2. Configurações de frete -->
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Configurações de frete</h4>
              </div>

              <div class="space-y-6">
                <!-- Pedido Mínimo -->
                <div>
                  <label for="minOrderValue" class="block text-sm font-medium text-gray-700 mb-2">
                    Pedido mínimo <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >R$</span
                    >
                    <input
                      id="minOrderValue"
                      v-model="form.minOrderValue"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                      placeholder="0,00"
                    />
                  </div>
                  <p class="mt-2 text-xs text-gray-500">
                    Valor mínimo do pedido para aplicar a promoção
                  </p>
                </div>

                <!-- Tipo de Promoção -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de promoção <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label
                      class="relative flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-coral-soft hover:bg-coral-50 transition-all duration-200 group"
                    >
                      <input
                        v-model="form.freeShipping"
                        :value="true"
                        type="radio"
                        name="freeShipping"
                        class="h-5 w-5 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <div class="ml-3 flex-1">
                        <span class="text-sm font-medium text-gray-900 group-hover:text-coral-700"
                          >Frete grátis</span
                        >
                        <p class="text-xs text-gray-500 mt-1">Frete totalmente gratuito</p>
                      </div>
                      <div
                        class="absolute top-2 right-2 w-3 h-3 bg-gray-200 rounded-full group-hover:bg-coral-200 transition-colors"
                      ></div>
                    </label>

                    <label
                      class="relative flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-coral-soft hover:bg-coral-50 transition-all duration-200 group"
                    >
                      <input
                        v-model="form.freeShipping"
                        :value="false"
                        type="radio"
                        name="freeShipping"
                        class="h-5 w-5 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <div class="ml-3 flex-1">
                        <span class="text-sm font-medium text-gray-900 group-hover:text-coral-700"
                          >Desconto no frete</span
                        >
                        <p class="text-xs text-gray-500 mt-1">Desconto parcial no frete</p>
                      </div>
                      <div
                        class="absolute top-2 right-2 w-3 h-3 bg-gray-200 rounded-full group-hover:bg-coral-200 transition-colors"
                      ></div>
                    </label>
                  </div>
                </div>

                <!-- Valor do Desconto (apenas se não for frete grátis) -->
                <div v-if="!form.freeShipping">
                  <label for="discountValue" class="block text-sm font-medium text-gray-700 mb-2">
                    Valor do desconto <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >R$</span
                    >
                    <input
                      id="discountValue"
                      v-model="form.discountValue"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                      placeholder="0,00"
                    />
                  </div>
                  <p class="mt-2 text-xs text-gray-500">Valor do desconto aplicado no frete</p>
                </div>
              </div>
            </div>

            <!-- 3. Validade -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Validade</h4>
              </div>

              <div>
                <label for="validUntil" class="block text-sm font-medium text-gray-700 mb-2">
                  Válida até
                </label>
                <DatePicker
                  id="validUntil"
                  v-model="form.validUntil"
                  :include-time="true"
                  placeholder="Selecione a data de expiração (opcional)"
                  :min-date="new Date()"
                />
                <p class="mt-2 text-xs text-gray-500">
                  Deixe vazio para promoção sem data de expiração
                </p>
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
                class="px-8 py-3 bg-gradient-to-r from-coral-soft to-coral-dark text-white font-medium rounded-lg hover:from-coral-dark hover:to-coral-soft transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                {{ promotion ? 'Atualizar Promoção' : 'Criar Promoção' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import DatePicker from './DatePicker.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  promotion: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'saved']);

const loading = ref(false);
const form = ref({
  name: '',
  description: '',
  minOrderValue: '',
  freeShipping: true,
  discountValue: '',
  validUntil: '',
  isActive: true,
});

const supabase = useSupabaseClient();

// Reset form when modal opens/closes
watch(
  () => props.isOpen,
  newValue => {
    if (newValue) {
      if (props.promotion) {
        // Edit mode
        form.value = {
          name: props.promotion.name || '',
          description: props.promotion.description || '',
          minOrderValue: props.promotion.minOrderValue || '',
          freeShipping:
            props.promotion.freeShipping !== undefined ? props.promotion.freeShipping : true,
          discountValue: props.promotion.discountValue || '',
          validUntil: props.promotion.validUntil ? props.promotion.validUntil.slice(0, 16) : '',
          isActive: props.promotion.isActive !== undefined ? props.promotion.isActive : true,
        };
      } else {
        // Create mode
        form.value = {
          name: '',
          description: '',
          minOrderValue: '',
          freeShipping: true,
          discountValue: '',
          validUntil: '',
          isActive: true,
        };
      }
    }
  }
);

const closeModal = () => {
  if (!loading.value) {
    emit('close');
  }
};

const savePromotion = async () => {
  loading.value = true;

  try {
    const promotionData = {
      name: form.value.name,
      description: form.value.description,
      minOrderValue: parseFloat(form.value.minOrderValue),
      freeShipping: form.value.freeShipping,
      discountValue: form.value.freeShipping ? 0 : parseFloat(form.value.discountValue),
      validUntil: form.value.validUntil ? new Date(form.value.validUntil).toISOString() : null,
      isActive: form.value.isActive,
    };

    if (props.promotion) {
      // Update existing promotion usando API endpoint
      try {
        const response = await $fetch(`/api/shipping-promotions/${props.promotion.id}`, {
          method: 'PUT',
          body: promotionData,
        });
      } catch (apiError) {
        console.error('Erro da API (update):', apiError);
        throw apiError;
      }
    } else {
      // Create new promotion usando API endpoint

      try {
        const response = await $fetch('/api/shipping-promotions', {
          method: 'POST',
          body: promotionData,
        });
      } catch (apiError) {
        console.error('Erro da API:', apiError);
        throw apiError;
      }
    }

    emit('saved');
  } catch (error) {
    console.error('Erro ao salvar promoção:', error);
    alert('Erro ao salvar promoção: ' + error.message);
  } finally {
    loading.value = false;
  }
};
</script>
