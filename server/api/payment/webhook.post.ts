import { usePagBank } from '~/composables/usePagBank';
import crypto from 'node:crypto';

export default defineEventHandler(async event => {
  try {
    const config = useRuntimeConfig();

    // Ler corpo CRU para validar assinatura
    const rawBody = await readRawBody(event, 'utf8');
    const signature = getHeader(event, 'x-pagbank-signature') || getHeader(event, 'x-pagseguro-signature') || '';

    if (config.pagbankWebhookSecret) {
      try {
        const expected = crypto
          .createHmac('sha256', config.pagbankWebhookSecret)
          .update(rawBody || '')
          .digest('hex');
        if (expected !== signature) {
          console.warn('Assinatura webhook inválida:', { expected, received: signature });
          throw createError({ statusCode: 401, statusMessage: 'Assinatura inválida' });
        }
      } catch (err) {
        console.error('Erro na validação da assinatura webhook:', err);
        throw createError({ statusCode: 401, statusMessage: 'Assinatura inválida' });
      }
    }

    const body = rawBody ? JSON.parse(rawBody as string) : {};

    const pagBank = usePagBank();
    await pagBank.handleWebhook(body);

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);

    // Retornar 200 mesmo com erro para não reenviar o webhook
    return { success: false, error: error.message };
  }
});
