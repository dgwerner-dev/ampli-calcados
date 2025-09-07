import { PrismaClient } from '@prisma/client';

export const usePagBank = () => {
  const config = useRuntimeConfig();

  // Configurações do PagBank
  const PAGBANK_API_URLS = ['https://api.pagseguro.com', 'https://api.pagbank.com.br'];
  const PAGBANK_SANDBOX_URLS = [
    'https://sandbox.api.pagseguro.com',
    'https://sandbox.api.pagbank.com.br',
  ];

  const env = process.dev
    ? 'sandbox'
    : (config as any).pagbankEnvironment ||
      (config as any).public?.pagbankEnvironment ||
      'production';
  const isProduction = env === 'production';
  const baseUrls = isProduction ? PAGBANK_API_URLS : PAGBANK_SANDBOX_URLS;
  if (process.dev) {
    const devToken =
      '5eba6716-cef2-49d6-b6ad-d90f15dc9b372c60c92a43ad8001609703a994f1dd6e6dfb-2f6b-44b6-9573-aeb7a5ea8cf5';
    console.info(
      '[PagBank] Ambiente:',
      env,
      'Base primária:',
      baseUrls[0],
      'Token prefix*:',
      devToken.slice(0, 8),
      'len:',
      devToken.length
    );
  }

  // Faz requisição tentando múltiplos domínios em caso de falha de DNS
  const fetchWithFallback = async (path: string, options: any) => {
    let lastError: any = null;
    for (const url of baseUrls) {
      try {
        if (process.dev) {
          const auth = options?.headers?.Authorization || options?.headers?.authorization || '';
          const prefix = typeof auth === 'string' ? auth.replace('Bearer ', '').slice(0, 8) : '';
          console.info('[PagBank] requisicao', url + path, 'token*:', prefix);
        }
        return await $fetch(`${url}${path}`, options);
      } catch (err: any) {
        lastError = err;
        const message = String(err?.message || '');
        const isDnsError = err?.cause?.code === 'ENOTFOUND' || message.includes('ENOTFOUND');
        if (isDnsError) {
          console.warn(`[PagBank] DNS falhou para ${url}. Tentando próximo domínio...`);
          continue;
        }
        throw err;
      }
    }
    throw lastError || new Error('Falha ao contatar endpoints do PagBank');
  };

  // Headers padrão para requisições
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${
      (process.dev
        ? '5eba6716-cef2-49d6-b6ad-d90f15dc9b372c60c92a43ad8001609703a994f1dd6e6dfb-2f6b-44b6-9573-aeb7a5ea8cf5'
        : (config.pagbankAccessToken as string)
      )
        ?.toString()
        ?.trim() || ''
    }`,
    'x-idempotency-key': crypto.randomUUID(),
  });

  // Criar pedido no PagBank
  const createOrder = async (orderData: {
    reference_id: string;
    customer: {
      name: string;
      email: string;
      tax_id: string;
      phones: Array<{
        country: string;
        area: string;
        number: string;
      }>;
    };
    items: Array<{
      reference_id: string;
      name: string;
      quantity: number;
      unit_amount: number;
    }>;
    shipping: {
      address: {
        street: string;
        number: string;
        locality: string;
        city: string;
        region_code: string;
        country: string;
        postal_code: string;
      };
    };
    notification_urls: string[];
    charges: Array<{
      reference_id: string;
      description: string;
      amount: {
        value: number;
        currency: string;
      };
      payment_method: {
        type: string;
        installments?: number;
        capture?: boolean;
        card?: {
          number: string;
          exp_month: string;
          exp_year: string;
          security_code: string;
          holder: {
            name: string;
          };
        };
        soft_descriptor?: string;
      };
    }>;
  }) => {
    try {
      const response = await fetchWithFallback(`/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: orderData,
      });

      return response;
    } catch (error: any) {
      console.error('Erro ao criar pedido no PagBank:', error);
      throw new Error(
        error.data?.error_messages?.[0]?.description || 'Erro ao processar pagamento'
      );
    }
  };

  // Criar pedido com PIX
  const createPixOrder = async (orderData: {
    reference_id: string;
    customer: {
      name: string;
      email: string;
      tax_id: string;
      phones: Array<{
        country: string;
        area: string;
        number: string;
      }>;
    };
    items: Array<{
      reference_id: string;
      name: string;
      quantity: number;
      unit_amount: number;
    }>;
    shipping: {
      address: {
        street: string;
        number: string;
        locality: string;
        city: string;
        region_code: string;
        country: string;
        postal_code: string;
      };
    };
    notification_urls: string[];
    charges: Array<{
      reference_id: string;
      description: string;
      amount: {
        value: number;
        currency: string;
      };
      payment_method: {
        type: 'pix';
        expires_in: number;
      };
    }>;
  }) => {
    try {
      const response = await fetchWithFallback(`/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: orderData,
      });

      return response;
    } catch (error: any) {
      console.error('Erro ao criar pedido PIX no PagBank:', error);
      throw new Error(
        error.data?.error_messages?.[0]?.description || 'Erro ao processar pagamento PIX'
      );
    }
  };

  // Consultar status do pedido
  const getOrderStatus = async (orderId: string) => {
    try {
      const response = await fetchWithFallback(`/orders/${orderId}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      return response;
    } catch (error: any) {
      console.error('Erro ao consultar status do pedido:', error);
      throw new Error('Erro ao consultar status do pagamento');
    }
  };

  // Capturar pagamento (para pagamentos autorizados)
  const capturePayment = async (chargeId: string, amount?: number) => {
    try {
      const body = amount ? { amount: { value: amount, currency: 'BRL' } } : {};

      const response = await fetchWithFallback(`/charges/${chargeId}/capture`, {
        method: 'POST',
        headers: getHeaders(),
        body,
      });

      return response;
    } catch (error: any) {
      console.error('Erro ao capturar pagamento:', error);
      throw new Error('Erro ao capturar pagamento');
    }
  };

  // Cancelar pagamento
  const cancelPayment = async (chargeId: string, amount?: number) => {
    try {
      const body = amount ? { amount: { value: amount, currency: 'BRL' } } : {};

      const response = await fetchWithFallback(`/charges/${chargeId}/cancel`, {
        method: 'POST',
        headers: getHeaders(),
        body,
      });

      return response;
    } catch (error: any) {
      console.error('Erro ao cancelar pagamento:', error);
      throw new Error('Erro ao cancelar pagamento');
    }
  };

  // Reembolsar pagamento
  const refundPayment = async (chargeId: string, amount?: number) => {
    try {
      const body = amount ? { amount: { value: amount, currency: 'BRL' } } : {};

      const response = await fetchWithFallback(`/charges/${chargeId}/refund`, {
        method: 'POST',
        headers: getHeaders(),
        body,
      });

      return response;
    } catch (error: any) {
      console.error('Erro ao reembolsar pagamento:', error);
      throw new Error('Erro ao processar reembolso');
    }
  };

  // Webhook para receber notificações do PagBank
  const handleWebhook = async (webhookData: any) => {
    try {
      const { event, data } = webhookData;

      switch (event) {
        case 'PAYMENT_RECEIVED':
          await handlePaymentReceived(data);
          break;
        case 'PAYMENT_CONFIRMED':
          await handlePaymentConfirmed(data);
          break;
        case 'PAYMENT_DENIED':
          await handlePaymentDenied(data);
          break;
        case 'PAYMENT_CANCELLED':
          await handlePaymentCancelled(data);
          break;
        case 'PAYMENT_REFUNDED':
          await handlePaymentRefunded(data);
          break;
        default:
          console.log('Evento não tratado:', event);
      }
    } catch (error: any) {
      console.error('Erro ao processar webhook:', error);
      throw error;
    }
  };

  // Handlers para eventos do webhook
  const handlePaymentReceived = async (data: any) => {
    // Atualizar status do pedido e pagamento para PENDING
    await updateOrderStatus(data.reference_id, 'PENDING');
    await updatePaymentStatus(data.reference_id, 'PENDING');
  };

  const handlePaymentConfirmed = async (data: any) => {
    // Pedido CONFIRMED; Pagamento APPROVED
    await updateOrderStatus(data.reference_id, 'CONFIRMED');
    await updatePaymentStatus(data.reference_id, 'APPROVED');
  };

  const handlePaymentDenied = async (data: any) => {
    // Pedido CANCELLED; Pagamento REJECTED
    await updateOrderStatus(data.reference_id, 'CANCELLED');
    await updatePaymentStatus(data.reference_id, 'REJECTED');
  };

  const handlePaymentCancelled = async (data: any) => {
    // Pedido CANCELLED; Pagamento CANCELLED
    await updateOrderStatus(data.reference_id, 'CANCELLED');
    await updatePaymentStatus(data.reference_id, 'CANCELLED');
  };

  const handlePaymentRefunded = async (data: any) => {
    // Pedido não possui REFUNDED; mapear para CANCELLED; Pagamento REFUNDED
    await updateOrderStatus(data.reference_id, 'CANCELLED');
    await updatePaymentStatus(data.reference_id, 'REFUNDED');
  };

  // Atualizar status do pedido no banco
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const prisma = new PrismaClient();

      await prisma.order.update({
        where: { id: orderId },
        data: { status: status as any },
      });

      await prisma.$disconnect();
    } catch (error: any) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw error;
    }
  };

  // Atualizar status do pagamento (via Prisma)
  const updatePaymentStatus = async (orderId: string, status: string) => {
    try {
      const prisma = new PrismaClient();
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: status as any },
      });
      await prisma.$disconnect();
    } catch (error: any) {
      console.error('Erro ao atualizar status do pagamento:', error);
    }
  };

  return {
    createOrder,
    createPixOrder,
    getOrderStatus,
    capturePayment,
    cancelPayment,
    refundPayment,
    handleWebhook,
  };
};
