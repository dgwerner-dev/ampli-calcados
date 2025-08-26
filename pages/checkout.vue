<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Checkout</h1>
        <p class="text-gray-600 mt-2">Finalize sua compra de forma segura</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p class="text-red-600 font-medium">{{ error }}</p>
        </div>
        <button @click="loadOrder" class="mt-4 text-red-600 hover:text-red-800 underline">
          Tentar novamente
        </button>
      </div>

      <!-- Checkout Form -->
      <div v-else-if="order">
        <CheckoutForm
          :order-id="order.id"
          :order-items="order.orderItems"
          :total="order.total"
          @payment-success="handlePaymentSuccess"
          @payment-error="handlePaymentError"
        />
      </div>

      <!-- Order not found -->
      <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div class="flex items-center space-x-2">
          <svg
            class="w-5 h-5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
          <p class="text-yellow-600 font-medium">Pedido não encontrado</p>
        </div>
        <p class="text-yellow-600 mt-2">
          O pedido que você está tentando finalizar não foi encontrado.
        </p>
        <NuxtLink to="/" class="mt-4 inline-block text-yellow-600 hover:text-yellow-800 underline">
          Voltar para a loja
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { success, error: notificationError } = useNotifications();

// Estados
const loading = ref(true);
const error = ref<string | null>(null);
const order = ref<any>(null);

// Carregar dados do pedido
const loadOrder = async () => {
  loading.value = true;
  error.value = null;

  try {
    const orderId = route.query.orderId as string;

    if (!orderId) {
      error.value = 'ID do pedido não fornecido';
      return;
    }

    // Buscar dados do pedido
    const supabase = useSupabaseClient();
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(
        `
        *,
        orderItems (
          *,
          product (
            id,
            name,
            price,
            images
          )
        )
      `
      )
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      error.value = 'Pedido não encontrado';
      return;
    }

    order.value = orderData;
  } catch (err: any) {
    console.error('Erro ao carregar pedido:', err);
    error.value = 'Erro ao carregar dados do pedido';
  } finally {
    loading.value = false;
  }
};

// Handlers de pagamento
const handlePaymentSuccess = (paymentData: any) => {
  success('Pagamento realizado com sucesso!');
  // Redirecionar para página de sucesso
  navigateTo(`/payment-success?orderId=${order.value.id}`);
};

const handlePaymentError = (error: any) => {
  console.error('Erro no pagamento:', error);
  notificationError('Erro ao processar pagamento. Tente novamente.');
};

// Carregar dados quando a página for montada
onMounted(() => {
  loadOrder();
});
</script>
