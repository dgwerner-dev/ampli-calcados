import { createSupabaseServerClient } from '~/utils/supabase-server';

export default defineEventHandler(async event => {
  try {
    console.log('Iniciando busca por promoção de frete grátis...');

    const supabase = createSupabaseServerClient();
    console.log('Cliente Supabase criado com sucesso');

    // Primeiro, vamos verificar se a tabela shipping_promotions existe
    const { data: tableCheck, error: tableError } = await supabase
      .from('shipping_promotions')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('Erro ao verificar tabela shipping_promotions:', tableError);
      return {
        success: false,
        error: 'Tabela shipping_promotions não encontrada',
        details: tableError.message,
      };
    }

    // Buscar promoções de frete grátis ativas com menor valor mínimo
    const { data: freeShippingPromotion, error } = await supabase
      .from('shipping_promotions')
      .select('*')
      .eq('isActive', true)
      .eq('freeShipping', true)
      .or('validUntil.gte.' + new Date().toISOString() + ',validUntil.is.null')
      .order('minOrderValue', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error('Erro na consulta Supabase:', error);
      // Se não houver promoções, retornar sucesso sem promoção
      if (error.code === 'PGRST116') {
        // No rows returned
        return {
          success: true,
          hasPromotion: false,
          promotion: null,
        };
      }
      return {
        success: false,
        error: 'Erro ao buscar promoções',
        details: error.message,
      };
    }

    console.log('Promoção encontrada:', freeShippingPromotion);

    if (!freeShippingPromotion) {
      return {
        success: true,
        hasPromotion: false,
        promotion: null,
      };
    }

    return {
      success: true,
      hasPromotion: true,
      promotion: {
        id: (freeShippingPromotion as any).id,
        name: (freeShippingPromotion as any).name,
        minOrderValue: (freeShippingPromotion as any).minOrderValue,
        description: (freeShippingPromotion as any).description,
        validUntil: (freeShippingPromotion as any).validUntil,
      },
    };
  } catch (error: any) {
    console.error('Erro geral ao buscar promoção de frete grátis:', error);

    // Retornar erro mais específico
    if (error.code === 'PGRST116') {
      return {
        success: true,
        hasPromotion: false,
        promotion: null,
      };
    }

    return {
      success: false,
      error: 'Erro interno do servidor',
      details: error.message || 'Erro desconhecido',
    };
  }
});
