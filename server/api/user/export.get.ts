import { serverSupabaseUser } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  const prisma = new PrismaClient();
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Usuário não autenticado' });
    }

    const [profile, addresses, orders, payments, wishlist] = await Promise.all([
      prisma.user.findUnique({ where: { id: user.id } }),
      prisma.address.findMany({ where: { userId: user.id } }),
      prisma.order.findMany({
        where: { userId: user.id },
        include: { orderItems: true, payments: true },
      }),
      prisma.payment.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          orderId: true,
          status: true,
          amount: true,
          paymentMethod: true,
          createdAt: true,
        },
      }),
      prisma.wishlistItem.findMany({ where: { userId: user.id } }),
    ]);

    return { profile, addresses, orders, payments, wishlist };
  } catch (error: any) {
    console.error('Erro ao exportar dados do usuário:', error);
    throw createError({ statusCode: 500, statusMessage: 'Erro interno do servidor' });
  } finally {
    await prisma.$disconnect();
  }
});
