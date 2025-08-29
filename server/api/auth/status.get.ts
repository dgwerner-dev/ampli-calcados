import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async event => {
  try {
    const user = await serverSupabaseUser(event);
    
    return {
      authenticated: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'USER'
      } : null,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Erro ao verificar status de autenticação:', error);
    return {
      authenticated: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
});
