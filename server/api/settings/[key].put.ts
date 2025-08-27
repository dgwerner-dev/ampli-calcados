import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const key = getRouterParam(event, 'key');
    const body = await readBody(event);
    
    const { value, description } = body;

    if (!key) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Chave da configuração é obrigatória',
      });
    }

    if (value === undefined || value === null) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valor da configuração é obrigatório',
      });
    }

    const setting = await prisma.settings.upsert({
      where: { key },
      update: {
        value: String(value),
        description: description || null,
      },
      create: {
        key,
        value: String(value),
        description: description || null,
      },
    });

    return {
      success: true,
      setting: {
        key: setting.key,
        value: setting.value,
        description: setting.description,
      },
    };
  } catch (error: any) {
    console.error('Erro ao atualizar configuração:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
