import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const settings = await prisma.settings.findMany({
      orderBy: {
        key: 'asc',
      },
    });

    // Converter para objeto para facilitar o uso
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value,
        description: setting.description,
      };
      return acc;
    }, {} as Record<string, { value: string; description: string | null }>);

    return {
      success: true,
      settings: settingsObject,
    };
  } catch (error: any) {
    console.error('Erro ao buscar configurações:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
