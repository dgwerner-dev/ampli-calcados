<template>
  <!-- Debug: teste simples de renderização -->
  <div style="position: fixed; top: 10px; left: 10px; background: yellow; color: black; padding: 10px; z-index: 10000;">
    ADMIN PAGE CARREGADA - showProductModal: {{ showProductModal }}
  </div>
  
  <div class="min-h-screen bg-gray-50">
    <!-- Container principal com largura máxima e centralização -->
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="w-48 bg-white shadow-lg rounded-lg mt-6 mb-6">
          <!-- Sidebar Navigation -->
          <nav class="p-4 space-y-2">
            <button
              @click="activeTab = 'products'"
              :class="[
                'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                activeTab === 'products'
                  ? 'bg-coral-soft text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                ></path>
              </svg>
              Produtos
            </button>

            <button
              @click="activeTab = 'categories'"
              :class="[
                'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                activeTab === 'categories'
                  ? 'bg-coral-soft text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                ></path>
              </svg>
              Categorias
            </button>

            <button
              @click="activeTab = 'users'"
              :class="[
                'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                activeTab === 'users'
                  ? 'bg-coral-soft text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                ></path>
              </svg>
              Clientes
            </button>

            <button
              @click="activeTab = 'marketing'"
              :class="[
                'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                activeTab === 'marketing'
                  ? 'bg-coral-soft text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                ></path>
              </svg>
              Marketing
            </button>

            <!-- Marketing Submenu -->
            <div v-if="activeTab === 'marketing'" class="ml-4 space-y-1">
              <button
                @click="activeMarketingSection = 'coupons'"
                :class="[
                  'w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeMarketingSection === 'coupons'
                    ? 'bg-coral-soft text-white'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  ></path>
                </svg>
                Cupons de Desconto
              </button>

              <button
                @click="activeMarketingSection = 'shipping'"
                :class="[
                  'w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeMarketingSection === 'shipping'
                    ? 'bg-coral-soft text-white'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
                Promoções de Frete
              </button>
            </div>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-auto ml-4">
          <div class="p-6 bg-white rounded-lg mt-6 mb-6">
            <!-- Products Tab -->
            <div v-if="activeTab === 'products'" class="space-y-6">
              <!-- Products Header -->
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-900">Produtos</h3>
                <div class="flex items-center space-x-3">
                  <button
                    @click="openCreateProductModal"
                    class="inline-flex items-center rounded-lg border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    Criar produto
                  </button>
                </div>
              </div>

              <!-- Search and Filter Bar -->
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                  <div class="relative">
                    <input
                      v-model="productSearch"
                      type="text"
                      placeholder="Busque por nome ou SKU"
                      class="block w-full pl-4 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-600 focus:border-green-600 sm:text-sm"
                    />
                  </div>
                </div>
                <button
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Buscar
                </button>
                <button
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                    ></path>
                  </svg>
                  Filtros
                </button>
              </div>

              <!-- Pagination Summary -->
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                  Mostrando {{ products.length }} de {{ totalProducts }} no total
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500">1/5</span>
                  <button
                    disabled
                    class="p-2 text-gray-300 cursor-not-allowed"
                    title="Página anterior"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                  </button>
                  <button
                    class="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    title="Próxima página"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Products Loading -->
              <div v-if="productsLoading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>

              <!-- Products Error -->
              <div v-else-if="productsError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-600">{{ productsError }}</p>
              </div>

              <!-- Products Table -->
              <div v-else class="bg-white rounded-lg border border-gray-200">
                <div class="w-full">
                  <table class="w-full table-fixed divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          class="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <input
                            v-model="selectAllProducts"
                            type="checkbox"
                            @change="toggleSelectAllProducts"
                            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                        </th>
                        <th
                          scope="col"
                          class="w-2/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Produto
                        </th>
                        <th
                          scope="col"
                          class="w-20 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div class="flex justify-center" title="Categoria">
                            <svg
                              class="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              ></path>
                            </svg>
                          </div>
                        </th>
                        <th
                          scope="col"
                          class="w-24 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div class="flex justify-center" title="Preço">
                            <svg
                              class="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              ></path>
                            </svg>
                          </div>
                        </th>
                        <th
                          scope="col"
                          class="w-20 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div class="flex justify-center" title="Estoque">
                            <svg
                              class="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              ></path>
                            </svg>
                          </div>
                        </th>
                        <th
                          scope="col"
                          class="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="product in filteredProducts"
                        :key="product.id"
                        class="hover:bg-gray-50 group"
                      >
                        <td class="w-12 px-3 py-4 whitespace-nowrap">
                          <input
                            v-model="selectedProducts"
                            :value="product.id"
                            type="checkbox"
                            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                        </td>
                        <td class="w-2/5 px-3 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <div
                                class="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center"
                              >
                                <svg
                                  class="h-5 w-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                            <div class="ml-3 min-w-0 flex-1">
                              <div class="text-sm font-medium text-gray-900 truncate">
                                {{ product.name }}
                              </div>
                              <div class="text-xs text-gray-500 font-mono truncate">
                                {{ product.code || '-' }}
                              </div>
                              <div class="text-xs text-gray-400">Tipo: Com variação</div>
                            </div>
                          </div>
                        </td>
                        <td
                          class="w-20 px-2 py-4 whitespace-nowrap text-sm text-gray-900 text-center"
                        >
                          {{ getCategoryName(product.categoryId) }}
                        </td>
                        <td
                          class="w-24 px-2 py-4 whitespace-nowrap text-sm text-gray-900 text-center"
                        >
                          <div class="text-sm text-gray-900">
                            <span
                              v-if="product.salePrice"
                              class="line-through text-gray-500 text-xs"
                            >
                              R$ {{ formatPrice(product.price) }}
                            </span>
                            <div class="font-medium">
                              R$ {{ formatPrice(product.salePrice || product.price) }}
                            </div>
                          </div>
                        </td>
                        <td
                          class="w-20 px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                        >
                          {{ product.inStock ? '-' : 'Indisponível' }}
                        </td>
                        <td class="w-16 px-2 py-4 whitespace-nowrap text-center">
                          <div class="group relative">
                            <div class="flex justify-center">
                              <div
                                :class="[
                                  'w-3 h-3 rounded-full',
                                  product.inStock ? 'bg-green-500' : 'bg-red-500',
                                ]"
                              ></div>
                            </div>

                            <!-- Actions on Hover -->
                            <div
                              class="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                            >
                              <div
                                class="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
                              >
                                <button
                                  @click="editProduct(product)"
                                  class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                  title="Editar produto"
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    ></path>
                                  </svg>
                                </button>
                                <button
                                  @click="deleteProduct(product)"
                                  class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                  title="Excluir produto"
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
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Table Footer -->
                <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                      Mostrando {{ filteredProducts.length }} de {{ totalProducts }} no total
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm text-gray-500">1/5</span>
                      <button
                        disabled
                        class="p-2 text-gray-300 cursor-not-allowed"
                        title="Página anterior"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                          ></path>
                        </svg>
                      </button>
                      <button
                        class="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Próxima página"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Products Empty State -->
              <div v-if="products.length === 0 && !productsLoading" class="text-center py-12">
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
                <p class="mt-1 text-sm text-gray-500">Comece criando seu primeiro produto.</p>
              </div>
            </div>

            <!-- Categories Tab -->
            <div v-if="activeTab === 'categories'" class="space-y-6">
              <!-- Categories Header -->
              <div class="flex justify-end items-center">
                <button
                  @click="openCreateCategoryModal"
                  class="inline-flex items-center rounded-lg border border-transparent bg-coral-soft px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Nova Categoria
                </button>
              </div>

              <!-- Categories Loading -->
              <div v-if="categoriesLoading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-soft"></div>
              </div>

              <!-- Categories Error -->
              <div
                v-else-if="categoriesError"
                class="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <p class="text-red-600">{{ categoriesError }}</p>
              </div>

              <!-- Categories Grid -->
              <div
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <div
                  v-for="category in categories"
                  :key="category.id"
                  class="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col justify-between"
                >
                  <!-- Category Info -->
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">{{ category.name }}</h4>
                    <p class="text-sm text-gray-500 mb-2">
                      {{ category.description || 'Sem descrição' }}
                    </p>
                    <p class="text-xs text-gray-400 mb-3">Slug: {{ category.slug }}</p>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-2 mt-4">
                    <button
                      @click="editCategory(category)"
                      class="text-coral-soft hover:text-coral-dark transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      @click="deleteCategory(category)"
                      class="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

              <!-- Categories Empty State -->
              <div v-if="categories.length === 0 && !categoriesLoading" class="text-center py-12">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma categoria encontrada</h3>
                <p class="mt-1 text-sm text-gray-500">Comece criando sua primeira categoria.</p>
              </div>
            </div>

            <!-- Users Tab -->
            <div v-if="activeTab === 'users'" class="space-y-6">
              <!-- Users Header -->
              <div class="flex justify-end items-center">
                <input
                  v-model="userSearch"
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  class="w-64 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                />
              </div>

              <!-- Users Loading -->
              <div v-if="usersLoading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-soft"></div>
              </div>

              <!-- Users Error -->
              <div v-else-if="usersError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-600">{{ usersError }}</p>
              </div>

              <!-- Users Table -->
              <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
                        @click="setUserSort('name')"
                      >
                        <div class="flex items-center">
                          <span>Nome</span>
                          <svg
                            v-if="userSortKey === 'name'"
                            class="ml-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              v-if="userSortOrder === 'asc'"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 15l7-7 7 7"
                            ></path>
                            <path
                              v-else
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                          <svg
                            v-else
                            class="ml-2 h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                              d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                            />
                          </svg>
                        </div>
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                      >
                        Data de Cadastro
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
                        @click="setUserSort('dateOfBirth')"
                      >
                        <div class="flex items-center">
                          <span>Data de Nascimento</span>
                          <svg
                            v-if="userSortKey === 'dateOfBirth'"
                            class="ml-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              v-if="userSortOrder === 'asc'"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 15l7-7 7 7"
                            ></path>
                            <path
                              v-else
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                          <svg
                            v-else
                            class="ml-2 h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                              d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                            />
                          </svg>
                        </div>
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="user in users" :key="user.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <img
                              v-if="user.avatar"
                              class="h-10 w-10 rounded-full"
                              :src="user.avatar"
                              alt="Avatar do usuário"
                            />
                            <div
                              v-else
                              class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                            >
                              <svg
                                class="h-8 w-8 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                              </svg>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ user.email }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">{{ formatDate(user.createdAt) }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">
                          {{ formatDate(user.dateOfBirth) || 'Não informado' }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          :class="[
                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800',
                          ]"
                        >
                          {{ user.isActive ? 'Ativo' : 'Inativo' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Users Empty State -->
              <div v-if="users.length === 0 && !usersLoading" class="text-center py-12">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-6-6h6a6 6 0 006 6"
                  />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum cliente encontrado</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Ainda não há clientes cadastrados no sistema.
                </p>
              </div>
            </div>
          </div>

          <!-- Marketing Tab -->
          <div v-if="activeTab === 'marketing'" class="space-y-6">
            <!-- Coupons Section -->
            <div v-if="activeMarketingSection === 'coupons'" class="space-y-6">
              <!-- Coupons Header -->
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Listagem de cupons</h3>
                <button
                  @click="openCreateCouponModal"
                  class="inline-flex items-center rounded-lg border border-transparent bg-coral-soft px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
                >
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Novo Cupom
                </button>
              </div>

              <!-- Search and Filters -->
              <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div class="flex flex-col sm:flex-row gap-4">
                  <div class="flex-1">
                    <div class="relative">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <svg
                          class="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        v-model="couponSearch"
                        type="text"
                        placeholder="Buscar por nome ou descrição do cupom"
                        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-coral-soft focus:border-coral-soft sm:text-sm"
                      />
                    </div>
                  </div>
                  <button
                    @click="searchCoupons"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              <!-- Coupons Loading -->
              <div v-if="couponsLoading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-soft"></div>
              </div>

              <!-- Coupons Error -->
              <div v-else-if="couponsError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-600">{{ couponsError }}</p>
              </div>

              <!-- Coupons Table -->
              <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <!-- Table Header -->
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <label class="flex items-center">
                        <input
                          v-model="selectAllCoupons"
                          type="checkbox"
                          @change="toggleSelectAllCoupons"
                          class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                        />
                        <span class="ml-2 text-sm font-medium text-gray-700">Selecionar todos</span>
                      </label>
                    </div>
                    <div class="text-sm text-gray-500">
                      Mostrando {{ filteredCoupons.length }} de {{ coupons.length }} no total
                    </div>
                  </div>
                </div>

                <!-- Table -->
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <input
                            v-model="selectAllCoupons"
                            type="checkbox"
                            @change="toggleSelectAllCoupons"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                          />
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Cupom
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tipo
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Validade
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Utilizados / Disponíveis
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="coupon in filteredCoupons"
                        :key="coupon.id"
                        class="hover:bg-gray-50 transition-colors"
                      >
                        <!-- Checkbox -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <input
                            v-model="selectedCoupons"
                            :value="coupon.id"
                            type="checkbox"
                            class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                          />
                        </td>

                        <!-- Cupom Info -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div class="text-sm font-medium text-gray-900 font-mono">
                              {{ coupon.code }}
                            </div>
                            <div class="text-sm text-gray-500">{{ coupon.name }}</div>
                          </div>
                        </td>

                        <!-- Tipo -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {{ formatDiscountType(coupon.discountType) }}
                          </span>
                        </td>

                        <!-- Validade -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ formatValidity(coupon.validUntil) }}
                        </td>

                        <!-- Utilizados / Disponíveis -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ coupon.usedCount }} / {{ coupon.usageLimit || '∞' }}
                        </td>

                        <!-- Status with Actions -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="group relative">
                            <!-- Status Display -->
                            <div class="flex items-center space-x-2">
                              <div :class="['w-3 h-3 rounded-full', getStatusColor(coupon)]"></div>
                              <span :class="['text-sm font-medium', getStatusTextColor(coupon)]">
                                {{ getStatusText(coupon) }}
                              </span>
                            </div>

                            <!-- Actions on Hover -->
                            <div
                              class="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                            >
                              <div
                                class="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2"
                              >
                                <button
                                  @click="editCoupon(coupon)"
                                  class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                  title="Editar cupom"
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    ></path>
                                  </svg>
                                </button>
                                <button
                                  @click="deleteCoupon(coupon)"
                                  class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                  title="Excluir cupom"
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
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Table Footer -->
                <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                      Mostrando {{ filteredCoupons.length }} de {{ coupons.length }} no total
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm text-gray-500">1/1</span>
                      <button
                        disabled
                        class="p-2 text-gray-300 cursor-not-allowed"
                        title="Página anterior"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                          ></path>
                        </svg>
                      </button>
                      <button
                        disabled
                        class="p-2 text-gray-300 cursor-not-allowed"
                        title="Próxima página"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Coupons Empty State -->
              <div v-if="coupons.length === 0 && !couponsLoading" class="text-center py-12">
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
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  ></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum cupom encontrado</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Comece criando seu primeiro cupom de desconto.
                </p>
              </div>
            </div>

            <!-- Shipping Promotions Section -->
            <div v-if="activeMarketingSection === 'shipping'" class="space-y-8">
              <!-- Header -->
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-900">Promoções de Frete</h3>
                <button
                  @click="openCreateShippingPromotionModal"
                  class="inline-flex items-center rounded-lg border border-transparent bg-coral-soft px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
                >
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Nova Promoção de Frete
                </button>
              </div>

              <!-- 1. Por região -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
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
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="text-lg font-semibold text-gray-900">Por região</h4>
                        <p class="text-sm text-gray-500">
                          Aplicado em todos os produtos, dentro das regiões configuradas
                        </p>
                      </div>
                    </div>
                    <button
                      @click="toggleRegionSection"
                      class="text-coral-soft hover:text-coral-dark transition-colors text-sm font-medium"
                    >
                      {{ showRegionSection ? 'Mostrar menos' : 'Mostrar mais' }}
                    </button>
                  </div>
                </div>

                <div v-if="showRegionSection" class="p-6">
                  <!-- Regions Table -->
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Região
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Valor mínimo do pedido
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Faixa de CEP
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                          v-for="region in regions"
                          :key="region.id"
                          class="hover:bg-gray-50 group"
                        >
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {{ region.name }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {{ formatPrice(region.minOrderValue) }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ region.cepRange || '-' }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="group flex items-center justify-between">
                              <div class="flex items-center space-x-2">
                                <div
                                  :class="[
                                    'w-3 h-3 rounded-full',
                                    region.isActive ? 'bg-green-500' : 'bg-red-500',
                                  ]"
                                ></div>
                                <span
                                  :class="[
                                    'text-sm font-medium',
                                    region.isActive ? 'text-green-600' : 'text-red-600',
                                  ]"
                                >
                                  {{ region.isActive ? 'Ativo' : 'Inativo' }}
                                </span>
                              </div>

                              <!-- Actions on Hover -->
                              <div
                                class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                <div
                                  class="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
                                >
                                  <button
                                    @click="editRegion(region)"
                                    class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Editar região"
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      ></path>
                                    </svg>
                                  </button>
                                  <button
                                    @click="toggleRegionStatus(region)"
                                    :class="[
                                      'p-2 rounded-md transition-colors',
                                      region.isActive
                                        ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                        : 'text-green-600 hover:text-green-800 hover:bg-green-50',
                                    ]"
                                    :title="region.isActive ? 'Desativar região' : 'Ativar região'"
                                  >
                                    <svg
                                      v-if="region.isActive"
                                      class="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                                      ></path>
                                    </svg>
                                    <svg
                                      v-else
                                      class="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 13l4 4L19 7"
                                      ></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Add Region Button -->
                  <div class="mt-6 text-center">
                    <button
                      @click="openCreateRegionModal"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-coral-soft hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-colors"
                    >
                      <svg
                        class="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      Nova região
                    </button>
                  </div>
                </div>
              </div>

              <!-- 2. Por produto -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
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
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="text-lg font-semibold text-gray-900">Por produto</h4>
                        <p class="text-sm text-gray-500">
                          Aplicado em todos os produtos selecionados
                        </p>
                      </div>
                    </div>
                    <button
                      @click="toggleProductSection"
                      class="text-coral-soft hover:text-coral-dark transition-colors text-sm font-medium"
                    >
                      {{ showProductSection ? 'Mostrar menos' : 'Mostrar mais' }}
                    </button>
                  </div>
                </div>

                <div v-if="showProductSection" class="p-6">
                  <!-- Product Search -->
                  <div class="mb-6">
                    <div class="flex flex-col sm:flex-row gap-4">
                      <div class="flex-1">
                        <div class="relative">
                          <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                          >
                            <svg
                              class="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              ></path>
                            </svg>
                          </div>
                          <input
                            v-model="productSearchShipping"
                            type="text"
                            placeholder="Busque por produtos"
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-coral-soft focus:border-coral-soft sm:text-sm"
                          />
                        </div>
                      </div>
                      <button
                        @click="searchProductsShipping"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                      >
                        Buscar
                      </button>
                    </div>
                  </div>

                  <!-- Products Table -->
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            <input
                              v-model="selectAllProductsShipping"
                              type="checkbox"
                              @change="toggleSelectAllProductsShipping"
                              class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                            />
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Nome do produto
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            SKU
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Preço
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Estoque
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                          v-for="product in filteredProductsShipping"
                          :key="product.id"
                          class="hover:bg-gray-50"
                        >
                          <td class="px-6 py-4 whitespace-nowrap">
                            <input
                              v-model="selectedProductsShipping"
                              :value="product.id"
                              type="checkbox"
                              class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                            />
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {{ product.name }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {{ product.code || '-' }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {{ formatPrice(product.price) }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ product.inStock ? 'Sim' : '-' }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="group relative">
                              <div class="flex items-center space-x-2">
                                <div
                                  :class="[
                                    'w-3 h-3 rounded-full',
                                    product.inStock ? 'bg-green-500' : 'bg-red-500',
                                  ]"
                                ></div>
                                <span
                                  :class="[
                                    'text-sm font-medium',
                                    product.inStock ? 'text-green-600' : 'text-red-600',
                                  ]"
                                >
                                  {{ product.inStock ? 'Ativo' : 'Inativo' }}
                                </span>
                              </div>

                              <!-- Actions on Hover -->
                              <div
                                class="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                              >
                                <div
                                  class="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2"
                                >
                                  <button
                                    @click="editProductShipping(product)"
                                    class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Editar produto"
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      ></path>
                                    </svg>
                                  </button>
                                  <button
                                    @click="deleteProductShipping(product)"
                                    class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                    title="Excluir produto"
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
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Pagination and Actions -->
                  <div class="mt-6 flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                      Mostrando {{ filteredProductsShipping.length }} de {{ products.length }} total
                    </div>
                    <div class="flex items-center space-x-4">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500">1/11</span>
                        <button
                          disabled
                          class="p-2 text-gray-300 cursor-not-allowed"
                          title="Página anterior"
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
                              d="M15 19l-7-7 7-7"
                            ></path>
                          </svg>
                        </button>
                        <button
                          disabled
                          class="p-2 text-gray-300 cursor-not-allowed"
                          title="Próxima página"
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
                              d="M9 5l7 7-7 7"
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <div class="flex items-center space-x-3">
                        <button
                          class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          class="px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                        >
                          Salvar alterações
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. Por categoria -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"
                      >
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
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          ></path>
                        </svg>
                      </div>
                      <div class="flex items-center space-x-2">
                        <h4 class="text-lg font-semibold text-gray-900">Por categoria</h4>
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          NOVO
                        </span>
                      </div>
                    </div>
                    <button
                      @click="toggleCategorySection"
                      class="text-coral-soft hover:text-coral-dark transition-colors text-sm font-medium"
                    >
                      {{ showCategorySection ? 'Mostrar menos' : 'Mostrar mais' }}
                    </button>
                  </div>
                  <p class="text-sm text-gray-500 mt-2">
                    Aplica em todos os produtos dentro da categoria
                  </p>
                </div>
              </div>

              <!-- 4. Alerta frete grátis -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div class="flex items-center space-x-3">
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
                          d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900">Alerta frete grátis</h4>
                      <p class="text-sm text-gray-500">
                        Ativa um alerta na loja que informa ao cliente sobre quando falta em compras
                        para obter frete grátis.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="p-6">
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <label class="text-sm font-medium text-gray-700"
                        >Alerta de frete grátis ativo?</label
                      >
                      <div class="flex items-center">
                        <input v-model="freeShippingAlert" type="checkbox" class="sr-only" />
                        <button
                          @click="toggleFreeShippingAlert"
                          :class="[
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-coral-soft focus:ring-offset-2',
                            freeShippingAlert ? 'bg-coral-soft' : 'bg-gray-200',
                          ]"
                        >
                          <span
                            :class="[
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              freeShippingAlert ? 'translate-x-6' : 'translate-x-1',
                            ]"
                          ></span>
                        </button>
                        <span class="ml-3 text-sm text-gray-700">
                          {{ freeShippingAlert ? 'Sim' : 'Não' }}
                        </span>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3 pt-4">
                      <button
                        class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-soft transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        class="px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                      >
                        Salvar alterações
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Modal -->
            <div v-if="showProductModal" style="position: fixed; top: 100px; left: 100px; background: orange; color: white; padding: 20px; z-index: 10000; border: 2px solid black;">
              <h3>MODAL SIMPLES DE TESTE</h3>
              <p>showProductModal: {{ showProductModal }}</p>
              <p>editingProduct: {{ editingProduct }}</p>
              <button @click="closeProductModal" style="background: red; color: white; padding: 5px; margin: 5px;">Fechar</button>
            </div>
            
            <!-- Product Modal Original (comentado temporariamente) -->
            <!--
            <ProductModal
              :is-open="showProductModal"
              :product="editingProduct"
              @close="closeProductModal"
              @saved="handleProductSaved"
            />
            -->

            <!-- Debug: mostrar estado do modal -->
            <div
              v-if="showProductModal"
              style="
                position: fixed;
                top: 50px;
                left: 50px;
                background: blue;
                color: white;
                padding: 10px;
                z-index: 10000;
              "
            >
              DEBUG: showProductModal é true
            </div>

            <!-- Category Modal -->
            <CategoryModal
              :is-open="showCategoryModal"
              :category="editingCategory"
              @close="closeCategoryModal"
              @saved="handleCategorySaved"
            />

            <!-- Coupon Modal -->
            <CouponModal
              :is-open="showCouponModal"
              :coupon="editingCoupon"
              @close="closeCouponModal"
              @saved="handleCouponSaved"
            />

            <!-- Shipping Promotion Modal -->
            <ShippingPromotionModal
              :is-open="showShippingPromotionModal"
              :promotion="editingShippingPromotion"
              @close="closeShippingPromotionModal"
              @saved="handleShippingPromotionSaved"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import ProductModal from '~/components/ProductModal.vue';

// Estados
const activeTab = ref('products');
const productsLoading = ref(false);
const categoriesLoading = ref(false);
const usersLoading = ref(false);
const productsError = ref(null);
const categoriesError = ref(null);
const usersError = ref(null);
const couponsError = ref(null);
const shippingPromotionsError = ref(null);
const products = ref([]);
const categories = ref([]);
const users = ref([]);
const coupons = ref([]);
const shippingPromotions = ref([]);
const showProductModal = ref(false);
const showCategoryModal = ref(false);
const showCouponModal = ref(false);
const showShippingPromotionModal = ref(false);
const editingProduct = ref(null);
const editingCategory = ref(null);
const editingCoupon = ref(null);
const editingShippingPromotion = ref(null);
const activeMarketingSection = ref('coupons');
const couponsLoading = ref(false);
const shippingPromotionsLoading = ref(false);
const productSearch = ref('');
const userSearch = ref('');
const userSortKey = ref('createdAt');
const userSortOrder = ref('desc');

// Novas variáveis para tabela de cupons
const couponSearch = ref('');
const selectedCoupons = ref([]);
const selectAllCoupons = ref(false);

// Novas variáveis para tabela de produtos
const selectedProducts = ref([]);
const selectAllProducts = ref(false);
const totalProducts = ref(189);

// Novas variáveis para promoções de frete
const showRegionSection = ref(false);
const showProductSection = ref(false);
const showCategorySection = ref(false);
const productSearchShipping = ref('');
const selectedProductsShipping = ref([]);
const selectAllProductsShipping = ref(false);
const freeShippingAlert = ref(false);
const regions = ref([
  { id: 1, name: 'São Paulo', minOrderValue: 100, cepRange: '01000-01999', isActive: true },
  { id: 2, name: 'Rio de Janeiro', minOrderValue: 200, cepRange: '20000-20999', isActive: true },
  { id: 3, name: 'Belo Horizonte', minOrderValue: 150, cepRange: '30000-30999', isActive: true },
]);

const supabase = useSupabaseClient();

let productSearchDebounceTimer = null;
let userSearchDebounceTimer = null;

// Métodos
const loadProducts = async () => {
  productsLoading.value = true;
  productsError.value = null;

  try {
    let query = supabase.from('products').select('*').order('createdAt', { ascending: false });

    if (productSearch.value) {
      query = query.ilike('name', `%${productSearch.value}%`);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) throw fetchError;
    products.value = data || [];
  } catch (err) {
    productsError.value = err.message || 'Erro ao carregar produtos';
  } finally {
    productsLoading.value = false;
  }
};

const loadCategories = async () => {
  categoriesLoading.value = true;
  categoriesError.value = null;

  try {
    const { data, error: fetchError } = await supabase.from('categories').select('*').order('name');

    if (fetchError) throw fetchError;
    categories.value = data || [];
  } catch (err) {
    categoriesError.value = err.message || 'Erro ao carregar categorias';
  } finally {
    categoriesLoading.value = false;
  }
};

const loadUsers = async () => {
  usersLoading.value = true;
  usersError.value = null;

  try {
    let query = supabase.from('users').select('*').eq('role', 'USER');

    if (userSearch.value) {
      query = query.or(`name.ilike.%${userSearch.value}%,email.ilike.%${userSearch.value}%`);
    }

    query = query.order(userSortKey.value, {
      ascending: userSortOrder.value === 'asc',
      nullsFirst: false,
    });

    const { data, error: fetchError } = await query;

    if (fetchError) throw fetchError;
    users.value = data || [];
  } catch (err) {
    usersError.value = err.message || 'Erro ao carregar clientes';
  } finally {
    usersLoading.value = false;
  }
};

const formatPrice = price => {
  if (typeof price !== 'number') return '0,00';
  return price.toFixed(2).replace('.', ',');
};

const formatDate = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const setUserSort = key => {
  if (userSortKey.value === key) {
    userSortOrder.value = userSortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    userSortKey.value = key;
    userSortOrder.value = 'asc';
  }
  loadUsers();
};

const openCreateProductModal = () => {
  console.log('=== FUNÇÃO openCreateProductModal CHAMADA ===');
  console.log('Estado ANTES:', showProductModal.value);
  editingProduct.value = null;
  showProductModal.value = true;
  console.log('Estado DEPOIS:', showProductModal.value);
  console.log('editingProduct:', editingProduct.value);
};

const editProduct = product => {
  console.log('Editando produto:', product);
  editingProduct.value = { ...product };
  showProductModal.value = true;
  console.log('Modal aberto:', showProductModal.value);
  console.log('Produto sendo editado:', editingProduct.value);
};

const closeProductModal = () => {
  showProductModal.value = false;
  editingProduct.value = null;
};

const handleProductSaved = () => {
  loadProducts();
  closeProductModal();
};

const deleteProduct = async product => {
  if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
    return;
  }

  try {
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id);

    if (deleteError) throw deleteError;

    await loadProducts();
  } catch (err) {
    productsError.value = err.message || 'Erro ao excluir produto';
  }
};

const openCreateCategoryModal = () => {
  editingCategory.value = null;
  showCategoryModal.value = true;
};

const editCategory = category => {
  editingCategory.value = { ...category };
  showCategoryModal.value = true;
};

const closeCategoryModal = () => {
  showCategoryModal.value = false;
  editingCategory.value = null;
};

const handleCategorySaved = () => {
  loadCategories();
  closeCategoryModal();
};

const deleteCategory = async category => {
  if (!confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
    return;
  }

  try {
    const { error: deleteError } = await supabase.from('categories').delete().eq('id', category.id);

    if (deleteError) throw deleteError;

    await loadCategories();
  } catch (err) {
    categoriesError.value = err.message || 'Erro ao excluir categoria';
  }
};

// Marketing
const loadCoupons = async () => {
  couponsLoading.value = true;
  couponsError.value = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('coupons')
      .select('*')
      .order('createdAt', { ascending: false });

    if (fetchError) throw fetchError;
    coupons.value = data || [];
  } catch (err) {
    couponsError.value = err.message || 'Erro ao carregar cupons';
  } finally {
    couponsLoading.value = false;
  }
};

const loadShippingPromotions = async () => {
  shippingPromotionsLoading.value = true;
  shippingPromotionsError.value = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('shipping_promotions')
      .select('*')
      .order('createdAt', { ascending: false });

    if (fetchError) throw fetchError;
    shippingPromotions.value = data || [];
  } catch (err) {
    shippingPromotionsError.value = err.message || 'Erro ao carregar promoções de frete';
  } finally {
    shippingPromotionsLoading.value = false;
  }
};

const formatDiscount = coupon => {
  if (coupon.discountType === 'PERCENTAGE') {
    return `${coupon.discountValue}%`;
  }
  return `R$ ${formatPrice(coupon.discountValue)}`;
};

const isCouponValid = coupon => {
  if (!coupon.isActive) return false;
  if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) return false;
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return false;
  return true;
};

const isShippingPromotionValid = promotion => {
  if (!promotion.isActive) return false;
  if (promotion.validUntil && new Date(promotion.validUntil) < new Date()) return false;
  return true;
};

const openCreateCouponModal = () => {
  editingCoupon.value = null;
  showCouponModal.value = true;
};

const editCoupon = coupon => {
  editingCoupon.value = { ...coupon };
  showCouponModal.value = true;
};

const closeCouponModal = () => {
  showCouponModal.value = false;
  editingCoupon.value = null;
};

const handleCouponSaved = () => {
  loadCoupons();
  closeCouponModal();
};

const toggleCouponStatus = async coupon => {
  try {
    const { error: updateError } = await supabase
      .from('coupons')
      .update({ isActive: !coupon.isActive })
      .eq('id', coupon.id);

    if (updateError) throw updateError;

    await loadCoupons();
  } catch (err) {
    couponsError.value = err.message || 'Erro ao alterar status do cupom';
  }
};

const deleteCoupon = async coupon => {
  if (!confirm(`Tem certeza que deseja excluir o cupom "${coupon.name}"?`)) {
    return;
  }

  try {
    const { error: deleteError } = await supabase.from('coupons').delete().eq('id', coupon.id);

    if (deleteError) throw deleteError;

    await loadCoupons();
  } catch (err) {
    couponsError.value = err.message || 'Erro ao excluir cupom';
  }
};

// Novas funções para tabela de cupons
const searchCoupons = () => {
  // A busca é feita automaticamente pelo computed filteredCoupons
};

const toggleSelectAllCoupons = () => {
  if (selectAllCoupons.value) {
    selectedCoupons.value = filteredCoupons.value.map(coupon => coupon.id);
  } else {
    selectedCoupons.value = [];
  }
};

// Novas funções para tabela de produtos
const toggleSelectAllProducts = () => {
  if (selectAllProducts.value) {
    selectedProducts.value = filteredProducts.value.map(product => product.id);
  } else {
    selectedProducts.value = [];
  }
};

const getCategoryName = categoryId => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.name : '-';
};

const formatDiscountType = discountType => {
  switch (discountType) {
    case 'PERCENTAGE':
      return 'Percentual';
    case 'FIXED':
      return 'Valor fixo';
    case 'FREE_SHIPPING':
      return 'Frete grátis';
    default:
      return 'Desconhecido';
  }
};

const formatValidity = validUntil => {
  if (!validUntil) return 'Indefinida';
  const date = new Date(validUntil);
  return date.toLocaleDateString('pt-BR');
};

const getStatusColor = coupon => {
  if (!coupon.isActive) return 'bg-red-500';
  if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) return 'bg-yellow-500';
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 'bg-gray-500';
  return 'bg-green-500';
};

const getStatusTextColor = coupon => {
  if (!coupon.isActive) return 'text-red-600';
  if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) return 'text-yellow-600';
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 'text-gray-600';
  return 'text-green-600';
};

const getStatusText = coupon => {
  if (!coupon.isActive) return 'Inativo';
  if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) return 'Expirado';
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 'Esgotado';
  return 'Ativo';
};

// Computed para cupons filtrados
const filteredCoupons = computed(() => {
  if (!couponSearch.value) return coupons.value;

  const search = couponSearch.value.toLowerCase();
  return coupons.value.filter(
    coupon =>
      coupon.name.toLowerCase().includes(search) ||
      coupon.description?.toLowerCase().includes(search) ||
      coupon.code.toLowerCase().includes(search)
  );
});

// Computed para produtos filtrados
const filteredProducts = computed(() => {
  if (!productSearch.value) return products.value;

  const search = productSearch.value.toLowerCase();
  return products.value.filter(
    product =>
      product.name.toLowerCase().includes(search) || product.code?.toLowerCase().includes(search)
  );
});

const openCreateShippingPromotionModal = () => {
  editingShippingPromotion.value = null;
  showShippingPromotionModal.value = true;
};

const editShippingPromotion = promotion => {
  editingShippingPromotion.value = { ...promotion };
  showShippingPromotionModal.value = true;
};

const closeShippingPromotionModal = () => {
  showShippingPromotionModal.value = false;
  editingShippingPromotion.value = null;
};

const handleShippingPromotionSaved = () => {
  loadShippingPromotions();
  closeShippingPromotionModal();
};

const toggleShippingPromotionStatus = async promotion => {
  try {
    const { error: updateError } = await supabase
      .from('shipping_promotions')
      .update({ isActive: !promotion.isActive })
      .eq('id', promotion.id);

    if (updateError) throw updateError;

    await loadShippingPromotions();
  } catch (err) {
    shippingPromotionsError.value = err.message || 'Erro ao alterar status da promoção';
  }
};

const deleteShippingPromotion = async promotion => {
  if (!confirm(`Tem certeza que deseja excluir a promoção "${promotion.name}"?`)) {
    return;
  }

  try {
    const { error: deleteError } = await supabase
      .from('shipping_promotions')
      .delete()
      .eq('id', promotion.id);

    if (deleteError) throw deleteError;

    await loadShippingPromotions();
  } catch (err) {
    shippingPromotionsError.value = err.message || 'Erro ao excluir promoção';
  }
};

// Novas funções para promoções de frete
const toggleRegionSection = () => {
  showRegionSection.value = !showRegionSection.value;
};

const toggleProductSection = () => {
  showProductSection.value = !showProductSection.value;
};

const toggleCategorySection = () => {
  showCategorySection.value = !showCategorySection.value;
};

const searchProductsShipping = () => {
  // Implementar lógica de busca por produtos para promoções de frete
  console.log('Buscando produtos para promoções de frete:', productSearchShipping.value);
};

const toggleSelectAllProductsShipping = () => {
  if (selectAllProductsShipping.value) {
    selectedProductsShipping.value = filteredProductsShipping.value.map(product => product.id);
  } else {
    selectedProductsShipping.value = [];
  }
};

const filteredProductsShipping = computed(() => {
  if (!productSearchShipping.value) return products.value;

  const search = productSearchShipping.value.toLowerCase();
  return products.value.filter(
    product =>
      product.name.toLowerCase().includes(search) || product.code.toLowerCase().includes(search)
  );
});

const editProductShipping = product => {
  // Implementar lógica de edição de produto para promoções de frete
  console.log('Editando produto para promoção de frete:', product);
};

const deleteProductShipping = async product => {
  if (
    !confirm(`Tem certeza que deseja excluir o produto "${product.name}" da promoção de frete?`)
  ) {
    return;
  }

  try {
    const { error: deleteError } = await supabase
      .from('shipping_promotions')
      .update({ products: shippingPromotions.value.map(p => p.id).filter(id => id !== product.id) })
      .eq('id', editingShippingPromotion.value.id);

    if (deleteError) throw deleteError;

    await loadShippingPromotions();
  } catch (err) {
    shippingPromotionsError.value = err.message || 'Erro ao excluir produto da promoção';
  }
};

const toggleFreeShippingAlert = () => {
  freeShippingAlert.value = !freeShippingAlert.value;
};

const editRegion = region => {
  // Implementar modal para editar região
  console.log('Editando região:', region);
  // Aqui você pode abrir um modal para editar os campos da região
  // como nome, valor mínimo do pedido, faixa de CEP, etc.
};

const toggleRegionStatus = region => {
  // Alternar o status ativo/inativo da região
  region.isActive = !region.isActive;
  console.log(`Região ${region.name} ${region.isActive ? 'ativada' : 'desativada'}`);
  // Aqui você pode fazer uma chamada para a API para persistir a mudança
};

const openCreateRegionModal = () => {
  // Implementar modal para criar nova região
  console.log('Abrindo modal para criar nova região');
};

// Carregar dados quando a página for montada
onMounted(() => {
  loadProducts();
  loadCategories();
  loadUsers();
  loadCoupons();
  loadShippingPromotions();
});

// Resetar modais quando a aba mudar (comentado temporariamente para debug)
/*
watch(activeTab, () => {
  showProductModal.value = false;
  showCategoryModal.value = false;
  showCouponModal.value = false;
  showShippingPromotionModal.value = false;
  editingProduct.value = null;
  editingCategory.value = null;
  editingCoupon.value = null;
  editingShippingPromotion.value = null;
});
*/

// Debug: monitorar mudanças no estado do modal de produto
watch(showProductModal, newValue => {
  console.log('showProductModal mudou para:', newValue);
});

watch(productSearch, () => {
  if (productSearchDebounceTimer) {
    clearTimeout(productSearchDebounceTimer);
  }
  productSearchDebounceTimer = setTimeout(() => {
    loadProducts();
  }, 300); // 300ms delay
});

watch(userSearch, () => {
  if (userSearchDebounceTimer) {
    clearTimeout(userSearchDebounceTimer);
  }
  userSearchDebounceTimer = setTimeout(() => {
    loadUsers();
  }, 300); // 300ms delay
});

// Watch para mudanças na seção de marketing
watch(activeMarketingSection, newSection => {
  if (newSection === 'coupons') {
    loadCoupons();
  } else if (newSection === 'shipping') {
    loadShippingPromotions();
  }
});

definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
});

useHead({
  title: 'Admin - AMPLI CALÇADOS',
});
</script>
