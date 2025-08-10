export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth();

  // Inicializar autenticação quando o app carregar
  // Usar try-catch para evitar erros que possam afetar o roteamento
  try {
    await initAuth();
  } catch (error) {
    console.error('Erro ao inicializar autenticação:', error);
  }
});
