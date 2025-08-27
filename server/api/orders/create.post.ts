import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async event => {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Iniciando criação de pedido...');

    // Verificar autenticação
    const user = await serverSupabaseUser(event);
    console.log('👤 Usuário autenticado:', user?.id);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário não autenticado',
      });
    }

    const body = await readBody(event);
    console.log('📦 Dados recebidos:', body);

    const { productId, quantity = 1, size, color } = body;

    // Validar dados obrigatórios
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do produto é obrigatório',
      });
    }

    const supabase = await serverSupabaseClient(event);
    console.log('🔗 Cliente Supabase conectado');

    // Buscar dados do produto
    console.log('🔍 Buscando produto:', productId);
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError) {
      console.error('❌ Erro ao buscar produto:', productError);
      throw createError({
        statusCode: 404,
        statusMessage: 'Produto não encontrado',
      });
    }

    if (!product) {
      console.error('❌ Produto não encontrado');
      throw createError({
        statusCode: 404,
        statusMessage: 'Produto não encontrado',
      });
    }

    const typedProduct = product as any;
    console.log('✅ Produto encontrado:', typedProduct.name, 'Preço:', typedProduct.price);

    // Verificar se o produto está em estoque
    if (!typedProduct.inStock) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Produto fora de estoque',
      });
    }

    // Calcular total
    const total = typedProduct.price * quantity;
    const shipping = 0; // Frete grátis ou calcular baseado no CEP
    const tax = 0; // Impostos se necessário
    const finalTotal = total + shipping + tax;

    console.log('💰 Cálculo do total:', { total, shipping, tax, finalTotal });

    // Criar pedido usando Prisma
    console.log('📝 Criando pedido...');
    const orderData = {
      userId: user.id,
      status: 'PENDING' as const,
      total: finalTotal,
      shipping: shipping,
      tax: tax,
    };
    console.log('📋 Dados do pedido:', orderData);

    const order = await prisma.order.create({
      data: orderData,
    });

    console.log('✅ Pedido criado:', order.id);

    // Criar item do pedido usando Prisma
    console.log('📦 Criando item do pedido...');
    const orderItemData = {
      orderId: order.id,
      productId,
      quantity,
      price: typedProduct.price,
      size: size || null,
      color: color || null,
    };
    console.log('📋 Dados do item:', orderItemData);

    const orderItem = await prisma.orderItem.create({
      data: orderItemData,
    });

    console.log('✅ Item do pedido criado:', orderItem.id);

    console.log('✅ Item do pedido criado com sucesso');

    const result = {
      success: true,
      order: {
        id: order.id,
        total: finalTotal,
        status: order.status,
      },
    };

    console.log('🎉 Pedido criado com sucesso:', result);
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
