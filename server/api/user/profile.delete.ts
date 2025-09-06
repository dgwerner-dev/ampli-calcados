import { serverSupabaseUser } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  const prisma = new PrismaClient();
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Usuário não autenticado' });
    }

    // Anonimizar dados pessoais e desativar conta
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: null,
        cpf: null,
        phone: null,
        avatar: null,
        isActive: false,
      },
    });

    // Remover dados que não precisam ser retidos legalmente
    await prisma.address.deleteMany({ where: { userId: user.id } });
    await prisma.wishlistItem.deleteMany({ where: { userId: user.id } });

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao anonimizar/excluir dados do usuário:', error);
    throw createError({ statusCode: 500, statusMessage: 'Erro interno do servidor' });
  } finally {
    await prisma.$disconnect();
  }
});
