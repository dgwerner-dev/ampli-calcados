import { createSupabaseServerClient } from '~/utils/supabase-server';

export default defineEventHandler(async event => {
  try {
    console.log('Verificando estrutura das tabelas...');

    const supabase = createSupabaseServerClient();

    // Listar estrutura da tabela products
    const { data: productsStructure, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    // Listar estrutura da tabela categories
    const { data: categoriesStructure, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    // Listar estrutura da tabela shipping_promotions
    const { data: shippingStructure, error: shippingError } = await supabase
      .from('shipping_promotions')
      .select('*')
      .limit(1);

    return {
      success: true,
      tables: {
        products: {
          exists: !productsError,
          error: productsError?.message,
          sample: productsStructure?.[0] ? Object.keys(productsStructure[0]) : [],
        },
        categories: {
          exists: !categoriesError,
          error: categoriesError?.message,
          sample: categoriesStructure?.[0] ? Object.keys(categoriesStructure[0]) : [],
        },
        shipping_promotions: {
          exists: !shippingError,
          error: shippingError?.message,
          sample: shippingStructure?.[0] ? Object.keys(shippingStructure[0]) : [],
        },
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Erro ao verificar estrutura das tabelas:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }
});
