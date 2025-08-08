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
          <h2 class="text-xl font-semibold text-gray-900">Cadastrar Novo Produto</h2>
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
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
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
              <label for="product-images" class="block text-sm font-medium text-gray-700 mb-1">
                URLs das Imagens (uma por linha)
              </label>
              <textarea
                id="product-images"
                v-model="imagesText"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="https://exemplo.com/imagem1.jpg&#10;https://exemplo.com/imagem2.jpg"
              ></textarea>
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

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const { success, error: notificationError } = useNotifications();

// Estados
const loading = ref(false);
const error = ref(null);
const successMessage = ref('');
const categories = ref([]);

// Formulário
const form = ref({
  name: '',
  slug: '',
  description: '',
  price: '',
  salePrice: '',
  categoryId: '',
  images: [],
  sizes: [],
  colors: [],
  inStock: true,
  featured: false,
});

// Texto das imagens para o textarea
const imagesText = computed({
  get: () => form.value.images.join('\n'),
  set: value => {
    form.value.images = value.split('\n').filter(url => url.trim());
  },
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
    sizes: [],
    colors: [],
    inStock: true,
    featured: false,
  };
  error.value = null;
  successMessage.value = '';
};

const loadCategories = async () => {
  try {
    const { data, error: fetchError } = await supabase.from('categories').select('*').order('name');

    if (fetchError) throw fetchError;
    categories.value = data || [];
  } catch (err) {
    console.error('Erro ao carregar categorias:', err);
  }
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Preparar dados
    const productData = {
      ...form.value,
      price: parseFloat(form.value.price),
      salePrice: form.value.salePrice ? parseFloat(form.value.salePrice) : null,
      sizes: form.value.sizes
        .split(',')
        .map(s => s.trim())
        .filter(s => s),
      colors: form.value.colors
        .split(',')
        .map(c => c.trim())
        .filter(c => c),
    };

    // Criar produto
    const { data, error: createError } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (createError) throw createError;

    successMessage.value = 'Produto criado com sucesso!';
    setTimeout(() => {
      closeModal();
    }, 1500);
  } catch (err) {
    error.value = err.message || 'Erro ao criar produto';
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
    } else {
      resetForm();
    }
  }
);
</script>
