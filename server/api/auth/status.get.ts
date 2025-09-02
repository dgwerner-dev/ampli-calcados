import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async event => {
  try {
    const authUser = await serverSupabaseUser(event);

    if (!authUser) {
      return {
        authenticated: false,
        user: null,
        timestamp: new Date().toISOString(),
      };
    }

    // Consultar a tabela users para obter a role
    const supabase = await serverSupabaseClient(event);
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', authUser.id)
      .single();

    if (profileError) {
      console.error('❌ Erro ao carregar perfil do usuário:', profileError);
      return {
        authenticated: false,
        error: 'Erro ao carregar perfil do usuário',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      authenticated: !!userProfile,
      user: userProfile
        ? {
            id: userProfile.id,
            email: userProfile.email,
            role: userProfile.role,
          }
        : null,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Erro ao verificar status de autenticação:', error);
    return {
      authenticated: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
});
