<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="bg-gray-100 p-4 rounded-t-lg border-b">
      <h1 class="text-lg font-semibold text-gray-800 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-3 text-coral-dark"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.97 1.278h8.97a1 1 0 00.97-1.278L15.78 3H17a1 1 0 100-2H3zm12.378 5.422a1 1 0 01-1.414 1.414L12 9.879l-1.964 1.963a1 1 0 11-1.414-1.414l2.656-2.657a1 1 0 011.414 0l2.686 2.686z"
          />
          <path
            fill-rule="evenodd"
            d="M3.01 6.222a1 1 0 01.97-1.278h12.04a1 1 0 01.97 1.278l-1.028 4.11a2 2 0 01-1.94 1.544H6.008a2 2 0 01-1.94-1.544L3.01 6.222zM5 13a1 1 0 100 2h10a1 1 0 100-2H5z"
            clip-rule="evenodd"
          />
        </svg>
        MEUS PEDIDOS
      </h1>
    </div>

    <!-- Filtros -->
    <div class="bg-gray-100 p-4 rounded-b-lg flex items-center space-x-4">
      <!-- Filtro por nome ou código do produto -->
      <div class="relative flex-grow">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.97 1.278h8.97a1 1 0 00.97-1.278L15.78 3H17a1 1 0 100-2H3zm12.378 5.422a1 1 0 01-1.414 1.414L12 9.879l-1.964 1.963a1 1 0 11-1.414-1.414l2.656-2.657a1 1 0 011.414 0l2.686 2.686z"
            />
            <path
              fill-rule="evenodd"
              d="M3.01 6.222a1 1 0 01.97-1.278h12.04a1 1 0 01.97 1.278l-1.028 4.11a2 2 0 01-1.94 1.544H6.008a2 2 0 01-1.94-1.544L3.01 6.222zM5 13a1 1 0 100 2h10a1 1 0 100-2H5z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <input
          v-model="productFilter"
          type="text"
          placeholder="Digite o nome ou o código do produto"
          class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
        />
      </div>

      <!-- Filtro por período -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <select
          v-model="periodFilter"
          class="appearance-none w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent bg-white"
        >
          <option value="3">Últimos 3 meses</option>
          <option value="6">Últimos 6 meses</option>
          <option value="12">Último ano</option>
          <option value="24">Últimos 2 anos</option>
          <option value="all">Todos</option>
        </select>
      </div>

      <!-- Filtro por estado da entrega -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM15 3a1 1 0 10-2 0v.732a2 2 0 000 3.464v6.536a2 2 0 000 3.464V17a1 1 0 102 0v-2.804a2 2 0 000-3.464V6.196a2 2 0 000-3.464V3z"
            />
          </svg>
        </div>
        <select
          v-model="statusFilter"
          class="appearance-none w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent bg-white"
        >
          <option value="all">Todos</option>
          <option value="PENDING">Pendente</option>
          <option value="PROCESSING">Processando</option>
          <option value="SHIPPED">Enviado</option>
          <option value="DELIVERED">Entregue</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-soft"></div>
      <span class="ml-2 text-gray-600">Carregando pedidos...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <svg
          class="mx-auto h-12 w-12 text-red-400"
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
        <h3 class="mt-2 text-sm font-medium text-red-800">Erro ao carregar pedidos</h3>
        <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        <div class="mt-6">
          <button
            @click="getUserOrders"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          {{
            productFilter || periodFilter !== 'all' || statusFilter !== 'all'
              ? 'Nenhum pedido encontrado com os filtros aplicados'
              : 'Nenhum pedido encontrado'
          }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            productFilter || periodFilter !== 'all' || statusFilter !== 'all'
              ? 'Tente ajustar os filtros ou limpar a busca.'
              : 'Você ainda não fez nenhum pedido.'
          }}
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-coral-soft hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft"
          >
            Fazer compras
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-6">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
      >
        <!-- Order Header -->
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Pedido #{{ order.id.slice(-8) }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span
                :class="[
                  'px-3 py-1 text-xs font-medium rounded-full',
                  getOrderStatusColor(order.status),
                ]"
              >
                {{ getOrderStatusText(order.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="item in order.orderItems"
              :key="item.id"
              class="flex items-center space-x-4"
            >
              <!-- Product Image -->
              <div class="flex-shrink-0">
                <img
                  :src="item.product.images?.[0] || '/images/placeholder.jpg'"
                  :alt="item.product.name"
                  class="w-16 h-16 object-cover rounded-lg"
                />
              </div>

              <!-- Product Details -->
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 truncate">
                  {{ item.product.name }}
                </h4>
                <p class="text-sm text-gray-500">
                  Quantidade: {{ item.quantity }}
                  <span v-if="item.size" class="ml-2">Tamanho: {{ item.size }}</span>
                  <span v-if="item.color" class="ml-2">Cor: {{ item.color }}</span>
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatPrice(Number(item.price) * item.quantity) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-600">
                <p>
                  Subtotal:
                  {{
                    formatPrice(Number(order.total) - Number(order.shipping) - Number(order.tax))
                  }}
                </p>
                <p v-if="Number(order.shipping) > 0">Frete: {{ formatPrice(order.shipping) }}</p>
                <p v-if="Number(order.tax) > 0">Impostos: {{ formatPrice(order.tax) }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">Total: {{ formatPrice(order.total) }}</p>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex justify-end space-x-3">
              <button
                @click="viewOrderDetails(order)"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                Ver Detalhes
              </button>
              <button
                v-if="order.status === 'DELIVERED'"
                @click="rateOrder(order)"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-coral-soft hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  ></path>
                </svg>
                Avaliar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const {
  orders,
  loading,
  error,
  getUserOrders,
  getOrderStatusText,
  getOrderStatusColor,
  formatDate,
  formatPrice,
} = useOrders();

// Variáveis reativas para os filtros
const productFilter = ref('');
const periodFilter = ref('3');
const statusFilter = ref('all');

// Computed property para filtrar os pedidos
const filteredOrders = computed(() => {
  let filtered = orders.value;

  // Filtro por produto
  if (productFilter.value) {
    const searchTerm = productFilter.value.toLowerCase();
    filtered = filtered.filter(order =>
      order.orderItems.some(
        item =>
          item.product.name.toLowerCase().includes(searchTerm) ||
          item.product.id.toLowerCase().includes(searchTerm)
      )
    );
  }

  // Filtro por período
  if (periodFilter.value !== 'all') {
    const monthsAgo = parseInt(periodFilter.value);
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);

    filtered = filtered.filter(order => new Date(order.createdAt) >= cutoffDate);
  }

  // Filtro por status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(order => order.status === statusFilter.value);
  }

  return filtered;
});

onMounted(() => {
  getUserOrders();
});

const viewOrderDetails = order => {
  // TODO: Implementar modal de detalhes do pedido
  console.log('Ver detalhes do pedido:', order);
};

const rateOrder = order => {
  // TODO: Implementar sistema de avaliação
  console.log('Avaliar pedido:', order);
};
</script>
