import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async event => {
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
    const { productId, quantity = 1, size, color } = body;

    // Validar dados obrigatórios
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do produto é obrigatório',
      });
    }

    const supabase = await serverSupabaseClient(event);

    // Buscar dados do produto
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Produto não encontrado',
      });
    }

    // Verificar se o produto está em estoque
    if (!product.inStock) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Produto fora de estoque',
      });
    }

    // Calcular total
    const total = product.price * quantity;
    const shipping = 0; // Frete grátis ou calcular baseado no CEP
    const tax = 0; // Impostos se necessário
    const finalTotal = total + shipping + tax;

    // Criar pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        userId: user.id,
        status: 'PENDING',
        total: finalTotal,
        shipping,
        tax,
      })
      .select()
      .single();

    if (orderError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao criar pedido',
      });
    }

    // Criar item do pedido
    const { error: orderItemError } = await supabase.from('orderItems').insert({
      orderId: order.id,
      productId,
      quantity,
      price: product.price,
      size: size || null,
      color: color || null,
    });

    if (orderItemError) {
      // Se falhar ao criar item, deletar o pedido
      await supabase.from('orders').delete().eq('id', order.id);
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao adicionar produto ao pedido',
      });
    }

    return {
      success: true,
      order: {
        id: order.id,
        total: finalTotal,
        status: order.status,
      },
    };
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro ao criar pedido',
    });
  }
});
