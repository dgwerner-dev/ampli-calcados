import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const key = getRouterParam(event, 'key');

    if (!key) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Chave da configuração é obrigatória',
      });
    }

    const setting = await prisma.settings.findUnique({
      where: { key },
    });

    if (!setting) {
      return {
        key,
        value: null,
        exists: false,
      };
    }

    return {
      key: setting.key,
      value: setting.value,
      description: setting.description,
      exists: true,
    };
  } catch (error: any) {
    console.error('Erro ao buscar configuração:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
