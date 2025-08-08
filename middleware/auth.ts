export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth();
  
  // Se não há usuário logado, redirecionar para login
  if (!user.value) {
    return navigateTo('/');
  }
  
  // Se a rota é administrativa e o usuário não é admin, redirecionar
  if (to.path.startsWith('/admin') && user.value.role !== 'ADMIN') {
    return navigateTo('/');
  }
});
