import { serverSupabaseUser } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  try {
    // Verificar se o usuário está autenticado
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    // Obter ID do endereço da URL
    const addressId = getRouterParam(event, 'id');

    if (!addressId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do endereço é obrigatório',
      });
    }

    // Verificar se o endereço pertence ao usuário
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!address) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Endereço não encontrado',
      });
    }

    // Excluir endereço
    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    // Se o endereço excluído era o padrão, definir outro como padrão
    if (address.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });

      if (nextAddress) {
        await prisma.address.update({
          where: {
            id: nextAddress.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return {
      success: true,
      message: 'Endereço excluído com sucesso',
    };
  } catch (error: any) {
    console.error('Erro ao excluir endereço:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
