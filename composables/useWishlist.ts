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

export const useWishlist = () => {
  const wishlist = ref<WishlistItem[]>([]);
  const loading = ref(false);

  // Computed properties
  const wishlistCount = computed(() => wishlist.value.length);
  const isEmpty = computed(() => wishlist.value.length === 0);

  // Carregar wishlist do usuário
  const loadWishlist = async () => {
    try {
      loading.value = true;
      const response = await $fetch('/api/wishlist');
      wishlist.value = response.items || [];
    } catch (error: any) {
      // Se o erro for de autenticação, limpar wishlist silenciosamente
      if (error.statusCode === 401 || error.message?.includes('Auth session missing')) {
        wishlist.value = [];
        return;
      }

      // Para outros erros, logar mas não fazer throw para evitar uncaught
      console.error('Erro ao carregar wishlist:', error);
      wishlist.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Adicionar produto à wishlist
  const addToWishlist = async (productId: string) => {
    try {
      loading.value = true;
      const response = await $fetch('/api/wishlist', {
        method: 'POST',
        body: { productId },
      });

      if (response.success) {
        // Recarregar a wishlist para ter os dados atualizados
        await loadWishlist();
        return true;
      }
      return false;
    } catch (error: any) {
      // Se não estiver autenticado, não mostrar erro
      if (error.statusCode === 401 || error.message?.includes('Auth session missing')) {
        return false;
      }
      console.error('Erro ao adicionar à wishlist:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Remover produto da wishlist
  const removeFromWishlist = async (productId: string) => {
    try {
      loading.value = true;
      const response = await $fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });

      if (response.success) {
        // Remover do estado local
        wishlist.value = wishlist.value.filter(item => item.productId !== productId);
        return true;
      }
      return false;
    } catch (error: any) {
      // Se não estiver autenticado, não mostrar erro
      if (error.statusCode === 401 || error.message?.includes('Auth session missing')) {
        return false;
      }
      console.error('Erro ao remover da wishlist:', error);
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
  };

  return {
    wishlist: readonly(wishlist),
    loading: readonly(loading),
    wishlistCount,
    isEmpty,
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
};
