export default defineEventHandler(async event => {
  try {
    console.log('Testando conectividade com Supabase...');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('URL do Supabase:', supabaseUrl);
    console.log('Chave configurada:', !!supabaseKey);
    
    // Testar se a URL é válida
    if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
      return {
        success: false,
        error: 'URL do Supabase inválida',
        url: supabaseUrl
      };
    }
    
    // Testar conectividade básica
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey || '',
          'Authorization': `Bearer ${supabaseKey || ''}`
        }
      });
      
      return {
        success: true,
        message: 'Conectividade OK',
        status: response.status,
        url: supabaseUrl,
        timestamp: new Date().toISOString()
      };
      
    } catch (fetchError: any) {
      return {
        success: false,
        error: 'Erro de conectividade',
        details: {
          message: fetchError.message,
          type: fetchError.constructor.name,
          url: supabaseUrl
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
