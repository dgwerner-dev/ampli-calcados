import { ref, computed, readonly } from 'vue';

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    images: string[];
  };
  createdAt: string;
}

interface CachedWishlist {
  items: WishlistItem[];
  timestamp: number;
  expiresAt: number;
}

export const useWishlist = () => {
  const wishlist = ref<WishlistItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Cache em memória (3 minutos)
  const CACHE_DURATION = 3 * 60 * 1000; // 3 minutos
  let cache: CachedWishlist | null = null;
  let loadingPromise: Promise<void> | null = null;

  // Computed properties
  const wishlistCount = computed(() => wishlist.value.length);
  const isEmpty = computed(() => wishlist.value.length === 0);
  const hasError = computed(() => !!error.value);

  // Verificar se o cache é válido
  const isCacheValid = () => {
    if (!cache) return false;
    return Date.now() < cache.expiresAt;
  };

  // Carregar wishlist com cache e otimizações
  const loadWishlist = async (forceRefresh = false) => {
    console.log('🔄 loadWishlist chamado', { forceRefresh });
    
    // Se já está carregando, retornar a promise existente
    if (loadingPromise && !forceRefresh) {
      console.log('⏭️ Já está carregando, retornando promise existente');
      return loadingPromise;
    }

    // Verificar cache primeiro (se não for refresh forçado)
    if (!forceRefresh && isCacheValid()) {
      console.log('📦 Usando cache válido');
      wishlist.value = cache!.items;
      return;
    }

    loadingPromise = (async () => {
      try {
        loading.value = true;
        error.value = null;

        console.log('🌐 Fazendo requisição para /api/wishlist...');
        
        // Buscar wishlist via API com timeout
        const response = await $fetch('/api/wishlist', {
          timeout: 3000, // 3 segundos de timeout
        });

        console.log('📥 Resposta da API:', response);

        const items = response.items || [];

        console.log('📊 Itens recebidos:', items.length);

        // Atualizar cache
        cache = {
          items,
          timestamp: Date.now(),
          expiresAt: Date.now() + CACHE_DURATION,
        };

        wishlist.value = items;
        console.log('✅ Wishlist atualizada com sucesso:', items.length, 'itens');
      } catch (error: any) {
        console.error('❌ Erro ao carregar wishlist:', error);
        console.error('📋 Detalhes do erro:', {
          statusCode: error.statusCode,
          message: error.message,
          data: error.data
        });
        
        // Se o erro for de autenticação, limpar wishlist silenciosamente
        if (
          error.statusCode === 401 ||
          error.statusCode === 500 ||
          error.message?.includes('Auth session missing')
        ) {
          console.log('🔐 Usuário não autenticado, limpando wishlist');
          wishlist.value = [];
          cache = null;
          return;
        }

        // Para outros erros, logar mas não fazer throw
        error.value = error.message || 'Erro ao carregar wishlist';

        // Se há cache expirado, usar como fallback
        if (cache && cache.items.length > 0) {
          wishlist.value = cache.items;
          console.log('⚠️ Usando wishlist em cache como fallback');
        } else {
          wishlist.value = [];
          console.log('📭 Wishlist vazia após erro');
        }
      } finally {
        loading.value = false;
        loadingPromise = null;
      }
    })();

    return loadingPromise;
  };

  // Adicionar produto à wishlist (otimizado)
  const addToWishlist = async (productId: string) => {
    try {
      loading.value = true;
      const response = await $fetch('/api/wishlist', {
        method: 'POST',
        body: { productId },
        timeout: 3000,
      });

      if (response.success) {
        // Buscar dados do produto para adicionar ao estado local
        const productResponse = await $fetch(`/api/products/${productId}`, {
          timeout: 2000,
        });

        if (productResponse) {
          const newItem: WishlistItem = {
            id: Date.now().toString(), // ID temporário
            productId,
            product: {
              id: productResponse.id,
              name: productResponse.name,
              slug: productResponse.slug,
              price: productResponse.price,
              salePrice: productResponse.salePrice,
              images: productResponse.images || [],
            },
            createdAt: new Date().toISOString(),
          };

          // Adicionar ao estado local
          wishlist.value.unshift(newItem);

          // Atualizar cache
          if (cache) {
            cache.items.unshift(newItem);
            cache.expiresAt = Date.now() + CACHE_DURATION;
          }

          return true;
        }
      }
      return false;
    } catch (error: any) {
      // Se não estiver autenticado, não mostrar erro
      if (error.statusCode === 401 || error.message?.includes('Auth session missing')) {
        return false;
      }
      console.error('Erro ao adicionar à wishlist:', error);
      error.value = error.message || 'Erro ao adicionar à wishlist';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Remover produto da wishlist (otimizado)
  const removeFromWishlist = async (productId: string) => {
    try {
      loading.value = true;
      const response = await $fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        timeout: 3000,
      });

      if (response.success) {
        // Remover do estado local
        wishlist.value = wishlist.value.filter(item => item.productId !== productId);

        // Atualizar cache
        if (cache) {
          cache.items = cache.items.filter(item => item.productId !== productId);
          cache.expiresAt = Date.now() + CACHE_DURATION;
        }

        return true;
      }
      return false;
    } catch (error: any) {
      // Se não estiver autenticado, não mostrar erro
      if (error.statusCode === 401 || error.message?.includes('Auth session missing')) {
        return false;
      }
      console.error('Erro ao remover da wishlist:', error);
      error.value = error.message || 'Erro ao remover da wishlist';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Verificar se produto está na wishlist
  const isInWishlist = (productId: string) => {
    return wishlist.value.some(item => item.productId === productId);
  };

  // Limpar wishlist
  const clearWishlist = () => {
    wishlist.value = [];
    cache = null;
  };

  // Limpar cache
  const clearCache = () => {
    cache = null;
  };

  // Forçar refresh dos dados
  const refresh = () => {
    return loadWishlist(true);
  };

  // Carregar wishlist de forma assíncrona (não bloqueante)
  const loadWishlistAsync = () => {
    console.log('🔄 loadWishlistAsync chamado');
    console.log('📊 Estado atual:', {
      loading: loading.value,
      cacheValid: isCacheValid(),
      wishlistCount: wishlist.value.length,
      hasCache: !!cache,
    });

    // Verificar se usuário está autenticado
    const { user } = useAuth();
    if (!user.value) {
      console.log('❌ Usuário não autenticado, limpando wishlist');
      wishlist.value = [];
      cache = null;
      return;
    }

    if (!loading.value && !isCacheValid()) {
      console.log('🚀 Iniciando carregamento da wishlist...');
      loadWishlist().catch(err => {
        console.error('Erro ao carregar wishlist de forma assíncrona:', err);
      });
    } else {
      console.log('⏭️ Pulando carregamento (loading ou cache válido)');
    }
  };

  // Watcher para limpar wishlist quando usuário não estiver autenticado
  const { user } = useAuth();

  watch(user, newUser => {
    console.log('👤 Status do usuário mudou:', !!newUser);
    if (!newUser) {
      console.log('🔐 Usuário deslogado, limpando wishlist');
      wishlist.value = [];
      cache = null;
    } else {
      console.log('✅ Usuário logado, carregando wishlist');
      // Carregar wishlist quando usuário fizer login
      loadWishlistAsync();
    }
  });

  return {
    // Estados
    wishlist: readonly(wishlist),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    wishlistCount,
    isEmpty,
    hasError,

    // Métodos
    loadWishlist,
    loadWishlistAsync,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    clearCache,
    refresh,
  };
};
