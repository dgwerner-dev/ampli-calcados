<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        @click="closeModal"
      ></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100"
      >
        <!-- Header -->
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Atualizar Preços em Massa</h3>
                <p class="text-coral-100 text-sm">
                  Defina novos preços para todos os produtos de uma categoria
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

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Categoria -->
            <div>
              <label for="category-select" class="block text-sm font-medium text-gray-700 mb-2">
                Categoria <span class="text-red-500">*</span>
              </label>
              <select
                id="category-select"
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

            <!-- Tipo de Atualização -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Atualização <span class="text-red-500">*</span>
              </label>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="form.updateType"
                    value="percentage"
                    type="radio"
                    name="updateType"
                    class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Percentual (%)</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.updateType"
                    value="fixed"
                    type="radio"
                    name="updateType"
                    class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Valor Fixo (R$)</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.updateType"
                    value="replace"
                    type="radio"
                    name="updateType"
                    class="h-4 w-4 text-coral-soft focus:ring-coral-soft border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Substituir Preço</span>
                </label>
              </div>
            </div>

            <!-- Valor -->
            <div>
              <label for="update-value" class="block text-sm font-medium text-gray-700 mb-2">
                {{ getValueLabel() }} <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span
                  v-if="form.updateType !== 'percentage'"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >R$</span
                >
                <input
                  id="update-value"
                  v-model="form.value"
                  type="number"
                  :step="form.updateType === 'percentage' ? '0.01' : '0.01'"
                  :min="form.updateType === 'percentage' ? '-100' : '0'"
                  required
                  :class="[
                    'w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200',
                    form.updateType !== 'percentage' ? 'pl-10 pr-4 py-3' : 'px-4 py-3',
                  ]"
                  :placeholder="getValuePlaceholder()"
                />
                <span
                  v-if="form.updateType === 'percentage'"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >%</span
                >
              </div>
              <p class="mt-2 text-xs text-gray-500">{{ getValueDescription() }}</p>
            </div>

            <!-- Preview -->
            <div
              v-if="previewProducts.length > 0"
              class="bg-white rounded-lg border border-gray-200 p-4"
            >
              <h4 class="text-sm font-medium text-gray-900 mb-3">Preview dos Produtos Afetados</h4>
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <div
                  v-for="product in previewProducts"
                  :key="product.id"
                  class="flex items-center justify-between text-sm"
                >
                  <span class="text-gray-700">{{ product.name }}</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-gray-500 line-through"
                      >R$ {{ formatPrice(product.price) }}</span
                    >
                    <span class="text-coral-soft font-medium"
                      >→ R$ {{ formatPrice(calculateNewPrice(product.price)) }}</span
                    >
                  </div>
                </div>
              </div>
              <p class="mt-3 text-xs text-gray-500">
                Total de produtos que serão atualizados: {{ previewProducts.length }}
              </p>
            </div>

            <!-- Footer -->
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
                :disabled="loading || !form.categoryId || !form.updateType || !form.value"
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
                {{ loading ? 'Atualizando...' : 'Atualizar Preços' }}
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
});

const emit = defineEmits(['close', 'updated']);

const { success, error: notificationError } = useNotifications();
const supabase = useSupabaseClient();

// Estados
const loading = ref(false);
const categoriesLoading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref('');
const categories = ref<Array<{ id: string; name: string }>>([]);
const previewProducts = ref<Array<{ id: string; name: string; price: number }>>([]);

// Formulário
const form = ref({
  categoryId: '',
  updateType: 'percentage',
  value: '',
});

// Métodos
const closeModal = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  form.value = {
    categoryId: '',
    updateType: 'percentage',
    value: '',
  };
  error.value = null;
  successMessage.value = '';
  previewProducts.value = [];
};

const getValueLabel = () => {
  switch (form.value.updateType) {
    case 'percentage':
      return 'Percentual de Alteração';
    case 'fixed':
      return 'Valor a Adicionar/Subtrair';
    case 'replace':
      return 'Novo Preço';
    default:
      return 'Valor';
  }
};

const getValuePlaceholder = () => {
  switch (form.value.updateType) {
    case 'percentage':
      return 'Ex: 10 (aumentar 10%) ou -5 (diminuir 5%)';
    case 'fixed':
      return 'Ex: 50 (adicionar R$ 50) ou -20 (subtrair R$ 20)';
    case 'replace':
      return 'Ex: 299.90';
    default:
      return '';
  }
};

const getValueDescription = () => {
  switch (form.value.updateType) {
    case 'percentage':
      return 'Use valores positivos para aumentar e negativos para diminuir o preço';
    case 'fixed':
      return 'Use valores positivos para adicionar e negativos para subtrair do preço atual';
    case 'replace':
      return 'Todos os produtos da categoria terão este novo preço';
    default:
      return '';
  }
};

const calculateNewPrice = (currentPrice: number) => {
  const value = parseFloat(form.value.value);
  if (isNaN(value)) return currentPrice;

  switch (form.value.updateType) {
    case 'percentage':
      return currentPrice * (1 + value / 100);
    case 'fixed':
      return currentPrice + value;
    case 'replace':
      return value;
    default:
      return currentPrice;
  }
};

const formatPrice = (price: number) => {
  return price.toFixed(2).replace('.', ',');
};

const loadCategories = async () => {
  categoriesLoading.value = true;
  try {
    const { data, error: fetchError } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');

    if (fetchError) throw fetchError;
    categories.value = data || [];
  } catch (err: any) {
    console.error('Erro ao carregar categorias:', err);
    error.value = 'Erro ao carregar categorias. Tente novamente.';
  } finally {
    categoriesLoading.value = false;
  }
};

const loadPreviewProducts = async () => {
  if (!form.value.categoryId) {
    previewProducts.value = [];
    return;
  }

  try {
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('id, name, price')
      .eq('categoryId', form.value.categoryId)
      .order('name');

    if (fetchError) throw fetchError;
    previewProducts.value = data || [];
  } catch (err: any) {
    console.error('Erro ao carregar preview:', err);
    previewProducts.value = [];
  }
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    const value = parseFloat(form.value.value);
    if (isNaN(value)) {
      throw new Error('Valor inválido');
    }

    // Buscar todos os produtos da categoria
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, price')
      .eq('categoryId', form.value.categoryId);

    if (fetchError) throw fetchError;
    if (!products || products.length === 0) {
      throw new Error('Nenhum produto encontrado nesta categoria');
    }

    // Calcular novos preços
    const updates = products.map(product => {
      const newPrice = calculateNewPrice(product.price);
      return {
        id: product.id,
        price: Math.max(0, newPrice), // Garantir que o preço não seja negativo
      };
    });

    // Atualizar produtos em lote
    // @ts-ignore - Supabase type inference issue
    const { error: updateError } = await supabase
      .from('products')
      .upsert(updates, { onConflict: 'id' });

    if (updateError) throw updateError;

    successMessage.value = `${updates.length} produtos atualizados com sucesso!`;
    emit('updated');

    setTimeout(() => {
      closeModal();
    }, 2000);
  } catch (err: any) {
    error.value = err.message || 'Erro ao atualizar preços';
    notificationError(error.value);
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(() => form.value.categoryId, loadPreviewProducts);
watch(
  () => form.value.updateType,
  () => {
    form.value.value = '';
    loadPreviewProducts();
  }
);
watch(() => form.value.value, loadPreviewProducts);

// Carregar categorias quando o modal abrir
watch(
  () => props.isOpen,
  newValue => {
    if (newValue) {
      loadCategories();
    }
  }
);
</script>
