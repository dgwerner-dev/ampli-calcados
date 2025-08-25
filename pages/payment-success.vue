<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md mx-auto text-center">
      <!-- Success Icon -->
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-6">
        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <!-- Success Message -->
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Pagamento Aprovado!</h1>
      <p class="text-gray-600 mb-8">
        Seu pagamento foi processado com sucesso. Você receberá um email de confirmação em breve.
      </p>

      <!-- Order Details -->
      <div v-if="order" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pedido</h2>
        
        <div class="space-y-3 text-left">
          <div class="flex justify-between">
            <span class="text-gray-600">Número do Pedido:</span>
            <span class="font-medium">{{ order.id }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total:</span>
            <span class="font-medium">R$ {{ formatPrice(order.total) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Status:</span>
            <span class="font-medium text-green-600">{{ getStatusText(order.status) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Data:</span>
            <span class="font-medium">{{ formatDate(order.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-4">
        <NuxtLink
          to="/orders"
          class="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Ver Meus Pedidos
        </NuxtLink>
        
        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Continuar Comprando
        </NuxtLink>
      </div>

      <!-- Additional Info -->
      <div class="mt-8 text-sm text-gray-500">
        <p>Em caso de dúvidas, entre em contato conosco:</p>
        <p class="mt-2">
          <a href="mailto:contato@bartezen.com" class="text-orange-500 hover:text-orange-600">
            contato@bartezen.com
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

// Estados
const order = ref<any>(null);

// Carregar dados do pedido
const loadOrder = async () => {
  try {
    const orderId = route.query.orderId as string;
    
    if (!orderId) return;

    // Buscar dados do pedido
    const supabase = useSupabaseClient();
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!orderError && orderData) {
      order.value = orderData;
    }
  } catch (error) {
    console.error('Erro ao carregar pedido:', error);
  }
};

// Métodos
const formatPrice = (price: number) => {
  return price.toFixed(2).replace('.', ',');
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
  };
  return statusMap[status] || status;
};

// Carregar dados quando a página for montada
onMounted(() => {
  loadOrder();
});
</script>
