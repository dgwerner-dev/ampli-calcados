import { serverSupabaseUser } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  try {
    // Obter o usuário autenticado
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

    // Obter o ID do pedido da URL
    const orderId = getRouterParam(event, 'id');

    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do pedido não fornecido',
      });
    }

    const prisma = new PrismaClient();

    // Buscar o pedido específico do usuário
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
        payments: true,
      },
    });

    await prisma.$disconnect();

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pedido não encontrado',
      });
    }

    return order;
  } catch (error: any) {
    console.error('Erro ao buscar pedido:', error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar pedido',
    });
  }
});
