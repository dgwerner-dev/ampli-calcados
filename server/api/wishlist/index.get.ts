import { serverSupabaseUser } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  try {
    console.log('🔍 Verificando autenticação na API wishlist...');
    
    const user = await serverSupabaseUser(event);
    
    console.log('👤 Usuário encontrado:', user ? {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role
    } : 'null');

    if (!user) {
      console.log('❌ Usuário não autenticado');
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    const prisma = new PrismaClient();

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        productId: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await prisma.$disconnect();

    console.log('📊 Wishlist retornada:', {
      count: wishlistItems.length,
      items: wishlistItems.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name
      }))
    });

    return {
      success: true,
      items: wishlistItems,
    };
  } catch (error: any) {
    console.error('Erro ao buscar wishlist:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erro interno do servidor',
    });
  }
});
