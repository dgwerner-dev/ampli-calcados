import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  try {
    const prisma = new PrismaClient();

    // Buscar produtos em destaque
    const products = await prisma.product.findMany({
      where: {
        featured: true,
        isActive: true,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    });

    await prisma.$disconnect();

    return products;
  } catch (error: any) {
    console.error('Erro ao buscar produtos em destaque:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar produtos em destaque',
    });
  }
});
