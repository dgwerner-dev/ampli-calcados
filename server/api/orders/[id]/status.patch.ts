import { serverSupabaseUser } from '#supabase/server';
import { PrismaClient } from '@prisma/client';
import { getRouterParam } from 'h3';

export default defineEventHandler(async event => {
  try {
    // Obter o usuário autenticado
    let user;
    try {
      user = await serverSupabaseUser(event);
      console.log('Usuário autenticado:', user?.id);
    } catch (authError) {
      console.error('Erro de autenticação:', authError);
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    if (!user) {
      console.log('Usuário não encontrado');
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

    // Obter o corpo da requisição
    const body = await readBody(event);
    const { status } = body;

    if (!status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Status não fornecido',
      });
    }

    // Validar status permitidos
    const allowedStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Status inválido',
      });
    }

    const prisma = new PrismaClient();

    try {
      // Verificar se o pedido pertence ao usuário
      const existingOrder = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: user.id,
        },
      });

      if (!existingOrder) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Pedido não encontrado',
        });
      }

      // Atualizar o status do pedido
      const updatedOrder = await prisma.order.update({
        where: {
          id: orderId,
          userId: user.id, // Garantir que o pedido pertence ao usuário
        },
        data: {
          status: status as any,
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
        },
      });

      return {
        success: true,
        order: updatedOrder,
      };
    } finally {
      await prisma.$disconnect();
    }
  } catch (error: any) {
    console.error('Erro ao atualizar status do pedido:', error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao atualizar status do pedido',
    });
  }
});
