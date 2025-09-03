import { createSupabaseServerClient } from '~/utils/supabase-server';

export default defineEventHandler(async event => {
  try {
    console.log('Testando cliente Supabase...');
    
    // Testar criação do cliente
    let supabase;
    try {
      supabase = createSupabaseServerClient();
      console.log('Cliente Supabase criado com sucesso');
    } catch (clientError: any) {
      return {
        success: false,
        error: 'Erro ao criar cliente',
        details: clientError.message
      };
    }
    
    // Testar query simples
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      if (error) {
        return {
          success: false,
          error: 'Erro na query',
          details: {
            message: error.message,
            code: error.code,
            hint: error.hint
          }
        };
      }
      
      return {
        success: true,
        message: 'Cliente Supabase funcionando',
        data: data,
        timestamp: new Date().toISOString()
      };
      
    } catch (queryError: any) {
      return {
        success: false,
        error: 'Erro na execução da query',
        details: {
          message: queryError.message,
          type: queryError.constructor.name
        }
      };
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: 'Erro geral',
      details: error.message
    };
  }
});
