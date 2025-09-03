import { createSupabaseServerClient } from '~/utils/supabase-server';

export default defineEventHandler(async event => {
  try {
    console.log('Testando conexão com banco de dados...');

    const supabase = createSupabaseServerClient();
    console.log('Cliente Supabase criado com sucesso');

    // Testar conexão básica
    const { data, error } = await supabase.from('categories').select('count').limit(1);

    if (error) {
      console.error('Erro na conexão com Supabase:', error);
      return {
        success: false,
        error: error.message,
        details: error,
      };
    }

    return {
      success: true,
      message: 'Conexão com Supabase funcionando',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Erro geral:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }
});
