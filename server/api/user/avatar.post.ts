import { serverSupabaseUser } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  
  try {
    const user = await serverSupabaseUser(event);
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    const formData = await readFormData(event);
    const file = formData.get('avatar') as File;
    
    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nenhum arquivo enviado',
      });
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Apenas arquivos de imagem são permitidos',
      });
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Arquivo muito grande. Máximo 5MB permitido',
      });
    }

    // Converter para base64 para armazenar no banco
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Atualizar avatar no banco de dados
    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: dataUrl },
    });

    return {
      success: true,
      message: 'Avatar atualizado com sucesso',
      avatar: dataUrl,
    };
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
