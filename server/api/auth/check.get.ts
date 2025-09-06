import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async event => {
  try {
    // Tentar obter o usuário do servidor
    const serverUser = await serverSupabaseUser(event);

    // Obter headers para debug
    const headers = getHeaders(event);
    const cookies = headers.cookie;

    let userProfile = null;

    if (serverUser) {
      // Consultar a tabela users para obter a role
      const supabase = await serverSupabaseClient(event);
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('id', serverUser.id)
        .single();

      if (!profileError && profile) {
        userProfile = profile;
      }
    }

    return {
      timestamp: new Date().toISOString(),
      serverAuthenticated: !!serverUser,
      serverUser: userProfile
        ? {
            id: userProfile.id,
            email: userProfile.email,
            role: userProfile.role,
          }
        : null,
      hasCookies: !!cookies,
      cookies: cookies ? 'present' : 'missing',
      message: 'Status de autenticação verificado',
    };
  } catch (error: any) {
    console.error('❌ Erro ao verificar autenticação:', error);
    return {
      timestamp: new Date().toISOString(),
      serverAuthenticated: false,
      serverUser: null,
      hasCookies: false,
      error: error.message,
      message: 'Erro ao verificar autenticação',
    };
  }
});
