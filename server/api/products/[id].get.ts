import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  try {
    const productId = getRouterParam(event, 'id');
    
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do produto é obrigatório',
      });
    }

    const prisma = new PrismaClient();

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        images: true,
      },
    });

    await prisma.$disconnect();

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Produto não encontrado',
      });
    }

    return product;
  } catch (error: any) {
    console.error('Erro ao buscar produto:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erro interno do servidor',
    });
  }
});
