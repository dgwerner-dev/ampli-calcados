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

    // Obter o ID do endereço da URL
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

    // Remover o status de padrão de todos os endereços do usuário
    await prisma.address.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        isDefault: false,
      },
    });

    // Definir o endereço selecionado como padrão
    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        isDefault: true,
      },
    });

    return {
      address: updatedAddress,
    };
  } catch (error: any) {
    console.error('Erro ao definir endereço como padrão:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
