import { ref, computed, readonly } from 'vue';

interface FeaturedProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  images: string[];
  slug: string;
  category?: {
    name: string;
  };
  featured: boolean;
  isActive: boolean;
}

interface CachedData {
  products: FeaturedProduct[];
  timestamp: number;
  expiresAt: number;
}

export const useFeaturedProducts = () => {
  const products = ref<FeaturedProduct[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Cache em memória (5 minutos)
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  let cache: CachedData | null = null;

  // Computed properties
  const isEmpty = computed(() => products.value.length === 0);
  const hasError = computed(() => !!error.value);

  // Verificar se o cache é válido
  const isCacheValid = () => {
    if (!cache) return false;
    return Date.now() < cache.expiresAt;
  };

  // Carregar produtos em destaque com cache
  const loadFeaturedProducts = async (forceRefresh = false) => {
    console.log('🚀 loadFeaturedProducts chamado', { forceRefresh });
    
    try {
      loading.value = true;
      error.value = null;

      // Verificar cache primeiro (se não for refresh forçado)
      if (!forceRefresh && isCacheValid()) {
        console.log('📦 Usando cache válido:', cache!.products.length, 'produtos');
        products.value = cache!.products;
        return;
      }

      console.log('🌐 Buscando produtos da API...');
      // Buscar produtos em destaque via API com timeout
      const data = await $fetch('/api/products/featured', {
        timeout: 5000, // 5 segundos de timeout
      });

      console.log('✅ Produtos recebidos da API:', data?.length || 0);

      // Atualizar cache
      cache = {
        products: data || [],
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION,
      };

      products.value = data || [];
      console.log('📊 Estado atualizado:', products.value.length, 'produtos');
    } catch (err: any) {
      console.error('❌ Erro ao carregar produtos em destaque:', err);
      error.value = err.message || 'Erro ao carregar produtos em destaque';
      
      // Se há cache expirado, usar como fallback
      if (cache && cache.products.length > 0) {
        products.value = cache.products;
        console.log('⚠️ Usando dados em cache como fallback');
      }
    } finally {
      loading.value = false;
    }
  };

  // Limpar cache
  const clearCache = () => {
    console.log('🗑️ Limpando cache de produtos em destaque');
    cache = null;
    products.value = [];
  };

  // Forçar refresh dos dados
  const refresh = () => {
    return loadFeaturedProducts(true);
  };

  // Transformar produtos em slides para o carrossel
  const transformToSlides = (products: FeaturedProduct[]) => {
    return products.map(product => ({
      id: product.id,
      title: product.name,
      description: product.description || 'Produto em destaque da AMPLI CALÇADOS',
      price: product.salePrice
        ? `R$ ${parseFloat(product.salePrice.toString()).toFixed(2).replace('.', ',')}`
        : `R$ ${product.price.toFixed(2).replace('.', ',')}`,
      originalPrice: product.salePrice
        ? `R$ ${product.price.toFixed(2).replace('.', ',')}`
        : null,
      discount: product.salePrice
        ? Math.round(((product.price - parseFloat(product.salePrice.toString())) / product.price) * 100)
        : null,
      image: product.images && product.images.length > 0
        ? product.images[0]
        : '/images/placeholder-product.jpg',
      slug: product.slug,
      category: product.category?.name,
    }));
  };

  // Obter slides transformados
  const slides = computed(() => transformToSlides(products.value));

  return {
    // Estados
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    isEmpty,
    hasError,
    slides,
    
    // Métodos
    loadFeaturedProducts,
    clearCache,
    refresh,
    transformToSlides,
  };
};
