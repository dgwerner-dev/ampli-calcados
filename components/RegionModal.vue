<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    @click="closeModal"
  >
    <div
      class="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-coral-soft to-coral-dark px-6 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-white">
            {{ isEditing ? 'Editar Região' : 'Nova Região' }}
          </h2>
          <button
            @click="closeModal"
            class="text-white hover:text-gray-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nome da Região -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nome da Região *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-transparent transition-all"
              placeholder="Ex: São Paulo Capital"
            />
          </div>

          <!-- Valor Mínimo do Pedido -->
          <div>
            <label for="minOrderValue" class="block text-sm font-medium text-gray-700 mb-2">
              Valor Mínimo do Pedido (R$) *
            </label>
            <input
              id="minOrderValue"
              v-model="form.minOrderValue"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-transparent transition-all"
              placeholder="0.00"
            />
          </div>

          <!-- CEP Inicial -->
          <div>
            <label for="zipCodeStart" class="block text-sm font-medium text-gray-700 mb-2">
              CEP Inicial *
            </label>
            <input
              id="zipCodeStart"
              v-model="form.zipCodeStart"
              type="text"
              required
              maxlength="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-transparent transition-all"
              placeholder="01000"
            />
          </div>

          <!-- CEP Final -->
          <div>
            <label for="zipCodeEnd" class="block text-sm font-medium text-gray-700 mb-2">
              CEP Final *
            </label>
            <input
              id="zipCodeEnd"
              v-model="form.zipCodeEnd"
              type="text"
              required
              maxlength="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-transparent transition-all"
              placeholder="39999"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="flex items-center">
              <input
                v-model="form.isActive"
                type="checkbox"
                class="w-4 h-4 text-coral-soft border-gray-300 rounded focus:ring-coral-soft"
              />
              <span class="ml-2 text-sm text-gray-700">Região ativa</span>
            </label>
          </div>

          <!-- Buttons -->
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-3 bg-coral-soft hover:bg-coral-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Salvando...
              </span>
              <span v-else>
                {{ isEditing ? 'Atualizar' : 'Criar' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  region: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'saved']);

const supabase = useSupabaseClient();

const loading = ref(false);
const form = ref({
  name: '',
  minOrderValue: '',
  zipCodeStart: '',
  zipCodeEnd: '',
  isActive: true,
});

const isEditing = computed(() => !!props.region);

// Reset form when modal opens/closes
watch(
  () => props.isVisible,
  (visible) => {
    if (visible) {
      if (props.region) {
        // Editing mode
        form.value = {
          name: props.region.name || '',
          minOrderValue: props.region.minOrderValue || '',
          zipCodeStart: props.region.zipCodeStart || '',
          zipCodeEnd: props.region.zipCodeEnd || '',
          isActive: props.region.isActive !== false,
        };
      } else {
        // Create mode
        form.value = {
          name: '',
          minOrderValue: '',
          zipCodeStart: '',
          zipCodeEnd: '',
          isActive: true,
        };
      }
    }
  }
);

const closeModal = () => {
  emit('close');
};

const handleSubmit = async () => {
  if (loading.value) return;

  loading.value = true;

  try {
    const regionData = {
      name: form.value.name.trim(),
      minOrderValue: parseFloat(form.value.minOrderValue),
      zipCodeStart: form.value.zipCodeStart.trim(),
      zipCodeEnd: form.value.zipCodeEnd.trim(),
      isActive: form.value.isActive,
    };

    if (isEditing.value) {
      // Update existing region
      const { data, error } = await supabase
        .from('shipping_regions')
        .update(regionData)
        .eq('id', props.region.id)
        .select()
        .single();

      if (error) throw error;
      emit('saved', data);
    } else {
      // Create new region
      const { data, error } = await supabase
        .from('shipping_regions')
        .insert([regionData])
        .select()
        .single();

      if (error) throw error;
      emit('saved', data);
    }

    closeModal();
  } catch (error) {
    console.error('Erro ao salvar região:', error);
    alert('Erro ao salvar região: ' + error.message);
  } finally {
    loading.value = false;
  }
};
</script>
