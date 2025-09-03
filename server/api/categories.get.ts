import { createSupabaseServerClient } from '~/utils/supabase-server';

export default defineEventHandler(async event => {
  try {
    console.log('Iniciando busca por categorias...');

    const supabase = createSupabaseServerClient();
    console.log('Cliente Supabase criado com sucesso');

    // Primeiro, vamos verificar se a tabela categories existe
    const { data: tableCheck, error: tableError } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('Erro ao verificar tabela categories:', tableError);
      return {
        success: false,
        error: 'Tabela categories não encontrada',
        details: tableError.message,
      };
    }

    // Buscar todas as categorias
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro na consulta Supabase:', error);
      return {
        success: false,
        error: 'Erro ao buscar categorias',
        details: error.message,
      };
    }

    console.log(`Categorias encontradas: ${categories?.length || 0}`);

    return {
      success: true,
      categories: categories || [],
    };
  } catch (error: any) {
    console.error('Erro geral ao buscar categorias:', error);

    return {
      success: false,
      error: 'Erro interno do servidor',
      details: error.message || 'Erro desconhecido',
    };
  }
});
