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
                    Forneça informações básicas sobre o produto para a IA gerar uma descrição completa
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
  </div>
</template>

<script setup lang="ts">
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
const error = ref(null);
const successMessage = ref('');
const categories = ref([]);
const uploadedImages = ref([]);

// Formulário
const form = ref({
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
const handleFileUpload = event => {
  const files = Array.from(event.target.files);

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        uploadedImages.value.push({
          file: file,
          preview: e.target.result,
          uploading: false,
          url: null,
        });
      };
      reader.readAsDataURL(file);
    }
  });
};

const removeImage = index => {
  uploadedImages.value.splice(index, 1);
};

const supabase = useSupabaseClient();

const uploadImagesToSupabase = async (filesToUpload: any[]) => {
  const uploadedUrls = [];

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
    } catch (err) {
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
  } catch (err) {
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

    const newImageFiles = uploadedImages.value.filter(img => img.file);

    // 2. Fazer upload apenas das novas imagens
    let newImageUrls = [];
    if (newImageFiles.length > 0) {
      newImageUrls = await uploadImagesToSupabase(newImageFiles);
    }

    const allImageUrls = [...existingImageUrls, ...newImageUrls];

    // Preparar dados
    const productData = {
      ...form.value,
      price: parseFloat(form.value.price),
      salePrice: form.value.salePrice ? parseFloat(form.value.salePrice) : null,
      images: allImageUrls,
      sizes: form.value.sizes
        .split(',')
        .map(s => s.trim())
        .filter(s => s),
      colors: form.value.colors
        .split(',')
        .map(c => c.trim())
        .filter(c => c),
    };
    // Remover ID do form para não dar conflito no insert/update
    delete productData.id;

    if (isEditing.value) {
      // Atualizar produto existente
      const { data, error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', props.product.id)
        .select();

      if (updateError) throw updateError;
      if (!data || data.length === 0) throw new Error('Falha ao atualizar o produto.');

      successMessage.value = 'Produto atualizado com sucesso!';
    } else {
      // Criar novo produto
      const { data, error: createError } = await supabase
        .from('products')
        .insert(productData)
        .select();

      if (createError) throw createError;
      if (!data || data.length === 0) throw new Error('Falha ao criar o produto.');

      successMessage.value = 'Produto criado com sucesso!';
    }

    emit('saved');
    setTimeout(() => {
      closeModal();
    }, 1500);
  } catch (err) {
    error.value = err.message || `Erro ao ${isEditing.value ? 'atualizar' : 'criar'} produto`;
  } finally {
    loading.value = false;
  }
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
          ...props.product,
          code: props.product.code || '',
          price: props.product.price?.toString() || '',
          salePrice: props.product.salePrice?.toString() || '',
          sizes: Array.isArray(props.product.sizes) ? props.product.sizes.join(', ') : '',
          colors: Array.isArray(props.product.colors) ? props.product.colors.join(', ') : '',
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
