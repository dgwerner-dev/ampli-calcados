<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ props.category ? 'Editar Categoria' : 'Cadastrar Nova Categoria' }}
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

          <!-- Category Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name -->
            <div>
              <label for="category-name" class="block text-sm font-medium text-gray-700 mb-1">
                Nome da Categoria *
              </label>
              <input
                id="category-name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="Ex: Sandálias"
              />
            </div>

            <!-- Slug -->
            <div>
              <label for="category-slug" class="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                id="category-slug"
                v-model="form.slug"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="Ex: sandalias"
              />
              <p class="mt-1 text-xs text-gray-500">
                URL amigável (apenas letras, números e hífens)
              </p>
            </div>

            <!-- Description -->
            <div>
              <label
                for="category-description"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição
              </label>
              <textarea
                id="category-description"
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent"
                placeholder="Descreva a categoria..."
              ></textarea>
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
                {{
                  loading
                    ? 'Salvando...'
                    : props.category
                      ? 'Atualizar Categoria'
                      : 'Salvar Categoria'
                }}
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
