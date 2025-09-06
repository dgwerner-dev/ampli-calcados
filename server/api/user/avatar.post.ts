import { serverSupabaseUser } from '#supabase/server';
import { PrismaClient } from '@prisma/client';
import { createSupabaseServerClient } from '~/utils/supabase-server';

export default defineEventHandler(async event => {
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

    // Upload para Supabase Storage (bucket: avatars)
    const supabase = createSupabaseServerClient();
    const arrayBuffer = await file.arrayBuffer();
    const fileExt = file.name?.split('.').pop() || 'png';
    const objectPath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(objectPath, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      throw createError({ statusCode: 500, statusMessage: 'Falha no upload do avatar' });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(objectPath);

    // Atualizar avatar no banco de dados com a URL
    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: publicUrl },
    });

    return {
      success: true,
      message: 'Avatar atualizado com sucesso',
      avatar: publicUrl,
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
