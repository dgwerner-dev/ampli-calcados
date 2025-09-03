import { createSupabaseServerClient } from '~/utils/supabase-server';

export default defineEventHandler(async event => {
  try {
    console.log('Testando conexão com Supabase...');
    
    const supabase = createSupabaseServerClient();
    
    // Testar conexão básica
    const { data: connectionTest, error: connectionError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('Erro na conexão:', connectionError);
      return {
        success: false,
        error: 'Erro de conexão',
        details: {
          message: connectionError.message,
          code: connectionError.code,
          hint: connectionError.hint,
          details: connectionError.details
        }
      };
    }
    
    // Testar cada tabela individualmente
    const tables = ['categories', 'products', 'shipping_promotions'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        results[table] = {
          exists: !error,
          error: error ? {
            message: error.message,
            code: error.code,
            hint: error.hint
          } : null,
          data: data ? 'Tabela acessível' : 'Sem dados'
        };
      } catch (err) {
        results[table] = {
          exists: false,
          error: {
            message: err.message,
            code: 'EXCEPTION'
          }
        };
      }
    }
    
    return {
      success: true,
      connection: 'OK',
      tables: results,
      timestamp: new Date().toISOString()
    };
    
  } catch (error: any) {
    console.error('Erro geral:', error);
    return {
      success: false,
      error: 'Erro geral',
      details: {
        message: error.message,
        stack: error.stack
      }
    };
  }
});
