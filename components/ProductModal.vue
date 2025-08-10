<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto' }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
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

        <!-- Content -->
        <div class="p-6">
          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Success Message -->
          <div
            v-if="successMessage"
            class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <!-- Product Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="product-name" class="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto *
                </label>
                <input
                  id="product-name"
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                  placeholder="Ex: Sandália Birkenstock Arizona"
                />
              </div>

              <div>
                <label for="product-slug" class="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  id="product-slug"
                  v-model="form.slug"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                  placeholder="Ex: sandalia-birkenstock-arizona"
                />
              </div>
            </div>

            <!-- Category -->
            <div>
              <label for="product-category" class="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                id="product-category"
                v-model="form.categoryId"
                required
                :disabled="categoriesLoading"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {{ categoriesLoading ? 'Carregando categorias...' : 'Selecione uma categoria' }}
                </option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <p
                v-if="!categoriesLoading && categories.length === 0"
                class="mt-1 text-sm text-red-600"
              >
                Nenhuma categoria encontrada. Cadastre categorias primeiro.
              </p>
            </div>

            <!-- Description -->
            <div>
              <label for="product-description" class="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                id="product-description"
                v-model="form.description"
                required
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="Descreva o produto..."
              ></textarea>
            </div>

            <!-- Pricing -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="product-price" class="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$) *
                </label>
                <input
                  id="product-price"
                  v-model="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label
                  for="product-sale-price"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preço de Venda (R$)
                </label>
                <input
                  id="product-sale-price"
                  v-model="form.salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <!-- Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Imagens do Produto
              </label>

              <!-- File Upload -->
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleFileUpload"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-coral-soft hover:bg-coral-dark transition-colors"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  Selecionar Imagens
                </button>
                <p class="mt-2 text-sm text-gray-500">
                  Arraste e solte imagens aqui ou clique para selecionar
                </p>
              </div>

              <!-- Uploaded Images Preview -->
              <div v-if="uploadedImages.length > 0" class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Imagens selecionadas:</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div v-for="(image, index) in uploadedImages" :key="index" class="relative group">
                    <img
                      :src="image.preview"
                      :alt="`Imagem ${index + 1}`"
                      class="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      @click="removeImage(index)"
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                    <div
                      v-if="image.uploading"
                      class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
                    >
                      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sizes and Colors -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="product-sizes" class="block text-sm font-medium text-gray-700 mb-1">
                  Tamanhos (separados por vírgula)
                </label>
                <input
                  id="product-sizes"
                  v-model="form.sizes"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                  placeholder="Ex: 35, 36, 37, 38, 39, 40, 41, 42"
                />
              </div>

              <div>
                <label for="product-colors" class="block text-sm font-medium text-gray-700 mb-1">
                  Cores (separadas por vírgula)
                </label>
                <input
                  id="product-colors"
                  v-model="form.colors"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                  placeholder="Ex: Preto, Marrom, Bege"
                />
              </div>
            </div>

            <!-- Options -->
            <div class="flex items-center space-x-6">
              <label class="flex items-center">
                <input
                  v-model="form.inStock"
                  type="checkbox"
                  class="rounded border-gray-300 text-coral-soft focus:ring-coral-soft"
                />
                <span class="ml-2 text-sm text-gray-700">Em estoque</span>
              </label>

              <label class="flex items-center">
                <input
                  v-model="form.featured"
                  type="checkbox"
                  class="rounded border-gray-300 text-coral-soft focus:ring-coral-soft"
                />
                <span class="ml-2 text-sm text-gray-700">Produto em destaque</span>
              </label>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-white bg-coral-soft border border-transparent rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Salvando...' : 'Salvar Produto' }}
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
const error = ref(null);
const successMessage = ref('');
const categories = ref([]);
const uploadedImages = ref([]);

// Formulário
const form = ref({
  name: '',
  slug: '',
  description: '',
  price: '',
  salePrice: '',
  categoryId: '',
  images: [],
  sizes: '',
  colors: '',
  inStock: true,
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
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    images: [],
    sizes: '',
    colors: '',
    inStock: true,
    featured: false,
  };
  uploadedImages.value = [];
  error.value = null;
  successMessage.value = '';
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
    if (newValue) {
      loadCategories();
      if (props.product) {
        // Modo de edição: preencher formulário
        form.value = {
          ...props.product,
          price: props.product.price?.toString() || '',
          salePrice: props.product.salePrice?.toString() || '',
          sizes: Array.isArray(props.product.sizes) ? props.product.sizes.join(', ') : '',
          colors: Array.isArray(props.product.colors) ? props.product.colors.join(', ') : '',
        };
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
        resetForm();
      }
    } else {
      resetForm();
    }
  }
);
</script>
