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

    const body = await readBody(event);
    const { productId } = body;

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do produto é obrigatório',
      });
    }

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Produto não encontrado',
      });
    }

    // Verificar se já está na wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    if (existingItem) {
      return {
        success: true,
        message: 'Produto já está na lista de desejos',
      };
    }

    // Adicionar à wishlist
    await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId,
      },
    });

    return {
      success: true,
      message: 'Produto adicionado à lista de desejos',
    };
  } catch (error: any) {
    console.error('Erro ao adicionar à wishlist:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
