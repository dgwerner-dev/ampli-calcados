import { usePagBank } from '~/composables/usePagBank';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Verificar assinatura do webhook (recomendado para produção)
    const signature = getHeader(event, 'x-pagbank-signature');
    if (!signature) {
      console.warn('Webhook sem assinatura recebido');
    }

    // Processar webhook
    const pagBank = usePagBank();
    await pagBank.handleWebhook(body);

    return { success: true };

  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    
    // Retornar 200 mesmo com erro para não reenviar o webhook
    return { success: false, error: error.message };
  }
});
