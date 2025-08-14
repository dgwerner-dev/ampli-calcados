export default defineNuxtPlugin(async () => {
  // Aguardar o próximo tick para garantir que o router esteja pronto
  await nextTick();

  // Verificar se estamos no lado do cliente
  if (process.client) {
    const { initAuth } = useAuth();

    // Inicializar autenticação quando o app carregar
    // Usar try-catch para evitar erros que possam afetar o roteamento
    try {
      await initAuth();
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
    }
  }
});
