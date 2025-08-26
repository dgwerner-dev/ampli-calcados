import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async event => {
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

    // Criar pedido
    console.log('📝 Criando pedido...');
    const orderData = {
      userId: user.id,
      status: 'PENDING',
      total: finalTotal,
      shipping: shipping,
      tax: tax,
    };
    console.log('📋 Dados do pedido:', orderData);

    const { data: order, error: orderError } = await (supabase as any)
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('❌ Erro ao criar pedido:', orderError);
      throw createError({
        statusCode: 500,
        statusMessage: `Erro ao criar pedido: ${orderError.message}`,
      });
    }

    const typedOrder = order as any;
    console.log('✅ Pedido criado:', typedOrder.id);

    // Criar item do pedido
    console.log('📦 Criando item do pedido...');
    const orderItemData = {
      orderId: typedOrder.id,
      productId,
      quantity,
      price: typedProduct.price,
      size: size || null,
      color: color || null,
    };
    console.log('📋 Dados do item:', orderItemData);

    // @ts-ignore - Supabase type inference issue
    const { error: orderItemError } = await supabase.from('orderItems').insert(orderItemData);

    if (orderItemError) {
      console.error('❌ Erro ao criar item do pedido:', orderItemError);
      // Se falhar ao criar item, deletar o pedido
      console.log('🗑️ Deletando pedido devido ao erro...');
      await supabase.from('orders').delete().eq('id', typedOrder.id);
      throw createError({
        statusCode: 500,
        statusMessage: `Erro ao adicionar produto ao pedido: ${orderItemError.message}`,
      });
    }

    console.log('✅ Item do pedido criado com sucesso');

    const result = {
      success: true,
      order: {
        id: typedOrder.id,
        total: finalTotal,
        status: typedOrder.status,
      },
    };

    console.log('🎉 Pedido criado com sucesso:', result);
    return result;
  } catch (error: any) {
    console.error('❌ Erro ao criar pedido:', error);
    console.error('📋 Stack trace:', error.stack);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro ao criar pedido',
    });
  }
});
