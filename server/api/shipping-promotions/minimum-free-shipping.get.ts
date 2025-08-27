import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  try {
    // Buscar promoções de frete grátis ativas com menor valor mínimo
    const freeShippingPromotion = await prisma.shippingPromotion.findFirst({
      where: {
        isActive: true,
        freeShipping: true,
        OR: [
          {
            validUntil: {
              gte: new Date(),
            },
          },
          {
            validUntil: null,
          },
        ],
      },
      orderBy: {
        minOrderValue: 'asc',
      },
    });

    if (!freeShippingPromotion) {
      return {
        success: true,
        hasPromotion: false,
        promotion: null,
      };
    }

    return {
      success: true,
      hasPromotion: true,
      promotion: {
        id: freeShippingPromotion.id,
        name: freeShippingPromotion.name,
        minOrderValue: freeShippingPromotion.minOrderValue,
        description: freeShippingPromotion.description,
        validUntil: freeShippingPromotion.validUntil,
      },
    };
  } catch (error: any) {
    console.error('Erro ao buscar promoção de frete grátis:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
