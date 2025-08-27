import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    const { name, description, minOrderValue, freeShipping, discountValue, validUntil, isActive } =
      body;

    // Validação básica
    if (!name || !minOrderValue) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nome e valor mínimo são obrigatórios',
      });
    }

    // Atualizar promoção usando Prisma
    const promotion = await prisma.shippingPromotion.update({
      where: { id },
      data: {
        name,
        description,
        minOrderValue: parseFloat(minOrderValue),
        freeShipping,
        discountValue: freeShipping ? 0 : parseFloat(discountValue || '0'),
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive,
      },
    });

    return {
      success: true,
      promotion,
      message: 'Promoção atualizada com sucesso! As informações de frete grátis foram atualizadas.',
    };
  } catch (error: any) {
    console.error('Erro ao atualizar promoção:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
