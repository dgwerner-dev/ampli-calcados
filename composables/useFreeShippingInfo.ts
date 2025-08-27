export const useFreeShippingInfo = () => {
  const freeShippingInfo = ref<{
    hasPromotion: boolean;
    minOrderValue: number | null;
    message: string | null;
    promotionName: string | null;
  }>({
    hasPromotion: false,
    minOrderValue: null,
    message: null,
    promotionName: null,
  });

  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadFreeShippingInfo = async () => {
    // Só executar no cliente
    if (process.server) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch('/api/shipping-promotions/minimum-free-shipping');

      if (response.success && response.hasPromotion) {
        const promotion = response.promotion;

        freeShippingInfo.value = {
          hasPromotion: true,
          minOrderValue: promotion.minOrderValue,
          message: promotion.name,
          promotionName: promotion.name,
        };
      } else {
        freeShippingInfo.value = {
          hasPromotion: false,
          minOrderValue: null,
          message: null,
          promotionName: null,
        };
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar informações de frete grátis';
      console.error('Erro ao carregar informações de frete grátis:', err);

      // Fallback para valor padrão em caso de erro
      freeShippingInfo.value = {
        hasPromotion: false,
        minOrderValue: null,
        message: null,
        promotionName: null,
      };
    } finally {
      loading.value = false;
    }
  };

  return {
    freeShippingInfo: readonly(freeShippingInfo),
    loading: readonly(loading),
    error: readonly(error),
    loadFreeShippingInfo,
  };
};
