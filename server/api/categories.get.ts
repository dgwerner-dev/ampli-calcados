import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  try {
    const prisma = new PrismaClient();

    // Buscar todas as categorias
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    await prisma.$disconnect();

    return categories;
  } catch (error: any) {
    console.error('Erro ao buscar categorias:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar categorias',
    });
  }
});
