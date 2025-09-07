import { serverSupabaseUser } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  const prisma = new PrismaClient();

  try {
    // Verificar autenticação
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    const body = await readBody(event);

    // Suportar tanto item único quanto múltiplos itens
    let items = [];

    if (body.items && Array.isArray(body.items)) {
      // Múltiplos itens (do carrinho)
      items = body.items;
    } else {
      // Item único (compatibilidade com código existente)
      const { productId, quantity = 1, size, color } = body;
      if (!productId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID do produto é obrigatório',
        });
      }
      items = [{ productId, quantity, size, color }];
    }

    // Validar que temos pelo menos um item
    if (items.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Pelo menos um item é obrigatório',
      });
    }

    // Buscar dados de todos os produtos (via Prisma)
    let total = 0;
    const products = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        console.error('❌ Erro ao buscar produto (Prisma):', item.productId);
        throw createError({
          statusCode: 404,
          statusMessage: `Produto ${item.productId} não encontrado`,
        });
      }

      // Verificar se o produto está em estoque
      if (!product.inStock) {
        throw createError({
          statusCode: 400,
          statusMessage: `Produto ${product.name} fora de estoque`,
        });
      }

      // Calcular subtotal do item
      const itemTotal = Number(product.price) * item.quantity;
      total += itemTotal;

      products.push({
        ...product,
        itemQuantity: item.quantity,
        itemSize: item.size,
        itemColor: item.color,
      });
    }

    const shipping = 0; // Frete grátis ou calcular baseado no CEP
    const tax = 0; // Impostos se necessário
    const finalTotal = total + shipping + tax;

    // Criar pedido usando Prisma
    const orderData = {
      userId: user.id,
      status: 'PENDING' as const,
      total: finalTotal,
      shipping: shipping,
      tax: tax,
    };

    const order = await prisma.order.create({
      data: orderData,
    });

    // Criar itens do pedido usando Prisma

    for (const product of products) {
      const orderItemData = {
        orderId: order.id,
        productId: product.id,
        quantity: product.itemQuantity,
        price: product.price,
        size: product.itemSize || null,
        color: product.itemColor || null,
      };

      const orderItem = await prisma.orderItem.create({
        data: orderItemData,
      });
    }

    const result = {
      success: true,
      order: {
        id: order.id,
        total: finalTotal,
        status: order.status,
      },
    };
    await prisma.$disconnect();
    return result;
  } catch (error: any) {
    await prisma.$disconnect();
    console.error('❌ Erro ao criar pedido:', error);
    console.error('📋 Stack trace:', error.stack);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro ao criar pedido',
    });
  }
});
