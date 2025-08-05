export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  
  // Se a rota requer autenticação e o usuário não está logado
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Redirecionar para login
    return navigateTo('/login')
  }
  
  // Se o usuário está logado e tenta acessar páginas de auth
  if (to.meta.guest && isAuthenticated.value) {
    // Redirecionar para home
    return navigateTo('/')
  }
}) 