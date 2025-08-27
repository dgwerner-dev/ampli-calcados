export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    const body = await readBody(event);
    const prisma = usePrisma();

    // Validar dados obrigatórios
    if (!body.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nome é obrigatório',
      });
    }

    // Atualizar dados básicos do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name,
      },
    });

    // Atualizar ou criar perfil do usuário
    const profileData = {
      phone: body.phone || null,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      newsletter: body.newsletter || false,
      smsNotifications: body.smsNotifications || false,
    };

    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: {
        userId: user.id,
        ...profileData,
      },
    });

    // Atualizar endereço se fornecido
    if (body.address) {
      const addressData = {
        userId: user.id,
        name: 'Endereço Principal',
        zipCode: body.address.cep,
        street: body.address.street,
        number: body.address.number,
        complement: body.address.complement || null,
        neighborhood: body.address.neighborhood,
        city: body.address.city,
        state: body.address.state,
        isDefault: true,
      };

      // Verificar se já existe um endereço padrão
      const existingAddress = await prisma.address.findFirst({
        where: { userId: user.id, isDefault: true },
      });

      if (existingAddress) {
        // Atualizar endereço existente
        await prisma.address.update({
          where: { id: existingAddress.id },
          data: addressData,
        });
      } else {
        // Criar novo endereço
        await prisma.address.create({
          data: addressData,
        });
      }
    }

    return {
      success: true,
      message: 'Perfil atualizado com sucesso',
    };
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor',
    });
  }
});
