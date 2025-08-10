import { serverSupabaseUser } from '#supabase/server';
import { useOrderService } from '~/composables/usePrisma';

export default defineEventHandler(async event => {
  try {
    // Obter o usuário sem redirecionamento automático
    let user;
    try {
      user = await serverSupabaseUser(event);
    } catch (authError) {
      // Se houver erro de autenticação, retornar 401 sem redirecionamento
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    const orderService = useOrderService();
    const orders = await orderService.getUserOrders(user.id);

    return orders;
  } catch (error: any) {
    console.error('Erro ao buscar pedidos:', error);

    // Se for erro de autenticação, retornar 401
    if (
      error.statusCode === 401 ||
      error.message?.includes('authentication') ||
      error.message?.includes('Unauthorized')
    ) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar pedidos',
    });
  }
});
