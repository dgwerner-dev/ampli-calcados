import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async event => {
  try {
    const supabase = await serverSupabaseClient(event);

    // Buscar todos os produtos
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao buscar produtos',
      });
    }

    return products || [];
  } catch (error: any) {
    console.error('Erro na API de produtos:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erro interno do servidor',
    });
  }
});
