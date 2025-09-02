import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async event => {
  try {
    const user = await serverSupabaseUser(event);

    if (!user) {
      return {
        error: 'Usuário não autenticado',
        timestamp: new Date().toISOString(),
      };
    }

    console.log('🔍 Debug - Usuário autenticado:', {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
    });

    // Consultar diretamente a tabela users
    const supabase = await serverSupabaseClient(event);

    // Consulta simples para testar
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', user.id)
      .single();

    console.log('🔍 Debug - Dados do banco:', {
      userProfile,
      error,
    });

    return {
      timestamp: new Date().toISOString(),
      authUser: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
      dbProfile: userProfile,
      dbError: error,
      message: 'Debug do perfil do usuário',
    };
  } catch (error: any) {
    console.error('❌ Erro ao debugar perfil do usuário:', error);
    return {
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
});
