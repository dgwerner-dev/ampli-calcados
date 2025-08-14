<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Container principal com largura máxima e centralização -->
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="w-64 bg-white shadow-lg rounded-lg mt-6 mb-6">
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
              @click="activeTab = 'promotions'"
              :class="[
                'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                activeTab === 'promotions'
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
          </nav>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-auto ml-6">
          <div class="p-6 bg-white rounded-lg mt-6 mb-6">
            <!-- Products Tab -->
            <div v-if="activeTab === 'products'" class="space-y-6">
              <!-- Products Header -->
              <div class="flex justify-end items-center">
                <div class="flex items-center space-x-4">
                  <input
                    v-model="productSearch"
                    type="text"
                    placeholder="Filtrar por nome..."
                    class="w-64 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-coral-soft focus:ring-coral-soft sm:text-sm"
                  />
                  <button
                    @click="openCreateProductModal"
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
                    Novo Produto
                  </button>
                </div>
              </div>

              <!-- Products Loading -->
              <div v-if="productsLoading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-soft"></div>
              </div>

              <!-- Products Error -->
              <div v-else-if="productsError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-600">{{ productsError }}</p>
              </div>

              <!-- Products Grid -->
              <div
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <div
                  v-for="product in products"
                  :key="product.id"
                  class="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <!-- Product Image -->
                  <div class="mb-3">
                    <img
                      v-if="product.images && product.images.length > 0"
                      :src="product.images[0]"
                      :alt="product.name"
                      class="w-full h-32 object-cover rounded-lg"
                    />
                    <div
                      v-else
                      class="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center"
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Product Info -->
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1">{{ product.name }}</h4>
                    <p class="text-sm text-gray-500 mb-2 line-clamp-2">{{ product.description }}</p>

                    <!-- Price -->
                    <div class="flex items-center mb-2">
                      <span v-if="product.salePrice" class="line-through text-gray-500 text-sm">
                        R$ {{ formatPrice(product.price) }}
                      </span>
                      <span class="ml-2 font-bold text-coral-soft">
                        R$ {{ formatPrice(product.salePrice || product.price) }}
                      </span>
                    </div>

                    <!-- Status Badges -->
                    <div class="flex items-center space-x-2 mb-3">
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          product.inStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{ product.inStock ? 'Em estoque' : 'Sem estoque' }}
                      </span>
                      <span
                        v-if="product.featured"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        Destaque
                      </span>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center space-x-2">
                      <button
                        @click="editProduct(product)"
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
                        @click="deleteProduct(product)"
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

          <!-- Promotions Tab -->
          <div v-if="activeTab === 'promotions'" class="space-y-6">
            <!-- Promotions Header -->
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-4">
                <button
                  @click="activePromotionTab = 'coupons'"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    activePromotionTab === 'coupons'
                      ? 'bg-coral-soft text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  ]"
                >
                  Cupons de Desconto
                </button>
                <button
                  @click="activePromotionTab = 'shipping'"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    activePromotionTab === 'shipping'
                      ? 'bg-coral-soft text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  ]"
                >
                  Promoções de Frete
                </button>
              </div>

              <div class="flex items-center space-x-4">
                <button
                  v-if="activePromotionTab === 'coupons'"
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
                <button
                  v-if="activePromotionTab === 'shipping'"
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
            </div>

            <!-- Coupons Section -->
            <div v-if="activePromotionTab === 'coupons'" class="space-y-6">
              <!-- Coupons Loading -->
              <div v-if="couponsLoading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-soft"></div>
              </div>

              <!-- Coupons Error -->
              <div v-else-if="couponsError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-600">{{ couponsError }}</p>
              </div>

              <!-- Coupons Grid -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="coupon in coupons"
                  :key="coupon.id"
                  class="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <!-- Coupon Header -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                      <span
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          coupon.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{ coupon.isActive ? 'Ativo' : 'Inativo' }}
                      </span>
                      <span
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          isCouponValid(coupon)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800',
                        ]"
                      >
                        {{ isCouponValid(coupon) ? 'Válido' : 'Expirado' }}
                      </span>
                    </div>
                  </div>

                  <!-- Coupon Info -->
                  <div class="mb-3">
                    <h4 class="font-medium text-gray-900 mb-1">{{ coupon.name }}</h4>
                    <p class="text-sm text-gray-500 mb-2">
                      {{ coupon.description || 'Sem descrição' }}
                    </p>
                    <div class="bg-gray-100 rounded-lg p-2 mb-2">
                      <p class="text-xs text-gray-600 font-mono text-center">{{ coupon.code }}</p>
                    </div>
                  </div>

                  <!-- Discount Info -->
                  <div class="mb-3">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600">Desconto:</span>
                      <span class="font-medium text-coral-soft">
                        {{ formatDiscount(coupon) }}
                      </span>
                    </div>
                    <div
                      v-if="coupon.minOrderValue"
                      class="flex items-center justify-between text-sm"
                    >
                      <span class="text-gray-600">Pedido mínimo:</span>
                      <span class="font-medium">R$ {{ formatPrice(coupon.minOrderValue) }}</span>
                    </div>
                    <div
                      v-if="coupon.maxDiscount"
                      class="flex items-center justify-between text-sm"
                    >
                      <span class="text-gray-600">Desconto máximo:</span>
                      <span class="font-medium">R$ {{ formatPrice(coupon.maxDiscount) }}</span>
                    </div>
                  </div>

                  <!-- Usage Info -->
                  <div class="mb-3 text-sm text-gray-600">
                    <div class="flex items-center justify-between">
                      <span>Usos:</span>
                      <span
                        >{{ coupon.usedCount
                        }}{{ coupon.usageLimit ? ` / ${coupon.usageLimit}` : '' }}</span
                      >
                    </div>
                    <div class="flex items-center justify-between">
                      <span>Válido até:</span>
                      <span>{{ formatDate(coupon.validUntil) }}</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editCoupon(coupon)"
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
                      @click="toggleCouponStatus(coupon)"
                      :class="[
                        'transition-colors',
                        coupon.isActive
                          ? 'text-red-600 hover:text-red-800'
                          : 'text-green-600 hover:text-green-800',
                      ]"
                    >
                      <svg
                        v-if="coupon.isActive"
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
                    <button
                      @click="deleteCoupon(coupon)"
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
            <div v-if="activePromotionTab === 'shipping'" class="space-y-6">
              <!-- Shipping Promotions Loading -->
              <div v-if="shippingPromotionsLoading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-soft"></div>
              </div>

              <!-- Shipping Promotions Error -->
              <div
                v-else-if="shippingPromotionsError"
                class="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <p class="text-red-600">{{ shippingPromotionsError }}</p>
              </div>

              <!-- Shipping Promotions Grid -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="promotion in shippingPromotions"
                  :key="promotion.id"
                  class="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <!-- Promotion Header -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                      <span
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          promotion.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{ promotion.isActive ? 'Ativa' : 'Inativa' }}
                      </span>
                      <span
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          isShippingPromotionValid(promotion)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800',
                        ]"
                      >
                        {{ isShippingPromotionValid(promotion) ? 'Válida' : 'Expirada' }}
                      </span>
                    </div>
                  </div>

                  <!-- Promotion Info -->
                  <div class="mb-3">
                    <h4 class="font-medium text-gray-900 mb-1">{{ promotion.name }}</h4>
                    <p class="text-sm text-gray-500 mb-2">
                      {{ promotion.description || 'Sem descrição' }}
                    </p>
                  </div>

                  <!-- Shipping Info -->
                  <div class="mb-3">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600">Pedido mínimo:</span>
                      <span class="font-medium">R$ {{ formatPrice(promotion.minOrderValue) }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600">Tipo:</span>
                      <span class="font-medium text-coral-soft">
                        {{ promotion.freeShipping ? 'Frete Grátis' : 'Desconto no Frete' }}
                      </span>
                    </div>
                    <div
                      v-if="!promotion.freeShipping"
                      class="flex items-center justify-between text-sm"
                    >
                      <span class="text-gray-600">Desconto:</span>
                      <span class="font-medium text-coral-soft">
                        R$ {{ formatPrice(promotion.discountValue) }}
                      </span>
                    </div>
                  </div>

                  <!-- Validity Info -->
                  <div class="mb-3 text-sm text-gray-600">
                    <div class="flex items-center justify-between">
                      <span>Válida até:</span>
                      <span>{{ formatDate(promotion.validUntil) }}</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editShippingPromotion(promotion)"
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
                      @click="toggleShippingPromotionStatus(promotion)"
                      :class="[
                        'transition-colors',
                        promotion.isActive
                          ? 'text-red-600 hover:text-red-800'
                          : 'text-green-600 hover:text-green-800',
                      ]"
                    >
                      <svg
                        v-if="promotion.isActive"
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
                    <button
                      @click="deleteShippingPromotion(promotion)"
                      class="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.128A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Shipping Promotions Empty State -->
              <div
                v-if="shippingPromotions.length === 0 && !shippingPromotionsLoading"
                class="text-center py-12"
              >
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
                <h3 class="mt-2 text-sm font-medium text-gray-900">
                  Nenhuma promoção de frete encontrada
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Comece criando sua primeira promoção de frete.
                </p>
              </div>
            </div>
          </div>

          <!-- Product Modal -->
          <ProductModal
            :is-open="showProductModal"
            :product="editingProduct"
            @close="closeProductModal"
            @saved="handleProductSaved"
          />

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
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

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
const activePromotionTab = ref('coupons');
const couponsLoading = ref(false);
const shippingPromotionsLoading = ref(false);
const productSearch = ref('');
const userSearch = ref('');
const userSortKey = ref('createdAt');
const userSortOrder = ref('desc');

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
  editingProduct.value = null;
  showProductModal.value = true;
};

const editProduct = product => {
  editingProduct.value = { ...product };
  showProductModal.value = true;
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

// Carregar dados quando a página for montada
onMounted(() => {
  loadProducts();
  loadCategories();
  loadUsers();
  loadCoupons();
  loadShippingPromotions();
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

definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
});

useHead({
  title: 'Admin - AMPLI CALÇADOS',
});
</script>
