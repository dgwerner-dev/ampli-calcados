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
    charges?: Array<{
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
        boleto?: {
          due_date: string;
          instruction_lines: {
            line_1: string;
            line_2: string;
          };
          holder: {
            name: string;
            tax_id: string;
            email: string;
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
        };
        soft_descriptor?: string;
        authentication_method?: {
          type: string;
          id: string;
        };
      };
    }>;
    qr_codes?: Array<{
      amount: {
        value: number;
        currency: string;
      };
      expires_in: number;
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

  // Tokenizar cartão
  const tokenizeCard = async (cardData: {
    number: string;
    exp_month: string;
    exp_year: string;
    security_code: string;
    holder: {
      name: string;
    };
  }) => {
    try {
      const response = await fetchWithFallback(`/cards`, {
        method: 'POST',
        headers: getHeaders(),
        body: cardData,
      });

      return response;
    } catch (error: any) {
      console.error('Erro ao tokenizar cartão:', error);
      throw new Error('Erro ao tokenizar cartão');
    }
  };

  // Consultar pedidos por parâmetros
  const getOrdersByParams = async (params: {
    reference_id?: string;
    status?: string;
    created_at?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetchWithFallback(`/orders?${queryParams.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      return response;
    } catch (error: any) {
      console.error('Erro ao consultar pedidos:', error);
      throw new Error('Erro ao consultar pedidos');
    }
  };

  // Consultar pagamento específico
  const getPayment = async (chargeId: string) => {
    try {
      const response = await fetchWithFallback(`/charges/${chargeId}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      return response;
    } catch (error: any) {
      console.error('Erro ao consultar pagamento:', error);
      throw new Error('Erro ao consultar pagamento');
    }
  };

  // Criar sessão de autenticação 3DS
  const create3DSSession = async (orderId: string) => {
    try {
      const response = await fetchWithFallback(`/orders/${orderId}/3ds-sessions`, {
        method: 'POST',
        headers: getHeaders(),
        body: {
          order_id: orderId,
        },
      });

      return response;
    } catch (error: any) {
      console.error('Erro ao criar sessão 3DS:', error);
      throw new Error('Erro ao criar sessão 3DS');
    }
  };

  // Webhook para receber notificações do PagBank
  const handleWebhook = async (webhookData: any) => {
    try {
      const { event, data } = webhookData;

      switch (event) {
        case 'ORDER_CREATED':
          await handleOrderCreated(data);
          break;
        case 'ORDER_PAID':
          await handleOrderPaid(data);
          break;
        case 'ORDER_CANCELED':
          await handleOrderCanceled(data);
          break;
        case 'CHARGE_PAID':
          await handleChargePaid(data);
          break;
        case 'CHARGE_CANCELED':
          await handleChargeCanceled(data);
          break;
        case 'CHARGE_REFUNDED':
          await handleChargeRefunded(data);
          break;
        case 'CHARGE_DENIED':
          await handleChargeDenied(data);
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
  const handleOrderCreated = async (data: any) => {
    // Pedido criado no PagBank
    await updateOrderStatus(data.reference_id, 'PENDING');
  };

  const handleOrderPaid = async (data: any) => {
    // Pedido pago completamente
    await updateOrderStatus(data.reference_id, 'CONFIRMED');
    await updatePaymentStatus(data.reference_id, 'APPROVED');
  };

  const handleOrderCanceled = async (data: any) => {
    // Pedido cancelado
    await updateOrderStatus(data.reference_id, 'CANCELLED');
    await updatePaymentStatus(data.reference_id, 'CANCELLED');
  };

  const handleChargePaid = async (data: any) => {
    // Cobrança específica paga
    await updatePaymentStatus(data.reference_id, 'APPROVED');
  };

  const handleChargeCanceled = async (data: any) => {
    // Cobrança cancelada
    await updatePaymentStatus(data.reference_id, 'CANCELLED');
  };

  const handleChargeRefunded = async (data: any) => {
    // Cobrança reembolsada
    await updatePaymentStatus(data.reference_id, 'REFUNDED');
  };

  const handleChargeDenied = async (data: any) => {
    // Cobrança negada
    await updatePaymentStatus(data.reference_id, 'REJECTED');
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
    getOrdersByParams,
    getPayment,
    capturePayment,
    cancelPayment,
    refundPayment,
    tokenizeCard,
    create3DSSession,
    handleWebhook,
  };
};
