import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: 'free_shipping_alert' },
    });

    return {
      success: true,
      enabled: setting?.value === 'true' || false,
      setting: setting
        ? {
            key: setting.key,
            value: setting.value,
            description: setting.description,
          }
        : null,
    };
  } catch (error: any) {
    console.error('Erro ao buscar configuração do alerta de frete grátis:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
