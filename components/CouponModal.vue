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
                {{ coupon ? 'Editar Cupom' : 'Novo Cupom' }}
              </h3>

              <form @submit.prevent="saveCoupon" class="space-y-4">
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

                <!-- Código -->
                <div>
                  <label for="code" class="block text-sm font-medium text-gray-700">Código</label>
                  <input
                    id="code"
                    v-model="form.code"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm font-mono"
                  />
                </div>

                <!-- Tipo de Desconto -->
                <div>
                  <label for="discountType" class="block text-sm font-medium text-gray-700">Tipo de Desconto</label>
                  <select
                    id="discountType"
                    v-model="form.discountType"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                  >
                    <option value="PERCENTAGE">Percentual (%)</option>
                    <option value="FIXED">Valor Fixo (R$)</option>
                  </select>
                </div>

                <!-- Valor do Desconto -->
                <div>
                  <label for="discountValue" class="block text-sm font-medium text-gray-700">
                    {{ form.discountType === 'PERCENTAGE' ? 'Percentual de Desconto (%)' : 'Valor do Desconto (R$)' }}
                  </label>
                  <input
                    id="discountValue"
                    v-model="form.discountValue"
                    type="number"
                    :step="form.discountType === 'PERCENTAGE' ? '1' : '0.01'"
                    :min="0"
                    :max="form.discountType === 'PERCENTAGE' ? '100' : ''"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                  />
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
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                  />
                </div>

                <!-- Desconto Máximo -->
                <div>
                  <label for="maxDiscount" class="block text-sm font-medium text-gray-700">Desconto Máximo (R$)</label>
                  <input
                    id="maxDiscount"
                    v-model="form.maxDiscount"
                    type="number"
                    step="0.01"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                  />
                </div>

                <!-- Limite de Uso -->
                <div>
                  <label for="usageLimit" class="block text-sm font-medium text-gray-700">Limite de Uso</label>
                  <input
                    id="usageLimit"
                    v-model="form.usageLimit"
                    type="number"
                    min="1"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                  />
                </div>

                <!-- Data de Validade -->
                <div>
                  <label for="validUntil" class="block text-sm font-medium text-gray-700">Válido Até</label>
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
                  <label for="isActive" class="ml-2 block text-sm text-gray-900">Ativo</label>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="saveCoupon"
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
  coupon: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'saved']);

const saving = ref(false);
const form = ref({
  name: '',
  description: '',
  code: '',
  discountType: 'PERCENTAGE',
  discountValue: '',
  minOrderValue: '',
  maxDiscount: '',
  usageLimit: '',
  validUntil: '',
  isActive: true,
});

const supabase = useSupabaseClient();

// Reset form when modal opens/closes
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    if (props.coupon) {
      // Edit mode
      form.value = {
        name: props.coupon.name || '',
        description: props.coupon.description || '',
        code: props.coupon.code || '',
        discountType: props.coupon.discountType || 'PERCENTAGE',
        discountValue: props.coupon.discountValue || '',
        minOrderValue: props.coupon.minOrderValue || '',
        maxDiscount: props.coupon.maxDiscount || '',
        usageLimit: props.coupon.usageLimit || '',
        validUntil: props.coupon.validUntil ? props.coupon.validUntil.slice(0, 16) : '',
        isActive: props.coupon.isActive !== undefined ? props.coupon.isActive : true,
      };
    } else {
      // Create mode
      form.value = {
        name: '',
        description: '',
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderValue: '',
        maxDiscount: '',
        usageLimit: '',
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

const saveCoupon = async () => {
  saving.value = true;

  try {
    const couponData = {
      name: form.value.name,
      description: form.value.description,
      code: form.value.code.toUpperCase(),
      discountType: form.value.discountType,
      discountValue: parseFloat(form.value.discountValue),
      minOrderValue: form.value.minOrderValue ? parseFloat(form.value.minOrderValue) : null,
      maxDiscount: form.value.maxDiscount ? parseFloat(form.value.maxDiscount) : null,
      usageLimit: form.value.usageLimit ? parseInt(form.value.usageLimit) : null,
      validUntil: form.value.validUntil ? new Date(form.value.validUntil).toISOString() : null,
      isActive: form.value.isActive,
    };

    if (props.coupon) {
      // Update existing coupon
      const { error } = await supabase
        .from('coupons')
        .update(couponData)
        .eq('id', props.coupon.id);

      if (error) throw error;
    } else {
      // Create new coupon - não incluir id, deixar o banco gerar automaticamente
      const { error } = await supabase
        .from('coupons')
        .insert([{ 
          ...couponData, 
          usedCount: 0 
        }]);

      if (error) throw error;
    }

    emit('saved');
  } catch (error) {
    console.error('Erro ao salvar cupom:', error);
    alert('Erro ao salvar cupom: ' + error.message);
  } finally {
    saving.value = false;
  }
};
</script>
