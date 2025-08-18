<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Background overlay com blur -->
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        @click="closeModal"
      ></div>

      <!-- Modal panel modernizado -->
      <div
        class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border border-gray-100"
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
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">
                  {{ coupon ? 'Editar Cupom' : 'Novo Cupom' }}
                </h3>
                <p class="text-coral-100 text-sm">
                  Configure todas as opções do seu cupom de desconto
                </p>
              </div>
            </div>
            <button
              @click="closeModal"
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
          <form @submit.prevent="saveCoupon" class="space-y-8">
            <!-- 1. Informações do cupom -->
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Informações do cupom</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Situação do cupom -->
                <div class="space-y-3">
                  <label class="block text-sm font-medium text-gray-700">
                    Situação do cupom <span class="text-red-500">*</span>
                  </label>
                  <div class="flex space-x-4">
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
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                    Nome do cupom <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                    placeholder="Ex: DESCONTO_VERAO"
                  />
                  <p class="mt-2 text-xs text-gray-500">
                    O nome do cupom será usado apenas para identificação no painel.
                  </p>
                </div>

                <!-- Código do cupom -->
                <div class="md:col-span-2">
                  <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
                    Código do cupom <span class="text-red-500">*</span>
                  </label>
                  <div class="flex space-x-3">
                    <input
                      id="code"
                      v-model="form.code"
                      type="text"
                      required
                      class="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 font-mono text-lg"
                      placeholder="Ex: AMPLI2024"
                    />
                    <button
                      type="button"
                      @click="generateCode"
                      class="px-6 py-3 bg-gradient-to-r from-coral-soft to-coral-dark text-white font-medium rounded-lg hover:from-coral-dark hover:to-coral-soft transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg
                        class="w-5 h-5 mr-2 inline"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        ></path>
                      </svg>
                      Gerar código
                    </button>
                  </div>
                  <p class="mt-2 text-xs text-gray-500">
                    O código do cupom é o que você dará para o seu cliente preencher no carrinho de
                    compras.
                  </p>
                </div>
              </div>
            </div>

            <!-- 2. Tipo de cupom -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
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
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Tipo de cupom</h4>
              </div>

              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Percentual -->
                  <label
                    class="relative flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-coral-soft hover:bg-coral-50 transition-all duration-200 group"
                  >
                    <input
                      v-model="form.discountType"
                      value="PERCENTAGE"
                      type="radio"
                      name="discountType"
                      class="h-5 w-5 text-coral-soft focus:ring-coral-soft border-gray-300"
                    />
                    <div class="ml-3 flex-1">
                      <span class="text-sm font-medium text-gray-900 group-hover:text-coral-700"
                        >Percentual</span
                      >
                      <p class="text-xs text-gray-500 mt-1">Desconto em %</p>
                    </div>
                    <div
                      class="absolute top-2 right-2 w-3 h-3 bg-gray-200 rounded-full group-hover:bg-coral-200 transition-colors"
                    ></div>
                  </label>

                  <!-- Valor fixo -->
                  <label
                    class="relative flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-coral-soft hover:bg-coral-50 transition-all duration-200 group"
                  >
                    <input
                      v-model="form.discountType"
                      value="FIXED"
                      type="radio"
                      name="discountType"
                      class="h-5 w-5 text-coral-soft focus:ring-coral-soft border-gray-300"
                    />
                    <div class="ml-3 flex-1">
                      <span class="text-sm font-medium text-gray-900 group-hover:text-coral-700"
                        >Valor fixo</span
                      >
                      <p class="text-xs text-gray-500 mt-1">Desconto em R$</p>
                    </div>
                    <div
                      class="absolute top-2 right-2 w-3 h-3 bg-gray-200 rounded-full group-hover:bg-coral-200 transition-colors"
                    ></div>
                  </label>

                  <!-- Frete grátis -->
                  <label
                    class="relative flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-coral-soft hover:bg-coral-50 transition-all duration-200 group"
                  >
                    <input
                      v-model="form.discountType"
                      value="FREE_SHIPPING"
                      type="radio"
                      name="discountType"
                      class="h-5 w-5 text-coral-soft focus:ring-coral-soft border-gray-300"
                    />
                    <div class="ml-3 flex-1">
                      <span class="text-sm font-medium text-gray-900 group-hover:text-coral-700"
                        >Frete grátis</span
                      >
                      <p class="text-xs text-gray-500 mt-1">Sem custo de envio</p>
                    </div>
                    <div
                      class="absolute top-2 right-2 w-3 h-3 bg-gray-200 rounded-full group-hover:bg-coral-200 transition-colors"
                    ></div>
                  </label>
                </div>

                <!-- Valor de desconto (quando não for frete grátis) -->
                <div v-if="form.discountType !== 'FREE_SHIPPING'" class="max-w-xs">
                  <label for="discountValue" class="block text-sm font-medium text-gray-700 mb-2">
                    Valor de desconto
                  </label>
                  <div class="relative">
                    <div
                      v-if="form.discountType === 'FIXED'"
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <span class="text-gray-500 sm:text-sm font-medium">R$</span>
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
                        'w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200',
                        form.discountType === 'FIXED' ? 'pl-12' : 'pr-12',
                      ]"
                      placeholder="0.00"
                    />
                    <div
                      v-if="form.discountType === 'PERCENTAGE'"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                    >
                      <span class="text-gray-500 sm:text-sm font-medium">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Quantidade -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Quantidade</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Quantidade total de cupons -->
                <div>
                  <label for="usageLimit" class="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade total de cupons
                  </label>
                  <input
                    id="usageLimit"
                    v-model="form.usageLimit"
                    type="number"
                    min="1"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                    placeholder="Ex: 100"
                  />
                </div>

                <!-- Quantidade de uso por cliente -->
                <div>
                  <label
                    for="usagePerCustomer"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Quantidade de uso por cliente
                  </label>
                  <input
                    id="usagePerCustomer"
                    v-model="form.usagePerCustomer"
                    type="number"
                    min="1"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                    placeholder="Ex: 1"
                  />
                </div>
              </div>
            </div>

            <!-- 4. Condições de limitação -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Condições de limitação</h4>
              </div>

              <div class="space-y-6">
                <!-- Por produto -->
                <div class="space-y-3">
                  <label class="block text-sm font-medium text-gray-700">Por produto</label>
                  <div class="space-y-3">
                    <label
                      class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <input
                        v-model="form.productRestriction"
                        value="ALL_PRODUCTS"
                        type="radio"
                        name="productRestriction"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <span class="ml-3 text-sm text-gray-700"
                        >Aplicar cupom para todos os produtos</span
                      >
                    </label>
                    <label
                      class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <input
                        v-model="form.productRestriction"
                        value="SPECIFIC_PRODUCTS"
                        type="radio"
                        name="productRestriction"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <span class="ml-3 text-sm text-gray-700"
                        >Aplicar cupom em um ou mais produtos específicos</span
                      >
                    </label>
                    <label
                      class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <input
                        v-model="form.productRestriction"
                        value="SPECIFIC_CATEGORIES"
                        type="radio"
                        name="productRestriction"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <span class="ml-3 text-sm text-gray-700"
                        >Aplicar cupom em uma ou mais categorias específicas</span
                      >
                    </label>
                  </div>
                </div>

                <!-- Por cliente -->
                <div class="space-y-3">
                  <label class="block text-sm font-medium text-gray-700">Por cliente</label>
                  <div class="space-y-3">
                    <label
                      class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <input
                        v-model="form.customerRestriction"
                        value="ALL_CUSTOMERS"
                        type="radio"
                        name="customerRestriction"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <span class="ml-3 text-sm text-gray-700"
                        >Aplicar cupom para todos os clientes</span
                      >
                    </label>
                    <label
                      class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <input
                        v-model="form.customerRestriction"
                        value="SPECIFIC_CUSTOMER"
                        type="radio"
                        name="customerRestriction"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <span class="ml-3 text-sm text-gray-700"
                        >Aplicar cupom para um cliente específico</span
                      >
                    </label>
                    <label
                      class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <input
                        v-model="form.customerRestriction"
                        value="CUSTOMER_GROUP"
                        type="radio"
                        name="customerRestriction"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <span class="ml-3 text-sm text-gray-700"
                        >Aplicar cupom para um grupo de cliente específico</span
                      >
                    </label>
                  </div>
                </div>

                <!-- Por valor -->
                <div class="space-y-3">
                  <label class="block text-sm font-medium text-gray-700">Por valor</label>
                  <div class="space-y-3">
                    <label
                      class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <input
                        v-model="form.minOrderValue"
                        type="checkbox"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                      />
                      <span class="ml-3 text-sm text-gray-700"
                        >Limitar cupom por valor mínimo do carrinho</span
                      >
                    </label>
                    <label
                      class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <input
                        v-model="form.isAccumulative"
                        type="checkbox"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                      />
                      <span class="ml-3 text-sm text-gray-700">Cupom acumulativo</span>
                    </label>
                    <label
                      class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <input
                        v-model="form.applyToTotal"
                        type="checkbox"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                      />
                      <span class="ml-3 text-sm text-gray-700">Aplicar no total</span>
                    </label>
                  </div>

                  <!-- Valor mínimo do carrinho (quando checkbox estiver marcado) -->
                  <div v-if="form.minOrderValue" class="mt-4 max-w-xs">
                    <label
                      for="minOrderValueAmount"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Valor mínimo do carrinho (R$)
                    </label>
                    <input
                      id="minOrderValueAmount"
                      v-model="form.minOrderValueAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 5. Por data -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Por data</h4>
              </div>

              <div class="max-w-xs">
                <label for="validUntil" class="block text-sm font-medium text-gray-700 mb-2">
                  Data final
                </label>
                <DatePicker
                  id="validUntil"
                  v-model="form.validUntil"
                  :include-time="true"
                  placeholder="Selecione a data de expiração"
                  :min-date="new Date()"
                />
              </div>
            </div>

            <!-- 6. Descrição -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Descrição</h4>
              </div>

              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 resize-none"
                placeholder="Descrição opcional do cupom..."
              ></textarea>
            </div>
          </form>
        </div>

        <!-- Footer com botões modernizados -->
        <div class="bg-white px-6 py-4 border-t border-gray-100">
          <div
            class="flex flex-col sm:flex-row-reverse sm:space-x-3 sm:space-x-reverse space-y-3 sm:space-y-0"
          >
            <button
              type="button"
              @click="saveCoupon"
              :disabled="saving"
              class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-coral-soft to-coral-dark text-white font-semibold rounded-lg hover:from-coral-dark hover:to-coral-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
              {{ saving ? 'Salvando...' : 'Salvar Cupom' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              :disabled="saving"
              class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import DatePicker from './DatePicker.vue';

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

// Função para gerar ID único no formato cuid
const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2);
  return `c${timestamp}${randomStr}`;
};

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
      discountValue:
        form.value.discountType !== 'FREE_SHIPPING' ? parseFloat(form.value.discountValue) : null,
      isActive: form.value.isActive,
      usageLimit: form.value.usageLimit ? parseInt(form.value.usageLimit) : null,
      usagePerCustomer: parseInt(form.value.usagePerCustomer),
      validUntil: form.value.validUntil ? new Date(form.value.validUntil).toISOString() : null,
      productRestriction: form.value.productRestriction,
      customerRestriction: form.value.customerRestriction,
      minOrderValue:
        form.value.minOrderValue && form.value.minOrderValueAmount
          ? parseFloat(form.value.minOrderValueAmount)
          : null,
      isAccumulative: form.value.isAccumulative,
      applyToTotal: form.value.applyToTotal,
    };

    if (props.coupon) {
      // Update existing coupon
      const { error } = await supabase.from('coupons').update(couponData).eq('id', props.coupon.id);

      if (error) throw error;
    } else {
      // Create new coupon - incluir id gerado
      const { error } = await supabase.from('coupons').insert([
        {
          id: generateId(), // Gerar ID único compatível com Prisma
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
