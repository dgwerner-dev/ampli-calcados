export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth()
  
  // Inicializar autenticação quando o app carregar
  await initAuth()
}) 