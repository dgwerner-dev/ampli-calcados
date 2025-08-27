<template>
  <div class="min-h-screen bg-neutral-light">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <nav class="flex items-center space-x-2 text-sm">
          <NuxtLink to="/" class="text-gray-500 hover:text-coral-soft transition-colors">
            Início
          </NuxtLink>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
          <span class="text-coral-soft font-medium">Checkout</span>
        </nav>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-soft mb-4"></div>
        <p class="text-gray-600 font-medium">Carregando dados do pedido...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
          >
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-red-800 mb-2">Erro ao carregar pedido</h3>
          <p class="text-red-600 mb-6">{{ error }}</p>
          <button
            @click="loadOrder"
            class="inline-flex items-center px-6 py-3 bg-coral-soft text-white font-medium rounded-lg hover:bg-coral-dark transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            Tentar novamente
          </button>
        </div>
      </div>

      <!-- Checkout Form -->
      <div v-else-if="order" class="animate-fade-in">
        <CheckoutForm
          :order-id="order.id"
          :order-items="order.orderItems"
          :total="Number(order.total)"
          @payment-success="handlePaymentSuccess"
          @payment-error="handlePaymentError"
        />
      </div>

      <!-- Order not found -->
      <div v-else class="max-w-2xl mx-auto">
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4"
          >
            <svg
              class="w-8 h-8 text-yellow-500"
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
          </div>
          <h3 class="text-xl font-semibold text-yellow-800 mb-2">Pedido não encontrado</h3>
          <p class="text-yellow-600 mb-6">
            O pedido que você está tentando finalizar não foi encontrado ou não pertence a você.
          </p>
          <NuxtLink
            to="/"
            class="inline-flex items-center px-6 py-3 bg-coral-soft text-white font-medium rounded-lg hover:bg-coral-dark transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Voltar para a loja
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
});

const route = useRoute();
const { success, error: notificationError } = useNotifications();

// Estados
const loading = ref(true);
const error = ref<string | null>(null);
const order = ref<any>(null);

// Carregar dados do pedido ou carrinho
const loadOrder = async () => {
  loading.value = true;
  error.value = null;

  try {
    const orderId = route.query.orderId as string;

    if (orderId) {
      // Se temos um orderId, carregar pedido existente
      const orderData = await $fetch(`/api/orders/${orderId}`);

      if (!orderData) {
        error.value = 'Pedido não encontrado';
        return;
      }

      order.value = orderData;
    } else {
      // Se não temos orderId, usar dados do carrinho
      const { cart, total, itemCount } = useCart();
      
      if (itemCount.value === 0) {
        error.value = 'Carrinho vazio. Adicione produtos antes de finalizar a compra.';
        return;
      }

      // Criar objeto de pedido a partir do carrinho
      order.value = {
        id: 'cart-' + Date.now(), // ID temporário
        orderItems: cart.value.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          product: item.product
        })),
        total: total.value,
        shipping: 0,
        tax: 0,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  } catch (err: any) {
    console.error('Erro ao carregar pedido:', err);
    error.value = 'Erro ao carregar dados do pedido';
  } finally {
    loading.value = false;
  }
};

// Handlers de pagamento
const handlePaymentSuccess = async (paymentData: any) => {
  try {
    // Se o pedido veio do carrinho, criar o pedido no banco
    if (order.value.id.startsWith('cart-')) {
      const { clearCart } = useCart();
      
      // Criar pedido no banco de dados
      const createdOrder = await $fetch('/api/orders/create', {
        method: 'POST',
        body: {
          items: order.value.orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color
          }))
        }
      });

      if (createdOrder.success) {
        // Limpar carrinho após sucesso
        clearCart();
        success('Pagamento realizado com sucesso!');
        // Redirecionar para página de sucesso com o ID real do pedido
        navigateTo(`/payment-success?orderId=${createdOrder.order.id}`);
      } else {
        throw new Error('Erro ao criar pedido');
      }
    } else {
      // Pedido já existente
      success('Pagamento realizado com sucesso!');
      navigateTo(`/payment-success?orderId=${order.value.id}`);
    }
  } catch (err) {
    console.error('Erro ao processar pagamento:', err);
    notificationError('Erro ao finalizar pedido. Tente novamente.');
  }
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
