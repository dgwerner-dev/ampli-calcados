export default defineNuxtPlugin(async () => {
  // Aguardar o próximo tick para garantir que o router esteja pronto
  await nextTick();

  // Verificar se estamos no lado do cliente
  if (process.client) {
    const { initAuth, refreshUserState } = useAuth();
    const supabase = useSupabaseClient();

    // Inicializar autenticação quando o app carregar
    // Usar try-catch para evitar erros que possam afetar o roteamento
    try {
      await initAuth();
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
    }

    // Listener para mudanças de autenticação
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        // Quando o usuário fizer logout, redirecionar para a página inicial
        const router = useRouter();
        await router.push('/');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Atualizar estado do usuário quando fizer login ou refresh do token
        await refreshUserState();
      }
    });
  }
});
