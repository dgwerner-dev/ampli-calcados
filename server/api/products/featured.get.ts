import { createSupabaseServerClient } from '~/utils/supabase-server';

export default defineEventHandler(async event => {
  try {
    console.log('Iniciando busca por produtos em destaque...');

    const supabase = createSupabaseServerClient();
    console.log('Cliente Supabase criado com sucesso');

    // Primeiro, vamos verificar se a tabela products existe
    const { data: tableCheck, error: tableError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('Erro ao verificar tabela products:', tableError);
      return {
        success: false,
        error: 'Tabela products não encontrada',
        details: tableError.message,
      };
    }

    // Buscar produtos em destaque com consulta mais simples
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, description, price, "salePrice", images, slug, featured, "isActive"')
      .eq('featured', true)
      .eq('isActive', true)
      .order('createdAt', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Erro na consulta Supabase:', error);
      return {
        success: false,
        error: 'Erro ao buscar produtos',
        details: error.message,
      };
    }

    console.log(`Produtos em destaque encontrados: ${products?.length || 0}`);

    // Se não houver produtos em destaque, retornar array vazio
    if (!products || products.length === 0) {
      return {
        success: true,
        products: [],
        message: 'Nenhum produto em destaque encontrado',
      };
    }

    return {
      success: true,
      products: products,
    };
  } catch (error: any) {
    console.error('Erro geral ao buscar produtos em destaque:', error);

    return {
      success: false,
      error: 'Erro interno do servidor',
      details: error.message || 'Erro desconhecido',
    };
  }
});
