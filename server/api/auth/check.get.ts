import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async event => {
  try {
    console.log('🔍 Verificando autenticação do cliente...');
    
    // Tentar obter o usuário do servidor
    const serverUser = await serverSupabaseUser(event);
    
    // Obter headers para debug
    const headers = getHeaders(event);
    const cookies = headers.cookie;
    
    console.log('🍪 Cookies recebidos:', cookies ? 'Sim' : 'Não');
    console.log('👤 Usuário do servidor:', serverUser ? {
      id: serverUser.id,
      email: serverUser.email
    } : 'null');

    return {
      timestamp: new Date().toISOString(),
      serverAuthenticated: !!serverUser,
      serverUser: serverUser ? {
        id: serverUser.id,
        email: serverUser.email,
        role: serverUser.user_metadata?.role || 'USER'
      } : null,
      hasCookies: !!cookies,
      cookies: cookies ? 'present' : 'missing',
      message: 'Status de autenticação verificado'
    };
  } catch (error: any) {
    console.error('❌ Erro ao verificar autenticação:', error);
    return {
      timestamp: new Date().toISOString(),
      serverAuthenticated: false,
      serverUser: null,
      hasCookies: false,
      error: error.message,
      message: 'Erro ao verificar autenticação'
    };
  }
});
