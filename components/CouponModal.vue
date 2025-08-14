<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="closeModal"
      ></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
                {{ coupon ? 'Editar Cupom' : 'Novo Cupom' }}
              </h3>

              <form @submit.prevent="saveCoupon" class="space-y-8">
                <!-- 1. Informações do cupom -->
                <div class="border-b border-gray-200 pb-6">
                  <h4 class="text-md font-medium text-gray-900 mb-4">Informações do cupom</h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Situação do cupom -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-3">
                        Situação do cupom <span class="text-red-500">*</span>
                      </label>
                      <div class="space-y-2">
                        <label class="flex items-center">
                          <input
                            v-model="form.isActive"
                            :value="true"
                            type="radio"
                            name="status"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                          />
                          <span class="ml-2 text-sm text-gray-700">Ativo</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            v-model="form.isActive"
                            :value="false"
                            type="radio"
                            name="status"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                          />
                          <span class="ml-2 text-sm text-gray-700">Inativo</span>
                        </label>
                      </div>
                    </div>

                    <!-- Nome do cupom -->
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700">
                        Nome do cupom <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        v-model="form.name"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                      />
                      <p class="mt-1 text-xs text-gray-500">
                        O nome do cupom será usado apenas para identificação no painel.
                      </p>
                    </div>

                    <!-- Código do cupom -->
                    <div class="md:col-span-2">
                      <label for="code" class="block text-sm font-medium text-gray-700">
                        Código do cupom <span class="text-red-500">*</span>
                      </label>
                      <div class="mt-1 flex rounded-md shadow-sm">
                        <input
                          id="code"
                          v-model="form.code"
                          type="text"
                          required
                          class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm font-mono"
                        />
                        <button
                          type="button"
                          @click="generateCode"
                          class="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-coral-soft"
                        >
                          Gerar código
                        </button>
                      </div>
                      <p class="mt-1 text-xs text-gray-500">
                        O código do cupom é o que você dará para o seu cliente preencher no carrinho de compras.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 2. Tipo de cupom -->
                <div class="border-b border-gray-200 pb-6">
                  <h4 class="text-md font-medium text-gray-900 mb-4">Tipo de cupom</h4>
                  
                  <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <!-- Percentual -->
                      <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          v-model="form.discountType"
                          value="PERCENTAGE"
                          type="radio"
                          name="discountType"
                          class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                        />
                        <span class="ml-2 text-sm font-medium text-gray-700">Percentual</span>
                      </label>

                      <!-- Valor fixo -->
                      <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          v-model="form.discountType"
                          value="FIXED"
                          type="radio"
                          name="discountType"
                          class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                        />
                        <span class="ml-2 text-sm font-medium text-gray-700">Valor fixo</span>
                      </label>

                      <!-- Frete grátis -->
                      <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          v-model="form.discountType"
                          value="FREE_SHIPPING"
                          type="radio"
                          name="discountType"
                          class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                        />
                        <span class="ml-2 text-sm font-medium text-gray-700">Frete grátis</span>
                      </label>
                    </div>

                    <!-- Valor de desconto (quando não for frete grátis) -->
                    <div v-if="form.discountType !== 'FREE_SHIPPING'" class="max-w-xs">
                      <label for="discountValue" class="block text-sm font-medium text-gray-700">
                        Valor de desconto
                      </label>
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <div v-if="form.discountType === 'FIXED'" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                          id="discountValue"
                          v-model="form.discountValue"
                          type="number"
                          :step="form.discountType === 'PERCENTAGE' ? '1' : '0.01'"
                          :min="0"
                          :max="form.discountType === 'PERCENTAGE' ? '100' : ''"
                          required
                          :class="[
                            'block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm',
                            form.discountType === 'FIXED' ? 'pl-12' : ''
                          ]"
                        />
                        <div v-if="form.discountType === 'PERCENTAGE'" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-sm">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 3. Quantidade -->
                <div class="border-b border-gray-200 pb-6">
                  <h4 class="text-md font-medium text-gray-900 mb-4">Quantidade</h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Quantidade total de cupons -->
                    <div>
                      <label for="usageLimit" class="block text-sm font-medium text-gray-700">
                        Quantidade total de cupons
                      </label>
                      <input
                        id="usageLimit"
                        v-model="form.usageLimit"
                        type="number"
                        min="1"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                      />
                    </div>

                    <!-- Quantidade de uso por cliente -->
                    <div>
                      <label for="usagePerCustomer" class="block text-sm font-medium text-gray-700">
                        Quantidade de uso por cliente
                      </label>
                      <input
                        id="usagePerCustomer"
                        v-model="form.usagePerCustomer"
                        type="number"
                        min="1"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <!-- 4. Condições de limitação -->
                <div class="border-b border-gray-200 pb-6">
                  <h4 class="text-md font-medium text-gray-900 mb-4">Condições de limitação</h4>
                  
                  <div class="space-y-6">
                    <!-- Por produto -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-3">Por produto</label>
                      <div class="space-y-2">
                        <label class="flex items-center">
                          <input
                            v-model="form.productRestriction"
                            value="ALL_PRODUCTS"
                            type="radio"
                            name="productRestriction"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                          />
                          <span class="ml-2 text-sm text-gray-700">Aplicar cupom para todos os produtos</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            v-model="form.productRestriction"
                            value="SPECIFIC_PRODUCTS"
                            type="radio"
                            name="productRestriction"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                          />
                          <span class="ml-2 text-sm text-gray-700">Aplicar cupom em um ou mais produtos específicos</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            v-model="form.productRestriction"
                            value="SPECIFIC_CATEGORIES"
                            type="radio"
                            name="productRestriction"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                          />
                          <span class="ml-2 text-sm text-gray-700">Aplicar cupom em uma ou mais categorias específicas</span>
                        </label>
                      </div>
                    </div>

                    <!-- Por cliente -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-3">Por cliente</label>
                      <div class="space-y-2">
                        <label class="flex items-center">
                          <input
                            v-model="form.customerRestriction"
                            value="ALL_CUSTOMERS"
                            type="radio"
                            name="customerRestriction"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                          />
                          <span class="ml-2 text-sm text-gray-700">Aplicar cupom para todos os clientes</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            v-model="form.customerRestriction"
                            value="SPECIFIC_CUSTOMER"
                            type="radio"
                            name="customerRestriction"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                          />
                          <span class="ml-2 text-sm text-gray-700">Aplicar cupom para um cliente específico</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            v-model="form.customerRestriction"
                            value="CUSTOMER_GROUP"
                            type="radio"
                            name="customerRestriction"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                          />
                          <span class="ml-2 text-sm text-gray-700">Aplicar cupom para um grupo de cliente específico</span>
                        </label>
                      </div>
                    </div>

                    <!-- Por valor -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-3">Por valor</label>
                      <div class="space-y-2">
                        <label class="flex items-center">
                          <input
                            v-model="form.minOrderValue"
                            type="checkbox"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                          />
                          <span class="ml-2 text-sm text-gray-700">Limitar cupom por valor mínimo do carrinho</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            v-model="form.isAccumulative"
                            type="checkbox"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                          />
                          <span class="ml-2 text-sm text-gray-700">Cupom acumulativo</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            v-model="form.applyToTotal"
                            type="checkbox"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                          />
                          <span class="ml-2 text-sm text-gray-700">Aplicar no total</span>
                        </label>
                      </div>
                      
                      <!-- Valor mínimo do carrinho (quando checkbox estiver marcado) -->
                      <div v-if="form.minOrderValue" class="mt-3 max-w-xs">
                        <label for="minOrderValueAmount" class="block text-sm font-medium text-gray-700">
                          Valor mínimo do carrinho (R$)
                        </label>
                        <input
                          id="minOrderValueAmount"
                          v-model="form.minOrderValueAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 5. Por data -->
                <div class="border-b border-gray-200 pb-6">
                  <h4 class="text-md font-medium text-gray-900 mb-4">Por data</h4>
                  
                  <div class="max-w-xs">
                    <label for="validUntil" class="block text-sm font-medium text-gray-700">
                      Data final
                    </label>
                    <input
                      id="validUntil"
                      v-model="form.validUntil"
                      type="datetime-local"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                    />
                  </div>
                </div>

                <!-- 6. Descrição -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                    placeholder="Descrição opcional do cupom..."
                  ></textarea>
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
            <svg
              v-if="saving"
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
  isActive: true,
  usageLimit: '',
  usagePerCustomer: 1,
  validUntil: '',
  productRestriction: 'ALL_PRODUCTS',
  customerRestriction: 'ALL_CUSTOMERS',
  minOrderValue: false,
  minOrderValueAmount: '',
  isAccumulative: false,
  applyToTotal: true,
});

const supabase = useSupabaseClient();

// Função para gerar código aleatório
const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  form.value.code = result;
};

// Reset form when modal opens/closes
watch(
  () => props.isOpen,
  newValue => {
    if (newValue) {
      if (props.coupon) {
        // Edit mode
        form.value = {
          name: props.coupon.name || '',
          description: props.coupon.description || '',
          code: props.coupon.code || '',
          discountType: props.coupon.discountType || 'PERCENTAGE',
          discountValue: props.coupon.discountValue || '',
          isActive: props.coupon.isActive !== undefined ? props.coupon.isActive : true,
          usageLimit: props.coupon.usageLimit || '',
          usagePerCustomer: props.coupon.usagePerCustomer || 1,
          validUntil: props.coupon.validUntil ? props.coupon.validUntil.slice(0, 16) : '',
          productRestriction: props.coupon.productRestriction || 'ALL_PRODUCTS',
          customerRestriction: props.coupon.customerRestriction || 'ALL_CUSTOMERS',
          minOrderValue: props.coupon.minOrderValue ? true : false,
          minOrderValueAmount: props.coupon.minOrderValue || '',
          isAccumulative: props.coupon.isAccumulative || false,
          applyToTotal: props.coupon.applyToTotal !== undefined ? props.coupon.applyToTotal : true,
        };
      } else {
        // Create mode
        form.value = {
          name: '',
          description: '',
          code: '',
          discountType: 'PERCENTAGE',
          discountValue: '',
          isActive: true,
          usageLimit: '',
          usagePerCustomer: 1,
          validUntil: '',
          productRestriction: 'ALL_PRODUCTS',
          customerRestriction: 'ALL_CUSTOMERS',
          minOrderValue: false,
          minOrderValueAmount: '',
          isAccumulative: false,
          applyToTotal: true,
        };
      }
    }
  }
);

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
      discountValue: form.value.discountType !== 'FREE_SHIPPING' ? parseFloat(form.value.discountValue) : null,
      isActive: form.value.isActive,
      usageLimit: form.value.usageLimit ? parseInt(form.value.usageLimit) : null,
      usagePerCustomer: parseInt(form.value.usagePerCustomer),
      validUntil: form.value.validUntil ? new Date(form.value.validUntil).toISOString() : null,
      productRestriction: form.value.productRestriction,
      customerRestriction: form.value.customerRestriction,
      minOrderValue: form.value.minOrderValue && form.value.minOrderValueAmount ? parseFloat(form.value.minOrderValueAmount) : null,
      isAccumulative: form.value.isAccumulative,
      applyToTotal: form.value.applyToTotal,
    };

    if (props.coupon) {
      // Update existing coupon
      const { error } = await supabase.from('coupons').update(couponData).eq('id', props.coupon.id);

      if (error) throw error;
    } else {
      // Create new coupon - não incluir id, deixar o banco gerar automaticamente
      const { error } = await supabase.from('coupons').insert([
        {
          ...couponData,
          usedCount: 0,
        },
      ]);

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
