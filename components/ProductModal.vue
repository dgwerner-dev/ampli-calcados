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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">
                  {{ isEditing ? 'Editar Produto' : 'Novo Produto' }}
                </h3>
                <p class="text-coral-100 text-sm">Configure todas as informações do seu produto</p>
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
          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-red-500"
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
              <p class="text-sm text-red-600 font-medium">{{ error }}</p>
            </div>
          </div>

          <!-- Success Message -->
          <div
            v-if="successMessage"
            class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-green-500"
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
              <p class="text-sm text-green-600 font-medium">{{ successMessage }}</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- 1. Informações básicas -->
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
                <h4 class="text-lg font-semibold text-gray-900">Informações básicas</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nome do produto -->
                <div>
                  <label for="product-name" class="block text-sm font-medium text-gray-700 mb-2">
                    Nome do produto <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="product-name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                    placeholder="Ex: Sandália Birkenstock Arizona"
                  />
                </div>

                <!-- Slug -->
                <div>
                  <label for="product-slug" class="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="product-slug"
                    v-model="form.slug"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                    placeholder="Ex: sandalia-birkenstock-arizona"
                  />
                  <p class="mt-2 text-xs text-gray-500">
                    URL amigável para SEO (apenas letras, números e hífens)
                  </p>
                </div>

                <!-- Código do produto -->
                <div>
                  <label for="product-code" class="block text-sm font-medium text-gray-700 mb-2">
                    Código do produto (SKU)
                  </label>
                  <input
                    id="product-code"
                    v-model="form.code"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 font-mono"
                    placeholder="Ex: SB-ARI-001"
                  />
                </div>

                <!-- Categoria -->
                <div>
                  <label
                    for="product-category"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Categoria <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="product-category"
                    v-model="form.categoryId"
                    required
                    :disabled="categoriesLoading"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 2. Preços e estoque -->
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Preços e estoque</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Preço normal -->
                <div>
                  <label for="product-price" class="block text-sm font-medium text-gray-700 mb-2">
                    Preço normal <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >R$</span
                    >
                    <input
                      id="product-price"
                      v-model="form.price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <!-- Preço promocional -->
                <div>
                  <label
                    for="product-sale-price"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Preço promocional
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >R$</span
                    >
                    <input
                      id="product-sale-price"
                      v-model="form.salePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                      placeholder="0,00"
                    />
                  </div>
                  <p class="mt-2 text-xs text-gray-500">Deixe vazio se não houver promoção</p>
                </div>

                <!-- Status do estoque -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Status do estoque
                  </label>
                  <div class="flex space-x-4">
                    <label class="flex items-center">
                      <input
                        v-model="form.inStock"
                        :value="true"
                        type="radio"
                        name="stock"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <span class="ml-2 text-sm text-gray-700">Em estoque</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.inStock"
                        :value="false"
                        type="radio"
                        name="stock"
                        class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                      />
                      <span class="ml-2 text-sm text-gray-700">Indisponível</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Descrição -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900">Descrição</h4>
                </div>
                <button
                  type="button"
                  @click="generateDescription"
                  :disabled="isGenerating"
                  class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <svg
                    v-if="isGenerating"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  <svg
                    v-else
                    class="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.5 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z"
                    />
                  </svg>
                  {{ isGenerating ? 'Gerando...' : 'Gerar com IA' }}
                </button>
              </div>

              <div class="space-y-6">
                <!-- Descrição base para IA -->
                <div>
                  <label
                    for="product-raw-description"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Descrição base para IA
                  </label>
                  <textarea
                    id="product-raw-description"
                    v-model="form.raw_description"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 resize-none"
                    placeholder="Insira características, material, diferenciais, etc. para a IA gerar uma descrição otimizada..."
                  ></textarea>
                  <p class="mt-2 text-xs text-gray-500">
                    Forneça informações básicas sobre o produto para a IA gerar uma descrição
                    completa
                  </p>
                </div>

                <!-- Descrição otimizada -->
                <div>
                  <label
                    for="product-description"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Descrição otimizada
                  </label>
                  <textarea
                    id="product-description"
                    v-model="form.description"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 resize-none"
                    placeholder="Descrição otimizada gerada pela IA ou editada manualmente..."
                  ></textarea>
                  <p class="mt-2 text-xs text-gray-500">
                    Use HTML para formatação (negrito, itálico, listas, etc.)
                  </p>
                </div>
              </div>
            </div>

            <!-- 4. Opções -->
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Opções</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <label class="flex items-center">
                    <input
                      v-model="form.isActive"
                      type="checkbox"
                      class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Produto ativo</span>
                  </label>

                  <label class="flex items-center">
                    <input
                      v-model="form.featured"
                      type="checkbox"
                      class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Produto em destaque</span>
                  </label>
                </div>

                <div class="text-xs text-gray-500 space-y-2">
                  <p><strong>Produto ativo:</strong> Aparece nas buscas e listagens</p>
                  <p><strong>Produto em destaque:</strong> Aparece na página inicial</p>
                </div>
              </div>
            </div>

            <!-- 5. Imagens do produto -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-5 h-5 text-pink-600"
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
                  <h4 class="text-lg font-semibold text-gray-900">Imagens do produto</h4>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="px-3 py-1 bg-pink-100 text-pink-800 text-sm font-medium rounded-full">
                    {{ uploadedImages.length }} imagens
                  </div>
                  <label
                    for="image-upload"
                    class="inline-flex items-center px-4 py-2 bg-coral-soft text-white text-sm font-medium rounded-lg hover:bg-coral-dark transition-colors cursor-pointer"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    Adicionar imagem
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    @change="handleFileUpload"
                    class="hidden"
                  />
                </div>
              </div>

              <!-- Grid de imagens -->
              <div
                v-if="uploadedImages.length > 0"
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                <div
                  v-for="(image, index) in uploadedImages"
                  :key="index"
                  class="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-coral-soft transition-all duration-200"
                >
                  <!-- Imagem -->
                  <img
                    :src="image.preview || image.url || ''"
                    :alt="`Imagem ${index + 1} do produto`"
                    class="w-full h-full object-contain"
                  />

                  <!-- Overlay com ações -->
                  <div
                    class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center"
                  >
                    <div
                      class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2"
                    >
                      <!-- Botão de visualizar -->
                      <button
                        type="button"
                        @click="previewImage(image)"
                        class="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                        title="Visualizar imagem"
                      >
                        <svg
                          class="w-4 h-4 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
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
                      </button>

                      <!-- Botão de remover -->
                      <button
                        type="button"
                        @click="removeImage(index)"
                        class="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        title="Remover imagem"
                      >
                        <svg
                          class="w-4 h-4 text-white"
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

                  <!-- Indicador de upload -->
                  <div
                    v-if="image.uploading"
                    class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                  >
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>

                  <!-- Número da imagem -->
                  <div
                    class="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full"
                  >
                    {{ index + 1 }}
                  </div>
                </div>
              </div>

              <!-- Estado vazio -->
              <div v-else class="text-center py-8">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma imagem adicionada</h3>
                <p class="mt-1 text-sm text-gray-500">Adicione imagens para mostrar seu produto.</p>
              </div>

              <!-- Dicas -->
              <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-start space-x-3">
                  <svg
                    class="w-5 h-5 text-blue-600 mt-0.5"
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
                  <div class="text-sm text-blue-800">
                    <p class="font-medium">Dicas para boas imagens:</p>
                    <ul class="mt-1 space-y-1 text-blue-700">
                      <li>• Use imagens de alta qualidade (mínimo 800x800px)</li>
                      <li>• Mostre o produto de diferentes ângulos</li>
                      <li>• Use fundo branco ou neutro</li>
                      <li>• A primeira imagem será a principal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- 6. Variações do produto -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      ></path>
                    </svg>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900">Variações do produto</h4>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full">
                    Limite: {{ productVariations.length }} de 50 variações
                  </div>
                  <button
                    type="button"
                    @click="addProductVariation"
                    :disabled="productVariations.length >= 50"
                    class="inline-flex items-center px-4 py-2 bg-coral-soft text-white text-sm font-medium rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    Adicionar variação
                  </button>
                </div>
              </div>

              <!-- Tabela de variações -->
              <div v-if="productVariations.length > 0" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tamanho de tênis
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Código
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Preço de venda
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantidade
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(variation, index) in productVariations"
                      :key="index"
                      class="hover:bg-gray-50"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <span class="text-sm font-medium text-gray-900">{{
                            variation.size
                          }}</span>
                          <div class="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                            <svg
                              class="w-4 h-4 text-gray-500"
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
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <input
                          v-model="variation.code"
                          type="text"
                          class="text-sm text-gray-900 bg-transparent border-none focus:ring-0 focus:outline-none font-mono"
                          placeholder="Código da variação"
                        />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm text-gray-900"
                          >R$ {{ variation.salePrice || '0,00' }}</span
                        >
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm text-gray-900">{{ variation.quantity || '0' }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-2">
                          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span class="text-sm text-gray-900">Ativo</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-2">
                          <button
                            type="button"
                            @click="editProductVariation(index)"
                            class="text-blue-600 hover:text-blue-800 transition-colors"
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
                            type="button"
                            @click="removeProductVariation(index)"
                            class="text-red-600 hover:text-red-800 transition-colors"
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
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Estado vazio -->
              <div v-else class="text-center py-8">
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
                <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma variação cadastrada</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Adicione variações de tamanho para este produto.
                </p>
              </div>
            </div>

            <!-- Footer com botões -->
            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-8 py-3 bg-gradient-to-r from-coral-soft to-coral-dark text-white font-medium rounded-lg hover:from-coral-dark hover:to-coral-soft transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg
                  v-if="loading"
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
                {{ isEditing ? 'Atualizar Produto' : 'Criar Produto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Variações -->
    <ProductVariationModal
      :is-open="showVariationModal"
      :variation="editingVariation"
      :product-code="form.code"
      @close="closeVariationModal"
      @saved="handleVariationSaved"
    />
  </div>
</template>

<script setup lang="ts">
import ProductVariationModal from './ProductVariationModal.vue';
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  product: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'saved']);

const { success, error: notificationError } = useNotifications();
const isEditing = computed(() => !!props.product);

// Estados
const loading = ref(false);
const categoriesLoading = ref(false);
const isGenerating = ref(false);
const error = ref<string | null>(null);
const successMessage = ref('');
const categories = ref<Array<{ id: string; name: string }>>([]);
const uploadedImages = ref<
  Array<{ file: File | null; preview: string; uploading: boolean; url: string | null }>
>([]);

// Variações do produto
const productVariations = ref<
  Array<{
    size: string;
    code: string;
    salePrice: number;
    quantity: number;
    isActive: boolean;
    index?: number;
  }>
>([]);

// Formulário
const form = ref<{
  name: string;
  slug: string;
  code: string;
  description: string;
  raw_description: string;
  price: string;
  salePrice: string;
  categoryId: string;
  images: string[];
  sizes: string;
  colors: string;
  inStock: boolean;
  isActive: boolean;
  featured: boolean;
  id?: string;
}>({
  name: '',
  slug: '',
  code: '',
  description: '',
  raw_description: '',
  price: '',
  salePrice: '',
  categoryId: '',
  images: [],
  sizes: '',
  colors: '',
  inStock: true,
  isActive: true,
  featured: false,
});

// Métodos
const closeModal = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  form.value = {
    name: '',
    slug: '',
    code: '',
    description: '',
    raw_description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    images: [],
    sizes: '',
    colors: '',
    inStock: true,
    isActive: true,
    featured: false,
  };
  uploadedImages.value = [];
  productVariations.value = [];
  error.value = null;
  successMessage.value = '';
};

const generateDescription = async () => {
  if (!form.value.raw_description) {
    notificationError('Por favor, insira uma descrição base para a IA.');
    return;
  }
  isGenerating.value = true;
  error.value = null;
  try {
    const category = categories.value.find(c => c.id === form.value.categoryId);
    const categoryName = category ? category.name : 'Geral';

    const response = await fetch('/api/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName: form.value.name,
        rawDescription: form.value.raw_description,
        categoryName: categoryName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.statusMessage || 'Erro da API');
    }

    const data = await response.json();
    form.value.description = data.description;
    success('Descrição gerada com sucesso!');
  } catch (err: any) {
    notificationError(err.message || 'Ocorreu um erro ao gerar a descrição.');
  } finally {
    isGenerating.value = false;
  }
};

// Funções para upload de imagens
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);

  files.forEach((file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        const target = e.target as FileReader;
        uploadedImages.value.push({
          file: file,
          preview: target.result as string,
          uploading: false,
          url: null,
        });
      };
      reader.readAsDataURL(file);
    }
  });
};

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1);
};

const previewImage = (image: { preview: string; url: string | null }) => {
  // Abrir imagem em nova aba para visualização
  const imageUrl = image.preview || image.url;
  if (imageUrl) {
    window.open(imageUrl, '_blank');
  }
};

const supabase = useSupabaseClient();

const uploadImagesToSupabase = async (
  filesToUpload: Array<{ file: File; preview: string; uploading: boolean; url: string | null }>
) => {
  const uploadedUrls: string[] = [];

  for (const image of filesToUpload) {
    const imageObject = uploadedImages.value.find(img => img.preview === image.preview);
    if (imageObject) {
      imageObject.uploading = true;
    }

    try {
      const fileName = `${Date.now()}-${image.file.name}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, image.file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('product-images').getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    } catch (err: any) {
      console.error('Erro ao fazer upload da imagem:', err);
      throw new Error(`Erro ao fazer upload da imagem: ${err.message}`);
    } finally {
      if (imageObject) {
        imageObject.uploading = false;
      }
    }
  }

  return uploadedUrls;
};

const loadCategories = async () => {
  categoriesLoading.value = true;
  try {
    const { data, error: fetchError } = await supabase.from('categories').select('*').order('name');

    if (fetchError) throw fetchError;
    categories.value = data || [];

    if (categories.value.length === 0) {
      console.log('Nenhuma categoria encontrada. Considere cadastrar categorias primeiro.');
    }
  } catch (err: any) {
    console.error('Erro ao carregar categorias:', err);
    error.value = 'Erro ao carregar categorias. Tente novamente.';
  } finally {
    categoriesLoading.value = false;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    // 1. Separar imagens existentes e novas
    const existingImageUrls = uploadedImages.value
      .filter(img => img.url && !img.file)
      .map(img => img.url);

    const newImageFiles = uploadedImages.value
      .filter(img => img.file)
      .map(img => ({
        file: img.file!,
        preview: img.preview,
        uploading: img.uploading,
        url: img.url,
      }));

    // 2. Fazer upload apenas das novas imagens
    let newImageUrls: string[] = [];
    if (newImageFiles.length > 0) {
      newImageUrls = await uploadImagesToSupabase(newImageFiles);
    }

    const allImageUrls = [...existingImageUrls, ...newImageUrls];

    // Preparar dados
    const productData = {
      name: form.value.name,
      slug: form.value.slug,
      code: form.value.code,
      description: form.value.description,
      raw_description: form.value.raw_description,
      price: parseFloat(form.value.price),
      salePrice: form.value.salePrice ? parseFloat(form.value.salePrice) : null,
      categoryId: form.value.categoryId,
      images: allImageUrls,
      sizes: form.value.sizes
        .split(',')
        .map(s => s.trim())
        .filter(s => s),
      colors: form.value.colors
        .split(',')
        .map(c => c.trim())
        .filter(c => c),
      inStock: form.value.inStock,
      isActive: form.value.isActive,
      featured: form.value.featured,
    };

    if (isEditing.value) {
      // Atualizar produto existente
      const { data, error: updateError } = await (supabase
        .from('products')
        // @ts-ignore
        .update(productData)
        .eq('id', props.product.id)
        .select() as any);

      if (updateError) throw updateError;
      if (!data || data.length === 0) throw new Error('Falha ao atualizar o produto.');

      successMessage.value = 'Produto atualizado com sucesso!';
    } else {
      // Criar novo produto
      const { data, error: createError } = await supabase
        .from('products')
        .insert(productData as any)
        .select();

      if (createError) throw createError;
      if (!data || data.length === 0) throw new Error('Falha ao criar o produto.');

      successMessage.value = 'Produto criado com sucesso!';
    }

    emit('saved');
    setTimeout(() => {
      closeModal();
    }, 1500);
  } catch (err: any) {
    error.value = err.message || `Erro ao ${isEditing.value ? 'atualizar' : 'criar'} produto`;
  } finally {
    loading.value = false;
  }
};

// Estados para modal de variações
const showVariationModal = ref(false);
const editingVariation = ref<Record<string, any> | undefined>(undefined);

// Métodos para variações do produto
const addProductVariation = () => {
  if (productVariations.value.length >= 50) {
    notificationError('Limite máximo de 50 variações atingido.');
    return;
  }

  editingVariation.value = undefined;
  showVariationModal.value = true;
};

const editProductVariation = (index: number) => {
  editingVariation.value = { ...productVariations.value[index], index };
  showVariationModal.value = true;
};

const closeVariationModal = () => {
  showVariationModal.value = false;
  editingVariation.value = undefined;
};

const handleVariationSaved = (variationData: {
  size: string;
  code: string;
  salePrice: number;
  quantity: number;
  isActive: boolean;
}) => {
  if (editingVariation.value) {
    // Editar variação existente
    const index = editingVariation.value.index;
    productVariations.value[index] = {
      ...variationData,
      isActive: true,
    };
  } else {
    // Adicionar nova variação
    productVariations.value.push({
      ...variationData,
      isActive: true,
    });
  }
};

const removeProductVariation = (index: number) => {
  productVariations.value.splice(index, 1);
};

const resetVariations = () => {
  productVariations.value = [];
};

// Carregar categorias quando o modal abrir
watch(
  () => props.isOpen,
  newValue => {
    console.log('Modal isOpen changed:', newValue);
    console.log('Product prop:', props.product);

    if (newValue) {
      loadCategories();
      if (props.product) {
        // Modo de edição: preencher formulário
        console.log('Preenchendo formulário com produto:', props.product);
        form.value = {
          name: props.product.name || '',
          slug: props.product.slug || '',
          code: props.product.code || '',
          description: props.product.description || '',
          raw_description: props.product.raw_description || '',
          price: props.product.price?.toString() || '',
          salePrice: props.product.salePrice?.toString() || '',
          categoryId: props.product.categoryId || '',
          images: props.product.images || [],
          sizes: Array.isArray(props.product.sizes) ? props.product.sizes.join(', ') : '',
          colors: Array.isArray(props.product.colors) ? props.product.colors.join(', ') : '',
          inStock: props.product.inStock ?? true,
          isActive: props.product.isActive ?? true,
          featured: props.product.featured ?? false,
        };
        console.log('Formulário preenchido:', form.value);
        // Preencher imagens se existirem
        if (props.product.images && Array.isArray(props.product.images)) {
          uploadedImages.value = props.product.images.map(url => ({
            file: null,
            preview: url,
            uploading: false,
            url: url,
          }));
        }
      } else {
        // Modo de criação: resetar formulário
        console.log('Resetando formulário para criação');
        resetForm();
      }
    } else {
      resetForm();
    }
  }
);
</script>
