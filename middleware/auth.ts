export default defineNuxtRouteMiddleware((to) => {
  // Temporariamente desabilitado para debug
  return;
  
  // const { user } = useAuth();
  
  // // Se a rota é administrativa
  // if (to.path.startsWith('/admin')) {
  //   // Se não há usuário logado, redirecionar para home
  //   if (!user.value) {
  //     return navigateTo('/');
  //   }
  
  //   // Se o usuário não é admin, redirecionar para home
  //   if (user.value.role !== 'ADMIN') {
  //     return navigateTo('/');
  //   }
  // }
});
