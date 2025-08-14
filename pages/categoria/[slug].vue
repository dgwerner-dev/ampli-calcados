<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-soft mx-auto"></div>
      <p class="mt-4 text-gray-600">Carregando produtos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <h1 class="text-2xl font-bold text-red-600 mb-2">Erro ao carregar a categoria</h1>
      <p class="text-gray-600">{{ error }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="category">
      <!-- Products Grid -->
      <ProductsGrid :products="products" />

      <!-- Empty State -->
      <div v-if="products.length === 0" class="text-center py-16">
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
        <h2 class="mt-4 text-xl font-medium text-gray-900">Nenhum produto encontrado</h2>
        <p class="mt-1 text-sm text-gray-500">
          Não há produtos disponíveis nesta categoria no momento.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const supabase = useSupabaseClient();

const loading = ref(true);
const error = ref<string | null>(null);
const category = ref<any>(null);
const products = ref<any[]>([]);

const fetchData = async () => {
  const slug = route.params.slug as string;
  if (!slug) {
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Fetch the category and its related products in a single query
    const { data, error: queryError } = await supabase
      .from('categories')
      .select('id, name, description, products(*)')
      .eq('slug', slug)
      .single();

    if (queryError || !data) {
      throw new Error(queryError?.message || 'Categoria não encontrada.');
    }

    // Separate category data and products
    const { products: productData, ...categoryData } = data;
    category.value = categoryData;
    products.value = productData || [];
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

// Watch for route changes to refetch data
watch(() => route.params.slug, fetchData);

// SEO and Head
useHead({
  title: computed(() => (category.value ? `${category.value.name} - AMPLI CALÇADOS` : 'Categoria')),
  meta: [
    {
      name: 'description',
      content: computed(() =>
        category.value
          ? category.value.description ||
            `Confira nossos produtos na categoria ${category.value.name}`
          : 'Produtos de alta qualidade'
      ),
    },
  ],
});
</script>
