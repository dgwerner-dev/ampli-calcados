<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Finalizar Compra</h2>

      <!-- Resumo do pedido -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">Resumo do Pedido</h3>
        <div class="space-y-2">
          <div v-for="item in orderItems" :key="item.id" class="flex justify-between">
            <span>{{ item.product.name }} ({{ item.quantity }}x)</span>
            <span>R$ {{ formatPrice(item.price * item.quantity) }}</span>
          </div>
          <div class="border-t pt-2 mt-2">
            <div class="flex justify-between font-semibold">
              <span>Total</span>
              <span>R$ {{ formatPrice(total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulário de pagamento -->
      <form @submit.prevent="processPayment" class="space-y-6">
        <!-- Dados do cliente -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Dados Pessoais</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                v-model="form.customer.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                CPF *
              </label>
              <input
                v-model="form.customer.cpf"
                type="text"
                required
                v-mask="'###.###.###-##'"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                v-model="form.customer.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                v-model="form.customer.phone"
                type="text"
                required
                v-mask="'(##) #####-####'"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        <!-- Endereço de entrega -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Endereço de Entrega</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                CEP *
              </label>
              <input
                v-model="form.address.zipCode"
                type="text"
                required
                v-mask="'#####-###'"
                @blur="searchCep"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Rua *
              </label>
              <input
                v-model="form.address.street"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Número *
              </label>
              <input
                v-model="form.address.number"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Complemento
              </label>
              <input
                v-model="form.address.complement"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Bairro *
              </label>
              <input
                v-model="form.address.neighborhood"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Cidade *
              </label>
              <input
                v-model="form.address.city"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                v-model="form.address.state"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Selecione...</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Método de pagamento -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Método de Pagamento</h3>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                v-model="form.paymentMethod"
                value="credit_card"
                type="radio"
                class="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">Cartão de Crédito</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.paymentMethod"
                value="pix"
                type="radio"
                class="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">PIX</span>
            </label>
          </div>
        </div>

        <!-- Dados do cartão (se selecionado) -->
        <div v-if="form.paymentMethod === 'credit_card'">
          <h3 class="text-lg font-semibold mb-4">Dados do Cartão</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Número do Cartão *
              </label>
              <input
                v-model="form.card.number"
                type="text"
                required
                v-mask="'#### #### #### ####'"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nome no Cartão *
              </label>
              <input
                v-model="form.card.holderName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Validade *
              </label>
              <input
                v-model="form.card.expiry"
                type="text"
                required
                v-mask="'##/##'"
                placeholder="MM/AA"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                CVV *
              </label>
              <input
                v-model="form.card.cvv"
                type="text"
                required
                v-mask="'###'"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Parcelas *
              </label>
              <select
                v-model="form.installments"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option v-for="i in 12" :key="i" :value="i">
                  {{ i }}x de R$ {{ formatPrice(total / i) }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Botão de pagamento -->
        <div class="pt-6">
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
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
            {{ loading ? 'Processando...' : `Pagar R$ ${formatPrice(total)}` }}
          </button>
        </div>
      </form>

      <!-- Modal PIX -->
      <div v-if="showPixModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="closePixModal"></div>
          
          <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
            <div class="bg-white px-6 py-8">
              <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Pagamento PIX</h3>
                <p class="text-sm text-gray-600 mb-6">
                  Escaneie o QR Code abaixo ou copie o código PIX para pagar
                </p>
                
                <!-- QR Code -->
                <div class="mb-6 flex justify-center">
                  <img :src="pixQrCode" alt="QR Code PIX" class="w-48 h-48" />
                </div>
                
                <!-- Código PIX -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Código PIX
                  </label>
                  <div class="flex">
                    <input
                      :value="pixCode"
                      type="text"
                      readonly
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                    />
                    <button
                      @click="copyPixCode"
                      class="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
                
                <div class="text-xs text-gray-500">
                  O pagamento expira em 1 hora
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
const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
  orderItems: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['payment-success', 'payment-error']);

const { success, error: notificationError } = useNotifications();

// Estados
const loading = ref(false);
const showPixModal = ref(false);
const pixQrCode = ref('');
const pixCode = ref('');

// Formulário
const form = ref({
  customer: {
    name: '',
    email: '',
    cpf: '',
    phone: '',
  },
  address: {
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  },
  paymentMethod: 'credit_card',
  card: {
    number: '',
    holderName: '',
    expiry: '',
    cvv: '',
  },
  installments: 1,
});

// Métodos
const formatPrice = (price: number) => {
  return price.toFixed(2).replace('.', ',');
};

const searchCep = async () => {
  const cep = form.value.address.zipCode.replace(/\D/g, '');
  if (cep.length === 8) {
    try {
      const response = await $fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.erro) {
        notificationError('CEP não encontrado');
        return;
      }
      
      form.value.address.street = response.logradouro;
      form.value.address.neighborhood = response.bairro;
      form.value.address.city = response.localidade;
      form.value.address.state = response.uf;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  }
};

const processPayment = async () => {
  loading.value = true;
  
  try {
    // Preparar dados do cartão
    let cardData = null;
    if (form.value.paymentMethod === 'credit_card') {
      const [expMonth, expYear] = form.value.card.expiry.split('/');
      cardData = {
        number: form.value.card.number.replace(/\s/g, ''),
        holderName: form.value.card.holderName,
        expMonth,
        expYear: `20${expYear}`,
        cvv: form.value.card.cvv,
      };
    }

    // Dados do cliente
    const customerData = {
      name: form.value.customer.name,
      email: form.value.customer.email,
      cpf: form.value.customer.cpf,
      phone: form.value.customer.phone,
      address: form.value.address,
    };

    // Processar pagamento
    const response = await $fetch('/api/payment/create', {
      method: 'POST',
      body: {
        orderId: props.orderId,
        paymentMethod: form.value.paymentMethod,
        cardData,
        installments: form.value.installments,
        customerData,
      },
    });

    if (response.success) {
      if (form.value.paymentMethod === 'pix') {
        // Mostrar modal PIX
        pixQrCode.value = response.order.charges[0].payment_method.pix.qr_codes[0].links[0].href;
        pixCode.value = response.order.charges[0].payment_method.pix.qr_codes[0].text;
        showPixModal.value = true;
      } else {
        // Pagamento com cartão
        success('Pagamento processado com sucesso!');
        emit('payment-success', response.order);
      }
    }
  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error);
    notificationError(error.data?.statusMessage || 'Erro ao processar pagamento');
    emit('payment-error', error);
  } finally {
    loading.value = false;
  }
};

const copyPixCode = async () => {
  try {
    await navigator.clipboard.writeText(pixCode.value);
    success('Código PIX copiado!');
  } catch (error) {
    console.error('Erro ao copiar código PIX:', error);
  }
};

const closePixModal = () => {
  showPixModal.value = false;
  pixQrCode.value = '';
  pixCode.value = '';
};
</script>
