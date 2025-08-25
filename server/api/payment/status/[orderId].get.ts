import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticação
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    const orderId = getRouterParam(event, 'orderId');

    // Buscar dados do pagamento
    const supabase = useSupabaseClient();
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('orderId', orderId)
      .eq('userId', user.id)
      .single();

    if (error || !payment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pagamento não encontrado',
      });
    }

    // Consultar status atualizado no PagBank
    const pagBank = usePagBank();
    const pagBankStatus = await pagBank.getOrderStatus(payment.pagBankOrderId);

    return {
      payment,
      pagBankStatus,
    };

  } catch (error: any) {
    console.error('Erro ao consultar status do pagamento:', error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro ao consultar status',
    });
  }
});
