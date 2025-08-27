import { serverSupabaseUser } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  try {
    // Verificar se o usuário está autenticado
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    // Obter dados do corpo da requisição
    const body = await readBody(event);

    // Validar campos obrigatórios
    const requiredFields = ['name', 'zipCode', 'street', 'number', 'neighborhood', 'city', 'state'];
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Campo ${field} é obrigatório`,
        });
      }
    }

    // Se for o primeiro endereço, definir como padrão
    const existingAddresses = await prisma.address.count({
      where: { userId: user.id },
    });

    const isDefault = existingAddresses === 0;

    // Criar novo endereço
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        name: body.name,
        zipCode: body.zipCode,
        street: body.street,
        number: body.number,
        complement: body.complement || null,
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state,
        isDefault,
      },
    });

    return {
      address,
    };
  } catch (error: any) {
    console.error('Erro ao salvar endereço:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erro interno do servidor',
    });
  } finally {
    await prisma.$disconnect();
  }
});
