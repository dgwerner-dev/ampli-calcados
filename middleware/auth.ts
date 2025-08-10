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
  }
});
