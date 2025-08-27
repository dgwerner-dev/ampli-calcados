export default defineNuxtRouteMiddleware(async to => {
  // Aplicar apenas no lado do cliente para evitar problemas de SSR
  if (process.client) {
    const { isAuthenticated, isAdmin, initAuth } = useAuth();

    // Inicializar autenticação se necessário
    await initAuth();

    // Verificar se a rota específica requer autenticação
    if (to.meta.requiresAuth) {
      // Se não estiver autenticado, redirecionar para login
      if (!isAuthenticated.value) {
        return navigateTo('/login');
      }
    }

    // Verificar se a rota requer role de admin
    if (to.meta.requiresAdmin) {
      // Se não for admin, redirecionar para home
      if (!isAdmin.value) {
        return navigateTo('/');
      }
    }
  }
});
