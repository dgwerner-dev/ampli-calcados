import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  try {
    const authUser = await serverSupabaseUser(event);

    if (!authUser) {
      return {
        timestamp: new Date().toISOString(),
        authenticated: false,
        user: null,
        wishlistItems: [],
        message: 'Usuário não autenticado',
      };
    }

    // Consultar a tabela users para obter a role
    const supabase = await serverSupabaseClient(event);
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', authUser.id)
      .single();

    if (profileError) {
      console.error('❌ Erro ao carregar perfil do usuário:', profileError);
      return {
        timestamp: new Date().toISOString(),
        authenticated: false,
        user: null,
        wishlistItems: [],
        error: 'Erro ao carregar perfil do usuário',
        message: 'Erro ao coletar debug info',
      };
    }

    const user = userProfile;

    const debugInfo = {
      timestamp: new Date().toISOString(),
      authenticated: !!user,
      user: user
        ? {
            id: user.id,
            email: user.email,
            role: user.role,
          }
        : null,
    };

    if (!user) {
      return {
        ...debugInfo,
        wishlistItems: [],
        message: 'Usuário não autenticado',
      };
    }

    const prisma = new PrismaClient();

    // Verificar se há itens na wishlist
    const wishlistCount = await prisma.wishlistItem.count({
      where: { userId: user.id },
    });

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

    return {
      ...debugInfo,
      wishlistCount,
      wishlistItems,
      message: 'Debug info coletada com sucesso',
    };
  } catch (error: any) {
    console.error('Erro no debug da wishlist:', error);
    return {
      timestamp: new Date().toISOString(),
      authenticated: false,
      user: null,
      wishlistItems: [],
      error: error.message,
      message: 'Erro ao coletar debug info',
    };
  }
});
