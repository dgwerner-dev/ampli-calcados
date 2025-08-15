import { ref, computed } from 'vue';
import { useSupabaseClient } from '@supabase/auth-helpers-nuxt';

export const useShippingPromotions = () => {
  const supabase = useSupabaseClient();

  // Estados
  const shippingPromotions = ref([]);
  const shippingRegions = ref([]);
  const shippingProducts = ref([]);
  const shippingCategories = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Carregar promoções de frete
  const loadShippingPromotions = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('shipping_promotions')
        .select('*')
        .order('createdAt', { ascending: false });

      if (fetchError) throw fetchError;
      shippingPromotions.value = data || [];
    } catch (err) {
      error.value = err.message || 'Erro ao carregar promoções de frete';
    } finally {
      loading.value = false;
    }
  };

  // Carregar regiões de frete
  const loadShippingRegions = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('shipping_regions')
        .select(
          `
          *,
          shipping_promotion:shipping_promotions(name)
        `
        )
        .order('name');

      if (fetchError) throw fetchError;
      shippingRegions.value = data || [];
    } catch (err) {
      console.error('Erro ao carregar regiões:', err);
    }
  };

  // Carregar produtos de frete
  const loadShippingProducts = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('shipping_products')
        .select(
          `
          *,
          product:products(name, code, images),
          shipping_promotion:shipping_promotions(name)
        `
        )
        .order('createdAt', { ascending: false });

      if (fetchError) throw fetchError;
      shippingProducts.value = data || [];
    } catch (err) {
      console.error('Erro ao carregar produtos de frete:', err);
    }
  };

  // Carregar categorias de frete
  const loadShippingCategories = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('shipping_categories')
        .select(
          `
          *,
          category:categories(name),
          shipping_promotion:shipping_promotions(name)
        `
        )
        .order('createdAt', { ascending: false });

      if (fetchError) throw fetchError;
      shippingCategories.value = data || [];
    } catch (err) {
      console.error('Erro ao carregar categorias de frete:', err);
    }
  };

  // Criar promoção de frete
  const createShippingPromotion = async promotionData => {
    try {
      const { data, error: createError } = await supabase
        .from('shipping_promotions')
        .insert([promotionData])
        .select()
        .single();

      if (createError) throw createError;

      await loadShippingPromotions();
      return data;
    } catch (err) {
      error.value = err.message || 'Erro ao criar promoção de frete';
      throw err;
    }
  };

  // Atualizar promoção de frete
  const updateShippingPromotion = async (id, promotionData) => {
    try {
      const { data, error: updateError } = await supabase
        .from('shipping_promotions')
        .update(promotionData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await loadShippingPromotions();
      return data;
    } catch (err) {
      error.value = err.message || 'Erro ao atualizar promoção de frete';
      throw err;
    }
  };

  // Deletar promoção de frete
  const deleteShippingPromotion = async id => {
    try {
      const { error: deleteError } = await supabase
        .from('shipping_promotions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await loadShippingPromotions();
    } catch (err) {
      error.value = err.message || 'Erro ao deletar promoção de frete';
      throw err;
    }
  };

  // Criar região de frete
  const createShippingRegion = async regionData => {
    try {
      const { data, error: createError } = await supabase
        .from('shipping_regions')
        .insert([regionData])
        .select()
        .single();

      if (createError) throw createError;

      await loadShippingRegions();
      return data;
    } catch (err) {
      error.value = err.message || 'Erro ao criar região de frete';
      throw err;
    }
  };

  // Atualizar região de frete
  const updateShippingRegion = async (id, regionData) => {
    try {
      const { data, error: updateError } = await supabase
        .from('shipping_regions')
        .update(regionData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await loadShippingRegions();
      return data;
    } catch (err) {
      error.value = err.message || 'Erro ao atualizar região de frete';
      throw err;
    }
  };

  // Deletar região de frete
  const deleteShippingRegion = async id => {
    try {
      const { error: deleteError } = await supabase.from('shipping_regions').delete().eq('id', id);

      if (deleteError) throw deleteError;

      await loadShippingRegions();
    } catch (err) {
      error.value = err.message || 'Erro ao deletar região de frete';
      throw err;
    }
  };

  // Adicionar produto à promoção
  const addProductToPromotion = async (productId, promotionId) => {
    try {
      const { data, error: createError } = await supabase
        .from('shipping_products')
        .insert([
          {
            productId,
            shippingPromotionId: promotionId,
            isActive: true,
          },
        ])
        .select()
        .single();

      if (createError) throw createError;

      await loadShippingProducts();
      return data;
    } catch (err) {
      error.value = err.message || 'Erro ao adicionar produto à promoção';
      throw err;
    }
  };

  // Remover produto da promoção
  const removeProductFromPromotion = async (productId, promotionId) => {
    try {
      const { error: deleteError } = await supabase
        .from('shipping_products')
        .delete()
        .eq('productId', productId)
        .eq('shippingPromotionId', promotionId);

      if (deleteError) throw deleteError;

      await loadShippingProducts();
    } catch (err) {
      error.value = err.message || 'Erro ao remover produto da promoção';
      throw err;
    }
  };

  // Adicionar categoria à promoção
  const addCategoryToPromotion = async (categoryId, promotionId) => {
    try {
      const { data, error: createError } = await supabase
        .from('shipping_categories')
        .insert([
          {
            categoryId,
            shippingPromotionId: promotionId,
            isActive: true,
          },
        ])
        .select()
        .single();

      if (createError) throw createError;

      await loadShippingCategories();
      return data;
    } catch (err) {
      error.value = err.message || 'Erro ao adicionar categoria à promoção';
      throw err;
    }
  };

  // Remover categoria da promoção
  const removeCategoryFromPromotion = async (categoryId, promotionId) => {
    try {
      const { error: deleteError } = await supabase
        .from('shipping_categories')
        .delete()
        .eq('categoryId', categoryId)
        .eq('shippingPromotionId', promotionId);

      if (deleteError) throw deleteError;

      await loadShippingCategories();
    } catch (err) {
      error.value = err.message || 'Erro ao remover categoria da promoção';
      throw err;
    }
  };

  // Verificar se produto tem frete grátis
  const checkProductFreeShipping = async (productId, zipCode, orderValue) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('shipping_products')
        .select(
          `
          *,
          shipping_promotion:shipping_promotions(
            minOrderValue,
            freeShipping,
            discountValue,
            isActive
          )
        `
        )
        .eq('productId', productId)
        .eq('isActive', true)
        .eq('shipping_promotion.isActive', true);

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const promotion = data[0].shipping_promotion;
        return {
          hasFreeShipping: promotion.freeShipping && orderValue >= promotion.minOrderValue,
          discountValue: promotion.discountValue,
          minOrderValue: promotion.minOrderValue,
        };
      }

      return {
        hasFreeShipping: false,
        discountValue: 0,
        minOrderValue: 0,
      };
    } catch (err) {
      console.error('Erro ao verificar frete grátis:', err);
      return {
        hasFreeShipping: false,
        discountValue: 0,
        minOrderValue: 0,
      };
    }
  };

  // Verificar frete por região
  const checkRegionFreeShipping = async (zipCode, orderValue) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('shipping_regions')
        .select(
          `
          *,
          shipping_promotion:shipping_promotions(
            minOrderValue,
            freeShipping,
            discountValue,
            isActive
          )
        `
        )
        .eq('isActive', true)
        .eq('shipping_promotion.isActive', true)
        .gte('zipCodeStart', zipCode)
        .lte('zipCodeEnd', zipCode);

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const region = data[0];
        const promotion = region.shipping_promotion;
        return {
          hasFreeShipping: promotion.freeShipping && orderValue >= region.minOrderValue,
          discountValue: promotion.discountValue,
          minOrderValue: region.minOrderValue,
          regionName: region.name,
        };
      }

      return {
        hasFreeShipping: false,
        discountValue: 0,
        minOrderValue: 0,
        regionName: null,
      };
    } catch (err) {
      console.error('Erro ao verificar frete por região:', err);
      return {
        hasFreeShipping: false,
        discountValue: 0,
        minOrderValue: 0,
        regionName: null,
      };
    }
  };

  return {
    // Estados
    shippingPromotions,
    shippingRegions,
    shippingProducts,
    shippingCategories,
    loading,
    error,

    // Métodos
    loadShippingPromotions,
    loadShippingRegions,
    loadShippingProducts,
    loadShippingCategories,
    createShippingPromotion,
    updateShippingPromotion,
    deleteShippingPromotion,
    createShippingRegion,
    updateShippingRegion,
    deleteShippingRegion,
    addProductToPromotion,
    removeProductFromPromotion,
    addCategoryToPromotion,
    removeCategoryFromPromotion,
    checkProductFreeShipping,
    checkRegionFreeShipping,
  };
};
