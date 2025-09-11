<template>
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Coluna 1 - Resumo do Pedido -->
      <div class="lg:col-span-1">
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8"
        >
          <div class="bg-gradient-to-r from-coral-soft to-coral-dark px-6 py-4">
            <h3 class="text-lg font-bold text-white flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              Resumo do Pedido
            </h3>
          </div>

          <div class="p-6">
            <!-- Loading Skeleton para Itens do Pedido -->
            <div v-if="loadingProfile" class="space-y-4 mb-6">
              <div v-for="i in 2" :key="i" class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
                <div class="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <!-- Itens do pedido -->
            <div v-else class="space-y-4 mb-6">
              <div v-for="item in orderItems" :key="item.id" class="flex items-center space-x-3">
                <div
                  class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <img
                    v-if="item.product.images && item.product.images.length > 0"
                    :src="item.product.images[0]"
                    :alt="item.product.name"
                    class="w-8 h-8 object-cover rounded"
                  />
                  <svg
                    v-else
                    class="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate">
                    {{ item.product.name }}
                  </h4>
                  <p class="text-xs text-gray-500">
                    Tamanho: {{ item.size || 'N/A' }} | Qtd: {{ item.quantity }}
                  </p>
                </div>
                <div class="text-sm font-semibold text-gray-900">
                  R$ {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>

            <!-- Subtotal -->
            <div class="border-t border-gray-200 pt-4">
              <div v-if="loadingProfile" class="space-y-2">
                <div class="flex justify-between items-center">
                  <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div class="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
              <div v-else class="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span
                  >R$
                  {{
                    formatPrice(
                      orderItems.reduce(
                        (acc, i) =>
                          acc +
                          Number((i.price as any)?.toString?.() || i.price || 0) *
                            (i.quantity || 0),
                        0
                      )
                    )
                  }}</span
                >
              </div>

              <!-- Opções de Frete -->
              <div v-if="loadingProfile" class="mb-4">
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div class="space-y-2">
                    <div v-for="i in 2" :key="i" class="border border-gray-200 rounded-lg p-3">
                      <div class="flex justify-between items-center">
                        <div class="space-y-1">
                          <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                          <div class="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                        <div class="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="shippingOptions.length > 0" class="mb-4">
                <div class="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>Opções de Frete</span>
                  <span v-if="loadingShipping" class="ml-2">
                    <svg
                      class="animate-spin h-3 w-3 text-coral-soft"
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
                  </span>
                </div>

                <div class="space-y-2">
                  <div
                    v-for="option in shippingOptions"
                    :key="option.id"
                    class="border-2 rounded-lg p-3 cursor-pointer transition-all duration-200"
                    :class="
                      selectedShippingOption?.id === option.id
                        ? 'border-coral-soft bg-coral-soft/5'
                        : 'border-gray-200 hover:border-gray-300'
                    "
                    @click="selectedShippingOption = option"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div
                          class="w-4 h-4 border-2 rounded-full flex items-center justify-center"
                          :class="
                            selectedShippingOption?.id === option.id
                              ? 'border-coral-soft'
                              : 'border-gray-300'
                          "
                        >
                          <div
                            v-if="selectedShippingOption?.id === option.id"
                            class="w-2 h-2 bg-coral-soft rounded-full"
                          ></div>
                        </div>
                        <div>
                          <div class="flex items-center space-x-2">
                            <span class="text-lg">{{ option.icon }}</span>
                            <span class="font-medium text-gray-900">{{ option.name }}</span>
                            <span
                              v-if="option.appliedPromotion"
                              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              Promoção
                            </span>
                          </div>
                          <p class="text-xs text-gray-500">{{ option.description }}</p>
                          <p
                            v-if="option.appliedPromotion"
                            class="text-xs text-green-600 font-medium"
                          >
                            {{ option.appliedPromotion.name }}
                          </p>
                        </div>
                      </div>
                      <div class="text-right">
                        <div
                          v-if="option.appliedPromotion && option.originalCost !== option.cost"
                          class="text-xs text-gray-400 line-through"
                        >
                          R$ {{ formatPrice(option.originalCost) }}
                        </div>
                        <div class="font-semibold text-gray-900">
                          R$ {{ formatPrice(option.cost) }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ option.estimatedDays }} dia{{
                            option.estimatedDays > 1 ? 's' : ''
                          }}
                          útil{{ option.estimatedDays > 1 ? 'eis' : '' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Alerta de Frete Grátis -->
                <div
                  v-if="freeShippingAlert"
                  class="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
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
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        ></path>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-green-800">
                        {{ freeShippingAlert.message }}
                      </p>
                      <p v-if="freeShippingAlert.promotion" class="text-xs text-green-600 mt-1">
                        Promoção: {{ freeShippingAlert.promotion.name }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total</span>
                <span
                  >R$
                  {{
                    formatPrice(
                      orderItems.reduce(
                        (acc, i) =>
                          acc +
                          Number((i.price as any)?.toString?.() || i.price || 0) *
                            (i.quantity || 0),
                        0
                      ) + (selectedShippingOption?.cost || 0)
                    )
                  }}</span
                >
              </div>
            </div>

            <!-- Informações de segurança -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center text-sm text-gray-600">
                <svg
                  class="w-4 h-4 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Pagamento 100% seguro
              </div>
              <div class="flex items-center text-sm text-gray-600 mt-1">
                <svg
                  class="w-4 h-4 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Dados criptografados
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coluna 2 - Dados Pessoais -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-coral-soft to-coral-dark px-6 py-4">
            <h2 class="text-xl font-bold text-white flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Dados Pessoais
            </h2>
          </div>

          <form @submit.prevent="processPayment" class="p-6 space-y-8">
            <!-- Dados do cliente -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 bg-coral-soft rounded-full flex items-center justify-center mr-3"
                  >
                    <span class="text-white font-semibold text-sm">1</span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
                </div>
                <button
                  @click="loadUserProfile"
                  type="button"
                  class="text-sm text-coral-soft hover:text-coral-dark font-medium flex items-center"
                  title="Carregar dados do perfil"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  Carregar Perfil
                </button>
              </div>
              <!-- Loading Skeleton para Dados Pessoais -->
              <div v-if="loadingProfile" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="i in 4" :key="i" class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div class="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>

              <!-- Dados Pessoais Reais -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Nome Completo *</label
                  >
                  <input
                    v-model="form.customer.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                    placeholder="Digite seu nome completo"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
                  <input
                    v-model="form.customer.cpf"
                    type="text"
                    required
                    @input="formatCpf"
                    placeholder="000.000.000-00"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    v-model="form.customer.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                  <input
                    v-model="form.customer.phone"
                    type="text"
                    required
                    @input="formatPhone"
                    placeholder="(00) 00000-0000"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                  />
                </div>
              </div>
            </div>

            <!-- Endereço de entrega -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 bg-coral-soft rounded-full flex items-center justify-center mr-3"
                  >
                    <span class="text-white font-semibold text-sm">2</span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Endereço de Entrega</h3>
                </div>
                <button
                  @click="showNewAddressModal = true"
                  type="button"
                  class="text-sm text-coral-soft hover:text-coral-dark font-medium flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Novo Endereço
                </button>
              </div>

              <!-- Loading Skeleton para Endereços -->
              <div v-if="loadingProfile" class="mb-6">
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                  <div class="space-y-3">
                    <div v-for="i in 2" :key="i" class="border-2 border-gray-200 rounded-lg p-4">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center mb-2">
                            <div class="w-4 h-4 border-2 border-gray-300 rounded-full mr-3"></div>
                            <div class="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                          </div>
                          <div class="ml-7 space-y-1">
                            <div class="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                            <div class="h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
                            <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Endereços salvos -->
              <div v-else class="mb-6">
                <div v-if="savedAddresses.length > 0">
                  <label class="block text-sm font-medium text-gray-700 mb-3"
                    >Escolha um endereço salvo:</label
                  >
                  <div class="space-y-3">
                    <div
                      v-for="address in savedAddresses"
                      :key="address.id"
                      class="border-2 rounded-lg p-4 cursor-pointer transition-all duration-200"
                      :class="
                        selectedAddressId === address.id
                          ? 'border-coral-soft bg-coral-soft/5'
                          : 'border-gray-200 hover:border-gray-300'
                      "
                      @click="selectAddress(address)"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center mb-2">
                            <div
                              class="w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center"
                              :class="
                                selectedAddressId === address.id
                                  ? 'border-coral-soft'
                                  : 'border-gray-300'
                              "
                            >
                              <div
                                v-if="selectedAddressId === address.id"
                                class="w-2 h-2 bg-coral-soft rounded-full"
                              ></div>
                            </div>
                            <span class="font-medium text-gray-900">{{ address.name }}</span>
                          </div>
                          <p class="text-sm text-gray-600 ml-7">
                            {{ address.street }}, {{ address.number }}
                            <span v-if="address.complement">- {{ address.complement }}</span>
                          </p>
                          <p class="text-sm text-gray-600 ml-7">
                            {{ address.neighborhood }}, {{ address.city }} - {{ address.state }}
                          </p>
                          <p class="text-sm text-gray-600 ml-7">CEP: {{ address.zipCode }}</p>
                        </div>
                        <button
                          @click.stop="deleteAddress(address.id)"
                          type="button"
                          class="text-red-500 hover:text-red-700 ml-2"
                          title="Excluir endereço"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Mensagem quando não há endereços -->
                <div v-else class="text-center py-8">
                  <div
                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <svg
                      class="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum endereço salvo</h3>
                  <p class="text-gray-600 mb-4">
                    Clique em "Novo Endereço" para cadastrar seu primeiro endereço de entrega.
                  </p>
                </div>
              </div>
            </div>

            <!-- Loading Skeleton para Botão de Pagamento -->
            <div v-if="loadingProfile" class="pt-8">
              <div class="w-full h-14 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            <!-- Botão de pagamento -->
            <div v-else class="pt-8">
              <button
                type="submit"
                :disabled="loading || paymentLocked"
                class="w-full bg-gradient-to-r from-coral-soft to-coral-dark hover:from-coral-dark hover:to-coral-soft text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                {{
                  loading
                    ? 'Processando...'
                    : paymentLocked
                      ? 'Aguardando pagamento PIX'
                      : `Comprar Agora`
                }}
              </button>
              <p v-if="paymentLocked" class="mt-2 text-xs text-gray-500">
                Método de pagamento travado até confirmação ou atualização da página.
              </p>
            </div>
          </form>
        </div>
      </div>

      <!-- Coluna 3 - Métodos de Pagamento -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-coral-soft to-coral-dark px-6 py-4">
            <h2 class="text-xl font-bold text-white flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                ></path>
              </svg>
              Método de Pagamento
            </h2>
          </div>

          <div class="p-6">
            <div
              class="grid grid-cols-1 gap-4 mb-6"
              :class="paymentLocked ? 'opacity-60 pointer-events-none' : ''"
            >
              <!-- PIX -->
              <label class="relative cursor-pointer">
                <input
                  v-model="form.paymentMethod"
                  value="pix"
                  type="radio"
                  class="sr-only"
                  :disabled="paymentLocked"
                />
                <div
                  class="border-2 rounded-lg p-4 transition-all duration-200"
                  :class="
                    form.paymentMethod === 'pix'
                      ? 'border-coral-soft bg-coral-soft/5'
                      : 'border-gray-200 hover:border-gray-300'
                  "
                >
                  <div class="flex items-center">
                    <div
                      class="w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center"
                      :class="
                        form.paymentMethod === 'pix' ? 'border-coral-soft' : 'border-gray-300'
                      "
                    >
                      <div
                        v-if="form.paymentMethod === 'pix'"
                        class="w-3 h-3 bg-coral-soft rounded-full"
                      ></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">PIX</div>
                      <div class="text-sm text-gray-500">Pagamento instantâneo</div>
                    </div>
                  </div>
                </div>
              </label>

              <!-- Cartão de Crédito -->
              <label class="relative cursor-pointer">
                <input
                  v-model="form.paymentMethod"
                  value="credit_card"
                  type="radio"
                  class="sr-only"
                  :disabled="paymentLocked"
                />
                <div
                  class="border-2 rounded-lg p-4 transition-all duration-200"
                  :class="
                    form.paymentMethod === 'credit_card'
                      ? 'border-coral-soft bg-coral-soft/5'
                      : 'border-gray-200 hover:border-gray-300'
                  "
                >
                  <div class="flex items-center">
                    <div
                      class="w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center"
                      :class="
                        form.paymentMethod === 'credit_card' ? 'border-coral-soft' : 'border-gray-300'
                      "
                    >
                      <div
                        v-if="form.paymentMethod === 'credit_card'"
                        class="w-3 h-3 bg-coral-soft rounded-full"
                      ></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Cartão de Crédito</div>
                      <div class="text-sm text-gray-500">Parcelamento em até 12x</div>
                    </div>
                  </div>
                </div>
              </label>

              <!-- Cartão de Débito -->
              <label class="relative cursor-pointer">
                <input
                  v-model="form.paymentMethod"
                  value="debit_card"
                  type="radio"
                  class="sr-only"
                  :disabled="paymentLocked"
                />
                <div
                  class="border-2 rounded-lg p-4 transition-all duration-200"
                  :class="
                    form.paymentMethod === 'debit_card'
                      ? 'border-coral-soft bg-coral-soft/5'
                      : 'border-gray-200 hover:border-gray-300'
                  "
                >
                  <div class="flex items-center">
                    <div
                      class="w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center"
                      :class="
                        form.paymentMethod === 'debit_card' ? 'border-coral-soft' : 'border-gray-300'
                      "
                    >
                      <div
                        v-if="form.paymentMethod === 'debit_card'"
                        class="w-3 h-3 bg-coral-soft rounded-full"
                      ></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Cartão de Débito</div>
                      <div class="text-sm text-gray-500">Pagamento à vista</div>
                    </div>
                  </div>
                </div>
              </label>

              <!-- Boleto Bancário -->
              <label class="relative cursor-pointer">
                <input
                  v-model="form.paymentMethod"
                  value="boleto"
                  type="radio"
                  class="sr-only"
                  :disabled="paymentLocked"
                />
                <div
                  class="border-2 rounded-lg p-4 transition-all duration-200"
                  :class="
                    form.paymentMethod === 'boleto'
                      ? 'border-coral-soft bg-coral-soft/5'
                      : 'border-gray-200 hover:border-gray-300'
                  "
                >
                  <div class="flex items-center">
                    <div
                      class="w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center"
                      :class="
                        form.paymentMethod === 'boleto' ? 'border-coral-soft' : 'border-gray-300'
                      "
                    >
                      <div
                        v-if="form.paymentMethod === 'boleto'"
                        class="w-3 h-3 bg-coral-soft rounded-full"
                      ></div>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Boleto Bancário</div>
                      <div class="text-sm text-gray-500">Vencimento em 3 dias úteis</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>

            <!-- Dados do cartão (se selecionado) -->
            <div v-if="form.paymentMethod === 'credit_card' || form.paymentMethod === 'debit_card'" class="animate-fade-in space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Dados do Cartão</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Número do Cartão *</label
                  >
                  <input
                    v-model="form.card.number"
                    type="text"
                    required
                    @input="formatCardNumber"
                    placeholder="0000 0000 0000 0000"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Nome no Cartão *</label
                  >
                  <input
                    v-model="form.card.holderName"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                    placeholder="Nome como está no cartão"
                  />
                </div>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Validade *</label>
                    <input
                      v-model="form.card.expiry"
                      type="text"
                      required
                      @input="formatExpiry"
                      placeholder="MM/AA"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                    <input
                      v-model="form.card.cvv"
                      type="text"
                      required
                      @input="formatCvv"
                      placeholder="000"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                    />
                  </div>
                </div>

                <!-- Campo de Parcelas apenas para crédito -->
                <div v-if="form.paymentMethod === 'credit_card'" class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Parcelas *</label>
                  <select
                    v-model="form.installments"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                  >
                    <option v-for="i in 12" :key="i" :value="i">
                      {{ i }}x de R$
                      {{
                        formatPrice(
                          orderItems.reduce(
                            (acc, it) =>
                              acc +
                              Number((it.price as any)?.toString?.() || it.price || 0) *
                                (it.quantity || 0),
                            0
                          ) / i
                        )
                      }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Novo Endereço -->
    <div v-if="showNewAddressModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Background overlay com blur -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          @click="closeNewAddressModal"
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">Novo Endereço</h3>
                  <p class="text-coral-100 text-sm">Cadastre um novo endereço de entrega</p>
                </div>
              </div>
              <button
                @click="closeNewAddressModal"
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
            <form @submit.prevent="saveNewAddress" class="space-y-6">
              <!-- Informações do endereço -->
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900">Informações do endereço</h4>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Endereço <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="newAddress.name"
                      type="text"
                      placeholder="Ex: Casa, Trabalho, etc."
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      CEP <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="newAddress.zipCode"
                        type="text"
                        required
                        @input="formatNewAddressCep"
                        @blur="searchNewAddressCep"
                        placeholder="00000-000"
                        class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                      />
                      <div
                        v-if="loadingCep"
                        class="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <svg
                          class="animate-spin h-5 w-5 text-coral-soft"
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
                      </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      <svg
                        class="w-3 h-3 inline mr-1"
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
                      Digite o CEP e os dados serão preenchidos automaticamente
                    </p>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Rua <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="newAddress.street"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Número <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="newAddress.number"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                    <input
                      v-model="newAddress.complement"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                      placeholder="Apto, bloco, etc."
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Bairro <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="newAddress.neighborhood"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                      placeholder="Nome do bairro"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Cidade <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="newAddress.city"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
                      placeholder="Nome da cidade"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Estado <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="newAddress.state"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-colors"
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

              <!-- Botões de ação -->
              <div class="flex justify-end space-x-4">
                <button
                  @click="closeNewAddressModal"
                  type="button"
                  class="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="px-8 py-3 bg-gradient-to-r from-coral-soft to-coral-dark text-white rounded-lg hover:from-coral-dark hover:to-coral-soft transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Salvar Endereço
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal PIX -->
    <div
      v-if="showPixModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closePixModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <!-- Header do Modal -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Pagamento PIX</h3>
          <button
            @click="closePixModal"
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
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-6">
            Escaneie o QR Code abaixo ou copie o código PIX para pagar
          </p>

          <!-- QR Code -->
          <div class="mb-6 flex justify-center">
            <img :src="pixQrCode" alt="QR Code PIX" class="w-48 h-48" />
          </div>

          <!-- Código PIX -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"> Código PIX </label>
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

          <div class="text-xs text-gray-500">O pagamento expira em 1 hora</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
  orderItems: {
    type: Array as PropType<any[]>,
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
const loadingProfile = ref(true);
const showPixModal = ref(false);
const pixQrCode = ref('');
const pixCode = ref('');
const paymentLocked = ref(false);
const showNewAddressModal = ref(false);
const savedAddresses = ref<any[]>([]);
const selectedAddressId = ref<string | null>(null);
const loadingCep = ref(false);
const shippingOptions = ref<any[]>([]);
const selectedShippingOption = ref<any>(null);
const loadingShipping = ref(false);
const freeShippingAlert = ref<any>(null);

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
  // Temporariamente permitimos apenas PIX
  paymentMethod: 'pix',
  card: {
    number: '',
    holderName: '',
    expiry: '',
    cvv: '',
  },
  installments: 1,
});

// Novo endereço
const newAddress = ref({
  name: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
});

// Métodos
const formatPrice = (price: any) => {
  const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  return numPrice.toFixed(2).replace('.', ',');
};

// Funções de formatação nativas
const formatCpf = () => {
  let value = form.value.customer.cpf.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  form.value.customer.cpf = value;
};

const formatPhone = () => {
  let value = form.value.customer.phone.replace(/\D/g, '');
  value = value.replace(/(\d{2})(\d)/, '($1) $2');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  form.value.customer.phone = value;
};

const formatCep = () => {
  let value = form.value.address.zipCode.replace(/\D/g, '');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  form.value.address.zipCode = value;
};

const formatCardNumber = () => {
  let value = form.value.card.number.replace(/\D/g, '');
  value = value.replace(/(\d{4})(\d)/g, '$1 $2');
  form.value.card.number = value;
};

const formatExpiry = () => {
  let value = form.value.card.expiry.replace(/\D/g, '');
  value = value.replace(/(\d{2})(\d)/, '$1/$2');
  form.value.card.expiry = value;
};

const formatCvv = () => {
  let value = form.value.card.cvv.replace(/\D/g, '');
  form.value.card.cvv = value;
};

const searchCep = async () => {
  const cep = form.value.address.zipCode.replace(/\D/g, '');
  if (cep.length === 8) {
    loadingCep.value = true;
    try {
      // Usar endpoint local para evitar CORS
      const response = (await $fetch(`/api/cep/${cep}`)) as any;

      if (response && response.logradouro) {
        form.value.address.street = response.logradouro;
        form.value.address.neighborhood = response.bairro;
        form.value.address.city = response.localidade;
        form.value.address.state = response.uf;
        success('Endereço encontrado e preenchido automaticamente!');

        // Calcular frete após preencher o endereço
        await calculateShipping(cep);
      } else {
        notificationError('CEP não encontrado');
      }
    } catch (error: any) {
      console.error('Erro ao buscar CEP:', error);
      notificationError(error.data?.statusMessage || 'Erro ao buscar CEP. Tente novamente.');
    } finally {
      loadingCep.value = false;
    }
  }
};

const processPayment = async () => {
  loading.value = true;

  try {
    // Preparar dados do cartão
    let cardData = null;
    if (form.value.paymentMethod === 'credit_card' || form.value.paymentMethod === 'debit_card') {
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
        shippingOption: selectedShippingOption.value,
      },
    });

    if (response.success) {
      if (form.value.paymentMethod === 'pix') {
        // Mostrar modal PIX
        const orderData = response.order as any;
        const firstQr = Array.isArray(orderData?.qr_codes) ? orderData.qr_codes[0] : null;
        if (firstQr) {
          pixQrCode.value = firstQr.links?.[0]?.href || '';
          pixCode.value = firstQr.text || '';
        }
        showPixModal.value = true;
        paymentLocked.value = true;
      } else if (form.value.paymentMethod === 'boleto') {
        // Mostrar modal Boleto
        const orderData = response.order as any;
        const firstCharge = Array.isArray(orderData?.charges) ? orderData.charges[0] : null;
        if (firstCharge?.links?.[0]?.href) {
          // Abrir boleto em nova aba
          window.open(firstCharge.links[0].href, '_blank');
          success('Boleto gerado! Abra o PDF para pagamento.');
        }
        emit('payment-success', response.order);
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

const closePixModal = async () => {
  showPixModal.value = false;
  // Redireciona para a lista de pedidos
  await navigateTo('/orders');
};

// Funções para gerenciar endereços
const loadSavedAddresses = async () => {
  try {
    const response = await $fetch('/api/addresses');
    savedAddresses.value = response.addresses;
    // Seleciona endereço padrão (ou o primeiro) automaticamente
    if (Array.isArray(savedAddresses.value) && savedAddresses.value.length > 0) {
      let toSelect = savedAddresses.value.find((a: any) => a.isDefault) || savedAddresses.value[0];
      selectedAddressId.value = toSelect.id;
      form.value.address = {
        zipCode: toSelect.zipCode,
        street: toSelect.street,
        number: toSelect.number,
        complement: toSelect.complement || '',
        neighborhood: toSelect.neighborhood,
        city: toSelect.city,
        state: toSelect.state,
      };
      const cepDigits = (toSelect.zipCode || '').replace(/\D/g, '');
      if (cepDigits.length === 8) {
        await calculateShipping(cepDigits);
      }
    }
  } catch (error: any) {
    console.error('Erro ao carregar endereços:', error);
    // Se o erro for de autenticação, não mostrar erro para o usuário
    // pois pode ser que o usuário ainda não esteja logado
    if (error.statusCode !== 401) {
      notificationError('Erro ao carregar endereços salvos');
    }
  }
};

const selectAddress = async (address: any) => {
  selectedAddressId.value = address.id;
  // Preenche o formulário com os dados do endereço selecionado
  form.value.address = {
    zipCode: address.zipCode,
    street: address.street,
    number: address.number,
    complement: address.complement || '',
    neighborhood: address.neighborhood,
    city: address.city,
    state: address.state,
  };

  // Calcular frete para o endereço selecionado
  await calculateShipping(address.zipCode.replace(/\D/g, ''));
};

const deleteAddress = async (addressId: string) => {
  if (confirm('Tem certeza que deseja excluir este endereço?')) {
    try {
      await $fetch(`/api/addresses/${addressId}`, { method: 'DELETE' });

      savedAddresses.value = savedAddresses.value.filter(addr => addr.id !== addressId);
      if (selectedAddressId.value === addressId) {
        selectedAddressId.value = null;
        // Limpa o formulário
        form.value.address = {
          zipCode: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
        };
      }
      success('Endereço excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir endereço:', error);
      notificationError('Erro ao excluir endereço');
    }
  }
};

const formatNewAddressCep = () => {
  let value = newAddress.value.zipCode.replace(/\D/g, '');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  newAddress.value.zipCode = value;
};

const searchNewAddressCep = async () => {
  const cep = newAddress.value.zipCode.replace(/\D/g, '');
  if (cep.length === 8) {
    loadingCep.value = true;
    try {
      // Usar endpoint local para evitar CORS
      const response = (await $fetch(`/api/cep/${cep}`)) as any;

      if (response && response.logradouro) {
        newAddress.value.street = response.logradouro;
        newAddress.value.neighborhood = response.bairro;
        newAddress.value.city = response.localidade;
        newAddress.value.state = response.uf;
        success('Endereço encontrado e preenchido automaticamente!');

        // Calcular frete após preencher o endereço
        await calculateShipping(cep);
      } else {
        notificationError('CEP não encontrado');
      }
    } catch (error: any) {
      console.error('Erro ao buscar CEP:', error);
      notificationError(error.data?.statusMessage || 'Erro ao buscar CEP. Tente novamente.');
    } finally {
      loadingCep.value = false;
    }
  }
};

const calculateShipping = async (cep: string) => {
  if (!cep || cep.length !== 8) return;

  loadingShipping.value = true;
  try {
    // Calcular peso total dos itens
    const totalWeight = props.orderItems.reduce((acc, item) => {
      return acc + (item.product.weight || 0.5) * item.quantity;
    }, 0);

    // Calcular valor total do pedido
    const orderTotal = props.orderItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    const response = await $fetch('/api/shipping/calculate', {
      method: 'POST',
      body: {
        destinationCep: cep,
        weight: totalWeight,
        orderTotal: orderTotal,
      },
    });

    if (response.success) {
      shippingOptions.value = response.shipping.options;
      // Selecionar PAC como padrão
      selectedShippingOption.value =
        shippingOptions.value.find(option => option.id === 'pac') || shippingOptions.value[0];

      // Atualizar alerta de frete grátis
      if (response.shipping.freeShippingAlert) {
        freeShippingAlert.value = response.shipping.freeShippingAlert;
      } else {
        freeShippingAlert.value = null;
      }
    }
  } catch (error: any) {
    console.error('Erro ao calcular frete:', error);
    // Em caso de erro, usar opções padrão
    shippingOptions.value = [
      {
        id: 'pac',
        name: 'PAC',
        description: 'Entrega econômica',
        cost: 15.0,
        estimatedDays: 3,
        icon: '📦',
      },
    ];
    selectedShippingOption.value = shippingOptions.value[0];
    freeShippingAlert.value = null;
  } finally {
    loadingShipping.value = false;
  }
};

const closeNewAddressModal = () => {
  showNewAddressModal.value = false;
  // Limpa o formulário
  newAddress.value = {
    name: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  };
};

const saveNewAddress = async () => {
  // Validação básica
  if (
    !newAddress.value.name ||
    !newAddress.value.zipCode ||
    !newAddress.value.street ||
    !newAddress.value.number ||
    !newAddress.value.neighborhood ||
    !newAddress.value.city ||
    !newAddress.value.state
  ) {
    notificationError('Preencha todos os campos obrigatórios');
    return;
  }

  try {
    const response = await $fetch('/api/addresses', {
      method: 'POST',
      body: newAddress.value,
    });

    const savedAddress = response.address;
    savedAddresses.value.push(savedAddress);
    selectedAddressId.value = savedAddress.id;

    // Preenche o formulário com o novo endereço
    form.value.address = {
      zipCode: savedAddress.zipCode,
      street: savedAddress.street,
      number: savedAddress.number,
      complement: savedAddress.complement || '',
      neighborhood: savedAddress.neighborhood,
      city: savedAddress.city,
      state: savedAddress.state,
    };

    // Limpa o formulário de novo endereço
    newAddress.value = {
      name: '',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    };

    showNewAddressModal.value = false;
    success('Endereço salvo com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar endereço:', error);
    notificationError('Erro ao salvar endereço');
  }
};

// Carrega os dados do perfil do usuário
const loadUserProfile = async () => {
  loadingProfile.value = true;
  try {
    const profileData = await $fetch('/api/user/profile');

    // Preencher dados pessoais do formulário
    if (profileData.name) {
      form.value.customer.name = profileData.name;
    }
    if (profileData.email) {
      form.value.customer.email = profileData.email;
    }
    if (profileData.cpf) {
      form.value.customer.cpf = profileData.cpf;
    }
    if (profileData.phone) {
      // Aplicar formatação do telefone após carregar
      form.value.customer.phone = profileData.phone;
      // Aguardar o próximo tick para garantir que o valor foi atualizado
      await nextTick();
      formatPhone();
    }

    // Se não há endereço padrão salvo, mas há um no perfil, usar ele
    if (!selectedAddressId.value && profileData.address) {
      form.value.address = {
        zipCode: profileData.address.cep,
        street: profileData.address.street,
        number: profileData.address.number,
        complement: profileData.address.complement || '',
        neighborhood: profileData.address.neighborhood,
        city: profileData.address.city,
        state: profileData.address.state,
      };

      // Calcular frete para o endereço do perfil
      await calculateShipping(profileData.address.cep.replace(/\D/g, ''));
    }

    success('✅ Dados do perfil carregados com sucesso!');
  } catch (error: any) {
    console.error('Erro ao carregar dados do perfil:', error);
    // Se o erro for de autenticação, não mostrar erro para o usuário
    // pois pode ser que o usuário ainda não esteja logado
    if (error.statusCode !== 401) {
      notificationError('Erro ao carregar dados do perfil. Tente novamente.');
    }
  } finally {
    loadingProfile.value = false;
  }
};

// Carrega os endereços salvos e dados do perfil quando o componente é montado
onMounted(async () => {
  loadingProfile.value = true;
  try {
    await loadSavedAddresses();
    await loadUserProfile();
  } finally {
    loadingProfile.value = false;
  }
});

// Watcher para calcular frete quando o CEP é alterado
watch(
  () => form.value.address.zipCode,
  async newCep => {
    if (newCep && newCep.replace(/\D/g, '').length === 8) {
      await calculateShipping(newCep.replace(/\D/g, ''));
    }
  }
);
</script>
