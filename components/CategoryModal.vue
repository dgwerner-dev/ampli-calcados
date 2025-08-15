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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">
                  {{ props.category ? 'Editar Categoria' : 'Nova Categoria' }}
                </h3>
                <p class="text-coral-100 text-sm">Configure as informações da categoria</p>
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
            <!-- Informações da categoria -->
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
                <h4 class="text-lg font-semibold text-gray-900">Informações da categoria</h4>
              </div>

              <div class="space-y-6">
                <!-- Nome da categoria -->
                <div>
                  <label for="category-name" class="block text-sm font-medium text-gray-700 mb-2">
                    Nome da categoria <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="category-name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                    placeholder="Ex: Sandálias"
                  />
                </div>

                <!-- Slug -->
                <div>
                  <label for="category-slug" class="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="category-slug"
                    v-model="form.slug"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200"
                    placeholder="Ex: sandalias"
                  />
                  <p class="mt-2 text-xs text-gray-500">
                    URL amigável para SEO (apenas letras, números e hífens)
                  </p>
                </div>

                <!-- Descrição -->
                <div>
                  <label
                    for="category-description"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Descrição
                  </label>
                  <textarea
                    id="category-description"
                    v-model="form.description"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 resize-none"
                    placeholder="Descreva a categoria e seus produtos..."
                  ></textarea>
                  <p class="mt-2 text-xs text-gray-500">
                    Use HTML para formatação (negrito, itálico, listas, etc.)
                  </p>
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
                {{ props.category ? 'Atualizar Categoria' : 'Criar Categoria' }}
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
  category: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'saved']);
// Supabase client do módulo @nuxtjs/supabase
const supabase = useSupabaseClient();

// Estados
const loading = ref(false);
const error = ref(null);
const successMessage = ref('');

// Formulário
const form = ref({
  name: '',
  slug: '',
  description: '',
});

// Métodos
const closeModal = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  if (props.category) {
    // Carregar dados da categoria para edição
    form.value = {
      name: props.category.name,
      slug: props.category.slug,
      description: props.category.description || '',
    };
  } else {
    // Formulário vazio para nova categoria
    form.value = {
      name: '',
      slug: '',
      description: '',
    };
  }
  error.value = null;
  successMessage.value = '';
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Validar slug
    const slug = form.value.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    form.value.slug = slug;

    let result;
    if (props.category) {
      // Atualizar categoria existente
      result = await supabase
        .from('categories')
        .update(form.value)
        .eq('id', props.category.id)
        .select()
        .single();
    } else {
      // Criar nova categoria
      result = await supabase.from('categories').insert(form.value).select().single();
    }

    if (result.error) throw result.error;

    successMessage.value = props.category
      ? 'Categoria atualizada com sucesso!'
      : 'Categoria criada com sucesso!';
    emit('saved');
    setTimeout(() => {
      closeModal();
    }, 1500);
  } catch (err) {
    error.value =
      err.message || (props.category ? 'Erro ao atualizar categoria' : 'Erro ao criar categoria');
  } finally {
    loading.value = false;
  }
};

// Recarregar formulário quando o modal abrir
watch(
  () => props.isOpen,
  newValue => {
    if (newValue) {
      resetForm();
    }
  }
);

// Recarregar formulário quando a categoria mudar
watch(
  () => props.category,
  () => {
    if (props.isOpen) {
      resetForm();
    }
  }
);
</script>
