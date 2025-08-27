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
    <div class="bg-gray-100 p-4 rounded-b-lg">
      <!-- Controles de expansão -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <button
            @click="expandAllOrders"
            class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
            Expandir Todos
          </button>
          <button
            @click="collapseAllOrders"
            class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              ></path>
            </svg>
            Colapsar Todos
          </button>
        </div>
        <div class="text-sm text-gray-600">
          {{ expandedOrders.length }} de {{ filteredOrders.length }} pedidos expandidos
        </div>
      </div>

      <!-- Filtros existentes -->
      <div class="flex items-center space-x-4">
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
            <option value="CONFIRMED">Confirmado</option>
            <option value="SHIPPED">Enviado</option>
            <option value="DELIVERED">Entregue</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
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
            <div class="flex items-center space-x-3">
              <button
                @click="toggleOrderExpansion(order.id)"
                class="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  class="w-5 h-5 transform transition-transform"
                  :class="{ 'rotate-90': expandedOrders.includes(order.id) }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Pedido #{{ order.id.slice(-8) }}
                </h3>
                <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
              </div>
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

        <!-- Order Items (Collapsible) -->
        <div v-show="expandedOrders.includes(order.id)" class="animate-fade-in">
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
                  <p class="text-lg font-bold text-gray-900">
                    Total: {{ formatPrice(order.total) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex justify-end space-x-3">
                <button
                  v-if="order.status === 'PENDING'"
                  @click="finalizeOrder(order)"
                  :disabled="finalizingOrder === order.id"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="finalizingOrder === order.id"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  <svg
                    v-else
                    class="w-4 h-4 mr-2"
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
                  {{ finalizingOrder === order.id ? 'Redirecionando...' : 'Finalizar Pedido' }}
                </button>
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

    <!-- Modal de Detalhes do Pedido -->
    <div
      v-if="showOrderDetailsModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showOrderDetailsModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <!-- Header do Modal -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">
            Detalhes do Pedido #{{ selectedOrder?.id?.slice(-8) }}
          </h3>
          <button
            @click="showOrderDetailsModal = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
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

        <!-- Conteúdo do Modal -->
        <div v-if="selectedOrder" class="space-y-6">
          <!-- Informações do Pedido -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">Informações do Pedido</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Data do Pedido:</p>
                <p class="font-medium">{{ formatDate(selectedOrder.createdAt) }}</p>
              </div>
              <div>
                <p class="text-gray-600">Status:</p>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getOrderStatusColor(selectedOrder.status),
                  ]"
                >
                  {{ getOrderStatusText(selectedOrder.status) }}
                </span>
              </div>
              <div>
                <p class="text-gray-600">Total:</p>
                <p class="font-medium text-lg">{{ formatPrice(selectedOrder.total) }}</p>
              </div>
              <div v-if="selectedOrder.shipping > 0">
                <p class="text-gray-600">Frete:</p>
                <p class="font-medium">{{ formatPrice(selectedOrder.shipping) }}</p>
              </div>
            </div>
          </div>

          <!-- Itens do Pedido -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Itens do Pedido</h4>
            <div class="space-y-4">
              <div
                v-for="item in selectedOrder.orderItems"
                :key="item.id"
                class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <!-- Imagem do Produto -->
                <div class="flex-shrink-0">
                  <img
                    :src="item.product.images?.[0] || '/images/placeholder.jpg'"
                    :alt="item.product.name"
                    class="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                <!-- Detalhes do Produto -->
                <div class="flex-1 min-w-0">
                  <h5 class="text-sm font-medium text-gray-900 truncate">
                    {{ item.product.name }}
                  </h5>
                  <div class="mt-1 text-sm text-gray-500 space-y-1">
                    <p>Quantidade: {{ item.quantity }}</p>
                    <p v-if="item.size">Tamanho: {{ item.size }}</p>
                    <p v-if="item.color">Cor: {{ item.color }}</p>
                    <p>Preço unitário: {{ formatPrice(item.price) }}</p>
                  </div>
                </div>

                <!-- Preço Total do Item -->
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">
                    {{ formatPrice(Number(item.price) * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumo Financeiro -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">Resumo Financeiro</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal:</span>
                <span>{{
                  formatPrice(
                    Number(selectedOrder.total) -
                      Number(selectedOrder.shipping) -
                      Number(selectedOrder.tax)
                  )
                }}</span>
              </div>
              <div v-if="Number(selectedOrder.shipping) > 0" class="flex justify-between">
                <span class="text-gray-600">Frete:</span>
                <span>{{ formatPrice(selectedOrder.shipping) }}</span>
              </div>
              <div v-if="Number(selectedOrder.tax) > 0" class="flex justify-between">
                <span class="text-gray-600">Impostos:</span>
                <span>{{ formatPrice(selectedOrder.tax) }}</span>
              </div>
              <div class="flex justify-between border-t border-gray-300 pt-2">
                <span class="font-semibold text-gray-900">Total:</span>
                <span class="font-bold text-lg text-gray-900">{{
                  formatPrice(selectedOrder.total)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              @click="showOrderDetailsModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft"
            >
              Fechar
            </button>
            <button
              v-if="selectedOrder.status === 'DELIVERED'"
              @click="rateOrder(selectedOrder)"
              class="px-4 py-2 text-sm font-medium text-white bg-coral-soft border border-transparent rounded-md hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft"
            >
              Avaliar Pedido
            </button>
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

// Estado para controlar o modal de detalhes
const showOrderDetailsModal = ref(false);
const selectedOrder = ref(null);

// Estado para controlar expansão dos pedidos
const expandedOrders = ref([]);
const finalizingOrder = ref(null);

const viewOrderDetails = order => {
  selectedOrder.value = order;
  showOrderDetailsModal.value = true;
};

// Função para alternar expansão do pedido
const toggleOrderExpansion = orderId => {
  const index = expandedOrders.value.indexOf(orderId);
  if (index > -1) {
    expandedOrders.value.splice(index, 1);
  } else {
    expandedOrders.value.push(orderId);
  }
};

// Função para finalizar pedido pendente
const finalizeOrder = async order => {
  if (
    !confirm(
      'Tem certeza que deseja finalizar este pedido? Você será redirecionado para a tela de checkout.'
    )
  ) {
    return;
  }

  finalizingOrder.value = order.id;

  try {
    // Redirecionar para a tela de checkout
    await navigateTo(`/checkout?orderId=${order.id}`);
  } catch (error) {
    console.error('Erro ao redirecionar para checkout:', error);
    const { error: notificationError } = useNotifications();
    notificationError('Erro ao redirecionar para checkout. Tente novamente.');
  } finally {
    finalizingOrder.value = null;
  }
};

// Função para expandir todos os pedidos
const expandAllOrders = () => {
  expandedOrders.value = filteredOrders.value.map(order => order.id);
};

// Função para colapsar todos os pedidos
const collapseAllOrders = () => {
  expandedOrders.value = [];
};

const rateOrder = order => {
  // TODO: Implementar sistema de avaliação
  console.log('Avaliar pedido:', order);
};
</script>
