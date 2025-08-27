export default defineNuxtRouteMiddleware(to => {
  // Aplicar apenas no lado do cliente para evitar problemas de SSR
  if (process.client) {
    // Verificar se a rota específica requer autenticação
    if (to.meta.requiresAuth) {
      const { isAuthenticated } = useAuth();

      // Se não estiver autenticado, redirecionar para home
      if (!isAuthenticated.value) {
        return navigateTo('/');
      }
    }

    // Verificar se a rota requer role de admin
    if (to.meta.requiresAdmin) {
      const { isAdmin } = useAuth();

      // Se não for admin, redirecionar para home
      if (!isAdmin.value) {
        return navigateTo('/');
      }
    }
  }
});
