export const usePagBank = () => {
  const config = useRuntimeConfig();
  const supabase = useSupabaseClient();

  // Configurações do PagBank
  const PAGBANK_API_URL = 'https://api.pagbank.com.br';
  const PAGBANK_SANDBOX_URL = 'https://sandbox.api.pagbank.com.br';

  const isProduction = config.public.pagbankEnvironment === 'production';
  const baseUrl = isProduction ? PAGBANK_API_URL : PAGBANK_SANDBOX_URL;

  // Headers padrão para requisições
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.pagbankAccessToken}`,
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
      const response = await $fetch(`${baseUrl}/orders`, {
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
      const response = await $fetch(`${baseUrl}/orders`, {
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
      const response = await $fetch(`${baseUrl}/orders/${orderId}`, {
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

      const response = await $fetch(`${baseUrl}/charges/${chargeId}/capture`, {
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

      const response = await $fetch(`${baseUrl}/charges/${chargeId}/cancel`, {
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

      const response = await $fetch(`${baseUrl}/charges/${chargeId}/refund`, {
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
    // Atualizar status do pedido para PENDING
    await updateOrderStatus(data.reference_id, 'PENDING');
  };

  const handlePaymentConfirmed = async (data: any) => {
    // Atualizar status do pedido para CONFIRMED
    await updateOrderStatus(data.reference_id, 'CONFIRMED');
  };

  const handlePaymentDenied = async (data: any) => {
    // Atualizar status do pedido para CANCELLED
    await updateOrderStatus(data.reference_id, 'CANCELLED');
  };

  const handlePaymentCancelled = async (data: any) => {
    // Atualizar status do pedido para CANCELLED
    await updateOrderStatus(data.reference_id, 'CANCELLED');
  };

  const handlePaymentRefunded = async (data: any) => {
    // Atualizar status do pedido para REFUNDED
    await updateOrderStatus(data.reference_id, 'REFUNDED');
  };

  // Atualizar status do pedido no banco
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw error;
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
