import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    const prisma = usePrisma();

    // Buscar dados do usuário e perfil
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
      },
    });

    if (!userData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usuário não encontrado',
      });
    }

    // Formatar dados para retorno
    const profileData = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      role: userData.role,
      phone: userData.profile?.phone || '',
      dateOfBirth: userData.profile?.dateOfBirth || null,
      newsletter: userData.profile?.newsletter || false,
      smsNotifications: userData.profile?.smsNotifications || false,
      address: userData.addresses[0] ? {
        cep: userData.addresses[0].zipCode,
        street: userData.addresses[0].street,
        number: userData.addresses[0].number,
        complement: userData.addresses[0].complement || '',
        neighborhood: userData.addresses[0].neighborhood,
        city: userData.addresses[0].city,
        state: userData.addresses[0].state,
      } : null,
    };

    return profileData;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor',
    });
  }
});
