import { serverSupabaseUser } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  try {
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    const productId = getRouterParam(event, 'productId');

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do produto é obrigatório',
      });
    }

    // Verificar se o item existe na wishlist
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    if (!wishlistItem) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Item não encontrado na lista de desejos',
      });
    }

    // Remover da wishlist
    await prisma.wishlistItem.delete({
      where: {
        id: wishlistItem.id,
      },
    });

    return {
      success: true,
      message: 'Produto removido da lista de desejos',
    };
  } catch (error: any) {
    console.error('Erro ao remover da wishlist:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
