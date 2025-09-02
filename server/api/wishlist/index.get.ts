import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  try {
    console.log('🔍 Verificando autenticação na API wishlist...');

    // Tentar obter usuário via serverSupabaseUser
    let authUser = await serverSupabaseUser(event);

    // Se não conseguir via serverSupabaseUser, tentar via headers
    if (!authUser) {
      console.log('⚠️ serverSupabaseUser falhou, tentando via headers...');
      const headers = getHeaders(event);
      const authHeader = headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        console.log('🔑 Token encontrado nos headers');

        // Aqui você poderia validar o token JWT do Supabase
        // Por enquanto, vamos apenas logar
        console.log('📝 Token recebido:', token.substring(0, 20) + '...');
      }
    }

    if (!authUser) {
      console.log('❌ Usuário não autenticado');
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
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
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao carregar perfil do usuário',
      });
    }

    const user = userProfile;

    console.log(
      '👤 Usuário encontrado:',
      user
        ? {
            id: user.id,
            email: user.email,
            role: user.role,
          }
        : 'null'
    );

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
        productName: item.product.name,
      })),
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
