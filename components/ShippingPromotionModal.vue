<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                {{ promotion ? 'Editar Promoção de Frete' : 'Nova Promoção de Frete' }}
              </h3>

              <form @submit.prevent="savePromotion" class="space-y-4">
                <!-- Nome -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                  />
                </div>

                <!-- Descrição -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                  ></textarea>
                </div>

                <!-- Pedido Mínimo -->
                <div>
                  <label for="minOrderValue" class="block text-sm font-medium text-gray-700">Pedido Mínimo (R$)</label>
                  <input
                    id="minOrderValue"
                    v-model="form.minOrderValue"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                  />
                </div>

                <!-- Tipo de Promoção -->
                <div>
                  <label for="freeShipping" class="block text-sm font-medium text-gray-700">Tipo de Promoção</label>
                  <div class="mt-2 space-y-2">
                    <div class="flex items-center">
                      <input
                        id="freeShipping"
                        v-model="form.freeShipping"
                        type="radio"
                        :value="true"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <label for="freeShipping" class="ml-2 block text-sm text-gray-900">Frete Grátis</label>
                    </div>
                    <div class="flex items-center">
                      <input
                        id="discountShipping"
                        v-model="form.freeShipping"
                        type="radio"
                        :value="false"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <label for="discountShipping" class="ml-2 block text-sm text-gray-900">Desconto no Frete</label>
                    </div>
                  </div>
                </div>

                <!-- Valor do Desconto (apenas se não for frete grátis) -->
                <div v-if="!form.freeShipping">
                  <label for="discountValue" class="block text-sm font-medium text-gray-700">Valor do Desconto (R$)</label>
                  <input
                    id="discountValue"
                    v-model="form.discountValue"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                  />
                </div>

                <!-- Data de Validade -->
                <div>
                  <label for="validUntil" class="block text-sm font-medium text-gray-700">Válida Até</label>
                  <input
                    id="validUntil"
                    v-model="form.validUntil"
                    type="datetime-local"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                  />
                </div>

                <!-- Status -->
                <div class="flex items-center">
                  <input
                    id="isActive"
                    v-model="form.isActive"
                    type="checkbox"
                    class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                  />
                  <label for="isActive" class="ml-2 block text-sm text-gray-900">Ativa</label>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="savePromotion"
            :disabled="saving"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-coral-soft text-base font-medium text-white hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            <svg v-if="saving" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
          <button
            type="button"
            @click="closeModal"
            :disabled="saving"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

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

const saving = ref(false);
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
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    if (props.promotion) {
      // Edit mode
      form.value = {
        name: props.promotion.name || '',
        description: props.promotion.description || '',
        minOrderValue: props.promotion.minOrderValue || '',
        freeShipping: props.promotion.freeShipping !== undefined ? props.promotion.freeShipping : true,
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
});

const closeModal = () => {
  if (!saving.value) {
    emit('close');
  }
};

const savePromotion = async () => {
  saving.value = true;

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
      // Update existing promotion
      const { error } = await supabase
        .from('shipping_promotions')
        .update(promotionData)
        .eq('id', props.promotion.id);

      if (error) throw error;
    } else {
      // Create new promotion
      const { error } = await supabase
        .from('shipping_promotions')
        .insert([promotionData]);

      if (error) throw error;
    }

    emit('saved');
  } catch (error) {
    console.error('Erro ao salvar promoção:', error);
    alert('Erro ao salvar promoção: ' + error.message);
  } finally {
    saving.value = false;
  }
};
</script>
