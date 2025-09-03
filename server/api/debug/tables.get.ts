import { createSupabaseServerClient } from '~/utils/supabase-server';

export default defineEventHandler(async event => {
  try {
    console.log('Listando tabelas disponíveis...');

    const supabase = createSupabaseServerClient();

    // Listar todas as tabelas
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      console.error('Erro ao listar tabelas:', error);
      return {
        success: false,
        error: error.message,
        details: error,
      };
    }

    const tableNames = tables?.map(t => t.table_name) || [];

    return {
      success: true,
      tables: tableNames,
      count: tableNames.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Erro ao listar tabelas:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }
});
